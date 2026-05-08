import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importăm Link pentru navigare și useLocation pentru stilul de "activ"
import './header.css';
import logoImg from "../assets/logoStuddle.png"; 
import avatarImg from "../assets/pisica.png";

const Header = () => {
  const location = useLocation(); // Ne ajută să știm pe ce pagină suntem

  // Funcție utilă care verifică dacă un link este cel activ (pentru a-i pune clasa CSS corespunzătoare)
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className="header-studdle">
      <div className="logo-box">
        {/* Logo-ul duce acum la pagina principală când dai click pe el */}
        <Link to="/">
          <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
        </Link>
      </div>
      
      <div className="header-right">
        <nav className="nav-meniu">
          <Link to="/" className={isActive("/")}>ACASĂ</Link>
          <Link to="/materiale" className={isActive("/materiale")}>MATERIALE DE STUDIU</Link>
          <Link to="/friends" className={isActive("/friends")}>PRIETENI</Link>
          <Link to="/settings" className={isActive("/settings")}>SETĂRI</Link>
          <Link to="/timer" className={isActive("/timer")}>TIMER</Link>
        </nav>

        <div className="avatar-box">
          <div className="cerc-avatar">
            {/* Avatarul duce utilizatorul la login sau profil */}
            <Link to="/login">
              <img src={avatarImg} alt="Profil" className="avatar-img" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;