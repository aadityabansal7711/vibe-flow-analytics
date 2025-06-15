import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading, fetchProfile } = useAuth();
  const SPOTIFY_REDIRECT_URI = 'https://my-vibe-lytics.lovable.app/spotify-callback';

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (loading) return;
        if (!user) {
          navigate('/auth?error=no_user');
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        if (error) {
          navigate('/error?reason=spotify_auth_error&details=' + encodeURIComponent(error));
          return;
        }
        if (!code) {
          navigate('/error?reason=no_auth_code');
          return;
        }
        if (state !== user.id) {
          navigate('/error?reason=state_mismatch');
          return;
        }

        // Call supabase edge function for secure token exchange
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: { 
            code,
            redirect_uri: SPOTIFY_REDIRECT_URI
          }
        });

        if (tokenError) {
          navigate('/error?reason=token_exchange_failed&details=' + encodeURIComponent(tokenError.message));
          return;
        }
        if (!tokenData || !tokenData.access_token) {
          navigate('/error?reason=no_access_token');
          return;
        }

        // Fetch Spotify profile
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          navigate('/error?reason=profile_fetch_failed&status=' + profileResponse.status);
          return;
        }
        const profileData = await profileResponse.json();

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

        // Update the profile and wait for it to finish before navigating
        await updateProfile(updateData);

        // Always refresh the profile right after update for reliability
        await fetchProfile?.();

        window.history.replaceState({}, document.title, '/spotify-callback');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);

      } catch (err: any) {
        navigate('/error?reason=unexpected_error&details=' + encodeURIComponent(err.message));
      }
    };

    const timeoutId = setTimeout(() => {
      navigate('/error?reason=timeout');
    }, 30000);

    if (!loading) {
      handleCallback().finally(() => clearTimeout(timeoutId));
    }
    return () => clearTimeout(timeoutId);
  }, [user, loading, navigate, updateProfile, fetchProfile]);

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
