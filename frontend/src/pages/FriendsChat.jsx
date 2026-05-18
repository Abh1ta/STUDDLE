<<<<<<< HEAD
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
=======
>>>>>>> origin/feature/update
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import pisicaIcon from '../assets/pisica.png';
import trimiteIcon from '../assets/trimite.png';
import galleryIcon from '../assets/galerie.png';

<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:5000/api';
=======
const API_BASE_URL = '/api';
const P = { navy: '#344979', blue: '#5d6da5', lav: '#5d6da5', lavLight: '#c6c6e8', blush: '#b4607cff' };
>>>>>>> origin/feature/update

const DAY_LABELS_RO = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

const FriendBarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.minutes), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px', padding: '0 4px' }}>
      {data.map((d, i) => {
        const heightPct = (d.minutes / maxVal) * 100;
        const isToday = i === data.length - 1;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
<<<<<<< HEAD
            <div
              title={`${d.hours}h`}
              style={{
                width: '100%',
                height: `${Math.max(heightPct, 3)}%`,
                backgroundColor: isToday ? '#8398e7' : '#c5cdf7',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.4s ease',
                cursor: 'default',
                position: 'relative',
                minHeight: d.minutes > 0 ? '4px' : '2px',
              }}
            >
              {d.minutes > 0 && (
                <span style={{
                  position: 'absolute', top: '-20px', left: '50%',
                  transform: 'translateX(-50%)', fontSize: '0.68rem',
                  color: '#555', whiteSpace: 'nowrap', fontWeight: 600,
                }}>
=======
            <div title={`${d.hours}h`} style={{
              width: '100%', height: `${Math.max(heightPct, 3)}%`,
              backgroundColor: isToday ? P.blue : P.lavLight,
              borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease',
              cursor: 'default', position: 'relative',
              minHeight: d.minutes > 0 ? '4px' : '2px',
            }}>
              {d.minutes > 0 && (
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', color: P.navy, whiteSpace: 'nowrap', fontWeight: 700 }}>
>>>>>>> origin/feature/update
                  {d.hours}h
                </span>
              )}
            </div>
<<<<<<< HEAD
            <span style={{
              fontSize: '0.72rem',
              color: isToday ? '#8398e7' : '#999',
              fontWeight: isToday ? 700 : 400,
            }}>
=======
            <span style={{ fontSize: '0.72rem', color: isToday ? P.blue : P.lav, fontWeight: isToday ? 800 : 500 }}>
>>>>>>> origin/feature/update
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

<<<<<<< HEAD

const FriendPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#aaa', fontSize: '0.85rem' }}>
=======
const FriendPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: P.lav, fontSize: '0.85rem' }}>
>>>>>>> origin/feature/update
        Niciun fișier încărcat
      </div>
    );
  }
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = -Math.PI / 2;
  const cx = 60, cy = 60, r = 52;
  const slices = data.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...d, path };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2">
            <title>{s.title}: {s.count} fișiere</title>
          </path>
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: d.color, flexShrink: 0, display: 'inline-block' }} />
<<<<<<< HEAD
            <span style={{ color: '#444', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
            <span style={{ color: '#888', marginLeft: 'auto', paddingLeft: '8px', fontWeight: 600 }}>{d.count}</span>
=======
            <span style={{ color: P.navy, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
            <span style={{ color: P.lav, marginLeft: 'auto', paddingLeft: '8px', fontWeight: 700 }}>{d.count}</span>
>>>>>>> origin/feature/update
          </div>
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD

=======
>>>>>>> origin/feature/update
const FriendStatsPanel = ({ friendId, token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!friendId || !token) return;
<<<<<<< HEAD
    setLoading(true);
    setError(null);

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Fetch the friend's study stats — adjust endpoint if yours differs
=======
    setLoading(true); setError(null);
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
>>>>>>> origin/feature/update
        const res = await axios.get(`${API_BASE_URL}/study/stats/${friendId}`, config);
        setStats(res.data);
      } catch (err) {
        setError('Nu s-au putut încărca statisticile prietenului.');
<<<<<<< HEAD
        console.error(err);
=======
>>>>>>> origin/feature/update
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [friendId, token]);

  const cardStyle = {
<<<<<<< HEAD
    background: '#fff',
    borderRadius: '14px',
    padding: '16px 20px',
    boxShadow: '0 2px 12px rgba(130,140,200,0.10)',
    marginBottom: '16px',
  };

  const subtitleStyle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#8398e7',
    margin: '0 0 14px 0',
  };

  if (loading) return <p style={{ color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic' }}>Se încarcă statisticile...</p>;
  if (error)   return <p style={{ color: '#f03a17', fontSize: '0.85rem' }}>{error}</p>;

  return (
    <div>
      {/* Summary chips */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Ore săpt.', value: `${stats.totalHoursThisWeek}h`, color: '#8398e7' },
          { label: 'Sesiuni', value: stats.totalSessions, color: '#5ca0e8' },
          { label: 'Fișiere', value: stats.filesPerSubject.reduce((s, f) => s + f.count, 0), color: '#9bacff' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: '80px',
            background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
            border: `1.5px solid ${s.color}44`,
            borderRadius: '12px',
            padding: '10px 14px',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
=======
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '16px', padding: '16px 20px',
    boxShadow: '0 2px 12px rgba(52,73,121,0.07)',
    marginBottom: '14px', border: `1.5px solid ${P.lavLight}55`,
    backdropFilter: 'blur(8px)',
  };
  const subtitleStyle = {
    fontSize: '0.73rem', fontWeight: 800, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: P.blue, margin: '0 0 12px 0',
  };

  if (loading) return <p style={{ color: P.lav, fontSize: '0.85rem', fontStyle: 'italic' }}>Se încarcă statisticile...</p>;
  if (error) return <p style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Ore săpt.', value: `${stats.totalHoursThisWeek}h`, color: P.blue },
          { label: 'Sesiuni', value: stats.totalSessions, color: P.navy },
          { label: 'Fișiere', value: stats.filesPerSubject.reduce((s, f) => s + f.count, 0), color: P.lav },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: '80px',
            background: `linear-gradient(135deg, ${s.color}20, ${s.color}0d)`,
            border: `1.5px solid ${s.color}33`, borderRadius: '14px', padding: '10px 14px',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', color: P.lav, marginTop: '4px', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
>>>>>>> origin/feature/update
      <div style={cardStyle}>
        <p style={subtitleStyle}>Ore de studiu — 7 zile</p>
        <FriendBarChart data={stats.studyByDay} />
      </div>
<<<<<<< HEAD

      {/* Pie chart */}
=======
>>>>>>> origin/feature/update
      <div style={cardStyle}>
        <p style={subtitleStyle}>Materiale per materie</p>
        <FriendPieChart data={stats.filesPerSubject} />
      </div>
    </div>
  );
};

<<<<<<< HEAD

function FriendsChat() {
  const { token, user } = useAuth();
  const location = useLocation();

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(location.state?.selectedFriend || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
=======
function FriendsChat() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(location.state?.selectedFriend || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
>>>>>>> origin/feature/update
  const [friendXP, setFriendXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/leaderboard/friends`, config);
        setFriends(res.data);
<<<<<<< HEAD
        if (res.data.length > 0 && !selectedFriend) {
          setSelectedFriend(res.data[0]);
        }
      } catch (err) {
        console.error("Eroare prieteni:", err);
=======
        if (res.data.length > 0 && !selectedFriend) setSelectedFriend(res.data[0]);
      } catch (err) {
        console.error('Eroare prieteni:', err);
>>>>>>> origin/feature/update
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [token]);

  useEffect(() => {
    if (!selectedFriend) return;
    const fetchFriendDetails = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const id = selectedFriend._id || selectedFriend.id;
      try {
        const chatRes = await axios.get(`${API_BASE_URL}/chat/${id}`, config);
        setMessages(Array.isArray(chatRes.data) ? chatRes.data : chatRes.data?.messages ?? []);
<<<<<<< HEAD

        const xpRes = await axios.get(`${API_BASE_URL}/user-achievements/user/${id}/xp`, config);
        setFriendXP(xpRes.data.totalXP || 0);
      } catch (err) {
        console.error("Eroare detalii prieten:", err);
=======
        const xpRes = await axios.get(`${API_BASE_URL}/user-achievements/user/${id}/xp`, config);
        setFriendXP(xpRes.data.totalXP || 0);
      } catch {
>>>>>>> origin/feature/update
        setMessages([]);
      }
    };
    fetchFriendDetails();
  }, [selectedFriend, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { sender: user?._id, text: newMessage, time: timeNow }]);
<<<<<<< HEAD
    setNewMessage("");
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-900 italic">Se încarcă profilul...</div>;
=======
    setNewMessage('');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Zilla Slab', serif", color: P.lav, fontSize: '1.1rem', fontStyle: 'italic' }}>
      Se încarcă...
    </div>
  );
>>>>>>> origin/feature/update

  const friendId = selectedFriend?._id || selectedFriend?.id;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white relative overflow-x-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
      {/* Background Decor */}
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #95bbe7 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)', filter: 'blur(80px)', zIndex: 0 }} />

      <main className="relative z-10 pt-16">

        {/* HEADER PROFIL PRIETEN */}
        <div className="px-6 sm:pl-20 md:pl-32 flex flex-col max-w-7xl mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <img
                src={selectedFriend?.avatar || selectedFriend?.avatar_url || pisicaIcon}
                className="w-16 h-16 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                alt={selectedFriend?.username}
              />
              <div className="absolute top-0 left-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold text-blue-950">{selectedFriend?.username || "Utilizator"}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                    <div className="h-full bg-[#a7c4da]" style={{ width: `${friendXP % 100}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-300 uppercase">XP</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[550px] h-[1px] bg-black opacity-100"></div>
        </div>

        {/* CONTAINER PRINCIPAL */}
        <div className="flex flex-col lg:flex-row px-6 sm:pl-20 md:pl-32 gap-10 max-w-7xl items-start justify-between">

          {/* COLOANA CHAT */}
          <div className="w-full md:w-[550px] flex-shrink-0 flex flex-col gap-6">
            <div className="bg-[#eef6ff] rounded-[40px] p-6 flex flex-col h-[550px] border border-blue-70 shadow-inner relative">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 no-scrollbar">
                {messages.length === 0 ? (
                  <p className="text-center text-blue-200 mt-20 italic">Începeți o conversație...</p>
=======
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #8d91c7 0%, #e0c5e6a6 100%)',
      fontFamily: "'Zilla Slab', serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.lavLight}60 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${P.blush}80 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px 0' }}>
       
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={selectedFriend?.avatar || selectedFriend?.avatar_url || pisicaIcon}
              style={{ width: '56px', height: '56px', borderRadius: '50%', border: `2px solid ${P.lavLight}`, objectFit: 'cover', boxShadow: `0 4px 12px rgba(52,73,121,0.15)` }}
              alt={selectedFriend?.username}
            />
            <div style={{ position: 'absolute', top: '2px', left: '2px', width: '12px', height: '12px', background: '#48bb78', border: '2px solid white', borderRadius: '50%' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: P.navy, margin: 0 }}>
              {selectedFriend?.username || 'Utilizator'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ width: '120px', height: '6px', background: `${P.lavLight}60`, borderRadius: '3px', overflow: 'hidden', border: `1px solid ${P.lavLight}` }}>
                <div style={{ height: '100%', width: `${friendXP % 100}%`, background: `linear-gradient(90deg, ${P.navy}, ${P.blue})`, borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: P.lav, textTransform: 'uppercase', letterSpacing: '1px' }}>XP</span>
            </div>
          </div>
        </div>
        <div style={{ height: '1.5px', background: `linear-gradient(90deg, ${P.lavLight}, transparent)`, marginBottom: '24px', width: '500px' }} />

       
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* chat */}
          <div style={{ width: '520px', flexShrink: 0 }}>
          <div style={{
              background: 'rgba(118,101,173,0.38)',
              backdropFilter: 'blur(12px)',
              borderRadius: '28px', padding: '20px 20px 16px',
              border: '2px solid #19022055',
              boxShadow: `0 4px 24px rgba(52,73,121,0.1)`,
              display: 'flex', flexDirection: 'column', height: '520px',
            }}>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '14px' }}>
                {messages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: P.lav, marginTop: '80px', fontStyle: 'italic', fontSize: '0.95rem' }}>Începeți o conversație...</p>
>>>>>>> origin/feature/update
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === user?._id;
                    return (
<<<<<<< HEAD
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] font-bold text-gray-300 mb-1 px-3 uppercase">{m.time || "12:00"}</span>
                        <div className={`max-w-[85%] p-3.5 rounded-[22px] text-sm font-medium shadow-sm
                          ${isMe ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-blue-900 rounded-tl-none border border-blue-50'}`}>
=======
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: P.lav, marginBottom: '4px', paddingLeft: '8px', paddingRight: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {m.time || '12:00'}
                        </span>
                        <div style={{
                          maxWidth: '82%', padding: '11px 16px',
                          borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          fontSize: '0.92rem', fontWeight: 600,
                          background: isMe ? `linear-gradient(135deg, ${P.navy}, ${P.blue})` : 'rgba(255,255,255,0.95)',
                          color: isMe ? '#fff' : P.navy,
                          border: isMe ? 'none' : `1.5px solid ${P.lavLight}55`,
                          boxShadow: isMe ? `0 4px 12px rgba(52,73,121,0.25)` : '0 2px 8px rgba(52,73,121,0.06)',
                        }}>
>>>>>>> origin/feature/update
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
<<<<<<< HEAD
              <form onSubmit={handleSendMessage} className="bg-white rounded-full border border-blue-100 p-1 flex items-center gap-2 shadow-sm focus-within:shadow-md transition-all">
=======

              <form onSubmit={handleSendMessage} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.9)', borderRadius: '50px',
                border: `1.5px solid ${P.lavLight}`, padding: '6px 8px 6px 16px',
                boxShadow: '0 2px 8px rgba(52,73,121,0.06)',
              }}>
>>>>>>> origin/feature/update
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Scrie un mesaj..."
<<<<<<< HEAD
                  className="flex-1 bg-transparent px-5 py-2 focus:outline-none text-blue-950 font-medium placeholder:text-blue-200"
                />
                <button type="button" className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <img src={galleryIcon} className="w-8 h-8 opacity-70 group-hover:opacity-100" alt="Galerie" />
                </button>
                <button type="submit" className="p-1 hover:scale-110 transition-transform active:scale-90">
                  <img src={trimiteIcon} alt="Trimite" className="w-9 h-9 object-contain" />
=======
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: P.navy, fontWeight: 600, fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
                <button type="button" style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
                  <img src={galleryIcon} style={{ width: '28px', height: '28px', opacity: 0.55 }} alt="Galerie" />
                </button>
                <button type="submit" style={{ background: `linear-gradient(135deg, ${P.navy}, ${P.blue})`, border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={trimiteIcon} alt="Trimite" style={{ width: '22px', height: '22px', objectFit: 'contain', filter: 'brightness(10)' }} />
>>>>>>> origin/feature/update
                </button>
              </form>
            </div>
          </div>

<<<<<<< HEAD
          {/* COLOANA DREAPTĂ — statistici prieten */}
          <div className="flex-1 max-w-[400px] flex flex-col gap-4 pt-2 lg:ml-auto">
            <p className="italic font-bold text-blue-950 text-base">
=======
          {/* stats */}
          <div style={{ flex: 1, maxWidth: '380px', paddingTop: '4px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: P.lav, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', borderLeft: `3px solid ${P.blue}`, paddingLeft: '10px' }}>
>>>>>>> origin/feature/update
              Statisticile lui {selectedFriend?.username || 'prietenului'}
            </p>
            {friendId ? (
              <FriendStatsPanel friendId={friendId} token={token} />
            ) : (
<<<<<<< HEAD
              <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Selectează un prieten pentru a vedea statisticile.</p>
            )}
          </div>

        </div>
      </main>
=======
              <p style={{ color: P.lav, fontSize: '0.85rem' }}>Selectează un prieten pentru statistici.</p>
            )}
          </div>
        </div>
      </div>
>>>>>>> origin/feature/update
    </div>
  );
}

<<<<<<< HEAD
export default FriendsChat;
=======
export default FriendsChat;
>>>>>>> origin/feature/update
