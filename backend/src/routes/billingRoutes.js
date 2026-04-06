const express = require('express');
const router  = express.Router();

const billingController = require('../controllers/billingController');


// POST /api/billing → create a new invoice
router.post('/', billingController.createInvoice);

// GET /api/billing → get all invoices (dashboard)
router.get('/', billingController.getAllInvoices);

// GET /api/billing/search/:invoiceId → search by invoice ID
// Example: GET /api/billing/search/INVC224830
router.get('/search/:invoiceId', billingController.getInvoiceById);

// GET /api/billing/customer/:customerId → invoices by customer
// Example: GET /api/billing/customer/3
router.get('/customer/:customerId', billingController.getInvoicesByCustomer);


module.exports = router;