/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoStuddle from '../assets/logoStuddle.png';
import pozacarti from '../assets/pozaCarti.png';
import { useAuth } from "../context/AuthContext";

const P = { navy: '#344979', blue: '#5d6da5', lav: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Ceva nu a mers bine.');
      else login(data.token, data.user);
    } catch {
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Zilla Slab', serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 50%, ${P.lavLight}55 100%)`,
    }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.lavLight}90 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${P.blush} 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', padding: '0 10%', position: 'relative', zIndex: 10 }}>
        <Link to={user ? '/home' : '/'}>
          <img src={logoStuddle} alt="Studdle" style={{ height: '56px', width: 'auto' }} />
        </Link>
      </nav>

      {/* FORM */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '10rem', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: P.navy, margin: '0 0 4px' }}>Bine ai revenit!</h1>
            <p style={{ fontSize: '0.9rem', color: P.lav, margin: 0 }}>Conectează-te la contul tău Studdle</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(220,38,38,0.1)', border: '1.5px solid rgba(220,38,38,0.25)', color: '#9b2c2c', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Adresa de e-mail</label>
            <input
              type="email"
              placeholder="nume@student.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: `1.5px solid ${P.lavLight}`, outline: 'none', background: 'rgba(255,255,255,0.8)', color: P.navy, fontSize: '0.95rem', boxSizing: 'border-box', fontWeight: 600, fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Parola</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: `1.5px solid ${P.lavLight}`, outline: 'none', background: 'rgba(255,255,255,0.8)', color: P.navy, fontSize: '0.95rem', boxSizing: 'border-box', fontWeight: 600, fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'white',
              background: loading ? '#9896bb' : `linear-gradient(135deg, ${P.navy}, ${P.blue})`,
              boxShadow: loading ? 'none' : `0 8px 24px rgba(52,73,121,0.35)`,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              marginTop: '6px',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Se încarcă...' : 'Conectează-te'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: P.lav, margin: 0 }}>
            Nu ai cont?{' '}
            <span onClick={() => navigate('/signup')} style={{ fontWeight: 800, cursor: 'pointer', color: P.navy, textDecoration: 'underline' }}>
              Creează unul
            </span>
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '700px', pointerEvents: 'none', zIndex: 1 }}>
        <img src={pozacarti} alt="" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>

      <style>{`input::placeholder { color: ${P.lav} !important; opacity: 1; }`}</style>
    </div>
  );
};

export default Login;
