
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
        console.log('🎵 Starting Spotify callback handling...');
        
        // Wait for auth to be ready
        if (loading) {
          console.log('⏳ Auth still loading, waiting...');
          return;
        }
        
        if (!user) {
          console.error('❌ No user found during callback');
          setStatus('Authentication required...');
          setTimeout(() => navigate('/auth?error=no_user'), 2000);
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('🔍 URL params:', { 
          hasCode: !!code, 
          error, 
          state,
          userId: user.id,
          stateMatch: state === user.id 
        });

        if (error) {
          console.error('❌ Spotify auth error:', error);
          setStatus('Authorization failed...');
          setTimeout(() => navigate('/dashboard?spotify_error=' + encodeURIComponent(error)), 2000);
          return;
        }

        if (!code) {
          console.error('❌ No authorization code received');
          setStatus('No authorization code received...');
          setTimeout(() => navigate('/dashboard?spotify_error=no_code'), 2000);
          return;
        }

        if (state !== user.id) {
          console.error('❌ State mismatch - possible security issue');
          setStatus('Security verification failed...');
          setTimeout(() => navigate('/dashboard?spotify_error=state_mismatch'), 2000);
          return;
        }

        setStatus('Exchanging authorization code...');
        console.log('🔄 Calling Supabase Edge Function for token exchange...');

        // Call the Supabase Edge Function (not /api/getTokens)
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: { 
            code,
            redirect_uri: 'https://my-vibe-lytics.lovable.app/spotify-callback'
          }
        });

        console.log('📊 Token exchange result:', { 
          hasData: !!tokenData, 
          hasToken: !!tokenData?.access_token,
          error: tokenError 
        });

        if (tokenError) {
          console.error('❌ Token exchange failed:', tokenError);
          setStatus('Token exchange failed...');
          setTimeout(() => navigate('/dashboard?spotify_error=token_exchange_failed'), 2000);
          return;
        }

        if (!tokenData?.access_token) {
          console.error('❌ No access token received from exchange');
          setStatus('No access token received...');
          setTimeout(() => navigate('/dashboard?spotify_error=no_access_token'), 2000);
          return;
        }

        console.log('✅ Token exchange successful');
        setStatus('Fetching Spotify profile...');

        // Fetch Spotify profile
        console.log('👤 Fetching Spotify user profile...');
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        console.log('📊 Profile fetch status:', profileResponse.status);

        if (!profileResponse.ok) {
          console.error('❌ Profile fetch failed:', profileResponse.status, profileResponse.statusText);
          setStatus('Failed to fetch profile...');
          setTimeout(() => navigate('/dashboard?spotify_error=profile_fetch_failed&status=' + profileResponse.status), 2000);
          return;
        }

        const profileData = await profileResponse.json();
        console.log('✅ Spotify profile fetched:', { 
          id: profileData.id, 
          displayName: profileData.display_name,
          email: profileData.email 
        });

        setStatus('Updating your account...');

        // Calculate token expiry
        const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
        
        console.log('💾 Updating profile with Spotify data...');
        
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

        await updateProfile(updateData);
        
        console.log('✅ Profile updated successfully');
        setStatus('Success! Redirecting...');
        
        // Redirect to dashboard with success indicator
        setTimeout(() => {
          navigate('/dashboard?spotify_connected=true', { replace: true });
        }, 1000);

      } catch (err: any) {
        console.error('❌ Unexpected error in Spotify callback:', err);
        setStatus('Connection failed...');
        setTimeout(() => {
          navigate('/dashboard?spotify_error=' + encodeURIComponent(err.message || 'unexpected_error'));
        }, 2000);
      }
    };

    // Add timeout protection
    const timeoutId = setTimeout(() => {
      console.error('⏰ Callback handler timed out after 30 seconds');
      setStatus('Connection timed out...');
      navigate('/dashboard?spotify_error=timeout');
    }, 30000);

    handleCallback().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, loading, navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <div className="text-white text-lg">{status}</div>
        <div className="text-muted-foreground text-sm mt-2">Please wait while we complete the setup</div>
        <div className="text-xs text-muted-foreground mt-4 max-w-md">
          Check your browser console for detailed logs if this takes too long
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
