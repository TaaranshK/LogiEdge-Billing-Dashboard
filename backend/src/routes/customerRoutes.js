const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

// GET /api/customers → Get all customers
router.get('/', customerController.getAllCustomers);

// GET /api/customers/:id → Get single customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers → Create new customer
router.post('/', customerController.createCustomer);

// PATCH /api/customers/:id/status → Update customer status
router.patch('/:id/status', customerController.updateCustomerStatus);

module.exports = router;
