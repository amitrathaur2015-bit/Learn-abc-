import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { applyDisplaySettings } from './services/displaySettingsService'
import BackgroundDecor from './components/BackgroundDecor'

// Applied before the first paint (not inside a React effect) so the page
// never flashes bright, then dims a moment later.
applyDisplaySettings()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BackgroundDecor />
    <App />
  </React.StrictMode>
)
