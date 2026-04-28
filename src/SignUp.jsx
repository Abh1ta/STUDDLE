import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoStuddle from './assets/logoStuddle.png';
import pozacarti from './assets/pozaCarti.png';

const Register = () => {
  const navigate = useNavigate();

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
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: '700', color: '#1e40af' }}>
        </div>
      </nav>

      {/* FORMULAR */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '13rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Nume + Prenume pe același rând */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Nume</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  borderRadius: '1rem',
                  border: 'none',
                  outline: 'none',
                  background: 'rgba(10, 56, 117, 0.35)',
                  color: '#1e3a8a',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Prenume</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  borderRadius: '1rem',
                  border: 'none',
                  outline: 'none',
                  background: 'rgba(10, 56, 117, 0.35)',
                  color: '#1e3a8a',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Adresa de e-mail</label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                border: 'none',
                outline: 'none',
                background: 'rgba(10, 56, 117, 0.35)',
                color: '#1e3a8a',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Nume de utilizator</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                border: 'none',
                outline: 'none',
                background: 'rgba(10, 56, 117, 0.35)',
                color: '#1e3a8a',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Parola */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginLeft: '4px' }}>Parola</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                border: 'none',
                outline: 'none',
                background: 'rgba(10, 56, 117, 0.35)',
                color: '#1e3a8a',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button style={{
            width: '80%',
            padding: '1rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            color: 'white',
            background: 'linear-gradient(135deg, #0c4b86 0%, #386ba1 100%)',
            boxShadow: '0 9px 15px rgba(12, 32, 90, 0.4)',
            margin: '0.25rem auto 0'
          }}>
            Creează cont
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

export default Register;