// --- START OF FILE src/main.jsx ---
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Keep or update your global styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// --- END OF FILE src/main.jsx ---