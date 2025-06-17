
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
  uri: string; // Added uri property
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
  currentlyPlaying?: SpotifyTrack;
  loading: boolean;
  error: string | null;
}

const useSpotifyData = (): SpotifyData => {
  const { profile, getValidSpotifyToken, updateProfile } = useAuth();
  const [data, setData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    loading: false,
    error: null
  });

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_connected) {
      console.log('❌ Spotify not connected');
      setData(prev => ({ ...prev, loading: false, error: 'Please connect your Spotify account' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));
    console.log('🎵 Fetching Spotify data with auto-refresh...');

    try {
      // Get a valid token (will auto-refresh if needed)
      const accessToken = await getValidSpotifyToken();
      
      if (!accessToken) {
        console.error('❌ Could not obtain valid access token');
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to get valid access token. Please reconnect your Spotify account.' 
        }));
        return;
      }

      const makeSpotifyRequest = async (url: string): Promise<Response> => {
        console.log(`📡 Making request to: ${url.replace('https://api.spotify.com/v1/', '')}`);
        
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        console.log(`📊 Response status: ${response.status}`);

        if (response.status === 401) {
          console.error('❌ Token invalid - clearing connection');
          await updateProfile({
            spotify_connected: false,
            spotify_access_token: null,
            spotify_refresh_token: null,
            spotify_token_expires_at: null
          });
          throw new Error('Spotify session expired. Please reconnect your account.');
        }

        return response;
      };

      console.log('📡 Starting API requests...');

      // Fetch data with proper error handling
      const [topTracksRes, topArtistsRes, recentlyPlayedRes] = await Promise.all([
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/player/recently-played?limit=20')
      ]);

      console.log('📊 API requests completed');

      const processResponse = async (response: Response, name: string) => {
        if (response.ok) {
          try {
            const text = await response.text();
            if (!text) {
              console.log(`📭 No content for ${name}`);
              return null;
            }
            const data = JSON.parse(text);
            console.log(`✅ ${name} data:`, data.items?.length || 0, 'items');
            return data;
          } catch (e) {
            console.error(`❌ Error parsing ${name} response:`, e);
            return null;
          }
        } else if (response.status === 204) {
          console.log(`📭 No content for ${name}`);
          return null;
        } else if (response.status === 403) {
          console.warn(`🚫 Insufficient permissions for ${name}`);
          return null;
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error(`❌ ${name} request failed:`, response.status, errorText);
          return null;
        }
      };

      const [topTracksData, topArtistsData, recentlyPlayedData] = await Promise.all([
        processResponse(topTracksRes, 'top tracks'),
        processResponse(topArtistsRes, 'top artists'),
        processResponse(recentlyPlayedRes, 'recently played')
      ]);

      const topTracks = topTracksData?.items || [];
      const topArtists = topArtistsData?.items || [];
      const recentlyPlayed = recentlyPlayedData?.items?.map((item: any) => item.track) || [];

      console.log('✅ Spotify data processed successfully:', {
        topTracks: topTracks.length,
        topArtists: topArtists.length,
        recentlyPlayed: recentlyPlayed.length
      });

      if (topTracks.length === 0 && topArtists.length === 0 && recentlyPlayed.length === 0) {
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'No Spotify data found. Try listening to some music first!' 
        }));
        return;
      }

      setData({
        topTracks,
        topArtists,
        recentlyPlayed,
        loading: false,
        error: null
      });

    } catch (error: any) {
      console.error('❌ Error fetching Spotify data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: `Failed to fetch Spotify data: ${error.message}` 
      }));
    }
  };

  useEffect(() => {
    if (profile?.spotify_connected) {
      console.log('🎵 Profile has Spotify connection, fetching data...');
      fetchSpotifyData();
    } else {
      console.log('❌ No Spotify connection found in profile');
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [profile?.spotify_connected, profile?.spotify_access_token]);

  return data;
};

export default useSpotifyData;
