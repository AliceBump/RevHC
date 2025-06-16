import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DoctorPage from './components/doctor'

const RootComponent = window.location.pathname.startsWith('/doctor')
  ? DoctorPage
  : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
