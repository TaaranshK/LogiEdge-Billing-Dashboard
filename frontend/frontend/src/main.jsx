import React    from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App        from './App'
import './index.css'   // global styles loaded once here for entire app

// createRoot is the modern React 18 way to render the app
// It's more performant than the old ReactDOM.render()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      BrowserRouter enables URL-based navigation.
      Any component inside can now use useNavigate, Link, Routes etc.
      We put it here (at the very top) so every page has access.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)