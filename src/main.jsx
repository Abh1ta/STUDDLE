import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Importăm router-ul
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx' // Importă pagina de Login
import SignUp from './SignUp.jsx' // Importă pagina de SignUp

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principală (Landing Page) */}
        <Route path="/" element={<App />} />
        
        {/* Rutele pentru paginile tale */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)