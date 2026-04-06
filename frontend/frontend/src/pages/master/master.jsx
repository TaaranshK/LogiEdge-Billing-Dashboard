import React    from 'react'
import { useNavigate } from 'react-router-dom'
import './master.css'



const MasterCard = ({ title, description, onClick }) => {
  return (
    <div className="master-card card card-clickable" onClick={onClick}>
      <div className="master-card__body">
        <h3 className="master-card__title">{title}</h3>
        <p  className="master-card__desc">{description}</p>
      </div>
    </div>
  )
}


const MasterHome = () => {
  const navigate = useNavigate()

  return (
    <div className="master-home">

      <div className="page-header">
        <div>
          <h1 className="page-title">Master</h1>
          <p className="page-subtitle">
            Manage your customer and item master data
          </p>
        </div>
      </div>

      <div className="master-home__grid">
        <MasterCard
          
          title       = "Customer"
          description = "Read or create customer data"
          onClick     = {() => navigate('/master/customers')}
        />
        <MasterCard
          
          title       = "Items"
          description = "Read or create items data"
          onClick     = {() => navigate('/master/items')}
        />
      </div>

    </div>
  )
}

export default MasterHome