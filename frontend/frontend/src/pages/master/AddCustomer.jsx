import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import { createCustomer }   from '../../API/customerAPI'
import './master.css'


const AddCustomer = () => {

  const navigate = useNavigate()

    const [formData, setFormData] = useState({
    customer_name : '',
    address       : '',
    pan_number    : '',
    gst_number    : '',
    status        : 'Active'
  })

  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

    const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,         // keep all existing field values
      [name]: value    // update only the field that changed
    }))

    // Clear error when user starts typing again
    if (error) setError('')
  }

   const handleSubmit = async (e) => {

    // Prevent default browser form submission behaviour
    e.preventDefault()

    // Basic front-end validation before hitting the API
    if (!formData.customer_name.trim()) {
      setError('Customer name is required')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      // Send form data to backend via our API function
      await createCustomer(formData)

      // Show success message briefly before navigating away
      setSuccess('Customer created successfully! Redirecting...')

      // Wait 1.2 seconds then go back to customer list
      setTimeout(() => {
        navigate('/master/customers')
      }, 1200)

    } catch (err) {
      // Show the error message from the backend service layer
      const message = err.response?.data?.message || 'Failed to create customer. Try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

    const handleCancel = () => {
    navigate('/master/customers')
  }


  return (
    <div className="master-page">

      {/* Page header with back navigation */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={handleCancel}>
            Back to Customers
          </button>
          <h1 className="page-title">Add New Customer</h1>
          <p className="page-subtitle">
            Fill in the details below to create a new customer
          </p>
        </div>
      </div>


      {/* The form card */}
      <div className="form-card card">

        {/* Success message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          

            <div className="form-group">
              <label className="form-label" htmlFor="customer_name">
                Customer Name <span className="form-required">*</span>
              </label>
              <input
                id          = "customer_name"
                name        = "customer_name"
                type        = "text"
                className   = "form-input"
                placeholder = "e.g. Gupta Enterprise Pvt. Ltd."
                value       = {formData.customer_name}
                onChange    = {handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Customer Address
              </label>
              <input
                id          = "address"
                name        = "address"
                type        = "text"
                className   = "form-input"
                placeholder = "e.g. Mumbai, Maharashtra"
                value       = {formData.address}
                onChange    = {handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pan_number">
                Customer PAN Card Number
              </label>
              <input
                id          = "pan_number"
                name        = "pan_number"
                type        = "text"
                className   = "form-input"
                placeholder = "e.g. AABCG1234F"
                value       = {formData.pan_number}
                onChange    = {handleChange}
                maxLength   = {10}
                style       = {{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gst_number">
                Customer GST Number
              </label>
              <input
                id          = "gst_number"
                name        = "gst_number"
                type        = "text"
                className   = "form-input"
                placeholder = "e.g. 27AABCG1234F1Z5"
                value       = {formData.gst_number}
                onChange    = {handleChange}
                style       = {{ textTransform: 'uppercase' }}
              />
            
              <p className="form-hint">
                💡 Leave empty if customer is not GST registered.
                  18% GST will be applied on their invoices.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Customer Status
              </label>
              <select
                id        = "status"
                name      = "status"
                className = "form-select"
                value     = {formData.status}
                onChange  = {handleChange}
              >
                <option value="Active">Active</option>
                <option value="In-Active">In-Active</option>
              </select>
            </div>


          
          <div className="form-actions">
            <button
              type      = "button"
              className = "btn btn-secondary"
              onClick   = {handleCancel}
              disabled  = {submitting}
            >
              Cancel
            </button>
            <button
              type      = "submit"
              className = "btn btn-primary"
              disabled  = {submitting}
            >
              {submitting ? 'Creating...' : 'Create Customer'}
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}

export default AddCustomer