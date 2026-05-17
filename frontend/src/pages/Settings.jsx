/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import google from "../assets/google.png";
import caracterulMeu from "../assets/caracterulMeu.png";
import contulMeu from "../assets/contulMeu.png";
import stergeCont from "../assets/stergereCont.png";
import deconectare from "../assets/deconectare.png";

const P = { navy: '#344979', blue: '#5d6da5', lavBlue: '#5d6da5', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const TrashIcon = ({ color = "white" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
  </svg>
);

const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center" style={{ fontFamily: "'Zilla Slab', serif" }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: P.blush }}>
        <TrashIcon color={P.navy} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: P.navy }}>Ștergi contul?</h3>
      <p className="text-sm mb-6" style={{ color: P.lavBlue }}>Această acțiune este permanentă și nu poate fi anulată.</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all"
          style={{ border: `1.5px solid ${P.lavLight}`, color: P.navy }}>
          Anulează
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ background: '#e53e3e' }}>
          Șterge
        </button>
      </div>
    </div>
  </div>
);

function Settings() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => { if (logout) logout(); navigate("/login"); };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/auth/delete", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { logout(); navigate("/login"); }
      else alert("Eroare la ștergerea contului.");
    } catch (err) { console.error(err); }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 40%, ${P.lavLight}55 100%)`, fontFamily: "'Zilla Slab', serif" }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P.lavLight}80 0%, ${P.blush}40 70%)`, filter: 'blur(70px)', zIndex: 0 }} />

      <main className="relative z-10 px-10 pt-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: P.navy }}>Setări</h1>
        <div className="h-[2px] w-32 rounded-full mb-10" style={{ background: `linear-gradient(90deg, ${P.navy}, ${P.lavLight})` }} />

        <div className="max-w-lg">
          {/* Opțiuni cont */}
          <div className="rounded-3xl overflow-hidden shadow-sm mb-6"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${P.lavLight}`, backdropFilter: 'blur(10px)' }}>
            <Link to="/myaccount"
              className="flex items-center gap-5 p-5 transition-all hover:bg-white/80 border-b"
              style={{ borderColor: P.lavLight }}>
              <img src={contulMeu} alt="" className="w-11 h-11 object-contain" />
              <span className="text-lg font-bold" style={{ color: P.navy }}>Contul meu</span>
              <span className="ml-auto text-lg" style={{ color: P.lavBlue }}>›</span>
            </Link>
            <Link to="/customization"
              className="flex items-center gap-5 p-5 transition-all hover:bg-white/80">
              <img src={caracterulMeu} alt="" className="w-11 h-11 object-contain" />
              <span className="text-lg font-bold" style={{ color: P.navy }}>Caracterul meu</span>
              <span className="ml-auto text-lg" style={{ color: P.lavBlue }}>›</span>
            </Link>
          </div>

          {/* Acțiuni periculoase */}
          <div className="rounded-3xl overflow-hidden shadow-sm"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${P.lavLight}`, backdropFilter: 'blur(10px)' }}>
            <button onClick={handleLogout}
              className="flex w-full items-center gap-5 p-5 transition-all hover:bg-white/80 border-b text-left"
              style={{ borderColor: P.lavLight, fontFamily: 'inherit' }}>
              <img src={deconectare} alt="" className="w-10 h-10 object-contain" />
              <span className="text-base font-bold text-red-500">Deconectează-te</span>
            </button>
            <button onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center gap-5 p-5 transition-all hover:bg-white/80 text-left"
              style={{ fontFamily: 'inherit' }}>
              <img src={stergeCont} alt="" className="w-10 h-10 object-contain" />
              <span className="text-base font-bold text-red-500">Șterge-ți contul</span>
            </button>
          </div>
        </div>
      </main>

      {showDeleteModal && <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />}
    </div>
  );
}

export default Settings;
