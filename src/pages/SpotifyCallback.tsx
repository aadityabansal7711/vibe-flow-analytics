
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const handleCallback = async () => {
      console.log('🎵 Starting silent Spotify callback handling...');

      if (!user) {
        console.error('❌ No user found for Spotify callback');
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
        userId: user.id,
        stateMatch: state === user.id 
      });

      if (error) {
        console.error('❌ Spotify auth error:', error);
        navigate('/error');
        return;
      }

      if (!code) {
        console.error('❌ No authorization code received');
        navigate('/error');
        return;
      }

      if (state !== user.id) {
        console.error('❌ State mismatch - security check failed');
        navigate('/error');
        return;
      }

      try {
        console.log('🔄 Exchanging code for access token...');

        // Use the correct redirect URI for production
        const redirectUri = 'https://my-vibe-lytics.lovable.app/spotify-callback';
        
        console.log('🔗 Using redirect URI for token exchange:', redirectUri);

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
          const errorData = await tokenResponse.json().catch(() => ({}));
          console.error('❌ Token exchange failed:', {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            error: errorData
          });
          navigate('/error');
          return;
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Token exchange successful:', {
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          expiresIn: tokenData.expires_in
        });

        console.log('🔄 Fetching Spotify profile...');

        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        console.log('📊 Profile response status:', profileResponse.status);

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('❌ Profile fetch failed:', errorText);
          navigate('/error');
          return;
        }

        const profileData = await profileResponse.json();
        console.log('✅ Spotify profile retrieved:', {
          id: profileData.id,
          display_name: profileData.display_name,
          email: profileData.email
        });

        console.log('🔄 Updating user profile with Spotify data...');

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

        console.log('💾 Saving profile data with expiry:', expiresAt.toISOString());

        await updateProfile(updateData);

        console.log('✅ Spotify successfully connected - redirecting to dashboard');
        
        // Clear the URL parameters and redirect to dashboard
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/dashboard');

      } catch (err: any) {
        console.error('❌ Spotify callback error:', err);
        navigate('/error');
      }
    };

    handleCallback();
  }, [user, loading, navigate, updateProfile]);

  // Return empty div - no UI shown during processing
  return <div></div>;
};

export default SpotifyCallback;
