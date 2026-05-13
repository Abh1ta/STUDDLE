import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App.jsx'
import StartPage from './pages/StartPage.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import FriendsPage from './pages/FriendsPage.jsx'
import Settings from './pages/Settings.jsx'
import ChatRoute from './pages/ChatRoute.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import PaginaMateriale from './pages/PaginaMateriale.jsx'
import Layout from './Layout.jsx'
import MyAccount from './pages/MyAccount.jsx'
import FriendsChat from './pages/FriendsChat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {/*<Layout />*/}
          <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<StartPage />} />     
    <Route path="/home" element={<App />} />          
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/friends" element={<FriendsPage />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/chat" element={<ChatRoute />} />
    <Route path="/materiale" element={<PaginaMateriale />} />
    <Route path="/myaccount" element={<MyAccount />} />
    <Route path="/friendschat" element={<FriendsChat />} />
  </Route>
</Routes>
        
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)