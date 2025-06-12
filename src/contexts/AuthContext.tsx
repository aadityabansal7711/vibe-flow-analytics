
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  spotifyId?: string;
  unlocked: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isUnlocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('myvibelytics_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    const clientId = 'fe34af0e9c494464a7a8ba2012f382bb';
    const redirectUri = `${window.location.origin}/callback`;
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-read-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read'
    ].join(' ');

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&show_dialog=true`;
    
    window.location.href = spotifyAuthUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('myvibelytics_user');
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  };

  const isUnlocked = user?.unlocked || user?.email === 'aadityabansal1112@gmail.com' || false;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isUnlocked
    }}>
      {children}
    </AuthContext.Provider>
  );
};
