// Item Model - Data Layer for Items
// Contains all SQL queries related to the items table
// Uses MySQL2 with promise-based API

const pool = require('../config/db');

// Get All Items
const getAllItems = async () => {
    try {
        const query = `
            SELECT id, item_name, selling_price, status, created_at
            FROM items
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error(`Error fetching items: ${error.message}`);
    }
};

// Get Active Items Only
const getActiveItems = async () => {
    try {
        const query = `
            SELECT id, item_name, selling_price, status
            FROM items
            WHERE status = 'Active'
            ORDER BY item_name ASC
        `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error(`Error fetching active items: ${error.message}`);
    }
};

// Get Item By ID
const getItemById = async (id) => {
    try {
        const query = `
            SELECT id, item_name, selling_price, status, created_at
            FROM items
            WHERE id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        throw new Error(`Error fetching item: ${error.message}`);
    }
};

// Create Item
const createItem = async (itemData) => {
    const { item_name, selling_price, status } = itemData;

    try {
        const query = `
            INSERT INTO items (item_name, selling_price, status)
            VALUES (?, ?, ?)
        `;
        const values = [
            item_name,
            selling_price,
            status || 'Active'
        ];

        const [result] = await pool.query(query, values);

        // Return the newly created item
        return {
            id: result.insertId,
            item_name,
            selling_price,
            status: status || 'Active',
            created_at: new Date().toISOString()
        };
    } catch (error) {
        throw new Error(`Error creating item: ${error.message}`);
    }
};

// Update Item Status
const updateItemStatus = async (id, status) => {
    try {
        const query = `
            UPDATE items
            SET status = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return null;
        }

        // Return updated item
        return getItemById(id);
    } catch (error) {
        throw new Error(`Error updating item status: ${error.message}`);
    }
};

module.exports = {
    getAllItems,
    getActiveItems,
    getItemById,
    createItem,
    updateItemStatus
};