/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';

import logoImg from "../assets/logoStuddle.png";

import { useAvatar } from '../context/AvatarContext';
import { getCatImage } from '../utils/catImages';
import { useSidebar } from '../context/SidebarContext';

import {
  House,
  BookOpen,
  Users,
  MessageSquare,
  Trophy,
  Timer,
  Settings
} from 'lucide-react';

const menuItems = [
  { to: '/home',        label: 'Acasă',      icon: House },
  { to: '/materiale',   label: 'Materiale',  icon: BookOpen },
  { to: '/friends',     label: 'Prieteni',   icon: Users },
  { to: '/chat',        label: 'Chat',       icon: MessageSquare },
  { to: '/leaderboard', label: 'Clasament',  icon: Trophy },
  { to: '/timer',       label: 'Timer',      icon: Timer },
  { to: '/settings',    label: 'Setări',     icon: Settings },
];

const Header = () => {
  const { avatarData } = useAvatar();
  const location = useLocation();
  const { collapsed, toggle } = useSidebar();

  const isTimerPage =
    location.pathname.startsWith('/timer/') &&
    location.pathname !== '/timer';

  return (
    <aside
      className={`sidebar-studdle${
        collapsed ? ' collapsed' : ''
      }${isTimerPage ? ' solid-header' : ''}`}
    >

      <div className="sidebar-logo-box">

        {!collapsed && (
          <NavLink to="/home" className="sidebar-logo-link">
            <img
              src={logoImg}
              alt="Studdle"
              className="sidebar-logo-img"
            />
          </NavLink>
        )}

        <button
          className="sidebar-toggle-btn"
          onClick={toggle}
          title={collapsed ? 'Extinde' : 'Restrânge'}
        >
          {collapsed ? '›' : '‹'}
        </button>

      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              title={collapsed ? item.label : ''}
            >

              <span className="sidebar-icon">
                <Icon size={22} />
              </span>

              {!collapsed && (
                <span className="sidebar-label">
                  {item.label}
                </span>
              )}

            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-avatar-box">

        <NavLink
          to="/customization"
          className="sidebar-avatar-link"
        >

          <div className="sidebar-avatar-ring">

            <img
              src={getCatImage(
                avatarData?.skin_color,
                avatarData?.eye_color
              )}
              alt="Profil"
              className="sidebar-avatar-img"
            />

          </div>

        </NavLink>

      </div>

    </aside>
  );
};

export default Header;
