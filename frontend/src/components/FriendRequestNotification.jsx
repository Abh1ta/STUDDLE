import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import catAvatar from '../assets/pisica.png';

const POLL_INTERVAL = 15000; 

function FriendRequestNotification() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [visible, setVisible] = useState([]);
  const [dismissing, setDismissing] = useState([]);

  const fetchPending = useCallback(async () => {
    if (!token) return;
    try {
const res = await fetch('/api/friends/requests/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setRequests(prev => {
        const prevIds = new Set(prev.map(r => r._id));
        const newRequests = data.filter(r => !prevIds.has(r._id));

        if (newRequests.length > 0) {
          // Stagger-reveal new ones
          newRequests.forEach((req, i) => {
            setTimeout(() => {
              setVisible(v => [...v, req._id]);
            }, i * 200);
          });
        }

        return data;
      });
    } catch (err) {
      console.error('Eroare la obținerea cererilor:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPending]);

  const dismiss = (id) => {
    setDismissing(d => [...d, id]);
    setTimeout(() => {
      setRequests(r => r.filter(req => req._id !== id));
      setVisible(v => v.filter(vid => vid !== id));
      setDismissing(d => d.filter(did => did !== id));
    }, 400);
  };

 const handleAccept = async (requestId) => {
    if (!token) return;
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'PUT',        
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) dismiss(requestId);
    } catch (err) {
      console.error('Eroare la acceptare:', err);
    }
  };

  const handleDecline = async (friendshipId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) dismiss(friendshipId);
    } catch (err) {
      console.error('Eroare la respingere:', err);
    }
  };

  if (requests.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0);   opacity: 1; }
          to   { transform: translateX(120%); opacity: 0; }
        }
        .notif-card {
          animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .notif-card.dismissing {
          animation: slideOut 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }
        .btn-accept {
          background: linear-gradient(135deg, #38bdf8, #3b82f6);
          transition: filter 0.15s, transform 0.1s;
        }
        .btn-accept:hover  { filter: brightness(1.12); }
        .btn-accept:active { transform: scale(0.95); }
        .btn-decline {
          background: #f1f5f9;
          color: #64748b;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-decline:hover  { background: #e2e8f0; }
        .btn-decline:active { transform: scale(0.95); }
        .close-btn {
          transition: opacity 0.15s, transform 0.1s;
          opacity: 0.4;
        }
        .close-btn:hover { opacity: 0.9; transform: scale(1.15); }
      `}</style>

      {/* Stack — bottom-right corner */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 9999,
          fontFamily: "'Zilla Slab', serif",
          maxWidth: '340px',
          width: '100%',
        }}
      >
        {requests.map(req => {
          const sender = req.user_a_id;
          const isVisible   = visible.includes(req._id);
          const isDismissing = dismissing.includes(req._id);

          if (!isVisible && !isDismissing) return null;

          return (
            <div
              key={req._id}
              className={`notif-card${isDismissing ? ' dismissing' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '1.1rem',
                boxShadow: '0 8px 32px rgba(59,130,246,0.13), 0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(186,213,255,0.5)',
                padding: '1rem 1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={sender?.avatar_url || catAvatar}
                  alt={sender?.username}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #bfdbfe',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1e3a5f', fontSize: '0.95rem' }}>
                    {sender?.username || 'Cineva'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#60a5fa', marginTop: '1px' }}>
                    ți-a trimis o cerere de prietenie
                  </p>
                </div>

                {/* Close ✕ */}
                <button
                  className="close-btn"
                  onClick={() => dismiss(req._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#94a3b8',
                    padding: '2px 4px',
                    lineHeight: 1,
                  }}
                  aria-label="Închide"
                >
                  ✕
                </button>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-accept"
                  onClick={() => handleAccept(req._id)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0',
                    borderRadius: '2rem',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  Acceptă
                </button>
                <button
                  className="btn-decline"
                  onClick={() => handleDecline(req._id)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0',
                    borderRadius: '2rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                  }}
                >
                  Refuză
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FriendRequestNotification;
