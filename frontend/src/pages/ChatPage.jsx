import { useState, useEffect, useRef, useMemo } from "react";
import { useSocket } from "../context/SocketContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fmt = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const timeStr = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const dayLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
};

function FileIcon({ type, size = 20 }) {
  const isPdf = type === "pdf";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="13" height="17" rx="2" fill={isPdf ? "#e07ef7" : "#7eb8f7"} opacity="0.25" />
      <rect x="3" y="2" width="13" height="17" rx="2" stroke={isPdf ? "#c855e8" : "#4a9eff"} strokeWidth="1.5" />
      <path d="M13 2v5h5" stroke={isPdf ? "#c855e8" : "#4a9eff"} strokeWidth="1.5" strokeLinecap="round" />
      <text x="9" y="14" textAnchor="middle" fontSize="5" fontWeight="700" fill={isPdf ? "#c855e8" : "#4a9eff"} fontFamily="sans-serif">{type?.toUpperCase()}</text>
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
    <div style={{
      display: "flex",
      justifyContent: isMine ? "flex-end" : "flex-start",
      marginBottom: 10,
      width: "100%",
    }}>
      {!isMine && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #b09fef, #7eb3f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: "bold", color: "#fff", flexShrink: 0,
          marginRight: 8, alignSelf: "flex-end"
        }}>
          {(msg.sender?.username || "U")[0].toUpperCase()}
        </div>
      )}

      <div style={{
        maxWidth: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: isMine ? "flex-end" : "flex-start",
      }}>
        {msg.attachment && (
          <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8, padding: 10, borderRadius: 12,
            background: isMine ? "rgba(139,120,221,0.2)" : "#fff",
            border: "1px solid rgba(139,120,221,0.2)", textDecoration: "none", color: "inherit", marginBottom: 4
          }}>
            <FileIcon type={msg.attachment.file_type} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{msg.attachment.title}</span>
          </a>
        )}

        {msg.content && (
          <div style={{
            padding: "10px 16px",
            borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMine ? "#8b6fd4" : "#fff",
            color: isMine ? "#fff" : "#3d2d6b",
            fontSize: 14,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            wordBreak: "break-word"
          }}>
            {msg.content}
          </div>
        )}
        
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, display: "flex", gap: 4 }}>
          {timeStr(msg.createdAt)}
          {isMine && <span>{msg.read ? "✓✓" : "✓"}</span>}
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
  const bottomRef = useRef(null);

  // 1. Fetch Conversații
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/chat/conversations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setConversations(d.conversations || []));
  }, [token]);

  // 2. Fetch Mesaje când se schimbă prietenul
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

  // 3. Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeFriend) return;
    const fId = activeFriend._id || activeFriend.id;
    socketRef.current.emit("send_message", { receiverId: fId, content: input.trim() });
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f7fb", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 300, background: "#fff", borderRight: "1px solid #eee", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 20, fontWeight: "bold", fontSize: 20, color: "#3d2d6b" }}>Chats</div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {friendList.map(f => {
            const fId = f._id || f.id;
            const isActive = (activeFriend?._id || activeFriend?.id) === fId;
            return (
              <div key={fId} onClick={() => setActiveFriend(f)} style={{
                padding: "15px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                background: isActive ? "#f0ecff" : "transparent",
                borderLeft: isActive ? "4px solid #8b6fd4" : "4px solid transparent"
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#b09fef", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {f.username[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{f.username}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeFriend ? (
          <>
            <div style={{ padding: "18px 25px", background: "#fff", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
              {activeFriend.username}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 30px" }}>
              {messages.map(m => <MessageBubble key={m._id} msg={m} currentUserId={currentUserId} />)}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: 20, background: "#fff", display: "flex", gap: 10 }}>
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Write a message..." 
                style={{ flex: 1, padding: "12px 15px", borderRadius: 10, border: "1px solid #ddd", outline: "none" }} 
              />
              <button onClick={handleSend} style={{ background: "#8b6fd4", color: "#fff", border: "none", padding: "0 20px", borderRadius: 10, cursor: "pointer", fontWeight: "bold" }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
            Select a conversation to start
          </div>
        )}
      </div>
    </div>
  );
}