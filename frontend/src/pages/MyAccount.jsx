/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import StatisticiSection from './StatisticiSection';

import contulMeu from '../assets/contulMeu.png';
import stergeCont from '../assets/stergereCont.png';
import deconectare from '../assets/deconectare.png';

const API_BASE_URL = '/api';
const P = { navy: '#344979', blue: '#5d6da5', lav: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth={2.2} style={{ width: '18px', height: '18px' }}>
    <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
  </svg>
);

const DeleteModal = ({ onConfirm, onCancel }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(52,73,121,0.35)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: 'linear-gradient(150deg, #344979, #5d6da5)', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 24px 60px rgba(52,73,121,0.4)', fontFamily: "'Zilla Slab', serif" }}>
      <div style={{ width: '56px', height: '56px', background: 'rgba(229,62,62,0.15)', border: '2px solid rgba(229,62,62,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <TrashIcon />
      </div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Ștergi contul?</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '24px' }}>Această acțiune este permanentă și ireversibilă.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.25)', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
          Anulează
        </button>
        <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: 'none', background: 'rgba(229,62,62,0.8)', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
          Șterge
        </button>
      </div>
    </div>
  </div>
);

function MyAccount() {
  const navigate = useNavigate();
  const { token, logout, user: authUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ username: '', email: '', googleEmail: 'Neconectat' });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/settings`, config);
        setUserData({
          username: res.data.username || authUser?.username || 'Utilizator',
          email: res.data.email || authUser?.email || 'email@studdle.ro',
          googleEmail: res.data.googleEmail || 'Neconectat',
        });
      } catch (error) {
        console.error('Eroare la profil:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [token, authUser]);

  const handleLogout = () => { if (logout) logout(); navigate('/login'); };
  const handleDeleteAccount = () => { setShowDeleteModal(false); handleLogout(); };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Zilla Slab', serif", color: P.lav, fontStyle: 'italic' }}>
      Se încarcă profilul...
    </div>
  );

  const inputStyle = {
    width: '100%', maxWidth: '420px', padding: '12px 16px',
    background: 'rgba(255,255,255,0.8)', border: `1.5px solid ${P.lavLight}`,
    borderRadius: '16px', color: P.navy, fontWeight: 600, fontSize: '0.95rem',
    outline: 'none', fontFamily: "'Zilla Slab', serif", backdropFilter: 'blur(4px)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 45%, ${P.lavLight}40 100%)`,
      fontFamily: "'Zilla Slab', serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.lavLight}70, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${P.blush}80, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '36px' }}>

        {/* TOPBAR */}
        <div style={{ padding: '0 32px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1.5px solid ${P.lavLight}55` }}>
          <img src={contulMeu} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: P.navy, margin: 0, lineHeight: 1.2 }}>Contul meu</h1>
            <p style={{ fontSize: '0.82rem', color: P.lav, margin: '2px 0 0' }}>Gestionează-ți informațiile personale</p>
          </div>
        </div>

        <div style={{ padding: '36px 32px', maxWidth: '760px' }}>

          {/* FIELDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
            {[
              { label: 'Nume de utilizator', value: userData.username, type: 'text' },
              { label: 'Parola', value: '••••••••', type: 'password' },
              { label: 'Adresa de e-mail', value: userData.email, type: 'email' },
              { label: 'Contul tău Google', value: userData.googleEmail, type: 'email' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: P.navy, marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {f.label}
                </label>
                <input type={f.type} value={f.value} readOnly style={inputStyle} />
                <button style={{ fontSize: '0.8rem', fontWeight: 700, color: P.blue, background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', textDecoration: 'underline', width: 'fit-content' }}>
                  Schimbă
                </button>
              </div>
            ))}
          </div>

          {/* STATISTICI */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: P.navy, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px', borderLeft: `3px solid ${P.blue}`, paddingLeft: '10px' }}>
              Statistici studiu
            </h2>
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '24px', padding: '24px', border: `1.5px solid ${P.lavLight}55`, backdropFilter: 'blur(8px)', boxShadow: `0 4px 20px rgba(52,73,121,0.08)` }}>
              <StatisticiSection token={token} />
            </div>
          </div>

          {/* DANGER ZONE */}
          <div style={{ borderTop: `1.5px solid ${P.lavLight}55`, paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229,62,62,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <img src={deconectare} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e53e3e' }}>Deconectează-te</span>
            </button>

            <button onClick={() => setShowDeleteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229,62,62,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <img src={stergeCont} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e53e3e' }}>Șterge-ți contul</span>
            </button>
          </div>

        </div>
      </main>

      {showDeleteModal && <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />}
    </div>
  );
}

export default MyAccount;
