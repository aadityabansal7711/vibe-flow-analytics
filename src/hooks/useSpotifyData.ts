
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  preview_url?: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  followers: { total: number };
  images: { url: string }[];
  popularity: number;
}

interface SpotifyData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  currentlyPlaying?: SpotifyTrack;
  loading: boolean;
  error: string | null;
}

const useSpotifyData = (): SpotifyData => {
  const { profile } = useAuth();
  const [data, setData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    loading: false,
    error: null
  });

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_access_token) {
      setData(prev => ({ ...prev, loading: false, error: 'No Spotify access token' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch top tracks
      const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term', {
        headers: {
          'Authorization': `Bearer ${profile.spotify_access_token}`
        }
      });

      // Fetch top artists
      const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
        headers: {
          'Authorization': `Bearer ${profile.spotify_access_token}`
        }
      });

      // Fetch recently played
      const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: {
          'Authorization': `Bearer ${profile.spotify_access_token}`
        }
      });

      // Fetch currently playing
      const currentlyPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${profile.spotify_access_token}`
        }
      });

      const results = await Promise.allSettled([
        topTracksResponse.json(),
        topArtistsResponse.json(),
        recentlyPlayedResponse.json(),
        currentlyPlayingResponse.status === 200 ? currentlyPlayingResponse.json() : null
      ]);

      const topTracks = results[0].status === 'fulfilled' && results[0].value?.items ? results[0].value.items : [];
      const topArtists = results[1].status === 'fulfilled' && results[1].value?.items ? results[1].value.items : [];
      const recentlyPlayed = results[2].status === 'fulfilled' && results[2].value?.items ? 
        results[2].value.items.map((item: any) => item.track) : [];
      const currentlyPlaying = results[3].status === 'fulfilled' && results[3].value?.item ? results[3].value.item : null;

      setData({
        topTracks,
        topArtists,
        recentlyPlayed,
        currentlyPlaying,
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
    if (profile?.spotify_connected && profile?.spotify_access_token) {
      fetchSpotifyData();
    }
  }, [profile?.spotify_connected, profile?.spotify_access_token]);

  return data;
};

export default useSpotifyData;
