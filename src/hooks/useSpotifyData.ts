
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
  const { profile } = useAuth();
  const [data, setData] = useState<SpotifyData>({
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    loading: false,
    error: null
  });

  const refreshTokenIfNeeded = async (accessToken: string, refreshToken: string) => {
    try {
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
        console.log('Token refreshed successfully');
        return tokenData.access_token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return accessToken;
  };

  const fetchSpotifyData = async () => {
    if (!profile?.spotify_access_token) {
      setData(prev => ({ ...prev, loading: false, error: 'No Spotify access token' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));
    console.log('Fetching Spotify data...');

    try {
      let accessToken = profile.spotify_access_token;

      // Function to make authenticated requests with token refresh
      const makeSpotifyRequest = async (url: string) => {
        let response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        // If token expired, try to refresh
        if (response.status === 401 && profile.spotify_refresh_token) {
          console.log('Token expired, refreshing...');
          accessToken = await refreshTokenIfNeeded(accessToken, profile.spotify_refresh_token);
          response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        }

        return response;
      };

      // Fetch all data with proper error handling
      const requests = [
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/player/recently-played?limit=20'),
        makeSpotifyRequest('https://api.spotify.com/v1/me/player/currently-playing')
      ];

      const responses = await Promise.allSettled(requests);
      console.log('Spotify API responses received');

      // Process responses
      const processResponse = async (response: any, index: number) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          try {
            return await response.value.json();
          } catch (e) {
            console.error(`Error parsing response ${index}:`, e);
            return null;
          }
        } else if (response.status === 'fulfilled' && response.value.status === 204) {
          // No content (e.g., nothing currently playing)
          return null;
        } else {
          console.error(`Request ${index} failed:`, response);
          return null;
        }
      };

      const [topTracksData, topArtistsData, recentlyPlayedData, currentlyPlayingData] = await Promise.all(
        responses.map(processResponse)
      );

      const topTracks = topTracksData?.items || [];
      const topArtists = topArtistsData?.items || [];
      const recentlyPlayed = recentlyPlayedData?.items?.map((item: any) => item.track) || [];
      const currentlyPlaying = currentlyPlayingData?.item || null;

      console.log('Spotify data processed:', {
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

    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to fetch Spotify data. Please try reconnecting your account.' 
      }));
    }
  };

  useEffect(() => {
    if (profile?.spotify_connected && profile?.spotify_access_token) {
      console.log('Profile has Spotify connection, fetching data...');
      fetchSpotifyData();
    } else {
      console.log('No Spotify connection found in profile');
    }
  }, [profile?.spotify_connected, profile?.spotify_access_token]);

  return data;
};

export default useSpotifyData;
