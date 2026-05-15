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
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
  </svg>
);

const DeleteModal = ({ onConfirm, onCancel }) => (
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
      } finally {
        setLoading(false);
      }
    };

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
    </div>
  );
}

export default MyAccount;