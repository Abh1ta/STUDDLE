import React from 'react';
import './header.css';
import logoImg from "../assets/logostuddle.png"; 
import avatarImg from "../assets/pisica.png";

const Header = () => {
  return (
    <header className="header-studdle">
      <div className="logo-box">
  <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
</div>
      
      <div className="header-right">
        <nav className="nav-meniu">
          <a href="#">ACASĂ</a>
          <a href="#" className="active">MATERIALE DE STUDIU</a>
          <a href="#">PRIETENI</a>
          <a href="#">SETĂRI</a>
          <a href="#">TIMER</a>
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