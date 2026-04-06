import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


// Create a new invoice — main billing action
export const createInvoice = async (billingData) => {
  const response = await axios.post(`${BASE_URL}/billing`, billingData)
  return response.data
}


// Get all invoices — for dashboard recent invoices
export const getAllInvoices = async () => {
  const response = await axios.get(`${BASE_URL}/billing`)
  return response.data
}


// Search invoice by ID — for dashboard search bar
export const getInvoiceById = async (invoiceId) => {
  const response = await axios.get(`${BASE_URL}/billing/search/${invoiceId}`)
  return response.data
}


// Get all invoices for one customer — dashboard customer filter
export const getInvoicesByCustomer = async (customerId) => {
  const response = await axios.get(`${BASE_URL}/billing/customer/${customerId}`)
  return response.data
}