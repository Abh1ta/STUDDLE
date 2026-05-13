/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


import google from '../assets/google.png';
import caracterulMeu from '../assets/caracterulMeu.png';
import contulMeu from '../assets/contulMeu.png';
import stergeCont from '../assets/stergereCont.png';
import deconectare from '../assets/deconectare.png';

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
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" style={{ fontFamily: "'Zilla Slab', serif" }}>
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <TrashIcon color="#ef4444" />
      </div>
      <h3 className="text-xl font-bold text-blue-950 mb-2">Ștergi contul?</h3>
      <p className="text-sm text-blue-900/50 mb-6">
        Această acțiune este permanentă și nu poate fi anulată.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-full border border-blue-200 text-blue-900/60 text-sm font-semibold hover:bg-blue-50 transition-colors">
          Anulează
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
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

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        logout();
        navigate("/login");
      } else {
        alert("Eroare la ștergerea contului.");
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>

      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div className="absolute -bottom-20 -right-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #db82e7 60%)', filter: 'blur(80px)', zIndex: 0 }} />


      <main className="relative px-6 sm:pl-20 md:pl-32 z-10 transition-all" style={{ paddingTop: '5rem' }}>
        <div className="max-w-lg w-full">

          {/* Opțiuni principale */}
          <div className="flex flex-col -mt-4">

            <Link to="/account" className="flex items-center gap-5 py-5 group border-b border-black transition-all duration-300 hover:scale-[1.03] hover:z-20 relative">
              <div className="flex items-center justify-center flex-shrink-0">
                <img src={contulMeu} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain ml-2 md:ml-4 transition-transform group-hover:rotate-3" />
              </div> 
              <span className="text-lg md:text-xl font-semibold text-blue-950">
                <Link to="/myaccount">Contul meu</Link>
                </span>
            </Link>

            <Link to="/character" className="flex items-center gap-5 py-5 group border-b border-black transition-all duration-300 hover:scale-[1.03] hover:z-20 relative">
              <div className="flex items-center justify-center flex-shrink-0">
                <img src={caracterulMeu} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain ml-2 md:ml-4 transition-transform group-hover:rotate-3" />
              </div>
              <span className="text-lg md:text-xl font-semibold text-blue-950">
                <Link to="/character">Caracterul meu</Link>
              </span>
            </Link>

            <button className="flex items-center gap-5 py-5 group border-b border-black transition-all duration-300 hover:scale-[1.03] hover:z-20 relative text-left">
              <div className="flex items-center justify-center flex-shrink-0">
                <img src={google} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain ml-2 md:ml-4" />
              </div>
              <span className="text-lg md:text-xl font-semibold text-blue-950">Conectează-te cu Google</span>
            </button>
          </div>

          {/* Danger zone */}
          <div className="mt-16 md:mt-24 flex flex-col gap-1">

            <button onClick={handleLogout} className="flex items-center gap-4 py-4 group transition-all duration-300 hover:scale-[1.03] hover:translate-x-2 relative text-left">
              <div className="flex items-center justify-center flex-shrink-0">
                <img src={deconectare} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              </div>
              <span className="text-sm md:text-base font-semibold text-red-500">Deconectează-te</span>
            </button>

            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-4 py-4 group transition-all duration-300 hover:scale-[1.03] hover:translate-x-2 relative text-left">
              <div className="flex items-center justify-center flex-shrink-0">
                <img src={stergeCont} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              </div>
              <span className="text-sm md:text-base font-semibold text-red-500">Șterge-ți contul</span>
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
    </div>
  );
}

export default Settings;