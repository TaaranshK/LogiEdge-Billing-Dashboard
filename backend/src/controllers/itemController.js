const itemService = require('../services/itemService');
const getAllItems = async (req, res, next) => {
  try {

    const items = await itemService.fetchAllItems();

    res.status(200).json({
      success : true,
      count   : items.length,
      data    : items
    });

  } catch (error) {
    next(error);
  }
};

const getActiveItems = async (req, res, next) => {
  try {

    const items = await itemService.fetchActiveItems();

    res.status(200).json({
      success : true,
      count   : items.length,
      data    : items
    });

  } catch (error) {
    next(error);
  }
};


const getItemById = async (req, res, next) => {
  try {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success : false,
        message : 'Item ID must be a valid number'
      });
    }

    const item = await itemService.fetchItemById(id);

    res.status(200).json({
      success : true,
      data    : item
    });

  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {

    const itemData = req.body;
    const newItem  = await itemService.addNewItem(itemData);

    res.status(201).json({
      success : true,
      message : 'Item created successfully',
      data    : newItem
    });

  } catch (error) {
    next(error);
  }
};

const updateItemStatus = async (req, res, next) => {
  try {

    const id         = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success : false,
        message : 'Item ID must be a valid number'
      });
    }

    const updatedItem = await itemService.changeItemStatus(id, status);

    res.status(200).json({
      success : true,
      message : `Item status updated to ${status}`,
      data    : updatedItem
    });

  } catch (error) {
    next(error);
  }
};


// Export all controllers for the route file
module.exports = {
  getAllItems,
  getActiveItems,
  getItemById,
  createItem,
  updateItemStatus
};