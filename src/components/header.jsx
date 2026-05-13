/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import './header.css';
import logoImg from "../assets/logoStuddle.png"; 
import { useAvatar } from '../context/AvatarContext';
import { getCatImage } from '../utils/catImages';

const Header = () => {
  const location = useLocation(); 
  const { avatarData } = useAvatar();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className="header-studdle">
  <div className="logo-box">
    <Link to="/home">
      <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
    </Link>
  </div>

  <nav className="nav-meniu">
    <Link to="/home" className={isActive("/")}>ACASĂ</Link>
    <Link to="/materiale" className={isActive("/materiale")}>MATERIALE DE STUDIU</Link>
    <Link to="/friends" className={isActive("/friends")}>PRIETENI</Link>
    <Link to="/chat" className={isActive("/chat")}>CHAT</Link>
    <Link to="/settings" className={isActive("/settings")}>SETĂRI</Link>
    <Link to="/timer" className={isActive("/timer")}>TIMER</Link>
  </nav>

  <div className="avatar-box">
    <div className="cerc-avatar">
      <Link to="/customization">
        <img 
          src={getCatImage(avatarData?.skin_color, avatarData?.eye_color)} 
          alt="Profil" 
          className="avatar-img" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: 'none',
            transform: 'scale(3.4) translate(2.2%, 9%)'
          }}
        />
      </Link>
    </div>
  </div>
</header>
  );
};

export default Header;