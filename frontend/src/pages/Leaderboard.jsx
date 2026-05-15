/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import leaderboardIcon from '../assets/leaderboardIcon.jpeg'; 
import catAvatar from '../assets/pisica.png';

const API_BASE_URL = 'http://localhost:5000/api/leaderboard';

function Leaderboard() {
  const { token, user: currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('global');
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        
        const endpoint = activeTab === 'global' ? '/global' : '/friends';
        const res = await axios.get(`${API_BASE_URL}${endpoint}`, config);
        setUsers(res.data);

       
        const rankRes = await axios.get(`${API_BASE_URL}/my-rank`, config);
        setMyRank(rankRes.data);
      } catch (err) {
        console.error("Eroare la încărcarea clasamentului:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, token]);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
      
      
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #95bbe7 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)', filter: 'blur(80px)', zIndex: 0 }} />

      <main className="relative z-10 pt-16 pl-6 sm:pl-20 md:pl-32 pr-6">
        
      
        <div className="max-w-4xl">
          <div className="flex items-center gap-5 mb-4">
            <img src={leaderboardIcon} alt="Leaderboard" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-bold text-blue-950 tracking-tight">Clasament XP</h1>
          </div>
          <div className="w-full md:w-[550px] h-[1px] bg-black opacity-100 mb-10"></div>
        </div>

        
        <div className="flex gap-4 mb-10 ml-4">
          <button 
            onClick={() => setActiveTab('global')}
            className={`px-8 py-2 rounded-full font-bold transition-all ${activeTab === 'global' ? 'bg-[#2d5a8e] text-white shadow-md scale-105' : 'bg-ice-50 text-blue-400 hover:bg-sky-100'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setActiveTab('friends')}
            className={`px-8 py-2 rounded-full font-bold transition-all ${activeTab === 'friends' ? 'bg-[#2d5a8e] text-white shadow-md scale-105' : 'bg-ice-50 text-blue-400 hover:bg-sky-100'}`}
          >
            Prieteni
          </button>
        </div>

        
        {myRank && activeTab === 'global' && (
          <div className="max-w-3xl ml-4 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-[30px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-blue-300 uppercase">Locul tău</span>
                <span className="text-3xl font-black text-blue-600">#{myRank.rank}</span>
              </div>
              <div className="w-[1px] h-10 bg-blue-200"></div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">Bravo, {myRank.username}!</h3>
                <p className="text-sm text-blue-400 italic">Ești în topul învățăceilor.</p>
              </div>
            </div>
            <div className="text-right">
              
              <span className="block text-2xl font-black text-blue-950">
                {Number(myRank.xp).toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-blue-300 uppercase">XP Total</span>
            </div>
          </div>
        )}

       
        <div className="max-w-3xl ml-4 flex flex-col gap-3 pb-20">
          {loading ? (
            <p className="italic text-blue-200 animate-pulse">Se calculează scorurile legendare...</p>
          ) : (
            users.map((u, index) => {
              
              const isMe = u._id === currentUser?._id || u.id === currentUser?.id;
              return (
                <div 
                  key={u._id || u.id}
                  className={`flex items-center justify-between p-4 rounded-[25px] transition-all border 
                    ${isMe ? 'bg-blue-500 text-white border-blue-400 shadow-md scale-[1.02]' : 'bg-white/50 border-gray-100 hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-5">
                    {/* Poziția */}
                    <span className={`w-8 text-center font-black text-lg ${index < 3 && !isMe ? 'text-blue-400' : ''}`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>
                    
                    
                    <img 
                      src={u.avatar_url || u.avatar || catAvatar} 
                      alt="" 
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <div className="flex flex-col">
                      <span className={`font-bold ${isMe ? 'text-white' : 'text-blue-950'}`}>{u.username}</span>
                      
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${isMe ? 'text-blue-100' : 'text-blue-300'}`}>
                        Nivel {u.level || Math.floor(u.xp / 500) + 1}
                      </span>
                    </div>
                  </div>

                 
                  <div className="text-right pr-4">
                    <span className="block font-black text-lg">
                      {Number(u.xp).toFixed(1)}
                    </span>
                    <span className={`text-[9px] font-bold uppercase ${isMe ? 'text-blue-100' : 'text-blue-200'}`}>XP</span>
                  </div>
                </div>
              );
            })
          )}
          
          {!loading && users.length === 0 && (
            <p className="text-center text-gray-300 mt-10 italic">Niciun rival găsit încă...</p>
          )}
        </div>

      </main>
    </div>
  );
}

export default Leaderboard;