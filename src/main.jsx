import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import TimerSelection from './pages/TimerSelection.jsx'
import ActiveTimer from './pages/ActiveTimer.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/STUDDLE/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timer" element={<TimerSelection />} />
        <Route path="/timer/:mode" element={<ActiveTimer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)