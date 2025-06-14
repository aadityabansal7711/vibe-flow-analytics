import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  const SPOTIFY_REDIRECT_URI = 'https://my-vibe-lytics.lovable.app/spotify-callback';

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
          setTimeout(() => navigate('/error'), 1000);
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
          redirectUri: SPOTIFY_REDIRECT_URI
        });

        if (error) {
          console.error('❌ Spotify auth error:', error);
          setTimeout(() => navigate('/error'), 1000);
          return;
        }

        if (!code) {
          console.error('❌ No authorization code received');
          setTimeout(() => navigate('/error'), 1000);
          return;
        }

        if (state !== user.id) {
          console.error('❌ State mismatch - security check failed');
          setTimeout(() => navigate('/error'), 1000);
          return;
        }

        console.log('🔄 Exchanging code for access token using Edge Function...');
        
        // Use Supabase Edge Function to exchange code for token (keeps secret secure)
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: { 
            code,
            redirect_uri: SPOTIFY_REDIRECT_URI
          }
        });

        if (tokenError) {
          console.error('❌ Token exchange failed:', tokenError);
          setTimeout(() => navigate('/error'), 1000);
          return;
        }

        console.log('✅ Token exchange successful');

        console.log('🔄 Fetching Spotify profile...');

        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!profileResponse.ok) {
          console.error('❌ Profile fetch failed:', profileResponse.status);
          setTimeout(() => navigate('/error'), 1000);
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
        
        // Clear URL parameters and redirect with delay
        window.history.replaceState({}, document.title, '/spotify-callback');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);

      } catch (err: any) {
        console.error('❌ Spotify callback error:', err);
        setTimeout(() => navigate('/error'), 1000);
      }
    };

    // Add safety timeout
    const timeoutId = setTimeout(() => {
      console.error('⏰ Callback handling timed out, redirecting to error');
      navigate('/error');
    }, 30000); // 30 second timeout

    if (!loading) {
      handleCallback().finally(() => {
        clearTimeout(timeoutId);
      });
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, loading, navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <div className="text-white text-lg">Connecting your Spotify account...</div>
        <div className="text-muted-foreground text-sm mt-2">Please wait while we complete the setup</div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
