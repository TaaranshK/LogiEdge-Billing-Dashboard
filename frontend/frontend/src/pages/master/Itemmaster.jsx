import React, { useState, useEffect } from 'react'
import { useNavigate }   from 'react-router-dom'
import { getAllItems }    from '../../API/itemapi'
import { getStatusClass } from '../../utils/helper'
import { formatCurrency } from '../../utils/helper'
import './Master.css'

const ItemCard = ({ item }) => {
  return (
    <div className="entity-card card">

      {/* Top row — avatar + status badge */}
      <div className="entity-card__header">
        <div className="entity-card__avatar">
          {item.item_name.charAt(0).toUpperCase()}
        </div>
        <span className={getStatusClass(item.status)}>
          {item.status}
        </span>
      </div>

      {/* Item name */}
      <h3 className="entity-card__name">{item.item_name}</h3>

      {/* Selling price — prominently displayed */}
      <div className="entity-card__price">
        {formatCurrency(item.selling_price)}
      </div>

      {/* Per unit label */}
      <div className="entity-card__details">
        <div className="entity-card__detail-row">
          <span className="entity-card__detail-label">Price</span>
          <span className="entity-card__detail-value">
            per unit
          </span>
        </div>
      </div>

    </div>
  )
}

const ItemMaster = () => {

  const navigate = useNavigate()

  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')


  // Fetch all items when component mounts
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true)
        const response = await getAllItems()
        setItems(response.data || [])
      } catch (err) {
        setError('Failed to load items. Please try again.')
        console.error('Items fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
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
          <h1 className="page-title">Items</h1>
          <p className="page-subtitle">
            {items.length} item{items.length !== 1 ? 's' : ''} in master
          </p>
        </div>
        <button
          className = "btn btn-primary"
          onClick   = {() => navigate('/master/items/add')}
        >
          + Add Item
        </button>
      </div>


      {/* Error alert */}
      {error && (
        <div className="alert alert-error">{error}</div>
      )}


      {/* Items grid or empty state */}
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items yet</p>
          <button
            className = "btn btn-primary"
            onClick   = {() => navigate('/master/items/add')}
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  )
}

export default ItemMaster