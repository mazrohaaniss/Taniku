import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App' // Ganti nama import menjadi AppWrapper
import './index.css' // Atau hapus jika tidak pakai styling global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)