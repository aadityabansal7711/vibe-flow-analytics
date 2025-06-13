
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  useEffect(() => {
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
        
        // Clear URL parameters and redirect
        window.history.replaceState({}, document.title, '/spotify-callback');
        navigate('/dashboard');

      } catch (err: any) {
        console.error('❌ Spotify callback error:', err);
        navigate('/error');
      }
    };

    // Only run if not loading
    if (!loading) {
      handleCallback();
    }
  }, [user, loading, navigate, updateProfile]);

  // Return minimal loading state
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-white">Processing Spotify connection...</div>
    </div>
  );
};

export default SpotifyCallback;
