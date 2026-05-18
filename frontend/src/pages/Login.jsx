<<<<<<< HEAD
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
=======
>>>>>>> origin/feature/update
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoStuddle from '../assets/logoStuddle.png';
import pozacarti from '../assets/pozaCarti.png';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
=======

>>>>>>> origin/feature/update
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

<<<<<<< HEAD
  const handleSubmit = async () => {
=======
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

>>>>>>> origin/feature/update
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
<<<<<<< HEAD
        setError(data.message || 'Ceva nu a mers bine.');
      } else {
        login(data.token, data.user);
      }
    } catch (err) {
=======
        setError(data.message || 'Eroare la autentificare.');
      } else {
        login(data.token, data.user);
        navigate('/home');
      }
    } catch (err) {
      console.error("Eroare la autentificare:", err);
>>>>>>> origin/feature/update
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div style={containerStyle}>
      {/* HEADER */}
      <nav style={navStyle}>
        <Link to={user ? '/home' : '/'}>
          <img src={logoStuddle} alt="Studdle logo" style={logoStyle} />
        </Link>
      </nav>

      {/* FORMULAR */}
      <div style={formWrapperStyle}>
        <div style={formContainerStyle}>
          
          {/* Error message */}
          {error && (
            <div style={errorBoxStyle}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Adresa de e-mail</label>
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
>>>>>>> origin/feature/update
            <input
              type="email"
              placeholder="nume@student.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

<<<<<<< HEAD
          {/* Parola */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Parola</label>
=======
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Parola</label>
>>>>>>> origin/feature/update
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
<<<<<<< HEAD
              ...buttonStyle,
              background: loading ? '#ccc' : 'linear-gradient(135deg, #0c4b86 0%, #386ba1 100%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Se încarcă...' : 'Conectează-te'}
          </button>

          <p style={footerTextStyle}>
            Nu ai cont?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={linkStyle}
=======
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
            {loading ? '...' : 'Conectează-te'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#3b6fa0' }}>
            Nu ai cont?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
>>>>>>> origin/feature/update
            >
              Creează unul
            </span>
          </p>
        </div>
      </div>

<<<<<<< HEAD
      {/* Decorative Image */}
      <div style={imageWrapperStyle}>
        <img src={pozacarti} alt="" style={bottomImageStyle} />
      </div>

      {/* Global placeholder styling */}
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
        <img src={pozacarti} alt="" style={{ width: '100%', transform: 'translateX(5%)', marginBottom: '20px', height: 'auto', objectFit: 'contain' }} />
      </div>
>>>>>>> origin/feature/update
      <style>
        {`
          input::placeholder {
            color: #d1d6e4 !important;
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

<<<<<<< HEAD
// --- STYLING OBJECTS (from File 2 Structure) ---

const containerStyle = {
  fontFamily: "'Inter', sans-serif",
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  background: 'radial-gradient(circle at center, #A5CFFF 0%, #ffffff 65%)'
};

const navStyle = {
  width: '100%',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 10%',
  position: 'relative',
  zIndex: 10
};

const logoStyle = {
  height: '70px',
  width: 'auto',
  display: 'block'
};

const formWrapperStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '11rem',
  zIndex: 2
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '360px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#1e3a8a',
  marginLeft: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '1rem 1.25rem',
=======
const inputStyle = {
  width: '100%',
  padding: '1rem 0.8rem',
>>>>>>> origin/feature/update
  borderRadius: '1rem',
  border: 'none',
  outline: 'none',
  background: 'rgba(10, 56, 117, 0.35)',
  color: '#1e3a8a',
<<<<<<< HEAD
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  fontWeight: '600'
};

const buttonStyle = {
  width: '80%',
  padding: '1rem',
  borderRadius: '3rem',
  border: 'none',
  fontWeight: '700',
  fontSize: '1rem',
  color: 'white',
  boxShadow: '0 9px 15px rgba(12, 32, 90, 0.4)',
  margin: '0.5rem auto 0',
  transition: 'all 0.2s ease'
};

const errorBoxStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  background: 'rgba(220, 38, 38, 0.15)',
  border: '1px solid rgba(220, 38, 38, 0.3)',
  color: '#7f1d1d',
  fontSize: '0.875rem',
  fontWeight: '500',
  textAlign: 'center'
};

const footerTextStyle = {
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#3b6fa0'
};

const linkStyle = {
  fontWeight: '700',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const imageWrapperStyle = {
  position: 'absolute',
  bottom: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '800px',
  pointerEvents: 'none',
  zIndex: 1
};

const bottomImageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  marginBottom: '20px'
};

export default Login;
=======
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
>>>>>>> origin/feature/update
