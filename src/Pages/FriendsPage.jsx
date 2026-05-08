import React, { useState, useEffect } from 'react';
import Header from '../Components/Header'; 
import { useAuth } from '../context/AuthContext';

// Importuri de imagini - am adăugat ../ ca să iasă din 'pages' și să intre în 'assets'
import catAvatar from '../assets/pisica.png';
import prieteniiTai from '../assets/prieteniiTai.png';
import adaugaPrieteni from '../assets/adaugaPrieteni.png';

function Friends() {
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Fetch lista de prieteni la încărcare
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch('/api/friends/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error('Eroare la fetch prieteni:', err);
      }
    };
    fetchFriends();
  }, [token]);

  // Căutare utilizatori
  useEffect(() => {
    if (!search) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/friends/search?query=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Eroare la căutare:', err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, token]);

  const sendRequest = async (recipientId) => {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId })
      });
      
      const data = await res.json();

      if(res.ok) {
        setPendingRequests(prev => [...prev, recipientId]);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Eroare:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
      
      {/* Background Blobs */}
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
      <Header />

      <main className="relative pl-32 pr-16 z-10 mt-10" style={{ paddingTop: '2rem' }}>
        <div className="max-w-2xl">

          {/* Secțiune Prieteni */}
          <div className="flex items-center gap-3 mb-3">
            <img src={prieteniiTai} alt="" className="w-12 h-12 object-contain" />
            <h2 className="text-xl font-semibold text-blue-950">Prietenii tăi</h2>
          </div>
          <hr className="border-t border-black opacity-100 mb-8 w-[495px]" />

          <div className="flex flex-col gap-4 mb-10 ml-9">
            {friends.length === 0 && (
              <p className="text-gray-400 text-sm">Nu ai prieteni adăugați încă.</p>
            )}
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={friend.avatar_url || catAvatar}
                    alt={friend.username}
                    className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover shadow-sm"
                  />
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
                <div>
                  <span className="text-blue-950 font-semibold text-lg">{friend.username}</span>
                  <p className="text-xs text-blue-300">{friend.isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Secțiune Adaugă */}
          <div className="flex items-center gap-3 mb-3">
            <img src={adaugaPrieteni} alt="" className="w-12 h-12 object-contain" />
            <h2 className="text-xl font-semibold text-blue-950">Adaugă prieteni</h2>
          </div>
          <hr className="border-t border-black opacity-100 mb-8 w-[495px]" />
          
          <div className="flex flex-col gap-4 ml-9">
            <label className="text-sm text-blue-950 font-medium mb-2 block">Introdu numele de utilizator</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Caută..."
              className="w-80 -mt-4 -ml-4 px-5 py-3 rounded-full border border-black bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all"
              style={{ fontFamily: "inherit" }}
            />

            {/* Rezultate Căutare */}
            {searchResults.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                {searchResults.map(user => (
                  <div key={user._id} className="flex items-center justify-between w-80">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || catAvatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 object-cover"
                      />
                      <span className="text-blue-950 font-semibold">{user.username}</span>
                    </div>
                    
                    {pendingRequests.includes(user._id) ? (
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-full cursor-default">
                        Trimisă
                      </span>
                    ) : (
                      <button
                        onClick={() => sendRequest(user._id)}
                        className="text-xs font-bold text-white bg-gradient-to-br from-sky-400 to-blue-500 px-4 py-2 rounded-full hover:brightness-110 transition-all active:scale-95"
                        style={{ fontFamily: "inherit" }}
                      >
                        Adaugă
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Friends;