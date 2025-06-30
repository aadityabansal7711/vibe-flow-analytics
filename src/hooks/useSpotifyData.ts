
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const lastFetchTime = useRef<number>(0);
  const isInitialized = useRef(false);

  const fetchSpotifyData = useCallback(async (force = false) => {
    if (!profile?.spotify_connected) {
      setLoading(false);
      return;
    }

    if (!isSpotifyWhitelisted) {
      setLoading(false);
      setError('Spotify features are temporarily limited. Please contact support.');
      return;
    }

    // Prevent excessive API calls - only fetch if more than 30 seconds have passed
    const now = Date.now();
    if (!force && now - lastFetchTime.current < 30000 && isInitialized.current) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      lastFetchTime.current = now;

      const token = await getValidSpotifyToken();
      if (!token) {
        throw new Error('Unable to get valid Spotify token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const fetchPromises = [];

      // Fetch top tracks
      fetchPromises.push(
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', { 
          headers,
          cache: 'no-store'
        }).then(response => {
          if (response.ok) {
            return response.json().then(data => ({ type: 'tracks', data: data.items || [] }));
          } else if (response.status === 403) {
            console.log('User not whitelisted for Spotify API - tracks');
            return { type: 'tracks', data: [] };
          }
          return { type: 'tracks', data: [] };
        }).catch(err => {
          console.error('Error fetching top tracks:', err);
          return { type: 'tracks', data: [] };
        })
      );

      // Fetch top artists
      fetchPromises.push(
        fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', { 
          headers,
          cache: 'no-store'
        }).then(response => {
          if (response.ok) {
            return response.json().then(data => ({ type: 'artists', data: data.items || [] }));
          } else if (response.status === 403) {
            console.log('User not whitelisted for Spotify API - artists');
            return { type: 'artists', data: [] };
          }
          return { type: 'artists', data: [] };
        }).catch(err => {
          console.error('Error fetching top artists:', err);
          return { type: 'artists', data: [] };
        })
      );

      // Fetch recently played
      fetchPromises.push(
        fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { 
          headers,
          cache: 'no-store'
        }).then(response => {
          if (response.ok) {
            return response.json().then(data => ({
              type: 'recent',
              data: data.items?.map((item: any) => ({
                ...item.track,
                played_at: item.played_at
              })) || []
            }));
          } else if (response.status === 403) {
            console.log('User not whitelisted for Spotify API - recent');
            return { type: 'recent', data: [] };
          }
          return { type: 'recent', data: [] };
        }).catch(err => {
          console.error('Error fetching recently played:', err);
          return { type: 'recent', data: [] };
        })
      );

      const results = await Promise.all(fetchPromises);
      
      results.forEach(result => {
        if (result.type === 'tracks') {
          setTopTracks(result.data);
        } else if (result.type === 'artists') {
          setTopArtists(result.data);
        } else if (result.type === 'recent') {
          setRecentlyPlayed(result.data);
        }
      });

      isInitialized.current = true;

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
  }, [profile?.spotify_connected, profile?.spotify_access_token, isSpotifyWhitelisted, getValidSpotifyToken]);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (mounted) {
        await fetchSpotifyData();
      }
    };

    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [profile?.spotify_connected, profile?.user_id]); // Only depend on connection status and user ID

  const refetch = useCallback(() => {
    return fetchSpotifyData(true);
  }, [fetchSpotifyData]);

  return {
    topTracks,
    topArtists,
    recentlyPlayed,
    loading,
    error,
    refetch
  };
};

export default useSpotifyData;
