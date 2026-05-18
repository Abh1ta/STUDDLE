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
import { AvatarProvider } from './context/AvatarContext.jsx'
<<<<<<< HEAD
=======
import { SidebarProvider } from './context/SidebarContext.jsx'
>>>>>>> origin/feature/update
import PaginaMateriale from './pages/PaginaMateriale.jsx'
import Layout from './Layout.jsx'
import TimerSelection from './pages/TimerSelection.jsx'
import ActiveTimer from './pages/ActiveTimer.jsx'
import CharacterCustomization from './pages/CharacterCustomization.jsx'
import MyAccount from './pages/MyAccount.jsx'
import FriendsChat from './pages/FriendsChat.jsx'
<<<<<<< HEAD
import PDFViewer from './pages/PDFViewer.jsx';
import PaginaEditMateriale from './pages/PaginaEditMateriale.jsx'
=======
import PDFViewer from './pages/PDFViewer.jsx'
import PaginaEditMateriale from './pages/PaginaEditMateriale.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
>>>>>>> origin/feature/update

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AvatarProvider>
<<<<<<< HEAD
          <SocketProvider>
            <Layout />
            <Routes>
              
              <Route path="/" element={<StartPage />} />     
              <Route path="/home" element={<App />} />          
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<ChatRoute />} />
              <Route path="/materiale" element={<PaginaMateriale />} />
              <Route path="/timer" element={<TimerSelection />} />
              <Route path="/timer/:mode" element={<ActiveTimer />} />
              <Route path="/customization" element={<CharacterCustomization />} />
              <Route path="/myaccount" element={<MyAccount />} />
              <Route path="/friendschat" element={<FriendsChat />} />
              <Route path="/pdf-viewer" element={<PDFViewer />} />
              <Route path="/edit-material:id" element={<PaginaEditMateriale />} />
            </Routes>
          </SocketProvider>
=======
          <SidebarProvider>
            <SocketProvider>
              <Routes>
              {/* fara sidebar */}
              <Route path="/" element={<StartPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/pdf-viewer" element={<PDFViewer />} />

              {/*cu sidebar */}
              <Route element={<Layout />}>
                <Route path="/home" element={<App />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat" element={<ChatRoute />} />
                <Route path="/materiale" element={<PaginaMateriale />} />
                <Route path="/timer" element={<TimerSelection />} />
                <Route path="/timer/:mode" element={<ActiveTimer />} />
                <Route path="/customization" element={<CharacterCustomization />} />
                <Route path="/myaccount" element={<MyAccount />} />
                <Route path="/friendschat" element={<FriendsChat />} />
                <Route path="/edit-material/:id" element={<PaginaEditMateriale />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
            </Routes>
            </SocketProvider>
          </SidebarProvider>
>>>>>>> origin/feature/update
        </AvatarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
<<<<<<< HEAD
)
=======
)
>>>>>>> origin/feature/update
