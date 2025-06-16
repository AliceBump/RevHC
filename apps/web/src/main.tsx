import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DoctorPage from './components/doctor'

// Remove the configured base path before checking the current route so that
// paths work correctly when the application is hosted in a subfolder (e.g.
// GitHub Pages).
const currentPath = window.location.pathname.replace(
  import.meta.env.BASE_URL,
  '/'
)

const RootComponent = currentPath.startsWith('/doctor') ? DoctorPage : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
