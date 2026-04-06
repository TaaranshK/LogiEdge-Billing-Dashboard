import React          from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'


const NavItem = ({ label, path, active, onClick }) => {
  return (
    <div
      className={`nav-item ${active ? 'nav-item--active' : ''}`}
      onClick={onClick}
    >
      {/* Label text */}
      <span className="nav-item__label">{label}</span>
    </div>
  )
}

const Sidebar = () => {

  // useLocation gives us the current URL path
  // We use this to figure out which nav item should be "active"
  const location = useLocation()
  const navigate = useNavigate()

  // Current path — e.g. '/master/customers' or '/billing'
  const currentPath = location.pathname


  const isActive = (path) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }


  // Navigation items config — easy to add more later
  const navItems = [
    {
      label : 'Dashboard',
      path  : '/'
    },
    {
      label : 'Master',
      path  : '/master'
    },
    {
      label : 'Billing',
      path  : '/billing'
    }
  ]


  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">LogiEdge</span>
          <span className="sidebar__brand-tagline">Billing System</span>
        </div>
      </div>
<div className="sidebar__divider" />    
  <p className="sidebar__section-label">Navigation</p>

  <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavItem
            key    = {item.path}
            icon   = {item.icon}
            label  = {item.label}
            path   = {item.path}
            active = {isActive(item.path)}
            onClick= {() => navigate(item.path)}
          />
        ))}
      </nav>

       <div className="sidebar__footer">
        <div className="sidebar__divider" />
        <div className="sidebar__version">
          <span className="sidebar__version-dot" />
          <span>v1.0.0 &nbsp;·&nbsp; LogiEdge</span>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar
   