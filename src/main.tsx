/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" /> //

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onOfflineReady() {
    console.log('✅ App siap offline!')
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)