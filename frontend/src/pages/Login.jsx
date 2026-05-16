<<<<<<< HEAD
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
=======
>>>>>>> varianta-mai-ok
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoStuddle from '../assets/logoStuddle.png';
import pozacarti from '../assets/pozaCarti.png';
import { useAuth } from "../context/AuthContext";

<<<<<<< HEAD
const P = { navy: '#344979', blue: '#5d6da5', lav: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const Login = () => {
  const navigate = useNavigate();
=======
const Login = () => {
  const navigate = useNavigate();
  
>>>>>>> varianta-mai-ok
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

<<<<<<< HEAD
  const handleSubmit = async () => {
    setError('');
    setLoading(true);
=======
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    setError('');
    setLoading(true);

>>>>>>> varianta-mai-ok
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
<<<<<<< HEAD
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Ceva nu a mers bine.');
      else login(data.token, data.user);
    } catch {
=======

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Eroare la autentificare.');
      } else {
        login(data.token, data.user);
        navigate('/home'); 
      }
    } catch (err) {
      console.error("Eroare la autentificare:", err);
>>>>>>> varianta-mai-ok
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div style={{ 
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, #A5CFFF 0%, #ffffff 65%)'
    }}>
      
      <nav style={{ 
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10%', 
        position: 'relative',
        zIndex: 10, 
      }}>
        <img
          src={logoStuddle}
          alt="Studdle logo"
          style={{ 
            height: '70px',
            width: 'auto',
            display: 'block',
            paddingRight: '100px',
            marginLeft: '-119px',
            marginTop: '-2px',
          }}
          onClick={() => navigate('/')} 
        />
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '11rem', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.8rem' }}>{error}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Adresa de e-mail</label>
>>>>>>> varianta-mai-ok
            <input
              type="email"
              placeholder="nume@student.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: `1.5px solid ${P.lavLight}`, outline: 'none', background: 'rgba(255,255,255,0.8)', color: P.navy, fontSize: '0.95rem', boxSizing: 'border-box', fontWeight: 600, fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Parola</label>
=======
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Parola</label>
>>>>>>> varianta-mai-ok
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
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
=======
              style={inputStyle}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              fontWeight: '1200px',
              width: '60%',
              padding: '1rem',
              borderRadius: '3rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              color: 'white',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #0c4b86 0%, #386ba1 100%)',
              boxShadow: '0 9px 15px rgba(12, 32, 90, 0.4)',
              margin: '0.5rem auto 0',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '...' : 'Creează cont'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#3b6fa0' }}>
            Nu ai cont?{' '}
            <span 
              onClick={() => navigate('/signup')}
              style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
>>>>>>> varianta-mai-ok
              Creează unul
            </span>
          </p>
        </div>
      </div>

<<<<<<< HEAD
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '700px', pointerEvents: 'none', zIndex: 1 }}>
        <img src={pozacarti} alt="" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>

      <style>{`input::placeholder { color: ${P.lav} !important; opacity: 1; }`}</style>
=======
      <div style={{ 
        position: 'absolute', 
        bottom: '0', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        maxWidth: '800px', 
        pointerEvents: 'none', 
        zIndex: 1 
      }}>
        <img src={pozacarti} alt="" style={{ width: '100%', transform: 'translateX(5%)', marginBottom:'20px', height: 'auto', objectFit: 'contain' }} />
      </div>
      <style>
        {`
          input::placeholder {
            color: #d1d6e4 !important;
            opacity: 1;
          }
        `}
      </style>
>>>>>>> varianta-mai-ok
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
const inputStyle = {
  width: '100%',
  padding: '1rem 0.8rem',
  borderRadius: '1rem',
  border: 'none',
  outline: 'none',
  background: 'rgba(10, 56, 117, 0.35)',
  color: '#1e3a8a',
  fontSize: '1rem',
  boxSizing: 'border-box',
  fontWeight: '600',
};

const buttonStyle = {
  width: '60%',
  padding: '1rem',
  borderRadius: '3rem',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '1rem',
  color: 'white',
  background: 'linear-gradient(135deg, #0c4b86 0%, #386ba1 100%)',
  boxShadow: '0 9px 15px rgba(12, 32, 90, 0.4)',
  margin: '0.5rem auto 0'
};

export default Login;
>>>>>>> varianta-mai-ok
