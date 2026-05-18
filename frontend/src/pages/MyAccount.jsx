<<<<<<< HEAD
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import StatisticiSection from "./StatisticiSection"; 

import contulMeu from "../assets/contulMeu.png";
import stergeCont from "../assets/stergereCont.png";
import deconectare from "../assets/deconectare.png";

const API_BASE_URL = "http://localhost:5000/api";

const TrashIcon = ({ color = "white" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.2}
    className="w-4 h-4"
  >
    <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
    <path
      d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
      strokeLinecap="round"
    />
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import StatisticiSection from './StatisticiSection';

import contulMeu from '../assets/contulMeu.png';
import stergeCont from '../assets/stergereCont.png';
import deconectare from '../assets/deconectare.png';

const API_BASE_URL = '/api';
const P = { navy: '#344979', blue: '#5d6da5', lav: '#5d6da5', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth={2.2} style={{ width: '18px', height: '18px' }}>
    <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
>>>>>>> origin/feature/update
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
  </svg>
);

const DeleteModal = ({ onConfirm, onCancel }) => (
<<<<<<< HEAD
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
      style={{ fontFamily: "'Zilla Slab', serif" }}
    >
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <TrashIcon color="#ef4444" />
      </div>
      <h3 className="text-xl font-bold text-blue-950 mb-2">Ștergi contul?</h3>
      <p className="text-sm text-blue-900/50 mb-6">
        Această acțiune este permanentă și ireversibilă.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-full border border-blue-200 text-blue-900/60 text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          Anulează
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
        >
=======
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(52,73,121,0.35)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: 'linear-gradient(150deg, #344979, #5d6da5)', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 24px 60px rgba(52,73,121,0.4)', fontFamily: "'Zilla Slab', serif" }}>
      <div style={{ width: '56px', height: '56px', background: 'rgba(229,62,62,0.15)', border: '2px solid rgba(229,62,62,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <TrashIcon />
      </div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Ștergi contul?</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '24px' }}>Această acțiune este permanentă și ireversibilă.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.25)', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
          Anulează
        </button>
        <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: 'none', background: 'rgba(229,62,62,0.8)', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
>>>>>>> origin/feature/update
          Șterge
        </button>
      </div>
    </div>
  </div>
);

function MyAccount() {
  const navigate = useNavigate();
  const { token, logout, user: authUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    googleEmail: "Neconectat",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const settingsRes = await axios.get(`${API_BASE_URL}/settings`, config);
        setUserData({
          username:
            settingsRes.data.username || authUser?.username || "Utilizator",
          email:
            settingsRes.data.email || authUser?.email || "email@studdle.ro",
          googleEmail: settingsRes.data.googleEmail || "Neconectat",
        });
      } catch (error) {
        console.error("Eroare generală la încărcarea profilului:", error);
=======
  const [userData, setUserData] = useState({ username: '', email: '', googleEmail: 'Neconectat' });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/settings`, config);
        setUserData({
          username: res.data.username || authUser?.username || 'Utilizator',
          email: res.data.email || authUser?.email || 'email@studdle.ro',
          googleEmail: res.data.googleEmail || 'Neconectat',
        });
      } catch (error) {
        console.error('Eroare la profil:', error);
>>>>>>> origin/feature/update
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    fetchProfileData();
  }, [token, authUser]);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    handleLogout();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Se încarcă profilul...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-white relative overflow-x-hidden"
      style={{ fontFamily: "'Zilla Slab', serif" }}
    >
      {/* Background Decor */}
      <div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <main className="relative z-10 pt-20">
        {/* HEADER */}
        <div className="px-6 sm:pl-20 md:pl-32">
          <div className="flex items-center gap-5 mb-6">
            <div className="flex items-center justify-center flex-shrink-0">
              <img
                src={contulMeu}
                alt=""
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-2xl font-bold text-blue-950 tracking-tight">
              Contul meu
            </h1>
          </div>
        </div>
        <div className="w-screen h-[1px] bg-black opacity-100 mb-12"></div>

        {/* DATE PERSONALE */}
        <div className="px-6 sm:pl-20 md:pl-48 max-w-4xl">
          <div className="flex flex-col gap-8 mb-20">
            <div className="flex flex-col">
              <label className="text-lg font-bold text-blue-950 mb-2">
                Nume de utilizator
              </label>
              <input
                type="text"
                value={userData.username}
                readOnly
                className="w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg text-blue-400 font-medium focus:outline-none shadow-sm"
              />
              <button className="text-pink-300 text-sm font-semibold mt-1 w-fit hover:underline">
                Schimbă
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-bold text-blue-950 mb-2">
                Parola
              </label>
              <input
                type="password"
                value="********"
                readOnly
                className="w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg text-blue-400 font-medium focus:outline-none shadow-sm"
              />
              <button className="text-pink-300 text-sm font-semibold mt-1 w-fit hover:underline">
                Schimbă
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-bold text-blue-950 mb-2">
                Adresa de e-mail
              </label>
              <input
                type="email"
                value={userData.email}
                readOnly
                className="w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg text-blue-400 font-medium focus:outline-none shadow-sm"
              />
              <button className="text-pink-300 text-sm font-semibold mt-1 w-fit hover:underline">
                Schimbă
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-bold text-blue-950 mb-2">
                Contul tău Google
              </label>
              <input
                type="email"
                value={userData.googleEmail}
                readOnly
                className="w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg text-blue-400 font-medium focus:outline-none shadow-sm"
              />
              <button className="text-pink-300 text-sm font-semibold mt-1 w-fit hover:underline">
                Schimbă
              </button>
            </div>
          </div>
        </div>

        {/* STATISTICI */}
        <div className="px-6 sm:pl-20 md:pl-48 max-w-4xl mb-20">
          
          <div style={{ position: "relative", borderRadius: "20px" }}>

            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "20px",
                background: "radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)",
                opacity: 0.25,
                filter: "blur(20px)",
                zIndex: 0,
              }}
            />

            <div style={{ position: "relative", zIndex: 1, padding: "24px" }}>
              <StatisticiSection token={token} />
            </div>

          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="w-screen h-[1px] bg-black opacity-10 mb-10"></div>
        <div className="px-6 sm:pl-20 md:pl-48 max-w-4xl pb-24">
          <div className="flex flex-col gap-1 ml-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 py-4 group transition-all duration-300 hover:scale-[1.03] hover:translate-x-2 relative text-left w-fit"
            >
              <div className="flex items-center justify-center flex-shrink-0">
                <img
                  src={deconectare}
                  alt=""
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              <span className="text-sm md:text-base font-semibold text-red-500 tracking-wide">
                Deconectează-te
              </span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-4 py-4 group transition-all duration-300 hover:scale-[1.03] hover:translate-x-2 relative text-left w-fit"
            >
              <div className="flex items-center justify-center flex-shrink-0">
                <img
                  src={stergeCont}
                  alt=""
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              <span className="text-sm md:text-base font-semibold text-red-500 tracking-wide">
                Șterge-ți contul
              </span>
            </button>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
=======
    fetchProfileData();
  }, [token, authUser]);

  const handleLogout = () => { if (logout) logout(); navigate('/login'); };
  const handleDeleteAccount = () => { setShowDeleteModal(false); handleLogout(); };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Zilla Slab', serif", color: P.lav, fontStyle: 'italic' }}>
      Se încarcă profilul...
    </div>
  );

  const inputStyle = {
    width: '100%', maxWidth: '420px', padding: '12px 16px',
    background: 'rgba(255,255,255,0.8)', border: `1.5px solid ${P.lavLight}`,
    borderRadius: '16px', color: P.navy, fontWeight: 600, fontSize: '0.95rem',
    outline: 'none', fontFamily: "'Zilla Slab', serif", backdropFilter: 'blur(4px)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #8d91c7 0%, #e0c5e6a6 100%)',
      fontFamily: "'Zilla Slab', serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.lavLight}70, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${P.blush}80, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '36px' }}>

      
        <div style={{ padding: '0 32px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1.5px solid ${P.lavLight}55` }}>
          <img src={contulMeu} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: P.navy, margin: 0, lineHeight: 1.2 }}>Contul meu</h1>
            <p style={{ fontSize: '0.82rem', color: P.lav, margin: '2px 0 0' }}>Gestionează-ți informațiile personale</p>
          </div>
        </div>

        <div style={{ padding: '36px 32px', maxWidth: '760px' }}>

       
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
            {[
              { label: 'Nume de utilizator', value: userData.username, type: 'text' },
              { label: 'Parola', value: '••••••••', type: 'password' },
              { label: 'Adresa de e-mail', value: userData.email, type: 'email' },
              { label: 'Contul tău Google', value: userData.googleEmail, type: 'email' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: P.navy, marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {f.label}
                </label>
                <input type={f.type} value={f.value} readOnly style={inputStyle} />
                <button style={{ fontSize: '0.8rem', fontWeight: 700, color: P.blue, background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', textDecoration: 'underline', width: 'fit-content' }}>
                  Schimbă
                </button>
              </div>
            ))}
          </div>

          {/*statistici */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: P.navy, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px', borderLeft: `3px solid ${P.blue}`, paddingLeft: '10px' }}>
              Statistici studiu
            </h2>
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '24px', padding: '24px', border: `1.5px solid ${P.lavLight}55`, backdropFilter: 'blur(8px)', boxShadow: `0 4px 20px rgba(52,73,121,0.08)` }}>
              <StatisticiSection token={token} />
            </div>
          </div>

         
          <div style={{ borderTop: `1.5px solid ${P.lavLight}55`, paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229,62,62,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <img src={deconectare} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e53e3e' }}>Deconectează-te</span>
            </button>

            <button onClick={() => setShowDeleteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229,62,62,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <img src={stergeCont} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e53e3e' }}>Șterge-ți contul</span>
            </button>
          </div>

        </div>
      </main>

      {showDeleteModal && <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />}
>>>>>>> origin/feature/update
    </div>
  );
}

<<<<<<< HEAD
export default MyAccount;
=======
export default MyAccount;
>>>>>>> origin/feature/update
