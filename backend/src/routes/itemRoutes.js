const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

// GET /api/items → Get all items
router.get('/', itemController.getAllItems);

// GET /api/items/active → Get only active items (for billing dropdown)
router.get('/active', itemController.getActiveItems);

// GET /api/items/:id → Get single item by ID
router.get('/:id', itemController.getItemById);

// POST /api/items → Create new item
router.post('/', itemController.createItem);

// PATCH /api/items/:id/status → Update item status
router.patch('/:id/status', itemController.updateItemStatus);

module.exports = router;

