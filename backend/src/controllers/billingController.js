// Billing Controller - HTTP Request Handler for Invoice Operations
// Receives HTTP requests, delegates to service layer, sends responses

const billingService = require('../services/billingService');

// Create New Invoice
const createInvoice = async (req, res, next) => {
    try {
        const billingData = req.body;
        const savedInvoice = await billingService.createNewInvoice(billingData);

        res.status(201).json({
            success: true,
            message: `Invoice ${savedInvoice.invoice_id} created successfully`,
            data: savedInvoice
        });
    } catch (error) {
        next(error);
    }
};

// Get All Invoices
const getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await billingService.fetchAllInvoices();

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        next(error);
    }
};

// Get Invoice By ID
const getInvoiceById = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await billingService.fetchInvoiceById(invoiceId);

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

// Get Invoices By Customer
const getInvoicesByCustomer = async (req, res, next) => {
    try {
        const customerId = parseInt(req.params.customerId);

        if (isNaN(customerId)) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID must be a valid number'
            });
        }

        const result = await billingService.fetchInvoicesByCustomer(customerId);

        res.status(200).json({
            success: true,
            customer: result.customer,
            count: result.invoices.length,
            data: result.invoices
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getInvoicesByCustomer
};
