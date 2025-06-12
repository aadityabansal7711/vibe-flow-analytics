
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
  const { profile, updateProfile } = useAuth();
  const [data, setData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    loading: false,
    error: null
  });

  const refreshTokenIfNeeded = async (accessToken: string, refreshToken: string) => {
    try {
      console.log('🔄 Refreshing Spotify token...');
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('fe34af0e9c494464a7a8ba2012f382bb:b3aea9ce9dde43dab089f67962bea287')
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        console.log('✅ Token refreshed successfully');
        
        await updateProfile({
          spotify_access_token: tokenData.access_token
        });
        
        return tokenData.access_token;
      } else {
        const errorText = await response.text();
        console.error('❌ Token refresh failed:', response.status, errorText);
        throw new Error(`Token refresh failed: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      throw error;
    }
  };

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_access_token || !profile?.spotify_connected) {
      console.log('❌ No Spotify access token or not connected');
      setData(prev => ({ ...prev, loading: false, error: 'Please connect your Spotify account' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));
    console.log('🎵 Fetching Spotify data...');

    try {
      let accessToken = profile.spotify_access_token;

      const makeSpotifyRequest = async (url: string, retryCount = 0): Promise<Response> => {
        console.log(`📡 Making request to: ${url}`);
        
        let response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        console.log(`📊 Response status: ${response.status}`);

        if (response.status === 401 && profile.spotify_refresh_token && retryCount === 0) {
          console.log('🔄 Token expired, refreshing...');
          try {
            accessToken = await refreshTokenIfNeeded(accessToken, profile.spotify_refresh_token);
            response = await fetch(url, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            console.log(`📊 Retry response status: ${response.status}`);
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            throw new Error('Failed to refresh Spotify token');
          }
        }

        return response;
      };

      const [topTracksRes, topArtistsRes, recentlyPlayedRes, currentlyPlayingRes] = await Promise.allSettled([
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/player/recently-played?limit=20'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/player/currently-playing')
      ]);

      console.log('📊 All Spotify API requests completed');

      const processResponse = async (result: any, name: string) => {
        if (result.status === 'fulfilled') {
          const response = result.value;
          if (response.ok) {
            try {
              return await response.json();
            } catch (e) {
              console.error(`❌ Error parsing ${name} response:`, e);
              return null;
            }
          } else if (response.status === 204) {
            console.log(`📭 No content for ${name}`);
            return null;
          } else {
            const errorText = await response.text();
            console.error(`❌ ${name} request failed:`, response.status, errorText);
            return null;
          }
        } else {
          console.error(`❌ ${name} request rejected:`, result.reason);
          return null;
        }
      };

      const [topTracksData, topArtistsData, recentlyPlayedData, currentlyPlayingData] = await Promise.all([
        processResponse(topTracksRes, 'top tracks'),
        processResponse(topArtistsRes, 'top artists'),
        processResponse(recentlyPlayedRes, 'recently played'),
        processResponse(currentlyPlayingRes, 'currently playing')
      ]);

      const topTracks = topTracksData?.items || [];
      const topArtists = topArtistsData?.items || [];
      const recentlyPlayed = recentlyPlayedData?.items?.map((item: any) => item.track) || [];
      const currentlyPlaying = currentlyPlayingData?.item || null;

      console.log('✅ Spotify data processed:', {
        topTracks: topTracks.length,
        topArtists: topArtists.length,
        recentlyPlayed: recentlyPlayed.length,
        currentlyPlaying: !!currentlyPlaying
      });

      setData({
        topTracks,
        topArtists,
        recentlyPlayed,
        currentlyPlaying,
        loading: false,
        error: null
      });

    } catch (error: any) {
      console.error('❌ Error fetching Spotify data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: `Failed to fetch Spotify data: ${error.message}. Please try reconnecting your account.` 
      }));
    }
  };

  useEffect(() => {
    if (profile?.spotify_connected && profile?.spotify_access_token) {
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
