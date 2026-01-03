import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { patchGanttForCustomViewModes } from './utils/ganttPatch'
import 'frappe-gantt/dist/frappe-gantt.css'
import './styles/globals.css'

// Apply patch before rendering app - enables custom view modes like 15-minute intervals
patchGanttForCustomViewModes()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
