import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fmt = (bytes) => {
  if (!bytes) return "";
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
      <rect x="3" y="2" width="13" height="17" rx="2" fill="none" />
      <text x="9" y="14" textAnchor="middle" fontSize="5" fontWeight="700"
        fill={isPdf ? "#c855e8" : "#4a9eff"} fontFamily="sans-serif">
        {type?.toUpperCase()}
      </text>
      <path d="M16 6l3 3" stroke={isPdf ? "#c855e8" : "#4a9eff"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AttachmentBubble({ attachment, isMine }) {
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: isMine
          ? "rgba(255,255,255,0.15)"
          : "rgba(139,120,221,0.1)",
        border: isMine
          ? "1px solid rgba(255,255,255,0.25)"
          : "1px solid rgba(139,120,221,0.25)",
        textDecoration: "none",
        color: "inherit",
        transition: "background 0.2s",
        maxWidth: "240px",
      }}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: 8,
        background: isMine ? "rgba(255,255,255,0.2)" : "rgba(139,120,221,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <FileIcon type={attachment.file_type} size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          color: isMine ? "#fff" : "#3d2d6b",
        }}>
          {attachment.title}
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2,
          color: isMine ? "#fff" : "#7b6aaa" }}>
          {attachment.file_type?.toUpperCase()} · {fmt(attachment.size_bytes)}
        </div>
      </div>
    </a>
  );
}

function MessageBubble({ msg, currentUserId }) {
  const isMine = msg.sender._id === currentUserId || msg.sender === currentUserId;

  return (
    <div style={{
      display: "flex",
      flexDirection: isMine ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 4,
    }}>
      {/* Avatar */}
      {!isMine && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #b09fef, #7eb3f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff",
          flexShrink: 0,
        }}>
          {(msg.sender.username || "?")[0].toUpperCase()}
        </div>
      )}

      {/* Bubble */}
      <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column",
        alignItems: isMine ? "flex-end" : "flex-start", gap: 4 }}>

        {msg.attachment && (
          <AttachmentBubble attachment={msg.attachment} isMine={isMine} />
        )}

        {msg.content && (
          <div style={{
            padding: "10px 14px",
            borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMine
              ? "linear-gradient(135deg, #8b6fd4, #6a5bc4)"
              : "rgba(255,255,255,0.85)",
            color: isMine ? "#fff" : "#3d2d6b",
            fontSize: 14,
            lineHeight: 1.5,
            boxShadow: isMine
              ? "0 2px 12px rgba(107,85,196,0.35)"
              : "0 2px 8px rgba(139,120,221,0.12)",
            backdropFilter: "blur(8px)",
            border: isMine ? "none" : "1px solid rgba(139,120,221,0.2)",
            wordBreak: "break-word",
          }}>
            {msg.content}
          </div>
        )}

        <div style={{ fontSize: 10, opacity: 0.5, color: "#5a4a8a",
          display: "flex", alignItems: "center", gap: 4 }}>
          {timeStr(msg.createdAt)}
          {isMine && (
            <span style={{ color: msg.read ? "#8b6fd4" : "inherit" }}>
              {msg.read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FilePickerModal({ token, onSelect, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/chat/files/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setFiles(d.files || []); setLoading(false); });
  }, [token]);

  const filtered = files.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(30,20,60,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "linear-gradient(160deg, #f0ecff 0%, #e8e4fc 100%)",
        borderRadius: 20, padding: 24, width: 420, maxHeight: "80vh",
        display: "flex", flexDirection: "column", gap: 16,
        boxShadow: "0 20px 60px rgba(100,70,200,0.3)",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#3d2d6b" }}>
            Share a file
          </h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#7b6aaa", lineHeight: 1,
          }}>×</button>
        </div>

        <input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px", borderRadius: 12, border: "1.5px solid rgba(139,120,221,0.3)",
            background: "rgba(255,255,255,0.7)", fontSize: 14, color: "#3d2d6b",
            outline: "none",
          }}
        />

        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {loading && <div style={{ textAlign: "center", color: "#9b8dc4", fontSize: 14 }}>Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#9b8dc4", fontSize: 14, paddingTop: 20 }}>
              No files found
            </div>
          )}
          {filtered.map((f) => (
            <button key={f._id} onClick={() => onSelect(f)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 12, cursor: "pointer",
              background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(139,120,221,0.2)",
              textAlign: "left", transition: "all 0.2s", width: "100%",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139,120,221,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.7)"}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "rgba(139,120,221,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FileIcon type={f.file_type} size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#3d2d6b",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 11, color: "#9b8dc4", marginTop: 2 }}>
                  {f.file_type?.toUpperCase()} · {fmt(f.size_bytes)}
                  {f.subject_id && ` · ${f.subject_id.title}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversationSidebar({ conversations, activeFriendId, onSelect }) {
  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(16px)",
      borderRight: "1.5px solid rgba(139,120,221,0.15)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(139,120,221,0.12)" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#3d2d6b" }}>Messages</h2>
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "8px 12px" }}>
        {conversations.length === 0 && (
          <div style={{ padding: "24px 8px", color: "#9b8dc4", fontSize: 13, textAlign: "center" }}>
            No conversations yet.<br/>Find a friend to start chatting!
          </div>
        )}
        {conversations.map(({ lastMessage, unreadCount }) => {
          const other = lastMessage.sender._id === lastMessage.receiver._id
            ? lastMessage.receiver
            : lastMessage.sender._id !== activeFriendId
              ? lastMessage.sender
              : lastMessage.receiver;

          const isActive = other._id === activeFriendId;

          return (
            <button key={other._id} onClick={() => onSelect(other)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 10px",
                borderRadius: 14, cursor: "pointer", width: "100%", textAlign: "left",
                background: isActive ? "linear-gradient(135deg,rgba(139,120,221,0.18),rgba(106,91,196,0.1))" : "none",
                border: isActive ? "1.5px solid rgba(139,120,221,0.3)" : "1.5px solid transparent",
                marginBottom: 4, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(139,120,221,0.08)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "none"; }}
            >
              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #b09fef, #7eb3f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 700, color: "#fff", position: "relative",
              }}>
                {(other.username || "?")[0].toUpperCase()}
                {unreadCount > 0 && (
                  <div style={{
                    position: "absolute", top: -2, right: -2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#8b6fd4", color: "#fff",
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #f0ecff",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#3d2d6b",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {other.username}
                </div>
                <div style={{ fontSize: 12, color: "#9b8dc4", marginTop: 2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lastMessage.type !== "text"
                    ? `📎 ${lastMessage.attachment?.title || "Attachment"}`
                    : lastMessage.content}
                </div>
              </div>

              <div style={{ fontSize: 11, color: "#b5a8d8", flexShrink: 0 }}>
                {timeStr(lastMessage.createdAt)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg,#b09fef,#7eb3f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }} />
      <div style={{
        padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(139,120,221,0.2)",
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#8b6fd4",
            animation: `bounce 1.2s ${delay}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ friend, token, currentUserId }) {
  const { socketRef } = useSocket();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading]     = useState(true);
  const bottomRef                 = useRef(null);
  const typingTimeout             = useRef(null);

  // Load history
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/chat/${friend._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setMessages(d.messages || []); setLoading(false); });

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join_chat", { friendId: friend._id });
    socket.emit("mark_read",  { senderId: friend._id });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender._id !== currentUserId) {
        socket.emit("mark_read", { senderId: friend._id });
      }
    });

    socket.on("user_typing",         () => setIsTyping(true));
    socket.on("user_stopped_typing", () => setIsTyping(false));

    return () => {
      socket.emit("leave_chat", { friendId: friend._id });
      socket.off("new_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [friend._id]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendText = () => {
    const text = input.trim();
    if (!text) return;
    socketRef.current?.emit("send_message", { receiverId: friend._id, content: text });
    setInput("");
    clearTyping();
  };

  const sendFile = (file) => {
    socketRef.current?.emit("share_file", { receiverId: friend._id, fileId: file._id });
    setShowPicker(false);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("typing_start", { receiverId: friend._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => clearTyping(), 2000);
  };

  const clearTyping = () => {
    socketRef.current?.emit("typing_stop", { receiverId: friend._id });
    clearTimeout(typingTimeout.current);
  };

  // Group messages by day
  const grouped = messages.reduce((acc, msg) => {
    const label = dayLabel(msg.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  return (
    <>
      {showPicker && (
        <FilePickerModal token={token} onSelect={sendFile} onClose={() => setShowPicker(false)} />
      )}

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1.5px solid rgba(139,120,221,0.15)",
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg,#b09fef,#7eb3f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#fff",
          }}>
            {(friend.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#3d2d6b" }}>{friend.username}</div>
            <div style={{ fontSize: 12, color: "#9b8dc4" }}>Friend</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column" }}>
          {loading && (
            <div style={{ textAlign: "center", color: "#9b8dc4", fontSize: 14, paddingTop: 40 }}>
              Loading messages...
            </div>
          )}

          {Object.entries(grouped).map(([day, msgs]) => (
            <div key={day}>
              <div style={{
                textAlign: "center", fontSize: 11, color: "#b5a8d8",
                margin: "16px 0 12px", display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(139,120,221,0.2)" }} />
                {day}
                <div style={{ flex: 1, height: 1, background: "rgba(139,120,221,0.2)" }} />
              </div>
              {msgs.map((msg) => (
                <MessageBubble key={msg._id} msg={msg} currentUserId={currentUserId} />
              ))}
            </div>
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1.5px solid rgba(139,120,221,0.15)",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          display: "flex", gap: 10, alignItems: "center",
        }}>
          {/* Attach file button */}
          <button
            onClick={() => setShowPicker(true)}
            title="Share a file"
            style={{
              width: 42, height: 42, borderRadius: 12, border: "none",
              background: "rgba(139,120,221,0.12)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
              color: "#8b6fd4",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139,120,221,0.22)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(139,120,221,0.12)"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <input
            value={input}
            onChange={handleTyping}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 14,
              border: "1.5px solid rgba(139,120,221,0.25)",
              background: "rgba(255,255,255,0.8)",
              fontSize: 14, color: "#3d2d6b", outline: "none",
              transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(139,120,221,0.55)"}
            onBlur={(e)  => e.target.style.borderColor = "rgba(139,120,221,0.25)"}
          />

          <button
            onClick={sendText}
            disabled={!input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 12, border: "none",
              background: input.trim()
                ? "linear-gradient(135deg,#8b6fd4,#6a5bc4)"
                : "rgba(139,120,221,0.2)",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
              boxShadow: input.trim() ? "0 4px 14px rgba(107,85,196,0.35)" : "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontSize: 52 }}>💬</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#3d2d6b" }}>Your messages</div>
      <div style={{ fontSize: 14, color: "#9b8dc4", textAlign: "center", maxWidth: 240 }}>
        Select a conversation or find a friend to start chatting and share study files.
      </div>
    </div>
  );
}


export default function ChatPage({ token, currentUserId, friendList = [] }) {
  const { socketRef } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeFriend,  setActiveFriend]  = useState(null);

  // Load sidebar
  useEffect(() => {
    fetch(`${API}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []));
  }, [token]);

  // Live sidebar updates
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("conversation_updated", ({ fromUserId, lastMessage }) => {
      setConversations((prev) => {
        const existing = prev.find(
          (c) => c.lastMessage.sender._id === fromUserId ||
                 c.lastMessage.receiver._id === fromUserId
        );
        if (existing) {
          return prev.map((c) =>
            c === existing
              ? { ...c, lastMessage, unreadCount: activeFriend?._id === fromUserId ? 0 : c.unreadCount + 1 }
              : c
          );
        }
        return [{ lastMessage, unreadCount: 1 }, ...prev];
      });
    });

    return () => socket.off("conversation_updated");
  }, [activeFriend]);

  const selectFriend = (friend) => {
    setActiveFriend(friend);
    // Reset unread badge for this friend
    setConversations((prev) =>
      prev.map((c) => {
        const other = c.lastMessage.sender._id === currentUserId
          ? c.lastMessage.receiver
          : c.lastMessage.sender;
        return other._id === friend._id ? { ...c, unreadCount: 0 } : c;
      })
    );
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,120,221,0.3); border-radius: 4px; }
      `}</style>

      <div style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(160deg, #ede9ff 0%, #e4e0ff 40%, #dde8ff 100%)",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}>
        <ConversationSidebar
          conversations={conversations}
          activeFriendId={activeFriend?._id}
          onSelect={selectFriend}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {activeFriend ? (
            <ChatWindow
              key={activeFriend._id}
              friend={activeFriend}
              token={token}
              currentUserId={currentUserId}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}
