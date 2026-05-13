import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoStuddle from '../assets/logoStuddle.png';
import pozacarti from '../assets/pozaCarti.png';
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

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
        navigate('/home'); 
      }
    } catch (err) {
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
        overflow: 'visible',
        zIndex: 10, 
        marginLeft: '-4px',
      }}>
        <img
          src={logoStuddle}
          alt="Studdle logo"
          style={{ 
            height: '70px',
            width: 'auto',
            display: 'block',
            paddingRight: '100px',
            marginLeft: '-115px',
            marginTop: '-2px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')} 
        />
      </nav>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingBottom: '17rem',
        zIndex: 2
      }}>
        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {error && (
            <div style={{ color: 'red', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600', background: 'rgba(220, 38, 38, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              {error}
            </div>
          )}

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Adresa de e-mail</label>
            <input 
              type="email" 
              style={inputStyle} 
              placeholder="nume@student.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Nume de utilizator</label>
            <input 
              type="text" 
              style={inputStyle} 
              placeholder="ionpopescu22" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Parola</label>
            <input 
              type="password" 
              style={inputStyle} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '60%',
              padding: '1rem',
              borderRadius: '3rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '1000px',
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

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#3b6fa0'}}>
            Ai deja cont?{' '}
            <span 
              onClick={() => navigate('/login')}
              style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Conectează-te
            </span>
          </p>
          <style>
            {`
              input::placeholder {
                color: #d1d6e4 !important;
                opacity: 1;
              }
            `}
          </style>

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
        zIndex: 1,
      }}>
        <img src={pozacarti} alt="" style={{ width: '100%', transform: 'translateX(5%)', marginBottom:'20px', height: 'auto', objectFit: 'contain' }} />
      </div>

    </div>
  );
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const inputStyle = {
  width: '100%',
  padding: '1rem 0.875rem',
  borderRadius: '1rem',
  border: 'none',
  outline: 'none',
  background: 'rgba(10, 56, 117, 0.35)',
  color: '#1e3a8a',
  fontSize: '1rem',
  boxSizing: 'border-box',
  fontWeight: '600',
};

const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#1e3a8a',
  marginLeft: '4px'
};

export default SignUp;