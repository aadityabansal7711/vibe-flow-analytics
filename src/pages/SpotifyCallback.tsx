
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  useEffect(() => {
    // Set a safety timeout to prevent infinite hanging
    const safetyTimeout = setTimeout(() => {
      console.error('🚨 Spotify callback timeout - redirecting to error');
      navigate('/error');
    }, 15000); // 15 second timeout

    const handleCallback = async () => {
      console.log('🎵 Starting Spotify callback handling...');

      try {
        // Wait for auth to be ready
        if (loading) {
          console.log('⏳ Waiting for auth to load...');
          return;
        }

        if (!user) {
          console.error('❌ No user found for Spotify callback');
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('📦 Callback params:', { 
          hasCode: !!code, 
          error, 
          state, 
          userId: user.id 
        });

        if (error) {
          console.error('❌ Spotify auth error:', error);
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        if (!code) {
          console.error('❌ No authorization code received');
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        if (state !== user.id) {
          console.error('❌ State mismatch - security check failed');
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        console.log('🔄 Exchanging code for access token...');

        const redirectUri = 'https://my-vibe-lytics.lovable.app/spotify-callback';
        
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('fe34af0e9c494464a7a8ba2012f382bb:b3aea9ce9dde43dab089f67962bea287'),
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
          }),
        });

        console.log('📊 Token response status:', tokenResponse.status);

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text().catch(() => 'Unknown error');
          console.error('❌ Token exchange failed:', {
            status: tokenResponse.status,
            error: errorText
          });
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Token exchange successful');

        console.log('🔄 Fetching Spotify profile...');

        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!profileResponse.ok) {
          console.error('❌ Profile fetch failed:', profileResponse.status);
          clearTimeout(safetyTimeout);
          navigate('/error');
          return;
        }

        const profileData = await profileResponse.json();
        console.log('✅ Spotify profile retrieved:', profileData.display_name);

        // Calculate token expiry time
        const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

        const updateData = {
          spotify_connected: true,
          spotify_access_token: tokenData.access_token,
          spotify_refresh_token: tokenData.refresh_token,
          spotify_token_expires_at: expiresAt.toISOString(),
          spotify_user_id: profileData.id,
          spotify_display_name: profileData.display_name,
          spotify_avatar_url: profileData.images?.[0]?.url || null,
        };

        await updateProfile(updateData);

        console.log('✅ Spotify successfully connected - redirecting to dashboard');
        
        // Clear the timeout and redirect
        clearTimeout(safetyTimeout);
        
        // Clear URL parameters and redirect
        window.history.replaceState({}, document.title, '/spotify-callback');
        navigate('/dashboard');

      } catch (err: any) {
        console.error('❌ Spotify callback error:', err);
        clearTimeout(safetyTimeout);
        navigate('/error');
      }
    };

    // Only run if not loading
    if (!loading) {
      handleCallback();
    }

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [user, loading, navigate, updateProfile]);

  // Return minimal UI - just a blank screen while processing
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#000', 
      zIndex: 9999 
    }} />
  );
};

export default SpotifyCallback;
