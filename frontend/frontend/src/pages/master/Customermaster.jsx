import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCustomers } from '../../API/customerAPI'
import { getStatusClass  } from '../../utils/helper'
import './master.css'


const CustomerCard = ({ customer }) => {
  return (
    <div className="entity-card card">

      {/* Top row — name + status badge */}
      <div className="entity-card__header">
        <div className="entity-card__avatar">
          {/* First letter of customer name as avatar */}
          {customer.customer_name.charAt(0).toUpperCase()}
        </div>
        <span className={getStatusClass(customer.status)}>
          {customer.status}
        </span>
      </div>

      {/* Customer name */}
      <h3 className="entity-card__name">{customer.customer_name}</h3>

      {/* Customer details */}
      <div className="entity-card__details">

        {/* GST info — shows registered/not registered */}
        <div className="entity-card__detail-row">
          <span className="entity-card__detail-label">GST</span>
          <span className="entity-card__detail-value">
            {customer.gst_number
              ? customer.gst_number
              : <span className="entity-card__no-gst">Not Registered</span>
            }
          </span>
        </div>

        {/* PAN number */}
        {customer.pan_number && (
          <div className="entity-card__detail-row">
            <span className="entity-card__detail-label">PAN</span>
            <span className="entity-card__detail-value">
              {customer.pan_number}
            </span>
          </div>
        )}

        {/* Address */}
        {customer.address && (
          <div className="entity-card__detail-row">
            <span className="entity-card__detail-label">Address</span>
            <span className="entity-card__detail-value entity-card__address">
              {customer.address}
            </span>
          </div>
        )}

      </div>

    </div>
  )
}


const CustomerMaster = () => {

  const navigate = useNavigate()

  // customers → array of all customer objects from backend
  // loading   → shows spinner while fetching
  // error     → stores error message if fetch fails
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')


  // Fetch all customers when page loads
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true)
        const response = await getAllCustomers()
        setCustomers(response.data || [])
      } catch (err) {
        setError('Failed to load customers. Please try again.')
        console.error('Customer fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])


  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    )
  }


  return (
    <div className="master-page">

      {/* Header with ADD button */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">
            {customers.length} customer{customers.length !== 1 ? 's' : ''} in master
          </p>
        </div>
        <button
          className = "btn btn-primary"
          onClick   = {() => navigate('/master/customers/add')}
        >
          + Add Customer
        </button>
      </div>


      {/* Error message */}
      {error && (
        <div className="alert alert-error">{error}</div>
      )}


      {/* Customer cards grid */}
      {customers.length === 0 ? (
        <div className="empty-state">
          <p>No customers yet</p>
          <button
            className = "btn btn-primary"
            onClick   = {() => navigate('/master/customers/add')}
          >
            Add First Customer
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

    </div>
  )
}

export default CustomerMaster