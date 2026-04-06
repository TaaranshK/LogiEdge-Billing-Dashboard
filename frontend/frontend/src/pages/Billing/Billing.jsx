

import React, { useState, useEffect } from 'react'
import { getAllCustomers }  from '../../API/customerAPI'
import { getActiveItems }   from '../../API/itemapi'
import { createInvoice }    from '../../API/billingapi'
import { formatCurrency }   from '../../utils/helper'
import './Billing.css'


const StepIndicator = ({ currentStep }) => {

  const steps = [
    { number: 1, label: 'Select Customer' },
    { number: 2, label: 'Select Items'    },
    { number: 3, label: 'Review & Confirm'},
  ]

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>

          {/* Step circle + label */}
          <div className={`step ${currentStep >= step.number ? 'step--done' : ''} ${currentStep === step.number ? 'step--active' : ''}`}>
            <div className="step__circle">
              {/* Show number for all steps */}
              {step.number}
            </div>
            <span className="step__label">{step.label}</span>
          </div>

          {/* Connector line between steps — not after last step */}
          {index < steps.length - 1 && (
            <div className={`step__connector ${currentStep > step.number ? 'step__connector--done' : ''}`} />
          )}

        </React.Fragment>
      ))}
    </div>
  )
}


const Billing = () => {

    // Page data — fetched from backend
  const [customers,  setCustomers]  = useState([])
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(true)

  // Step navigation
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 — which customer was selected
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Step 2 — selected items with quantities
  // Format: { [item_id]: { ...itemDetails, quantity: N } }
  // Using an object (not array) so we can look up by ID instantly
  const [selectedItems, setSelectedItems] = useState({})

  // Step 3 — after invoice is generated
  const [generatedInvoice, setGeneratedInvoice] = useState(null)

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')


    useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [customersRes, itemsRes] = await Promise.all([
          getAllCustomers(),
          getActiveItems()
        ])

        // Only show active customers in the billing screen
        const activeCustomers = (customersRes.data || []).filter(
          c => c.status === 'Active'
        )

        setCustomers(activeCustomers)
        setItems(itemsRes.data || [])

      } catch (err) {
        setError('Failed to load billing data. Please refresh.')
        console.error('Billing load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])


  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setError('')
    // Automatically move to step 2 after customer is picked
    setCurrentStep(2)
  }
const toggleItem = (item) => {
    setSelectedItems(prev => {

      // If item is already selected → remove it
      if (prev[item.id]) {
        const updated = { ...prev }
        delete updated[item.id]
        return updated
      }

      // If not selected → add it with default quantity of 1
      return {
        ...prev,
        [item.id]: { ...item, quantity: 1 }
      }
    })
    setError('')
  }


  const handleQtyChange = (itemId, value) => {
    // quantity must be at least 1 — never let it go below
    const qty = Math.max(1, parseInt(value) || 1)

    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: qty }
    }))
  }
 // Convert selectedItems object to an array for easier mapping
  const selectedItemsList = Object.values(selectedItems)

  // Add up all line totals → subtotal
  const subtotal = selectedItemsList.reduce((sum, item) => {
    return sum + (item.selling_price * item.quantity)
  }, 0)

  // GST logic:
  // If customer has a gst_number → they are registered → 0% GST
  // If no gst_number → not registered → 18% GST
  const isGSTRegistered = selectedCustomer?.gst_number &&
                          selectedCustomer.gst_number.trim() !== ''

  const gstRate   = isGSTRegistered ? 0 : 18
  const gstAmount = parseFloat((subtotal * (gstRate / 100)).toFixed(2))
  const total     = parseFloat((subtotal + gstAmount).toFixed(2))

  const handleProceedToReview = () => {
    if (selectedItemsList.length === 0) {
      setError('Please select at least one item before proceeding')
      return
    }
    setError('')
    setCurrentStep(3)
  }


  const handleGenerateInvoice = async () => {

    try {
      setSubmitting(true)
      setError('')

      // Build the payload in the format backend expects
      const billingPayload = {
        customer_id : selectedCustomer.id,
        items       : selectedItemsList.map(item => ({
          item_id  : item.id,
          quantity : item.quantity
        }))
      }

      const response = await createInvoice(billingPayload)

      // Save the generated invoice to show in success panel
      setGeneratedInvoice(response.data)

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to generate invoice. Try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }
 const handleReset = () => {
    setCurrentStep(1)
    setSelectedCustomer(null)
    setSelectedItems({})
    setGeneratedInvoice(null)
    setError('')
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    )
  }
if (generatedInvoice) {
    return (
      <div className="billing-page">

        <div className="page-header">
          <div>
            <h1 className="page-title">Invoice Generated!</h1>
            <p className="page-subtitle">
              Your invoice has been saved successfully
            </p>
          </div>
        </div>

        {/* Success invoice card */}
        <div className="invoice-success card">

          {/* Header */}
          <div className="invoice-success__header">
            <div>
              <h2 className="invoice-success__id">
                {generatedInvoice.invoice_id}
              </h2>
              <p className="invoice-success__sub">
                Invoice created successfully
              </p>
            </div>
          </div>

          <div className="divider" />

          {/* Customer info */}
          <div className="invoice-success__section">
            <p className="invoice-success__section-title">Customer Details</p>
            <div className="invoice-success__info-grid">
              <div>
                <span className="info-label">Name</span>
                <span className="info-value">{generatedInvoice.customer_name}</span>
              </div>
              <div>
                <span className="info-label">GST Number</span>
                <span className="info-value">
                  {generatedInvoice.gst_number || 'Not Registered'}
                </span>
              </div>
              <div>
                <span className="info-label">Address</span>
                <span className="info-value">
                  {generatedInvoice.address || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Line items */}
          <div className="invoice-success__section">
            <p className="invoice-success__section-title">Items Billed</p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedInvoice.items?.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
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

          <div className="divider" />

          {/* Billing totals */}
          <div className="invoice-success__totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatCurrency(generatedInvoice.subtotal)}</span>
            </div>
            <div className="totals-row">
              <span>
                GST
                <span className="totals-gst-note">
                  {generatedInvoice.gst_rate === 0
                    ? ' — Customer is GST Registered (Exempt)'
                    : ` — ${generatedInvoice.gst_rate}% Applied`
                  }
                </span>
              </span>
              <span>{formatCurrency(generatedInvoice.gst_amount)}</span>
            </div>
            <div className="totals-row totals-row--final">
              <span>Total Amount Payable</span>
              <span>{formatCurrency(generatedInvoice.total_amount)}</span>
            </div>
          </div>

          {/* New invoice button */}
          <div className="invoice-success__actions">
            <button className="btn btn-primary" onClick={handleReset}>
              + Create New Invoice
            </button>
          </div>

        </div>
      </div>
    )
  }
 return (
    <div className="billing-page">

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">
            Generate invoices for your customers
          </p>
        </div>
      </div>

      {/* Step indicator at top */}
      <StepIndicator currentStep={currentStep} />

      {/* Error message */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
           {error}
        </div>
      )}
{currentStep === 1 && (
        <div className="billing-step">
          <div className="billing-step__header">
            <h2 className="billing-step__title">Select a Customer</h2>
            <p className="billing-step__sub">
              Choose the customer you are generating this invoice for
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="empty-state">
              <p>No active customers found</p>
              <p style={{ fontSize: '12px' }}>
                Add customers in the Master section first
              </p>
            </div>
          ) : (
            <div className="billing-customers-grid">
              {customers.map((customer) => (
                <div
                  key       = {customer.id}
                  className = "billing-customer-card card card-clickable"
                  onClick   = {() => handleSelectCustomer(customer)}
                >
                  {/* Avatar */}
                  <div className="billing-customer-card__avatar">
                    {customer.customer_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <h3 className="billing-customer-card__name">
                    {customer.customer_name}
                  </h3>

                  {/* GST status tag */}
                  <div className={`billing-customer-card__gst ${customer.gst_number ? 'gst--registered' : 'gst--not-registered'}`}>
                    {customer.gst_number
                      ? 'GST Registered — No GST on invoice'
                      : 'Not Registered — 18% GST applies'
                    }
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* -------------------------------------------------- */}
      {/*  STEP 2 — SELECT ITEMS                             */}
      {/* -------------------------------------------------- */}

      {currentStep === 2 && (
        <div className="billing-step">

          {/* Selected customer summary bar */}
          <div className="billing-customer-bar">
            <div className="billing-customer-bar__info">
              <span className="billing-customer-bar__label">Customer</span>
              <span className="billing-customer-bar__name">
                {selectedCustomer?.customer_name}
              </span>
            </div>
            <div className={`billing-customer-bar__gst ${isGSTRegistered ? 'gst--registered' : 'gst--not-registered'}`}>
              {isGSTRegistered
                ? 'GST Registered — 0% GST'
                : 'Not GST Registered — 18% GST will apply'
              }
            </div>
            {/* Allow going back to change customer */}
            <button
              className = "btn btn-secondary btn-sm"
              onClick   = {() => { setCurrentStep(1); setSelectedItems({}) }}
            >
              Change
            </button>
          </div>

          <div className="billing-step__header" style={{ marginTop: 'var(--space-lg)' }}>
            <h2 className="billing-step__title">Select Items</h2>
            <p className="billing-step__sub">
              Click an item to add it. Adjust quantities as needed.
            </p>
          </div>

          {/* Two column layout — items grid on left, cart on right */}
          <div className="billing-items-layout">

            {/* LEFT — items grid */}
            <div className="billing-items-grid">
              {items.map((item) => {
                const isSelected = !!selectedItems[item.id]

                return (
                  <div
                    key       = {item.id}
                    className = {`billing-item-card card ${isSelected ? 'billing-item-card--selected' : ''}`}
                    onClick   = {() => toggleItem(item)}
                  >
                    {/* Selection indicator — top right corner */}
                    <div className="billing-item-card__check">
                    </div>

                    <h4 className="billing-item-card__name">
                      {item.item_name}
                    </h4>

                    <div className="billing-item-card__price">
                      {formatCurrency(item.selling_price)}
                    </div>

                    <span className="billing-item-card__unit">per unit</span>

                    {/* Quantity control — only shown when item is selected */}
                    {isSelected && (
                      <div
                        className = "billing-item-card__qty"
                        onClick   = {(e) => e.stopPropagation()}
                      >
                        {/* Minus button */}
                        <button
                          className = "qty-btn"
                          onClick   = {(e) => {
                            e.stopPropagation()
                            handleQtyChange(item.id, selectedItems[item.id].quantity - 1)
                          }}
                        >
                          −
                        </button>

                        {/* Quantity input */}
                        <input
                          type     = "number"
                          className= "qty-input"
                          value    = {selectedItems[item.id]?.quantity || 1}
                          min      = "1"
                          onChange = {(e) => {
                            e.stopPropagation()
                            handleQtyChange(item.id, e.target.value)
                          }}
                        />

                        {/* Plus button */}
                        <button
                          className = "qty-btn"
                          onClick   = {(e) => {
                            e.stopPropagation()
                            handleQtyChange(item.id, selectedItems[item.id].quantity + 1)
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}

                  </div>
                )
              })}
            </div>

            {/* RIGHT — live running cart summary */}
            <div className="billing-cart">
              <h3 className="billing-cart__title">Order Summary</h3>

              {selectedItemsList.length === 0 ? (
                <div className="billing-cart__empty">
                  <span>🛒</span>
                  <p>No items selected yet</p>
                </div>
              ) : (
                <>
                  {/* Cart line items */}
                  <div className="billing-cart__items">
                    {selectedItemsList.map(item => (
                      <div key={item.id} className="billing-cart__item">
                        <div className="billing-cart__item-name">
                          {item.item_name}
                        </div>
                        <div className="billing-cart__item-calc">
                          {item.quantity} × {formatCurrency(item.selling_price)}
                        </div>
                        <div className="billing-cart__item-total">
                          {formatCurrency(item.selling_price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="billing-cart__divider" />

                  {/* Running totals */}
                  <div className="billing-cart__totals">
                    <div className="billing-cart__total-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="billing-cart__total-row">
                      <span>GST ({gstRate}%)</span>
                      <span>{formatCurrency(gstAmount)}</span>
                    </div>
                    <div className="billing-cart__total-row billing-cart__total-row--final">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Proceed to review button */}
              <button
                className = "btn btn-primary"
                style     = {{ width: '100%', marginTop: 'var(--space-lg)' }}
                onClick   = {handleProceedToReview}
                disabled  = {selectedItemsList.length === 0}
              >
                Review Invoice
              </button>

            </div>
          </div>
        </div>
      )}


      {/* -------------------------------------------------- */}
      {/*  STEP 3 — REVIEW + CONFIRM                         */}
      {/* -------------------------------------------------- */}

      {currentStep === 3 && (
        <div className="billing-step">

          <div className="billing-step__header">
            <h2 className="billing-step__title">Review & Confirm</h2>
            <p className="billing-step__sub">
              Review the invoice details before generating
            </p>
          </div>

          <div className="billing-review card">

            {/* Customer section */}
            <div className="billing-review__section">
              <p className="billing-review__section-title">Bill To</p>
              <h3 className="billing-review__customer-name">
                {selectedCustomer?.customer_name}
              </h3>
              {selectedCustomer?.address && (
                <p className="billing-review__customer-address">
                  {selectedCustomer.address}
                </p>
              )}
              <div className={`billing-review__gst-status ${isGSTRegistered ? 'gst--registered' : 'gst--not-registered'}`}>
                {isGSTRegistered
                  ? `GST Registered: ${selectedCustomer.gst_number}`
                  : 'Not GST Registered — 18% GST will be charged'
                }
              </div>
            </div>

            <div className="divider" />

            {/* Items table */}
            <div className="billing-review__section">
              <p className="billing-review__section-title">Items</p>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItemsList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.item_name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.selling_price)}</td>
                        <td>{formatCurrency(item.selling_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="divider" />

            {/* Final totals */}
            <div className="billing-review__totals">
              <div className="review-total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="review-total-row">
                <span>
                  GST
                  <span className="review-gst-note">
                    {isGSTRegistered
                      ? ' (Customer is GST Registered — Exempt)'
                      : ` (${gstRate}% — Customer not GST registered)`
                    }
                  </span>
                </span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
              <div className="review-total-row review-total-row--final">
                <span>Total Amount</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="billing-review__actions">
              <button
                className = "btn btn-secondary"
                onClick   = {() => setCurrentStep(2)}
                disabled  = {submitting}
              >
                Edit Items
              </button>
              <button
                className = "btn btn-primary"
                onClick   = {handleGenerateInvoice}
                disabled  = {submitting}
              >
                {submitting ? 'Generating...' : 'Generate Invoice'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Billing