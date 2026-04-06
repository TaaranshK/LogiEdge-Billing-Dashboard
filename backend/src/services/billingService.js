// Billing Service - Business Logic Layer for Invoicing
// Handles validation, GST calculation, invoice generation, and customer verification

const billingModel = require('../models/billingModel');
const customerModel = require('../models/customerModel');
const itemModel = require('../models/itemModel');

// Generate Unique Invoice ID
const generateInvoiceId = async () => {
    let invoiceId;
    let alreadyExists = true;

    while (alreadyExists) {
        const randomNumber = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');

        invoiceId = `INVC${randomNumber}`;
        alreadyExists = await billingModel.checkInvoiceIdExists(invoiceId);
    }

    return invoiceId;
};

// Calculate GST Based on Registration
const calculateGST = (subtotal, gst_number) => {
    // If gst_number exists and is not empty → customer is registered → 0% GST
    // If no gst_number → not registered → 18% GST
    const isGSTRegistered = gst_number && gst_number.trim() !== '';

    const gst_rate = isGSTRegistered ? 0 : 18;
    const gst_amount = parseFloat(
        (subtotal * (gst_rate / 100)).toFixed(2)
    );

    const total_amount = parseFloat(
        (subtotal + gst_amount).toFixed(2)
    );

    return { gst_rate, gst_amount, total_amount };
};

// Create New Invoice
const createNewInvoice = async (billingData) => {
    const { customer_id, items } = billingData;

    // Validate customer selection
    if (!customer_id) {
        const error = new Error('Please select a customer to proceed');
        error.statusCode = 400;
        throw error;
    }

    // Validate items selection
    if (!items || !Array.isArray(items) || items.length === 0) {
        const error = new Error('Please select at least one item for the invoice');
        error.statusCode = 400;
        throw error;
    }

    // Check if customer exists
    const customer = await customerModel.getCustomerById(customer_id);
    if (!customer) {
        const error = new Error('Selected customer was not found');
        error.statusCode = 404;
        throw error;
    }

    // Check if customer is active
    if (customer.status !== 'Active') {
        const error = new Error('Cannot create invoice for an inactive customer');
        error.statusCode = 400;
        throw error;
    }

    let subtotal = 0;
    const lineItems = [];

    // Validate and process each item
    for (const selectedItem of items) {
        const { item_id, quantity } = selectedItem;

        // Validate quantity
        if (!quantity || quantity <= 0 || !Number.isInteger(Number(quantity))) {
            const error = new Error(`Invalid quantity for item ID ${item_id}`);
            error.statusCode = 400;
            throw error;
        }

        // Check if item exists
        const item = await itemModel.getItemById(item_id);
        if (!item) {
            const error = new Error(`Item with ID ${item_id} was not found`);
            error.statusCode = 404;
            throw error;
        }

        // Check if item is active
        if (item.status !== 'Active') {
            const error = new Error(`Item "${item.item_name}" is not active`);
            error.statusCode = 400;
            throw error;
        }

        // Calculate line total
        const lineTotal = parseFloat(
            (item.selling_price * quantity).toFixed(2)
        );

        subtotal += lineTotal;

        // Prepare line item for invoice
        lineItems.push({
            item_id: item.id,
            item_name: item.item_name,
            quantity: Number(quantity),
            unit_price: item.selling_price,
            total_price: lineTotal
        });
    }

    // Round subtotal to 2 decimals
    subtotal = parseFloat(subtotal.toFixed(2));

    // Calculate GST
    const { gst_rate, gst_amount, total_amount } = calculateGST(
        subtotal,
        customer.gst_number
    );

    // Generate unique invoice ID
    const invoice_id = await generateInvoiceId();

    // Prepare invoice data
    const invoiceData = {
        invoice_id,
        customer_id,
        subtotal,
        gst_rate,
        gst_amount,
        total_amount,
        items: lineItems
    };

    // Create invoice in database
    const createdInvoice = await billingModel.createInvoice(invoiceData);

    return createdInvoice;
};

// Fetch All Invoices
const fetchAllInvoices = async () => {
    try {
        const invoices = await billingModel.getAllInvoices();
        return invoices;
    } catch (error) {
        throw new Error(`Error fetching invoices: ${error.message}`);
    }
};

// Fetch Invoice By ID
const fetchInvoiceById = async (invoiceId) => {
    try {
        const invoice = await billingModel.getInvoiceById(invoiceId);

        if (!invoice) {
            const error = new Error(`Invoice ${invoiceId} was not found`);
            error.statusCode = 404;
            throw error;
        }

        return invoice;
    } catch (error) {
        if (error.statusCode) throw error;
        throw new Error(`Error fetching invoice: ${error.message}`);
    }
};

// Fetch Invoices By Customer ID
const fetchInvoicesByCustomer = async (customerId) => {
    try {
        // Check if customer exists
        const customer = await customerModel.getCustomerById(customerId);
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }

        // Get all invoices for customer
        const invoices = await billingModel.getInvoicesByCustomer(customerId);

        return {
            customer: customer.customer_name,
            invoices
        };
    } catch (error) {
        if (error.statusCode) throw error;
        throw new Error(`Error fetching customer invoices: ${error.message}`);
    }
};

module.exports = {
    generateInvoiceId,
    calculateGST,
    createNewInvoice,
    fetchAllInvoices,
    fetchInvoiceById,
    fetchInvoicesByCustomer
};
