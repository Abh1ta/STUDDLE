/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import catAvatar from "../assets/pisica.png";
import prieteniiTai from "../assets/prieteniiTai.png";
import adaugaPrieteni from "../assets/adaugaPrieteni.png";

const P = {
  navy:     '#344979',
  blue:     '#5d6da5',
  lavBlue:  '#5d6da5',
  lavLight: '#c6c6e8',
  blush:    '#f7e5eb',
};

function MiniLeaderboardList() {
  const [topUsers, setTopUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch("/api/leaderboard/global", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTopUsers(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error("Eroare MiniLeaderboard:", err);
      }
    };
    if (token) fetchTop();
  }, [token]);

  return (
    <div className="flex flex-col gap-3">
      {topUsers.map((u, index) => (
        <div key={u._id}
          className="flex items-center justify-between p-3 rounded-2xl"
          style={{
            background: 'rgba(118,101,173,0.38)',
            border: '2px solid #19022055',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-black w-4" style={{ color: P.lavBlue }}>{index + 1}</span>
            <img src={u.avatar_url || catAvatar} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: P.lavLight }} alt="" />
            <span className="text-sm font-bold truncate w-24" style={{ color: P.navy }}>{u.username}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-black block" style={{ color: P.blue }}>{Number(u.xp || 0).toFixed(1)}</span>
            <span className="text-[9px] font-bold uppercase" style={{ color: P.lavBlue }}>XP</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FriendsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/friends/list", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    };
    fetchFriends();
  }, [token]);

  useEffect(() => {
    if (!search) { setSearchResults([]); return; }
    if (!token) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/friends/search?query=${search}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, token]);

  const sendRequest = async (recipientId) => {
    if (!token) return;
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientId }),
      });
      const data = await res.json();
      if (res.ok) setPendingRequests(prev => [...prev, recipientId]);
      else alert(data.message);
    } catch (err) { console.error(err); }
  };

  const removeFriend = async (friendId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/friends/${friendId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setFriends(prev => prev.filter(f => f.friendshipId !== friendId));
    } catch (err) { console.error(err); }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at center, #8d91c7 0%, #e0c5e6a6 100%)', fontFamily: "'Zilla Slab', serif" }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P.lavLight}80 0%, ${P.blush}40 70%)`, filter: 'blur(70px)', zIndex: 0 }} />

      <main className="relative z-10 flex flex-row gap-10 pt-10 px-10 pb-20">
        <div className="flex-1 max-w-2xl">

          {/* Prietenii tăi */}
          <div className="flex items-center gap-3 mb-3">
            <img src={prieteniiTai} alt="" className="w-11 h-11 object-contain" />
            <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: P.navy }}>Prietenii tăi</h2>
          </div>
          <div className="h-[2px] w-80 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${P.navy}, ${P.lavLight})` }} />

          <div className="flex flex-col gap-3 mb-10">
            {!token && <p className="text-sm" style={{ color: '#f03a17' }}>Nu ești autentificat.</p>}
            {token && friends.length === 0 && <p className="text-sm" style={{ color: P.lavBlue }}>Nu ai prieteni adăugați încă.</p>}
            {friends.map(friend => (
              <div key={friend.id || friend._id}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                style={{
                  background: 'rgba(118,101,173,0.38)',
                  border: '2px solid #19022055',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 12px rgba(52,73,121,0.06)',
                  transition: 'box-shadow 0.18s, transform 0.18s, background 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(118,101,173,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(118,101,173,0.38)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="relative cursor-pointer" onClick={() => navigate("/friendschat", { state: { selectedFriend: friend } })}>
                  <img src={friend.avatar_url || catAvatar} alt={friend.username}
                    className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: P.lavLight }} />
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => navigate("/friendschat", { state: { selectedFriend: friend } })}>
                  <p className="font-bold text-base" style={{ color: P.navy }}>{friend.username}</p>
                  <p className="text-xs" style={{ color: P.lavBlue }}>{friend.isOnline ? 'Online' : 'Offline'}</p>
                </div>
                <button onClick={() => removeFriend(friend.friendshipId)}
                  className="text-xs font-bold px-4 py-2 rounded-full transition-all"
                  style={{ background: P.blush, color: P.lavBlue, fontFamily: 'inherit' }}>
                  Șterge
                </button>
              </div>
            ))}
          </div>

          {/* Adaugă prieteni */}
          <div className="flex items-center gap-3 mb-3">
            <img src={adaugaPrieteni} alt="" className="w-11 h-11 object-contain" />
            <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: P.navy }}>Adaugă prieteni</h2>
          </div>
          <div className="h-[2px] w-80 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${P.navy}, ${P.lavLight})` }} />

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium italic" style={{ color: P.navy }}>Introdu numele de utilizator</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Caută utilizatori..."
              className="w-80 px-5 py-3 rounded-full focus:outline-none transition-all"
              style={{
                background: 'rgba(118,101,173,0.18)',
                border: '2px solid #19022055',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 12px rgba(52,73,121,0.06)',
                fontFamily: 'inherit', color: P.navy
              }} />

            {searchResults.length > 0 && (
              <div className="mt-2 flex flex-col gap-3">
                {searchResults.map(user => (
                  <div key={user._id} className="flex items-center justify-between w-80 p-3 rounded-2xl"
                    style={{ background: 'rgba(118,101,173,0.38)', border: '2px solid #19022055', backdropFilter: 'blur(8px)' }}>
                    <div className="flex items-center gap-3">
                      <img src={user.avatar_url || catAvatar} alt={user.username}
                        className="w-9 h-9 rounded-full border-2 object-cover" style={{ borderColor: P.lavLight }} />
                      <span className="font-bold" style={{ color: P.navy }}>{user.username}</span>
                    </div>
                    {pendingRequests.includes(user._id) ? (
                      <span className="text-xs font-bold px-4 py-2 rounded-full" style={{ background: P.lavLight, color: P.navy }}>Trimisă</span>
                    ) : (
                      <button onClick={() => sendRequest(user._id)}
                        className="text-xs font-bold text-white px-4 py-2 rounded-full transition-all"
                        style={{ background: `linear-gradient(135deg, ${P.blue}, ${P.navy})`, fontFamily: 'inherit' }}>
                        Adaugă
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Top Studdle */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-28 rounded-3xl p-8 shadow-md"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${P.lavLight}`, backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: P.navy }}>Top Studdle</h3>
              <button onClick={() => navigate("/leaderboard")} className="text-sm font-bold"
                style={{ color: P.blue, fontFamily: 'inherit' }}>
                Vezi tot
              </button>
            </div>
            <MiniLeaderboardList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default FriendsPage;
