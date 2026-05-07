import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import ChatRoute from './ChatRoute.jsx'
import './index.css'
<<<<<<< HEAD
import SignUp from './SignUp.jsx';

=======
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
>>>>>>> origin/frontend-login-sigin

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
      </Routes>
=======
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/"       element={<App />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/chat"   element={<ChatRoute />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
>>>>>>> origin/frontend-login-sigin
    </BrowserRouter>
  </React.StrictMode>,
)
