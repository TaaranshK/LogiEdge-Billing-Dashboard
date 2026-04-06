import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getAllCustomers = async () => {
  const response = await axios.get(`${BASE_URL}/customers`)
  return response.data
}

export const createCustomer = async (customerData) => {
  const response = await axios.post(`${BASE_URL}/customers`, customerData)
  return response.data
}

