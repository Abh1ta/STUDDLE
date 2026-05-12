import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';
import logoImg from "../assets/logoStuddle.png"; 
import avatarImg from "../assets/pisica.png";

const Header = () => {
  return (
    <header className="header-studdle">
      <div className="logo-box">
        <NavLink to="/">
          <img src={logoImg} alt="Studdle Logo" className="logo-studiu" />
        </NavLink>
      </div>
      
      <div className="header-right">
        <nav className="nav-meniu">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>ACASĂ</NavLink>
          <NavLink to="/materiale" className={({ isActive }) => isActive ? 'active' : ''}>MATERIALE DE STUDIU</NavLink>
          <NavLink to="/prieteni" className={({ isActive }) => isActive ? 'active' : ''}>PRIETENI</NavLink>
          <NavLink to="/setari" className={({ isActive }) => isActive ? 'active' : ''}>SETĂRI</NavLink>
          <NavLink to="/timer" className={({ isActive }) => isActive ? 'active' : ''}>TIMER</NavLink>
        </nav>

        <div className="avatar-box">
          <div className="cerc-avatar">
            <NavLink to="/login">
              <img src={avatarImg} alt="Profil" className="avatar-img" />
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
