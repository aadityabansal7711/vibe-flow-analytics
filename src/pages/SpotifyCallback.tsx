
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for auth to be ready
        if (loading) return;
        
        if (!user) {
          console.error('❌ No user found during callback');
          navigate('/auth?error=no_user');
          return;
        }

        setStatus('Processing authorization...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('🎵 Spotify callback params:', { code: !!code, error, state });

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
          console.error('❌ State mismatch');
          navigate('/dashboard?spotify_error=state_mismatch');
          return;
        }

        setStatus('Exchanging tokens...');
        console.log('🔄 Exchanging code for tokens...');

        // Exchange code for tokens using edge function
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: { 
            code,
            redirect_uri: 'https://my-vibe-lytics.lovable.app/spotify-callback'
          }
        });

        if (tokenError || !tokenData?.access_token) {
          console.error('❌ Token exchange failed:', tokenError);
          navigate('/dashboard?spotify_error=token_exchange_failed');
          return;
        }

        console.log('✅ Token exchange successful');

        setStatus('Fetching Spotify profile...');

        // Fetch Spotify profile
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

        setStatus('Updating profile...');

        // Calculate token expiry
        const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
        
        // Update profile with Spotify data
        const updateData = {
          spotify_connected: true,
          spotify_access_token: tokenData.access_token,
          spotify_refresh_token: tokenData.refresh_token,
          spotify_token_expires_at: expiresAt.toISOString(),
          spotify_user_id: profileData.id,
          spotify_display_name: profileData.display_name,
          spotify_avatar_url: profileData.images?.[0]?.url || null,
        };

        // Update profile using the context method
        await updateProfile(updateData);
        
        console.log('✅ Spotify connection completed successfully');
        
        // Redirect to dashboard with success indicator
        navigate('/dashboard?spotify_connected=true', { replace: true });

      } catch (err: any) {
        console.error('❌ Unexpected error in Spotify callback:', err);
        setStatus('Connection failed...');
        setTimeout(() => {
          navigate('/dashboard?spotify_error=' + encodeURIComponent(err.message));
        }, 1000);
      }
    };

    handleCallback();
  }, [user, loading, navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <div className="text-white text-lg">{status}</div>
        <div className="text-muted-foreground text-sm mt-2">Please wait while we complete the setup</div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
