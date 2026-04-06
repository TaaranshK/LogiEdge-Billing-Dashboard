// Billing Model - Data Layer for Invoices
// Contains SQL queries for invoice management with transaction support
// Uses PostgreSQL with node-postgres (pg) library

const pool = require('../config/db');

// Create Invoice with Line Items (Transaction)
const createInvoice = async (invoiceData) => {
    const {
        invoice_id,
        customer_id,
        subtotal,
        gst_rate,
        gst_amount,
        total_amount,
        items
    } = invoiceData;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const invoiceQuery = `
            INSERT INTO invoices
                (invoice_id, customer_id, subtotal, gst_rate, gst_amount, total_amount)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING id, invoice_id, customer_id, subtotal, gst_rate, gst_amount, total_amount, created_at
        `;

        const invoiceValues = [
            invoice_id,
            customer_id,
            subtotal,
            gst_rate,
            gst_amount,
            total_amount
        ];

        const invoiceResult = await client.query(invoiceQuery, invoiceValues);

        // Insert line items
        for (const item of items) {
            const itemQuery = `
                INSERT INTO invoice_items
                    (invoice_id, item_id, item_name, quantity, unit_price, total_price)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
            `;

            const itemValues = [
                invoice_id,
                item.item_id,
                item.item_name,
                item.quantity,
                item.unit_price,
                item.total_price
            ];

            await client.query(itemQuery, itemValues);
        }

        await client.query('COMMIT');

        // Return the created invoice from RETURNING clause
        return invoiceResult.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Error creating invoice: ${error.message}`);
    } finally {
        client.release();
    }
};

// Get All Invoices
const getAllInvoices = async () => {
    try {
        const query = `
            SELECT
                i.invoice_id,
                i.customer_id,
                c.customer_name,
                i.subtotal,
                i.gst_rate,
                i.gst_amount,
                i.total_amount,
                i.created_at
            FROM invoices i
            JOIN customers c ON i.customer_id = c.id
            ORDER BY i.created_at DESC
        `;

        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Error fetching invoices: ${error.message}`);
    }
};

// Get Invoice By ID with Line Items
const getInvoiceById = async (invoiceId) => {
    try {
        // Query 1: Get invoice with customer details
        const invoiceQuery = `
            SELECT
                i.invoice_id,
                i.customer_id,
                c.customer_name,
                c.address,
                c.gst_number,
                c.pan_number,
                i.subtotal,
                i.gst_rate,
                i.gst_amount,
                i.total_amount,
                i.created_at
            FROM invoices i
            JOIN customers c ON i.customer_id = c.id
            WHERE i.invoice_id = $1
        `;

        const invoiceResult = await pool.query(invoiceQuery, [invoiceId]);

        if (invoiceResult.rows.length === 0) {
            return null;
        }

        const invoice = invoiceResult.rows[0];

        // Query 2: Get all line items
        const itemsQuery = `
            SELECT
                id,
                item_id,
                item_name,
                quantity,
                unit_price,
                total_price
            FROM invoice_items
            WHERE invoice_id = $1
            ORDER BY id ASC
        `;

        const itemResult = await pool.query(itemsQuery, [invoiceId]);
        invoice.items = itemResult.rows;

        return invoice;
    } catch (error) {
        throw new Error(`Error fetching invoice: ${error.message}`);
    }
};

// Get Invoices By Customer ID
const getInvoicesByCustomer = async (customerId) => {
    try {
        const query = `
            SELECT
                i.invoice_id,
                i.customer_id,
                c.customer_name,
                i.subtotal,
                i.gst_rate,
                i.gst_amount,
                i.total_amount,
                i.created_at
            FROM invoices i
            JOIN customers c ON i.customer_id = c.id
            WHERE i.customer_id = $1
            ORDER BY i.created_at DESC
        `;

        const result = await pool.query(query, [customerId]);
        return result.rows;
    } catch (error) {
        throw new Error(`Error fetching customer invoices: ${error.message}`);
    }
};

// Check if Invoice ID Already Exists
const checkInvoiceIdExists = async (invoiceId) => {
    try {
        const query = `
            SELECT invoice_id FROM invoices
            WHERE invoice_id = $1
        `;

        const result = await pool.query(query, [invoiceId]);
        return result.rows.length > 0;
    } catch (error) {
        throw new Error(`Error checking invoice ID: ${error.message}`);
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getInvoicesByCustomer,
    checkInvoiceIdExists
};
