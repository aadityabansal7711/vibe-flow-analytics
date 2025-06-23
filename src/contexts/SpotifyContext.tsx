
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  preview_url?: string;
  external_urls: { spotify: string };
  uri: string;
  played_at?: string;
  duration_ms?: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  followers: { total: number };
  images: { url: string }[];
  popularity: number;
  external_urls: { spotify: string };
}

interface SpotifyData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
}

interface SpotifyContextType {
  spotifyData: SpotifyData;
  fetchSpotifyData: () => Promise<void>;
  isLoading: boolean;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [spotifyData, setSpotifyData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_access_token) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock data for now - replace with actual Spotify API calls
      const mockData: SpotifyData = {
        topTracks: [
          {
            id: '1',
            name: 'Sample Track 1',
            artists: [{ name: 'Sample Artist 1' }],
            album: { name: 'Sample Album', images: [{ url: '/placeholder.svg' }] },
            popularity: 85,
            external_urls: { spotify: '#' },
            uri: 'spotify:track:1'
          }
        ],
        topArtists: [
          {
            id: '1',
            name: 'Sample Artist 1',
            genres: ['pop', 'rock'],
            followers: { total: 1000000 },
            images: [{ url: '/placeholder.svg' }],
            popularity: 90,
            external_urls: { spotify: '#' }
          }
        ],
        recentlyPlayed: [
          {
            id: '1',
            name: 'Recent Track 1',
            artists: [{ name: 'Recent Artist 1' }],
            album: { name: 'Recent Album', images: [{ url: '/placeholder.svg' }] },
            popularity: 75,
            external_urls: { spotify: '#' },
            uri: 'spotify:track:1',
            played_at: new Date().toISOString(),
            duration_ms: 180000
          }
        ]
      };
      setSpotifyData(mockData);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpotifyContext.Provider value={{ spotifyData, fetchSpotifyData, isLoading }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
