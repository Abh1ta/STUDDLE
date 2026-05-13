import React, { createContext, useContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

export const useAvatar = () => {
  return useContext(AvatarContext);
};

export const AvatarProvider = ({ children }) => {
  const [avatarData, setAvatarData] = useState({
    skin_color: 'siameza',
    eye_color: 'albastri',
    cat_name: 'Studdy'
  });

  const fetchAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/api/settings/avatar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAvatarData({
          skin_color: data.data.skin_color || 'siameza',
          eye_color: data.data.eye_color || 'albastri',
          cat_name: data.data.cat_name || 'Studdy'
        });
      }
    } catch (err) {
      console.error("Eroare la incarcarea avatarului global:", err);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <AvatarContext.Provider value={{ avatarData, setAvatarData, refreshAvatar: fetchAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};
