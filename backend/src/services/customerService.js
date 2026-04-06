// Business Logic Layer 
// Controller Says " Hey Someone Wants To Create an Customer"
// Service says: "okay let me check if the data is valid,
//                   apply any rules, then tell the model to save it"


const customerModel = require('../models/customerModel');

// Fetch All The Customers

const fetchAllCustomers = async ()=> {
    const customers = await customerModel.getAllCustomers();
    return customers;


};

const fetchCustomerById = async (id) => {
    const customer = await customerModel.getCustomerById(id);

    if(!customer) {
        const error = new Error('Customer with ID ${id} was not Found ');
        error.statusCode = 404;
        throw error;

    }
    return customer;
}

// Add new Customer

const addNewCustomer = async (CustomerData) => {
    const {customer_name , address , pan_number , gst_number , status}  = CustomerData;

    if(!customer_name || customer_name.trim() == '') {
        const error = new Error('Customer name is Required');
        error.statusCode = 400;
        throw error;     
    }
    const allowedStatuses = ['Active' , 'In-Active'];
    if (status && !allowedStatuses.includes (status)) {
        const error = new Error('Status must be Either active Or In-Active');
        error.statusCode = 400;
        throw error;
    }
     if (pan_number && pan_number.trim() !== '') {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan_number.trim().toUpperCase())) {
      const error = new Error('PAN number format is invalid. Example format: AABCG1234F');
      error.statusCode = 400;
      throw error;
    }
}


  const cleanData = {
    customer_name : customer_name.trim(),
    address       : address ? address.trim() : null,
    pan_number    : pan_number ? pan_number.trim().toUpperCase() : null,
    gst_number    : gst_number ? gst_number.trim().toUpperCase() : null,
    status        : status || 'Active'
  };

    // All checks passed — now we can safely tell the model to save it
  const newCustomer = await customerModel.createCustomer(cleanData);

  return newCustomer;
};

const changeCustomerStatus = async (id, status) => {

  // First make sure this customer actually exists
  // fetchCustomerById already throws a 404 if not found
  await fetchCustomerById(id);

  // Validate the status value
  const allowedStatuses = ['Active', 'In-Active'];

  if (!status || !allowedStatuses.includes(status)) {
    const error = new Error('Status must be either Active or In-Active');
    error.statusCode = 400;
    throw error;
  }

  // Customer exists and status is valid — go ahead and update
  const updatedCustomer = await customerModel.updateCustomerStatus(id, status);

  return updatedCustomer;
};


module.exports = {
  fetchAllCustomers,
  fetchCustomerById,
  addNewCustomer,
  changeCustomerStatus
};
