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

const API_BASE_URL = 'http://localhost:5000/api';

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
                  {d.hours}h
                </span>
              )}
            </div>
            <span style={{
              fontSize: '0.72rem',
              color: isToday ? '#8398e7' : '#999',
              fontWeight: isToday ? 700 : 400,
            }}>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#aaa', fontSize: '0.85rem' }}>
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
            <span style={{ color: '#444', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
            <span style={{ color: '#888', marginLeft: 'auto', paddingLeft: '8px', fontWeight: 600 }}>{d.count}</span>
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
    setLoading(true);
    setError(null);

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Fetch the friend's study stats — adjust endpoint if yours differs
        const res = await axios.get(`${API_BASE_URL}/study/stats/${friendId}`, config);
        setStats(res.data);
      } catch (err) {
        setError('Nu s-au putut încărca statisticile prietenului.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [friendId, token]);

  const cardStyle = {
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
      <div style={cardStyle}>
        <p style={subtitleStyle}>Ore de studiu — 7 zile</p>
        <FriendBarChart data={stats.studyByDay} />
      </div>

      {/* Pie chart */}
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
  const [newMessage, setNewMessage] = useState("");
  const [friendXP, setFriendXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/leaderboard/friends`, config);
        setFriends(res.data);
        if (res.data.length > 0 && !selectedFriend) {
          setSelectedFriend(res.data[0]);
        }
      } catch (err) {
        console.error("Eroare prieteni:", err);
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
      } catch (err) {
        console.error("Eroare detalii prieten:", err);
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
    setNewMessage("");
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-900 italic">Se încarcă profilul...</div>;

  const friendId = selectedFriend?._id || selectedFriend?.id;

  return (
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
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === user?._id;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] font-bold text-gray-300 mb-1 px-3 uppercase">{m.time || "12:00"}</span>
                        <div className={`max-w-[85%] p-3.5 rounded-[22px] text-sm font-medium shadow-sm
                          ${isMe ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-blue-900 rounded-tl-none border border-blue-50'}`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={handleSendMessage} className="bg-white rounded-full border border-blue-100 p-1 flex items-center gap-2 shadow-sm focus-within:shadow-md transition-all">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 bg-transparent px-5 py-2 focus:outline-none text-blue-950 font-medium placeholder:text-blue-200"
                />
                <button type="button" className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <img src={galleryIcon} className="w-8 h-8 opacity-70 group-hover:opacity-100" alt="Galerie" />
                </button>
                <button type="submit" className="p-1 hover:scale-110 transition-transform active:scale-90">
                  <img src={trimiteIcon} alt="Trimite" className="w-9 h-9 object-contain" />
                </button>
              </form>
            </div>
          </div>

          {/* COLOANA DREAPTĂ — statistici prieten */}
          <div className="flex-1 max-w-[400px] flex flex-col gap-4 pt-2 lg:ml-auto">
            <p className="italic font-bold text-blue-950 text-base">
              Statisticile lui {selectedFriend?.username || 'prietenului'}
            </p>
            {friendId ? (
              <FriendStatsPanel friendId={friendId} token={token} />
            ) : (
              <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Selectează un prieten pentru a vedea statisticile.</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default FriendsChat;