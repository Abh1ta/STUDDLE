/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import pisicaIcon from '../assets/pisica.png';
import trimiteIcon from '../assets/trimite.png';
import galleryIcon from '../assets/galerie.png';

const API_BASE_URL = '/api';
const P = { navy: '#344979', blue: '#5d6da5', lav: '#5d6da5', lavLight: '#c6c6e8', blush: '#b4607cff' };

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
            <div title={`${d.hours}h`} style={{
              width: '100%', height: `${Math.max(heightPct, 3)}%`,
              backgroundColor: isToday ? P.blue : P.lavLight,
              borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease',
              cursor: 'default', position: 'relative',
              minHeight: d.minutes > 0 ? '4px' : '2px',
            }}>
              {d.minutes > 0 && (
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', color: P.navy, whiteSpace: 'nowrap', fontWeight: 700 }}>
                  {d.hours}h
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: isToday ? P.blue : P.lav, fontWeight: isToday ? 800 : 500 }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const FriendPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: P.lav, fontSize: '0.85rem' }}>
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
            <span style={{ color: P.navy, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
            <span style={{ color: P.lav, marginLeft: 'auto', paddingLeft: '8px', fontWeight: 700 }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FriendStatsPanel = ({ friendId, token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!friendId || !token) return;
    setLoading(true); setError(null);
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/study/stats/${friendId}`, config);
        setStats(res.data);
      } catch (err) {
        setError('Nu s-au putut încărca statisticile prietenului.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [friendId, token]);

  const cardStyle = {
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
      <div style={cardStyle}>
        <p style={subtitleStyle}>Ore de studiu — 7 zile</p>
        <FriendBarChart data={stats.studyByDay} />
      </div>
      <div style={cardStyle}>
        <p style={subtitleStyle}>Materiale per materie</p>
        <FriendPieChart data={stats.filesPerSubject} />
      </div>
    </div>
  );
};

function FriendsChat() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(location.state?.selectedFriend || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friendXP, setFriendXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/leaderboard/friends`, config);
        setFriends(res.data);
        if (res.data.length > 0 && !selectedFriend) setSelectedFriend(res.data[0]);
      } catch (err) {
        console.error('Eroare prieteni:', err);
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
        const xpRes = await axios.get(`${API_BASE_URL}/user-achievements/user/${id}/xp`, config);
        setFriendXP(xpRes.data.totalXP || 0);
      } catch {
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
    setNewMessage('');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Zilla Slab', serif", color: P.lav, fontSize: '1.1rem', fontStyle: 'italic' }}>
      Se încarcă...
    </div>
  );

  const friendId = selectedFriend?._id || selectedFriend?.id;

  return (
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
        {/* HEADER */}
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

        {/* MAIN LAYOUT */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* CHAT COLUMN */}
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
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === user?._id;
                    return (
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
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.9)', borderRadius: '50px',
                border: `1.5px solid ${P.lavLight}`, padding: '6px 8px 6px 16px',
                boxShadow: '0 2px 8px rgba(52,73,121,0.06)',
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Scrie un mesaj..."
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
                </button>
              </form>
            </div>
          </div>

          {/* STATS COLUMN */}
          <div style={{ flex: 1, maxWidth: '380px', paddingTop: '4px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: P.lav, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', borderLeft: `3px solid ${P.blue}`, paddingLeft: '10px' }}>
              Statisticile lui {selectedFriend?.username || 'prietenului'}
            </p>
            {friendId ? (
              <FriendStatsPanel friendId={friendId} token={token} />
            ) : (
              <p style={{ color: P.lav, fontSize: '0.85rem' }}>Selectează un prieten pentru statistici.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsChat;
