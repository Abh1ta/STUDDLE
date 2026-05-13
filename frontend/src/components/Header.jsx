/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import logoImg from "../assets/logoStuddle.png";
import avatarImg from "../assets/pisica.png";

const Header = () => {
  const location = useLocation();

  // Verificăm dacă suntem pe o sub-rută (ex: /timer/pomodoro)
  // startsWith('/timer/') cu slash la final asigură că nu prinde pagina principală /timer
  const isTimerActivePage = location.pathname.startsWith('/timer/');

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className={`header-studdle ${isTimerActivePage ? 'timer-mode' : ''}`}>
      <div className="logo-box">
        <Link to="/home">
          <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
        </Link>
      </div>

      <nav className="nav-meniu">
        <Link to="/home" className={isActive("/home")}>ACASĂ</Link>
        <Link to="/materiale" className={isActive("/materiale")}>MATERIALE DE STUDIU</Link>
        <Link to="/friends" className={isActive("/friends")}>PRIETENI</Link>
        <Link to="/chat" className={isActive("/chat")}>CHAT</Link>
        <Link to="/settings" className={isActive("/settings")}>SETĂRI</Link>
        <Link to="/timer" className={isActive("/timer")}>TIMER</Link>
      </nav>

      <div className="avatar-box">
        <div className="cerc-avatar">
          <Link to="/login">
            <img src={avatarImg} alt="Profil" className="avatar-img" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;