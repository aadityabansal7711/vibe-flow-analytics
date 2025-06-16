
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
      try {
        if (loading) return;
        if (!user) {
          console.error('❌ No user found during callback');
          navigate('/auth?error=no_user');
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('🎵 Spotify callback params:', { code: !!code, error, state, userId: user.id });

        if (error) {
          console.error('❌ Spotify auth error:', error);
          navigate('/dashboard?spotify_error=' + encodeURIComponent(error));
          return;
        }
        if (!code) {
          console.error('❌ No authorization code received');
          navigate('/dashboard?spotify_error=no_code');
          return;
        }
        if (state !== user.id) {
          console.error('❌ State mismatch:', { expected: user.id, received: state });
          navigate('/dashboard?spotify_error=state_mismatch');
          return;
        }

        console.log('🔄 Exchanging code for tokens...');

        // Call supabase edge function for secure token exchange
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: { 
            code,
            redirect_uri: SPOTIFY_REDIRECT_URI
          }
        });

        if (tokenError) {
          console.error('❌ Token exchange failed:', tokenError);
          navigate('/dashboard?spotify_error=' + encodeURIComponent(tokenError.message));
          return;
        }
        if (!tokenData || !tokenData.access_token) {
          console.error('❌ No access token received');
          navigate('/dashboard?spotify_error=no_access_token');
          return;
        }

        console.log('✅ Token exchange successful');

        // Fetch Spotify profile
        console.log('📡 Fetching Spotify profile...');
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!profileResponse.ok) {
          console.error('❌ Profile fetch failed:', profileResponse.status);
          navigate('/dashboard?spotify_error=profile_fetch_failed');
          return;
        }
        const profileData = await profileResponse.json();

        console.log('✅ Spotify profile fetched:', profileData.id);

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

        console.log('🔄 Updating profile with Spotify data...');

        // Update profile directly with Supabase client first
        const { error: directUpdateError } = await supabase
          .from('profiles')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (directUpdateError) {
          console.error('❌ Direct profile update failed:', directUpdateError);
          navigate('/dashboard?spotify_error=' + encodeURIComponent(directUpdateError.message));
          return;
        }

        console.log('✅ Profile updated directly in database');

        // Also update the context state
        try {
          await updateProfile(updateData);
          console.log('✅ Profile context updated');
        } catch (contextError) {
          console.warn('⚠️ Context update failed but database was updated:', contextError);
        }

        console.log('🎉 Spotify connection completed successfully');
        
        // Clear URL and redirect to dashboard
        window.history.replaceState({}, document.title, '/spotify-callback');
        setTimeout(() => navigate('/dashboard?spotify_connected=true', { replace: true }), 500);

      } catch (err: any) {
        console.error('❌ Unexpected error in Spotify callback:', err);
        navigate('/dashboard?spotify_error=' + encodeURIComponent(err.message));
      }
    };

    if (!loading && user) {
      handleCallback();
    }
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
