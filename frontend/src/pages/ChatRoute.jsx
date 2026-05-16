import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChatPage from "./ChatPage";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatRoute() {
  const { token, user } = useAuth();
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/friends/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFriendList(Array.isArray(data) ? data : []));
  }, [token]);

  if (!token || !user) return null;

  return <ChatPage token={token} currentUserId={user._id} friendList={friendList} />;
}