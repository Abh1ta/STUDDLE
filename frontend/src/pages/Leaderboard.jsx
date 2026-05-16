/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import catAvatar from '../assets/pisica.png';

<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:5000/api/leaderboard';
=======
const API_BASE_URL = '/api/leaderboard';
>>>>>>> varianta-mai-ok

// Paleta "月影の幻想峰"
const PALETTE = {
  navy:     '#344979',
  blue:     '#5d6da5',
  lavBlue:  '#9896bb',
  lavLight: '#c6c6e8',
  blush:    '#f7e5eb',
};

<<<<<<< HEAD
const MEDAL = ['🥇', '🥈', '🥉'];
=======
>>>>>>> varianta-mai-ok

function PodiumCard({ user, index, isMe }) {
  const heights = ['h-36', 'h-28', 'h-24'];
  const sizes  = ['w-20 h-20', 'w-16 h-16', 'w-14 h-14'];
  const order  = [1, 0, 2]; // vizual: 2nd, 1st, 3rd

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={user.avatar_url || user.avatar || catAvatar}
        alt=""
        className={`${sizes[index]} rounded-full object-cover border-4 shadow-lg`}
        style={{ borderColor: isMe ? PALETTE.blush : PALETTE.lavLight }}
      />
<<<<<<< HEAD
      <span className="text-2xl">{MEDAL[index]}</span>
=======
      <span className="text-xl font-black" style={{ color: PALETTE.navy }}>
        #{index + 1}
      </span>
>>>>>>> varianta-mai-ok
      <span className="font-bold text-sm text-center" style={{ color: PALETTE.navy }}>
        {user.username}
      </span>
      <div
        className={`w-24 ${heights[index]} rounded-t-2xl flex flex-col items-center justify-end pb-3 shadow-md`}
        style={{ background: isMe ? `linear-gradient(160deg, ${PALETTE.blue}, ${PALETTE.navy})` : `linear-gradient(160deg, ${PALETTE.lavLight}, ${PALETTE.lavBlue})` }}
      >
        <span className="font-black text-white text-lg">{Number(user.xp).toFixed(0)}</span>
        <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide">XP</span>
      </div>
    </div>
  );
}

function Leaderboard() {
  const { token, user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('global');
  const [users, setUsers]         = useState([]);
  const [myRank, setMyRank]       = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const endpoint = activeTab === 'global' ? '/global' : '/friends';
        const res      = await axios.get(`${API_BASE_URL}${endpoint}`, config);
        setUsers(res.data);
        const rankRes  = await axios.get(`${API_BASE_URL}/my-rank`, config);
        setMyRank(rankRes.data);
      } catch (err) {
        console.error('Eroare la încărcarea clasamentului:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, token]);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: `linear-gradient(135deg, ${PALETTE.blush} 0%, #ffffff 40%, ${PALETTE.lavLight}55 100%)`,
        fontFamily: "'Zilla Slab', serif",
      }}
    >
      {/* Blob decorativ */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PALETTE.lavLight}80 0%, ${PALETTE.blush}40 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PALETTE.lavBlue}50 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <main className="relative z-10 pt-10 px-6 md:px-12 pb-20 max-w-6xl mx-auto">

        {/* Header pagina */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: PALETTE.navy }}>
            Clasament XP
          </h1>
          <p className="text-sm mt-1" style={{ color: PALETTE.lavBlue }}>
            Compară-te cu ceilalți și urcă în top!
          </p>
          <div className="mt-3 h-[2px] w-48 rounded-full" style={{ background: `linear-gradient(90deg, ${PALETTE.navy}, ${PALETTE.lavLight})` }} />
        </div>

        {/* Layout principal: stânga conținut, dreapta card rank */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* === COLOANA STÂNGA === */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              {['global', 'friends'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-7 py-2 rounded-full font-bold text-sm transition-all shadow-sm"
                  style={
                    activeTab === tab
                      ? { background: PALETTE.navy, color: '#fff', boxShadow: `0 4px 14px ${PALETTE.navy}55` }
                      : { background: '#fff', color: PALETTE.lavBlue, border: `1.5px solid ${PALETTE.lavLight}` }
                  }
                >
                  {tab === 'global' ? 'Global' : 'Prieteni'}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="italic animate-pulse" style={{ color: PALETTE.lavBlue }}>
                Se calculează scorurile legendare...
              </p>
            ) : (
              <>
                {/* Podium top 3 */}
                {top3.length === 3 && (
                  <div
                    className="rounded-3xl p-6 mb-8 shadow-md"
                    style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${PALETTE.lavLight}` }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: PALETTE.lavBlue }}>
                      Top 3
                    </p>
                    <div className="flex items-end justify-center gap-6">
                      {/* Vizual: loc 2, loc 1, loc 3 */}
                      {[top3[1], top3[0], top3[2]].map((u, visualIdx) => {
                        const realIdx = [1, 0, 2][visualIdx];
                        const isMe    = u?._id === currentUser?._id || u?.id === currentUser?.id;
                        return u ? <PodiumCard key={u._id || u.id} user={u} index={realIdx} isMe={isMe} /> : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Lista de la loc 4 în jos */}
                <div className="flex flex-col gap-3">
                  {rest.map((u, i) => {
                    const globalIndex = i + 3;
                    const isMe = u._id === currentUser?._id || u.id === currentUser?.id;
                    return (
                      <div
                        key={u._id || u.id}
                        className="flex items-center justify-between px-5 py-3 rounded-2xl transition-all"
                        style={
                          isMe
                            ? {
                                background: `linear-gradient(135deg, ${PALETTE.navy}, ${PALETTE.blue})`,
                                boxShadow: `0 6px 20px ${PALETTE.navy}40`,
                              }
                            : {
                                background: 'rgba(255,255,255,0.75)',
                                border: `1px solid ${PALETTE.lavLight}`,
                                backdropFilter: 'blur(8px)',
                              }
                        }
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="w-8 text-center font-black text-base"
                            style={{ color: isMe ? '#fff' : PALETTE.lavBlue }}
                          >
                            {globalIndex + 1}
                          </span>
                          <img
                            src={u.avatar_url || u.avatar || catAvatar}
                            alt=""
                            className="w-11 h-11 rounded-full object-cover border-2"
                            style={{ borderColor: isMe ? PALETTE.blush : PALETTE.lavLight }}
                          />
                          <div>
                            <p className="font-bold text-sm" style={{ color: isMe ? '#fff' : PALETTE.navy }}>
                              {u.username}
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isMe ? PALETTE.lavLight : PALETTE.lavBlue }}>
                              Nivel {u.level || Math.floor(u.xp / 500) + 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right pr-2">
                          <p className="font-black text-base" style={{ color: isMe ? '#fff' : PALETTE.navy }}>
                            {Number(u.xp).toFixed(1)}
                          </p>
                          <p className="text-[9px] font-bold uppercase" style={{ color: isMe ? PALETTE.lavLight : PALETTE.lavBlue }}>
                            XP
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {users.length === 0 && (
                  <p className="text-center mt-10 italic" style={{ color: PALETTE.lavBlue }}>
                    Niciun rival găsit încă...
                  </p>
                )}
              </>
            )}
          </div>

          {/* === COLOANA DREAPTA === */}
          <div className="lg:w-72 flex flex-col gap-5">

            {/* Cardul "Locul tău" */}
            {myRank && activeTab === 'global' && (
              <div
                className="rounded-3xl p-6 shadow-md"
                style={{
                  background: `linear-gradient(150deg, ${PALETTE.navy} 0%, ${PALETTE.blue} 100%)`,
                  boxShadow: `0 8px 28px ${PALETTE.navy}50`,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: PALETTE.lavLight }}>
                  Poziția ta
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-inner"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    #{myRank.rank}
                  </div>
                  <div>
                    <p className="font-bold text-white">{myRank.username}</p>
                    <p className="text-xs italic" style={{ color: PALETTE.lavLight }}>
                      Ești în topul învățăceilor!
                    </p>
                  </div>
                </div>
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <p className="text-3xl font-black text-white">{Number(myRank.xp).toFixed(1)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: PALETTE.lavLight }}>
                    XP Total
                  </p>
                </div>
              </div>
            )}

            {/* Card info XP */}
            <div
              className="rounded-3xl p-6 shadow-sm"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: `1px solid ${PALETTE.lavLight}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: PALETTE.lavBlue }}>
                Cum câștigi XP?
              </p>
              {[
                { label: 'Sesiune de studiu', xp: '+50 XP' },
                { label: 'Temă completată', xp: '+30 XP' },
                { label: 'Streak zilnic', xp: '+20 XP' },
                { label: 'Examen promovat', xp: '+100 XP' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: PALETTE.lavLight }}>
                  <span className="text-sm" style={{ color: PALETTE.navy }}>{item.label}</span>
                  <span className="text-sm font-black" style={{ color: PALETTE.blue }}>{item.xp}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
