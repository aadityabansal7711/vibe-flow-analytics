
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

const useSpotifyData = () => {
  const { profile, getValidSpotifyToken } = useAuth();
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_connected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getValidSpotifyToken();
      if (!token) {
        throw new Error('Unable to get valid Spotify token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch top tracks
      const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', { headers });
      if (topTracksResponse.ok) {
        const topTracksData = await topTracksResponse.json();
        setTopTracks(topTracksData.items || []);
      }

      // Fetch top artists
      const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', { headers });
      if (topArtistsResponse.ok) {
        const topArtistsData = await topArtistsResponse.json();
        setTopArtists(topArtistsData.items || []);
      }

      // Fetch recently played
      const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers });
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        const tracks = recentData.items?.map((item: any) => ({
          ...item.track,
          played_at: item.played_at
        })) || [];
        setRecentlyPlayed(tracks);
      }

    } catch (err: any) {
      console.error('Error fetching Spotify data:', err);
      setError(err.message || 'Failed to load Spotify data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotifyData();
  }, [profile?.spotify_connected, profile?.spotify_access_token]);

  return {
    topTracks,
    topArtists,
    recentlyPlayed,
    loading,
    error,
    refetch: fetchSpotifyData
  };
};

export default useSpotifyData;
