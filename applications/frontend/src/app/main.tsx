import './global.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { appStarted } from '@/shared/config/init'

import { App } from './app'

const container = document.querySelector('#root')!
const root = ReactDOM.createRoot(container)

appStarted()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
