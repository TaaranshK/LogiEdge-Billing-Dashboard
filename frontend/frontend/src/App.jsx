import React  from 'react'
import { Routes, Route } from 'react-router-dom'

// Layout components
import Sidebar from './components/sidebar/Sidebar'
import Dashboard from './components/Dashboard/dashboard'

// Page components — each one is a full screen
import MasterHome   from './pages/master/master'
import Customermaster from './pages/master/Customermaster'
import AddCustomer  from './pages/master/AddCustomer'
import Itemmaster   from './pages/master/Itemmaster'
import AddItem      from './pages/master/addItem'
import Billing      from './pages/Billing/Billing'


function App() {
  return (

    /*
      .layout is a flex container defined in index.css
      Sidebar sits on the left, main content fills the rest.
    */
    <div className="layout">

      {/* Sidebar is always visible — it never unmounts */}
      <Sidebar />

      {/*
        .main-content has margin-left equal to sidebar width
        so content never hides behind the sidebar.
        Routes go here — only the matched page renders inside.
      */}
      <main className="main-content">
        <Routes>

          {/* Dashboard — default landing page */}
          <Route path="/"  element={<Dashboard />} />

          {/* Master Home — shows Customer and Item cards */}
          <Route path="/master" element={<MasterHome />} />

          {/* Customer Master — list of all customers */}
          <Route path="/master/customers" element={<Customermaster />} />

          {/* Add Customer — form to create new customer */}
          <Route path="/master/customers/add" element={<AddCustomer />} />

          {/* Item Master — list of all items */}
          <Route path="/master/items" element={<Itemmaster />} />

          {/* Add Item — form to create new item */}
          <Route path="/master/items/add" element={<AddItem />} />

          {/* Billing — create invoices screen */}
          <Route path="/billing" element={<Billing />} />

        </Routes>
      </main>

    </div>
  )
}

export default App