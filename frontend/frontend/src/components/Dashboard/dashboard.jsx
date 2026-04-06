import React, { useState, useEffect } from 'react'
import { getAllInvoices, getInvoiceById, getInvoicesByCustomer } from '../../API/billingapi'
import { getAllCustomers } from '../../API/customerAPI'
import { formatCurrency, formatDate, getStatusClass } from '../../utils/helper'
import './dashboard.css'



const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__title">{title}</p>
        <h3 className="stat-card__value">{value}</h3>
      </div>
    </div>
  )
}

const InvoiceDetailPanel = ({ invoice, onClose }) => {
  if (!invoice) return null

  return (
    <div className="invoice-panel">

      {/* Panel Header */}
      <div className="invoice-panel__header">
        <div>
          <h3 className="invoice-panel__id">{invoice.invoice_id}</h3>
          <p className="invoice-panel__date">
            Generated on {formatDate(invoice.created_at)}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* Customer Info */}
      <div className="invoice-panel__customer">
        <div className="invoice-panel__customer-info">
          <span className="invoice-panel__label">Customer</span>
          <span className="invoice-panel__value">{invoice.customer_name}</span>
        </div>
        <div className="invoice-panel__customer-info">
          <span className="invoice-panel__label">GST Number</span>
          <span className="invoice-panel__value">
            {invoice.gst_number || '— (Not Registered)'}
          </span>
        </div>
        <div className="invoice-panel__customer-info">
          <span className="invoice-panel__label">PAN Number</span>
          <span className="invoice-panel__value">
            {invoice.pan_number || '—'}
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="invoice-panel__items">
        <p className="invoice-panel__section-title">Items Billed</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="invoice-panel__summary">
        <div className="invoice-panel__summary-row">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.subtotal)}</span>
        </div>
        <div className="invoice-panel__summary-row">
          <span>
            GST
            {/* Show the rate — 0% if registered, 18% if not */}
            <span className="invoice-panel__gst-tag">
              {invoice.gst_rate === 0 ? ' (GST Registered — Exempt)' : ` (${invoice.gst_rate}%)`}
            </span>
          </span>
          <span>{formatCurrency(invoice.gst_amount)}</span>
        </div>
        <div className="invoice-panel__summary-row invoice-panel__summary-row--total">
          <span>Total Amount</span>
          <span>{formatCurrency(invoice.total_amount)}</span>
        </div>
      </div>

    </div>
  )
}


const Dashboard = () => {
const [invoices,          setInvoices]          = useState([])
  const [customers,         setCustomers]          = useState([])
  const [loading,           setLoading]            = useState(true)
  const [searchId,          setSearchId]           = useState('')
  const [searchResult,      setSearchResult]       = useState(null)
  const [searchError,       setSearchError]        = useState('')
  const [searching,         setSearching]          = useState(false)
  const [selectedCustomer,  setSelectedCustomer]   = useState('')
  const [filteredInvoices,  setFilteredInvoices]   = useState([])

 useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch both at the same time — parallel requests
        const [invoicesResponse, customersResponse] = await Promise.all([
          getAllInvoices(),
          getAllCustomers()
        ])

        setInvoices(invoicesResponse.data || [])
        setFilteredInvoices(invoicesResponse.data || [])
        setCustomers(customersResponse.data || [])

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        // Always turn off loading — whether success or error
        setLoading(false)
      }
    }

    loadDashboardData()
  }, []) 

   const handleCustomerFilter = async (customerId) => {
    setSelectedCustomer(customerId)

    if (!customerId) {
      // "All Customers" selected — reset to full list
      setFilteredInvoices(invoices)
      return
    }

    try {
      const response = await getInvoicesByCustomer(customerId)
      setFilteredInvoices(response.data || [])
    } catch (error) {
      console.error('Failed to filter by customer:', error)
      setFilteredInvoices([])
    }
  }

  const handleSearch = async () => {

    // Don't search if the input is empty
    if (!searchId.trim()) return

    setSearching(true)
    setSearchResult(null)
    setSearchError('')

    try {
      const response = await getInvoiceById(searchId.trim().toUpperCase())
      setSearchResult(response.data)
    } catch (error) {
      // If 404, show a friendly message — not a console error
      setSearchError(`No invoice found with ID "${searchId.toUpperCase()}"`)
    } finally {
      setSearching(false)
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }


  // Clear search state completely
  const clearSearch = () => {
    setSearchId('')
    setSearchResult(null)
    setSearchError('')
  }

    const totalInvoices = invoices.length

  // Sum of all invoice totals — reduce adds them all up
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total_amount || 0), 0
  )

  // Sum of only the GST collected across all invoices
  const totalGST = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.gst_amount || 0), 0
  )

  // Count how many unique customers have invoices
  const uniqueCustomers = new Set(invoices.map(inv => inv.customer_id)).size



  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="dashboard">

     
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of all billing activity and invoices
          </p>
        </div>
      </div>
<div className="dashboard__stats">
        <StatCard
          title = "Total Invoices"
          value = {totalInvoices}
          icon  = "🧾"
          color = "blue"
        />
        <StatCard
          title = "Total Revenue"
          value = {formatCurrency(totalRevenue)}
          icon  = "💰"
          color = "green"
        />
        <StatCard
          title = "GST Collected"
          value = {formatCurrency(totalGST)}
          icon  = "📊"
          color = "purple"
        />
        <StatCard
          title = "Active Customers"
          value = {uniqueCustomers}
          icon  = "🏢"
          color = "orange"
        />
      </div>


 <div className="dashboard__controls">

        {/* Invoice ID Search */}
        <div className="dashboard__search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type        = "text"
              className   = "form-input search-input"
              placeholder = "Search by Invoice ID (e.g. INVC224830)"
              value       = {searchId}
              onChange    = {(e) => setSearchId(e.target.value)}
              onKeyDown   = {handleSearchKeyDown}
            />
            {/* Show clear button only when there's text */}
            {searchId && (
              <button className="search-clear" onClick={clearSearch}>✕</button>
            )}
          </div>
          <button
            className = "btn btn-primary"
            onClick   = {handleSearch}
            disabled  = {searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Customer Filter Dropdown */}
        <div className="dashboard__filter">
          <span className="filter-label">Filter by Customer</span>
          <select
            className = "form-select"
            value     = {selectedCustomer}
            onChange  = {(e) => handleCustomerFilter(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>

      </div>
    {searchError && (
        <div className="alert alert-error">
           {searchError}
        </div>
      )}

      {/* Invoice detail panel if found */}
      {searchResult && (
        <InvoiceDetailPanel
          invoice = {searchResult}
          onClose = {clearSearch}
        />
      )}

<div className="dashboard__table-section">

        <div className="dashboard__table-header">
          <h2 className="dashboard__table-title">
            {selectedCustomer ? 'Customer Invoices' : 'Recent Invoices'}
          </h2>
          <span className="dashboard__table-count">
            {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredInvoices.length === 0 ? (

          /* Empty state — shown when no invoices exist */
          <div className="empty-state">
            <span className="empty-state-icon">🧾</span>
            <p>No invoices found</p>
            <p style={{ fontSize: '12px' }}>
              {selectedCustomer
                ? 'This customer has no invoices yet'
                : 'Create your first invoice in the Billing section'}
            </p>
          </div>

        ) : (

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Subtotal</th>
                  <th>GST</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoice_id} className="invoice-row">

                    {/* Invoice ID with accent styling */}
                    <td>
                      <span className="invoice-id-tag">
                        {invoice.invoice_id}
                      </span>
                    </td>

                    <td>{invoice.customer_name}</td>

                    <td>{formatCurrency(invoice.subtotal)}</td>

                    {/* GST cell — shows amount + rate */}
                    <td>
                      <div className="gst-cell">
                        <span>{formatCurrency(invoice.gst_amount)}</span>
                        <span className="gst-rate-tag">
                          {invoice.gst_rate === 0 ? 'Exempt' : `${invoice.gst_rate}%`}
                        </span>
                      </div>
                    </td>

                    {/* Total — highlighted as the most important number */}
                    <td>
                      <span className="total-amount">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </td>

                    <td className="date-cell">
                      {formatDate(invoice.created_at)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}
      </div>

    </div>
  )
}

export default Dashboard