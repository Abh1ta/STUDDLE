import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

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
      
      {/* header */}

      <nav style={{ 
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10%', // Padding-ul original
        position: 'relative',
        overflow: 'visible',
        zIndex: 10, 
        marginLeft: '-4px',
      }}>
        <img
          src="/logostuddle.png"
          alt="Studdle logo"
          style={{ 
            width: 'auto',
            height: '140px',
            margin: '-15px',
            marginLeft: '-100px', // Acum va sta perfect pentru că are padding 10% ca "ancoră"
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-32%)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')} 
        />
      </nav>

      {/* sectiunea formular */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '13rem', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Adresa de e-mail</label>
            <input
              type="email"
              placeholder="nume@student.com"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Parola</label>
            <input
              type="password"
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button style={buttonStyle}>
            Conectează-te
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#3b6fa0' }}>
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

      {/* poza */}
      <div style={{ position: 'absolute', bottom: -230, left: '52%', transform: 'translateX(-50%)', width: '800px', pointerEvents: 'none', zIndex: 1 }}>
        <img src="/pozacarti.png" alt="" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

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
  fontSize: '0.95rem',
  boxSizing: 'border-box'
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