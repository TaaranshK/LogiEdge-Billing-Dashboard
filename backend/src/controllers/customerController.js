// Customer Controller - HTTP Request Handler for Customer Operations
// Receives HTTP requests, delegates to service layer, sends responses

const customerService = require('../services/customerService');

// Get All Customers
const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.fetchAllCustomers();

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        next(error);
    }
};

// Get Customer By ID
const getCustomerById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID must be a valid number'
            });
        }

        const customer = await customerService.fetchCustomerById(id);

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

// Create Customer
const createCustomer = async (req, res, next) => {
    try {
        const customerData = req.body;
        const newCustomer = await customerService.addNewCustomer(customerData);

        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: newCustomer
        });
    } catch (error) {
        next(error);
    }
};

// Update Customer Status
const updateCustomerStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID must be a valid number'
            });
        }

        const updatedCustomer = await customerService.changeCustomerStatus(id, status);

        res.status(200).json({
            success: true,
            message: `Customer status updated to ${status}`,
            data: updatedCustomer
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerStatus
};
