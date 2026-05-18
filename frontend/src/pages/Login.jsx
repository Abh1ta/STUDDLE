import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoStuddle from '../assets/logoStuddle.png';
import pozacarti from '../assets/pozaCarti.png';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

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
        setError(data.message || 'Eroare la autentificare.');
      } else {
        login(data.token, data.user);
        navigate('/home');
      }
    } catch (err) {
      console.error("Eroare la autentificare:", err);
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <input
              type="email"
              placeholder="nume@student.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Parola</label>
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
            >
              Creează unul
            </span>
          </p>
        </div>
      </div>

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
