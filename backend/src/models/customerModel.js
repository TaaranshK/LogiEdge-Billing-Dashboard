// Customer Model - Data Layer for Customers
// Contains all SQL queries related to the customers table
// Uses MySQL2 with promise-based API

const pool = require('../config/db');

// Get All Customers
const getAllCustomers = async () => {
    try {
        const query = `
            SELECT id, customer_name, address, pan_number, gst_number, status, created_at
            FROM customers
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error(`Error fetching customers: ${error.message}`);
    }
};

// Get Customer By ID
const getCustomerById = async (id) => {
    try {
        const query = `
            SELECT id, customer_name, address, pan_number, gst_number, status, created_at
            FROM customers
            WHERE id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        throw new Error(`Error fetching customer: ${error.message}`);
    }
};

// Create Customer
const createCustomer = async (customerData) => {
    const {
        customer_name,
        address,
        pan_number,
        gst_number,
        status
    } = customerData;

    try {
        const query = `
            INSERT INTO customers (customer_name, address, pan_number, gst_number, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            customer_name,
            address || null,
            pan_number || null,
            gst_number || null,
            status || 'Active'
        ];

        const [result] = await pool.query(query, values);

        // Return the newly created customer with the generated ID
        return {
            id: result.insertId,
            customer_name,
            address: address || null,
            pan_number: pan_number || null,
            gst_number: gst_number || null,
            status: status || 'Active',
            created_at: new Date().toISOString()
        };
    } catch (error) {
        throw new Error(`Error creating customer: ${error.message}`);
    }
};

// Update Customer Status
const updateCustomerStatus = async (id, status) => {
    try {
        const query = `
            UPDATE customers
            SET status = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return null;
        }

        // Return updated customer
        return getCustomerById(id);
    } catch (error) {
        throw new Error(`Error updating customer status: ${error.message}`);
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerStatus
};
