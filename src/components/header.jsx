import React from 'react';
import { Link } from 'react-router-dom'; 
import './header.css';
import logoImg from "../assets/logostuddle.png"; 
import avatarImg from "../assets/pisica.png";// IMPORTĂ ASTA SUS DE TOT

const Header = () => {
  return (
    <header className="header-studdle">
      <div className="logo-box">
  <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
    </div>
      
      <div className="header-right">
<nav className="nav-meniu">
  <Link to="/">ACASĂ</Link>
  <Link to="/" className="active">MATERIALE DE STUDIU</Link>
  <Link to="#">PRIETENI</Link>
  <Link to="#">SETĂRI</Link>
  <Link to="/timerSelection">TIMER</Link> {/* FĂRĂ PUNCT, DOAR SLASH */}
</nav>

        <div className="avatar-box">
          <div className="cerc-avatar">
            <img src={avatarImg} alt="Profil" className="avatar-img" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;