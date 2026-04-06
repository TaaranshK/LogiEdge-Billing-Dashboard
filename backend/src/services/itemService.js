const itemModel = require('../models/itemModel');


const fetchAllItems = async () => {
  const items = await itemModel.getAllItems();
  return items;
};



const fetchActiveItems = async () => {
  const items = await itemModel.getActiveItems();
  return items;
};

const fetchItemById = async (id) => {

  const item = await itemModel.getItemById(id);

  // If model returned nothing, item doesn't exist in DB
  if (!item) {
    const error = new Error(`Item with ID ${id} was not found`);
    error.statusCode = 404;
    throw error;
  }

  return item;
};


const addNewItem = async (itemData) => {

  const { item_name, selling_price, status } = itemData;

    if (!item_name || item_name.trim() === '') {
    const error = new Error('Item name is required');
    error.statusCode = 400;
    throw error;
  }

   if (selling_price === undefined || selling_price === null || selling_price === '') {
    const error = new Error('Selling price is required');
    error.statusCode = 400;
    throw error;
  }
  const price = parseFloat(selling_price);

  if (isNaN(price)) {
    const error = new Error('Selling price must be a valid number');
    error.statusCode = 400;
    throw error;
  }

   if (price <= 0) {
    const error = new Error('Selling price must be greater than zero');
    error.statusCode = 400;
    throw error;
  }

   const allowedStatuses = ['Active', 'In-Active'];

  if (status && !allowedStatuses.includes(status)) {
    const error = new Error('Status must be either Active or In-Active');
    error.statusCode = 400;
    throw error;
  }


  // All validations passed — prepare clean data for the model
  const cleanData = {
    item_name     : item_name.trim(),
    selling_price : Math.round(price * 100) / 100,  // round to 2 decimals
    status        : status || 'Active'
  };

  const newItem = await itemModel.createItem(cleanData);
  return newItem;
};


const changeItemStatus = async (id, status) => {

  // Reuse fetchItemById — it already handles the 404 case
  await fetchItemById(id);

  const allowedStatuses = ['Active', 'In-Active'];

  if (!status || !allowedStatuses.includes(status)) {
    const error = new Error('Status must be either Active or In-Active');
    error.statusCode = 400;
    throw error;
  }

  const updatedItem = await itemModel.updateItemStatus(id, status);
  return updatedItem;
};

module.exports = {
  fetchAllItems,
  fetchActiveItems,
  fetchItemById,
  addNewItem,
  changeItemStatus
};