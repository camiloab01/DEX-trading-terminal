import './config'
import './app/style.css'
import 'isomorphic-ws'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/Web3Provider/client_config'
import { HelmetProvider } from 'react-helmet-async'
import RouteWrapper from './app/route/RouteWrapper'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouteWrapper />
    </HelmetProvider>
  </React.StrictMode>
)
