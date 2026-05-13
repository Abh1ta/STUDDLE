/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

// Importuri iconițe locale
import trimiteIcon from '../assets/trimite.png'; 
import galleryIcon from '../assets/galerie.png'; 

const API_BASE_URL = 'http://localhost:5000/api';

function FriendsChat() {
  const { token, user } = useAuth();
  const location = useLocation();
  
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(location.state?.selectedFriend || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendXP, setFriendXP] = useState(0);
  
  const [friendStats, setFriendStats] = useState({
    filesCount: 0,
    coursesCount: 0
  });
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
    if (selectedFriend) {
      const fetchFriendDetails = async () => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const id = selectedFriend._id || selectedFriend.id;
        try {
          const chatRes = await axios.get(`${API_BASE_URL}/chat/${id}`, config);
          setMessages(chatRes.data || []);
          
          const xpRes = await axios.get(`${API_BASE_URL}/user-achievements/user/${id}/xp`, config);
          setFriendXP(xpRes.data.totalXP || 0);

          setFriendStats({
            filesCount: selectedFriend.filesCount || 0,
            coursesCount: selectedFriend.coursesCount || 0
          });
        } catch (err) {
          console.error("Eroare detalii prieten:", err);
        }
      };
      fetchFriendDetails();
    }
  }, [selectedFriend, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { 
      sender: user?._id, 
      text: newMessage, 
      time: timeNow 
    }]);
    setNewMessage("");
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-900 italic">Se încarcă profilul...</div>;
  
  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
       {/* Background Decor */}
       <div
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #a7c4da 0%, #95bbe7 60%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      <main className="relative z-10 pt-16">
        
        {/* HEADER PROFIL PRIETEN */}
        <div className="px-6 sm:pl-20 md:pl-32 flex flex-col max-w-7xl mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <img 
                src={selectedFriend?.avatar || selectedFriend?.avatar_url || 'https://via.placeholder.com/150'} 
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

        {/* CONTAINER PRINCIPAL CU JUSTIFY-BETWEEN */}
        <div className="flex flex-col lg:flex-row px-6 sm:pl-20 md:pl-32 gap-10 max-w-7xl items-start justify-between">
          
          {/* COLOANA CHAT (Lățime fixă) */}
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

          {/* COLOANA DREAPTĂ - Împinsă la maxim spre dreapta */}
          <div className="flex-1 max-w-[400px] flex flex-col gap-10 pt-2 lg:ml-auto">
            <div>
              <p className="italic font-bold text-blue-950 mb-6">Ore de studiu (zile/săptămâni)</p>
              <div className="flex items-end gap-4 h-32 border-b-2 border-black w-full pb-0 relative px-2">
                 <div className="w-8 bg-[#2d4a8a] rounded-t-sm transition-all" style={{height: '80%'}}></div>
                 <div className="w-8 bg-[#1a1f3d] rounded-t-sm transition-all" style={{height: '50%'}}></div>
                 <div className="w-8 bg-[#3b82f6] rounded-t-sm transition-all" style={{height: '70%'}}></div>
                 <div className="w-8 bg-[#a7c4da] rounded-t-sm transition-all" style={{height: '30%'}}></div>
              </div>
            </div>

            <div>
              <p className="italic font-bold text-blue-950 mb-6">Materiale accesate</p>
              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-blue-950">{friendStats.coursesCount}</span>
                  <span className="text-sm text-blue-900/60 font-semibold uppercase tracking-wide">Cursuri parcurse</span>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-blue-950">{friendStats.filesCount}</span>
                  <span className="text-sm text-blue-900/60 font-semibold uppercase tracking-wide">Fișe descărcate</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default FriendsChat;