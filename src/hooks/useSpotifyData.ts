
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  duration_ms: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  followers: { total: number };
  genres: string[];
}

interface SpotifyData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: any[];
  loading: boolean;
  error: string | null;
}

export const useSpotifyData = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    loading: false,
    error: null
  });

  const refreshToken = async () => {
    if (!profile?.spotify_refresh_token) return null;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('fe34af0e9c494464a7a8ba2012f382bb:b3aea9ce9dde43dab089f67962bea287')
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: profile.spotify_refresh_token
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        return tokenData.access_token;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    return null;
  };

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_connected || !profile?.spotify_access_token) {
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      let accessToken = profile.spotify_access_token;

      const fetchWithToken = async (url: string, token: string) => {
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
          // Token expired, try to refresh
          const newToken = await refreshToken();
          if (newToken) {
            accessToken = newToken;
            return fetch(url, {
              headers: { 'Authorization': `Bearer ${newToken}` }
            });
          }
        }
        return response;
      };

      // Fetch top tracks
      const topTracksResponse = await fetchWithToken(
        'https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=long_term',
        accessToken
      );
      
      // Fetch top artists
      const topArtistsResponse = await fetchWithToken(
        'https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term',
        accessToken
      );

      // Fetch recently played
      const recentlyPlayedResponse = await fetchWithToken(
        'https://api.spotify.com/v1/me/player/recently-played?limit=50',
        accessToken
      );

      const [tracksData, artistsData, recentData] = await Promise.all([
        topTracksResponse.ok ? topTracksResponse.json() : { items: [] },
        topArtistsResponse.ok ? topArtistsResponse.json() : { items: [] },
        recentlyPlayedResponse.ok ? recentlyPlayedResponse.json() : { items: [] }
      ]);

      setData({
        topTracks: tracksData.items || [],
        topArtists: artistsData.items || [],
        recentlyPlayed: recentData.items || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch Spotify data'
      }));
    }
  };

  useEffect(() => {
    if (profile?.spotify_connected) {
      fetchSpotifyData();
    }
  }, [profile?.spotify_connected]);

  return { ...data, refetch: fetchSpotifyData };
};
