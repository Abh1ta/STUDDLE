import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoStuddle from './assets/logoStuddle.png';
import pozacarti from './assets/pozaCarti.png';
import { useAuth } from "./context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();


  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ceva nu a mers bine.');
      } else {
        login(data.token, data.user);

      }
    } catch (err) {
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    border: 'none',
    outline: 'none',
    background: 'rgba(10, 56, 117, 0.35)',
    color: '#1e3a8a',
    fontSize: '0.95rem',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: '4px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 35%, #89baea 0%, #d9e4ed 35%, #c2d1de 70%, #d5dee8 100%)'
    }}>

      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5rem 1.5rem 2.5rem' }}>
        <img src={logoStuddle} alt="Studdle logo" className="h-16 w-auto object-contain" />
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: '700', color: '#1e40af' }} />
      </nav>

      {/* FORMULAR */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '13rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Error message */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#7f1d1d',
              fontSize: '0.875rem',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Adresa de e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Nume de utilizator</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Parola */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Parola</label>
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
              width: '80%',
              padding: '1rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              color: 'white',
              background: loading
                ? 'rgba(10, 56, 117, 0.4)'
                : 'linear-gradient(135deg, #0c4b86 0%, #386ba1 100%)',
              boxShadow: loading ? 'none' : '0 9px 15px rgba(12, 32, 90, 0.4)',
              margin: '0.25rem auto 0',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Se încarcă...' : 'Creează cont'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#3b6fa0' }}>
            Ai deja cont?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Conectează-te
            </span>
          </p>

        </div>
      </div>

      {/* ILUSTRAȚIA */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '550px', pointerEvents: 'none' }}>
        <img src={pozacarti} alt="" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

    </div>
  );
};

export default SignUp;
