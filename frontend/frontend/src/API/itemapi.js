
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


// Fetch all items — used on Item Master page
export const getAllItems = async () => {
  const response = await axios.get(`${BASE_URL}/items`)
  return response.data
}


// Fetch only active items — used in Billing screen dropdown
export const getActiveItems = async () => {
  const response = await axios.get(`${BASE_URL}/items/active`)
  return response.data
}


// Create a new item — used on Add Item form
export const createItem = async (itemData) => {
  const response = await axios.post(`${BASE_URL}/items`, itemData)
  return response.data
}


// Update item status — used on Item Master page
export const updateItemStatus = async (id, status) => {
  const response = await axios.patch(
    `${BASE_URL}/items/${id}/status`,
    { status }
  )
  return response.data
}