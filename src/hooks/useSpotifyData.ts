
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const { profile, getValidSpotifyToken, isSpotifyWhitelisted } = useAuth();
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

    if (!isSpotifyWhitelisted) {
      setLoading(false);
      setError('Spotify features are temporarily limited. Please contact support.');
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

      // Fetch top tracks with error handling
      try {
        const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', { headers });
        if (topTracksResponse.ok) {
          const topTracksData = await topTracksResponse.json();
          setTopTracks(topTracksData.items || []);
        } else if (topTracksResponse.status === 403) {
          console.log('User not whitelisted for Spotify API');
          setError('Spotify access limited. Contact support for full access.');
        }
      } catch (err) {
        console.error('Error fetching top tracks:', err);
      }

      // Fetch top artists with error handling
      try {
        const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', { headers });
        if (topArtistsResponse.ok) {
          const topArtistsData = await topArtistsResponse.json();
          setTopArtists(topArtistsData.items || []);
        } else if (topArtistsResponse.status === 403) {
          console.log('User not whitelisted for Spotify API');
        }
      } catch (err) {
        console.error('Error fetching top artists:', err);
      }

      // Fetch recently played with error handling
      try {
        const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers });
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          const tracks = recentData.items?.map((item: any) => ({
            ...item.track,
            played_at: item.played_at
          })) || [];
          setRecentlyPlayed(tracks);
        } else if (recentResponse.status === 403) {
          console.log('User not whitelisted for Spotify API');
        }
      } catch (err) {
        console.error('Error fetching recently played:', err);
      }

    } catch (err: any) {
      console.error('Error fetching Spotify data:', err);
      if (err.message.includes('403') || err.message.includes('not whitelisted')) {
        setError('Spotify features are temporarily limited. Please contact support to enable full access.');
      } else {
        setError(err.message || 'Failed to load Spotify data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotifyData();
  }, [profile?.spotify_connected, profile?.spotify_access_token, isSpotifyWhitelisted]);

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
