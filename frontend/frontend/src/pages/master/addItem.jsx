import React, { useState } from 'react'
import { useNavigate }     from 'react-router-dom'
import { createItem }      from '../../API/itemapi'
import './master.css'


const AddItem = () => {

  const navigate = useNavigate()

  // Form state — all fields in one object
  const [formData, setFormData] = useState({
    item_name     : '',
    selling_price : '',
    status        : 'Active'
  })


  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

   const handleSubmit = async (e) => {
    e.preventDefault()

    // Frontend validation before API call
    if (!formData.item_name.trim()) {
      setError('Item name is required')
      return
    }

    if (!formData.selling_price || formData.selling_price === '') {
      setError('Selling price is required')
      return
    }

    if (parseFloat(formData.selling_price) <= 0) {
      setError('Selling price must be greater than zero')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await createItem(formData)

      setSuccess('Item created successfully! Redirecting...')

      setTimeout(() => {
        navigate('/master/items')
      }, 1200)

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create item. Try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }


  const handleCancel = () => {
    navigate('/master/items')
  }


  return (
    <div className="master-page">

      {/* Page header */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={handleCancel}>
            Back to Items
          </button>
          <h1 className="page-title">Add New Item</h1>
          <p className="page-subtitle">
            Fill in the details below to add a new item
          </p>
        </div>
      </div>


      {/* Form card */}
      <div className="form-card card">

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          
          
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label" htmlFor="item_name">
                Item Name <span className="form-required">*</span>
              </label>
              <input
                id          = "item_name"
                name        = "item_name"
                type        = "text"
                className   = "form-input"
                placeholder = "e.g. Laptop"
                value       = {formData.item_name}
                onChange    = {handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="selling_price">
                Customer Selling Price <span className="form-required">*</span>
              </label>
              <input
                id          = "selling_price"
                name        = "selling_price"
                type        = "number"
                className   = "form-input"
                placeholder = "e.g. 55000"
                value       = {formData.selling_price}
                onChange    = {handleChange}
                min         = "0.01"
                step        = "0.01"
              />
              <p className="form-hint">
                💡 Enter the price per unit in Indian Rupees (₹)
              </p>
            </div>

          </div>


          
          <div className="form-grid" style={{ marginTop: 'var(--space-lg)' }}>

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

          </div>


          {/* Action buttons */}
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
              {submitting ? 'Creating...' : 'Create Item'}
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default AddItem
