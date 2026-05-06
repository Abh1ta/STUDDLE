import { useAuth } from './context/AuthContext';
import ChatPage from './ChatPage';

export default function ChatRoute() {
  const { token, user } = useAuth();

  if (!token || !user) return null; // not logged in

  return <ChatPage token={token} currentUserId={user._id} />;
}
