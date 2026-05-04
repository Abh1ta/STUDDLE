import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
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
        padding: '0 10%',
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
            marginLeft: '-100px', 
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-32%)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')} 
        />
      </nav>

      {/* sectiune formular */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingBottom: '17rem',
        zIndex: 2
      }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

          {/* nume si prenume */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Nume</label>
              <input type="text" style={inputStyle} placeholder="Popescu" />
            </div>
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Prenume</label>
              <input type="text" style={inputStyle} placeholder="Ion" />
            </div>
          </div>

          {/* mail */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Adresa de e-mail</label>
            <input type="email" style={inputStyle} placeholder="nume@student.com" />
          </div>

          {/* username */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Nume de utilizator</label>
            <input type="text" style={inputStyle} placeholder="ionpopescu22" />
          </div>

          {/* parola */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Parola</label>
            <input type="password" style={inputStyle} placeholder="••••••••" />
          </div>

          {/* buton */}
          <button style={{
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
          }}>
            Creează cont
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#3b6fa0', marginTop: '5px'}}>
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

      {/* poza */}
      <div style={{ position: 'absolute', bottom: -230, left: '52%', transform: 'translateX(-50%)', width: '800px', pointerEvents: 'none', zIndex: 1 }}>
        <img src="/pozacarti.png" alt="" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

    </div>
  );
};

  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 0.875rem',
    borderRadius: '1rem',
    border: 'none',
    outline: 'none',
    background: 'rgba(10, 56, 117, 0.35)',
    color: '#1e3a8a',
    fontSize: '0.95rem',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: '4px'
  };


export default Register;