import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './utils/serviceWorker'
import { initHighContrast } from './utils/contrastMode'
import { initTheme } from './utils/themes'

// Initialize High Contrast Mode if enabled
initHighContrast()

// Initialize theme system
initTheme()

// Register Service Worker for PWA offline support
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


