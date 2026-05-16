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

const SignUp = () => {
  const navigate = useNavigate();
=======
const SignUp = () => {
  const navigate = useNavigate();
  
>>>>>>> varianta-mai-ok
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
<<<<<<< HEAD
=======

>>>>>>> varianta-mai-ok
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
<<<<<<< HEAD
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Ceva nu a mers bine.');
      else login(data.token, data.user);
    } catch {
=======

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ceva nu a mers bine.');
      } else {
        login(data.token, data.user);
        navigate('/home'); 
      }
    } catch (err) {
>>>>>>> varianta-mai-ok
      setError('Nu s-a putut conecta la server.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '16px',
    border: `1.5px solid ${P.lavLight}`, outline: 'none',
    background: 'rgba(255,255,255,0.8)', color: P.navy,
    fontSize: '0.95rem', boxSizing: 'border-box', fontWeight: 600,
    fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      fontFamily: "'Zilla Slab', serif",
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 50%, ${P.lavLight}55 100%)`,
    }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.lavLight}90 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${P.blush} 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5rem 1.5rem 2.5rem', position: 'relative', zIndex: 10 }}>
        <Link to={user ? '/home' : '/'}>
          <img src={logoStuddle} alt="Studdle" className="h-14 w-auto object-contain" />
        </Link>
      </nav>

      {/* FORM */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '12rem', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: P.navy, margin: '0 0 4px' }}>Creează cont</h1>
            <p style={{ fontSize: '0.9rem', color: P.lav, margin: 0 }}>Alătură-te comunității Studdle</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(220,38,38,0.1)', border: '1.5px solid rgba(220,38,38,0.25)', color: '#9b2c2c', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
=======
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
>>>>>>> varianta-mai-ok
              {error}
            </div>
          )}

<<<<<<< HEAD
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Adresa de e-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Nume de utilizator</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: P.navy, marginLeft: '4px' }}>Parola</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = P.blue}
              onBlur={(e) => e.target.style.borderColor = P.lavLight} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: '50px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '1rem',
              color: 'white',
              background: loading ? '#9896bb' : `linear-gradient(135deg, ${P.navy}, ${P.blue})`,
              boxShadow: loading ? 'none' : `0 8px 24px rgba(52,73,121,0.35)`,
              margin: '6px auto 0', fontFamily: 'inherit', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Se încarcă...' : 'Creează cont'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: P.lav, margin: 0 }}>
            Ai deja cont?{' '}
            <span onClick={() => navigate('/login')} style={{ fontWeight: 800, cursor: 'pointer', color: P.navy, textDecoration: 'underline' }}>
              Conectează-te
            </span>
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '550px', pointerEvents: 'none' }}>
        <img src={pozacarti} alt="" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      <style>{`input::placeholder { color: ${P.lav} !important; opacity: 1; }`}</style>
=======
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

>>>>>>> varianta-mai-ok
    </div>
  );
};

<<<<<<< HEAD
export default SignUp;
=======
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
>>>>>>> varianta-mai-ok
