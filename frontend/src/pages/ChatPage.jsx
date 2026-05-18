import { useState, useEffect, useRef, useMemo } from "react";
import { useSocket } from "../context/SocketContext";
import galleryIcon from '../assets/galerie.png'; 
import trimiteIcon from '../assets/trimite.png';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const P = { navy: '#344979', blue: '#5d6da5', lav: '#5d6da5', lavLight: '#c6c6e8', blush: '#f7e5eb' };
const pdfInlineUrl = (url) => {
  if (!url) return url;
 
  return url.replace('/upload/', '/upload/fl_attachment:false/');
};
const fmt = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const timeStr = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function FileIcon({ type, size = 20 }) {
  const isPdf = type === "pdf";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="13" height="17" rx="2" fill={isPdf ? P.blush : P.lavLight} opacity="0.5" />
      <rect x="3" y="2" width="13" height="17" rx="2" stroke={isPdf ? P.blue : P.lav} strokeWidth="1.5" />
      <path d="M13 2v5h5" stroke={isPdf ? P.blue : P.lav} strokeWidth="1.5" strokeLinecap="round" />
      <text x="9" y="14" textAnchor="middle" fontSize="5" fontWeight="700" fill={isPdf ? P.blue : P.lav} fontFamily="sans-serif">{type?.toUpperCase()}</text>
    </svg>
  );
}

function MessageBubble({ msg, currentUserId }) {
  const isMine = useMemo(() => {
    const senderId = msg.sender?._id || msg.sender;
    const myId = currentUserId?._id || currentUserId;
    if (!senderId || !myId) return false;
    return senderId.toString().trim().toLowerCase() === myId.toString().trim().toLowerCase();
  }, [msg.sender, currentUserId]);

  return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 14, width: "100%" }}>
      {!isMine && (
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg, ${P.lavLight}, ${P.blue})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
          marginRight: 10, alignSelf: "flex-end", boxShadow: "0 2px 8px rgba(93, 109, 165, 0.2)"
        }}>
          {(msg.sender?.username || "U")[0].toUpperCase()}
        </div>
      )}
      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
        
       {msg.attachment && (
  
    <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(msg.attachment.url)}&embedded=true`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 16,
      background: "rgba(255, 255, 255, 0.75)",
      border: "1px solid rgba(93, 109, 165, 0.18)", textDecoration: "none", color: "inherit", marginBottom: 6,
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      boxShadow: "0 4px 12px rgba(52,73,121,0.04)",
      transition: "transform 0.2s ease"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
  >
    <FileIcon type={msg.attachment.file_type} />
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: P.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.attachment.title}</span>
      <span style={{ fontSize: 10, color: P.lav, fontWeight: 500 }}>Apasă pentru vizualizare</span>
    </div>
  </a>
)}

        {msg.content && (
          <div style={{
            padding: "11px 16px",
            borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMine ? `linear-gradient(135deg, ${P.navy}, ${P.blue})` : "rgba(255, 255, 255, 0.85)",
            color: isMine ? "#fff" : P.navy,
            fontSize: 14, fontWeight: 600,
            backdropFilter: isMine ? "none" : "blur(8px)",
            WebkitBackdropFilter: isMine ? "none" : "blur(8px)",
            boxShadow: isMine ? `0 4px 14px rgba(52,73,121,0.2)` : "0 4px 12px rgba(52,73,121,0.04)",
            wordBreak: "break-word",
            border: isMine ? "none" : `1px solid rgba(198,198,232,0.4)`,
          }}>
            {msg.content}
          </div>
        )}
        
        <div style={{ fontSize: 10, marginTop: 4, display: "flex", alignItems: "center", gap: 4, color: P.lav, fontWeight: 600 }}>
          {timeStr(msg.createdAt)}
          {isMine && <span style={{ color: P.blue, fontSize: 11 }}>{msg.read ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage({ token, currentUserId, friendList = [] }) {
  const { socketRef } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [statusText, setStatusText] = useState(""); // Pentru starea de upload
  const bottomRef = useRef(null);
  

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/chat/conversations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setConversations(d.conversations || []));
  }, [token]);

  useEffect(() => {
    if (!activeFriend || !token) return;
    const fId = activeFriend._id || activeFriend.id;
    fetch(`${API}/api/chat/${fId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setMessages(d.messages || []));
    const socket = socketRef.current;
    if (socket) {
      socket.emit("join_chat", { friendId: fId });
      socket.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
      return () => {
        socket.emit("leave_chat", { friendId: fId });
        socket.off("new_message");
      };
    }
  }, [activeFriend, token, socketRef]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeFriend) return;
    const fId = activeFriend._id || activeFriend.id;
    socketRef.current.emit("send_message", { receiverId: fId, content: input.trim() });
    setInput("");
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file || !activeFriend) return;

  const fId = activeFriend._id || activeFriend.id;
  const formData = new FormData();
  formData.append("file", file);

  try {
    setStatusText("Se încarcă...");
    
    const res = await fetch(`${API}/api/files/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.message || "Upload-ul a eșuat");
    }
    
    const uploadResult = await res.json(); 

    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        receiverId: fId,
        content: "",
        attachment: {
          url: uploadResult.url || uploadResult.file?.url || uploadResult.secure_url, 
          file_type: file.name.split('.').pop().toLowerCase(),
          title: file.name
        }
      });
    }
    setStatusText("");
  } catch (err) {
    console.error("Eroare la trimiterea fișierului:", err);
    setStatusText("Eroare încărcare");
    setTimeout(() => setStatusText(""), 2000);
  }
};

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 50%, #c6c6e830 100%)`,
    }}>
     
      <div style={{
        width: 290, flexShrink: 0,
        background: "rgba(243, 245, 250, 0.75)",
        borderRight: "1px solid rgba(93, 109, 165, 0.15)",
        display: "flex", flexDirection: "column",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      }}>
        <div style={{ padding: "24px 22px 18px", fontWeight: 800, fontSize: "0.85rem", color: P.navy, borderBottom: "1px solid rgba(93, 109, 165, 0.12)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Conversații
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {friendList.map(f => {
            const fId = f._id || f.id;
            const isActive = (activeFriend?._id || activeFriend?.id) === fId;
            return (
              <div key={fId} onClick={() => setActiveFriend(f)} style={{
                padding: "12px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                background: isActive ? "rgba(198, 198, 232, 0.45)" : "transparent",
                borderLeft: isActive ? `4px solid ${P.navy}` : "4px solid transparent",
                transition: "all 0.2s ease",
                margin: "4px 0"
              }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(198, 198, 232, 0.2)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${P.lavLight}, ${P.lav})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 800, flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(152, 150, 187, 0.3)"
                }}>
                  {f.username[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: P.navy }}>{f.username}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* main chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeFriend ? (
          <>
            <div style={{
              padding: "18px 28px",
              background: "rgba(255, 255, 255, 0.6)",
              borderBottom: "1px solid rgba(93, 109, 165, 0.15)",
              fontWeight: 800, fontSize: "1.05rem", color: P.navy,
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            }}>
              {activeFriend.username}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
              {messages.map(m => <MessageBubble key={m._id} msg={m} currentUserId={currentUserId} />)}
              <div ref={bottomRef} />
            </div>
            <div style={{
              padding: "16px 24px",
              background: "rgba(255, 255, 255, 0.6)",
              borderTop: "1px solid rgba(93, 109, 165, 0.15)",
              display: "flex", gap: 12, alignItems: "center",
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            }}>
              
             
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <img src={galleryIcon} style={{ width: '28px', height: '28px', opacity: 0.7 }} alt="Atașează fișier" />
              </button>
              
             
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".pdf,.txt"
                onChange={handleFileChange} 
              />

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Scrie un mesaj drăguț..."
                style={{
                  flex: 1, padding: "12px 20px", borderRadius: "50px",
                  border: "1px solid rgba(93, 109, 165, 0.25)", outline: "none",
                  background: "rgba(255, 255, 255, 0.9)", color: P.navy,
                  fontWeight: 600, fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = P.blue;
                  e.target.style.boxShadow = "0 0 12px rgba(93, 109, 165, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(93, 109, 165, 0.25)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                }}
              />
              
              {statusText && <span style={{ fontSize: "11px", color: P.lav, fontWeight: 700, whiteSpace: "nowrap" }}>{statusText}</span>}

              <button onClick={handleSend} style={{
                background: `linear-gradient(135deg, ${P.navy}, ${P.blue})`,
                color: "#fff", border: "none",
                padding: "12px 26px", borderRadius: "50px",
                cursor: "pointer", fontWeight: 800, fontSize: "0.9rem",
                boxShadow: `0 4px 14px rgba(52,73,121,0.25)`,
                transition: "all 0.15s ease",
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Trimite
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: P.lav, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 500 }}>
            Selectează o conversație pentru a începe chat-ul
          </div>
        )}
      </div>
    </div>
  );
}
