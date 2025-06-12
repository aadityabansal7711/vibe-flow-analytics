
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();
  const [status, setStatus] = useState('Processing your Spotify connection...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (loading) return;

    const handleCallback = async () => {
      console.log('🔁 Starting Spotify callback handling...');

      if (!user) {
        console.error('❌ No user found for Spotify callback');
        setStatus('Please sign in first');
        setIsError(true);
        setTimeout(() => navigate('/auth'), 3000);
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
        setStatus('Spotify connection cancelled or failed');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      if (!code) {
        console.error('❌ No authorization code received');
        setStatus('No authorization code received');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      if (state !== user.id) {
        console.error('❌ State mismatch - security check failed');
        setStatus('Security validation failed');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      try {
        console.log('🔄 Exchanging code for access token...');
        setStatus('Exchanging code for access token...');

        // Use dynamic redirect URI based on current origin
        const currentOrigin = window.location.origin;
        const redirectUri = `${currentOrigin}/spotify-callback`;
        
        console.log('Using redirect URI for token exchange:', redirectUri);

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

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('❌ Token exchange failed:', errorText);
          throw new Error(`Token exchange failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Token exchange successful');

        setStatus('Getting your Spotify profile...');
        console.log('🔄 Fetching Spotify profile...');

        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('❌ Profile fetch failed:', errorText);
          throw new Error(`Profile fetch failed: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log('✅ Spotify profile retrieved:', profileData.display_name);

        setStatus('Saving your connection...');
        console.log('🔄 Updating user profile with Spotify data...');

        await updateProfile({
          spotify_connected: true,
          spotify_access_token: tokenData.access_token,
          spotify_refresh_token: tokenData.refresh_token,
          spotify_user_id: profileData.id,
          spotify_display_name: profileData.display_name,
          spotify_avatar_url: profileData.images?.[0]?.url || null,
        });

        console.log('✅ Spotify successfully connected');
        setStatus('Success! Spotify connected to your account.');
        setIsSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);

      } catch (err: any) {
        console.error('❌ Spotify callback error:', err);
        setStatus('Failed to connect Spotify. Please try again.');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [user, loading, navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="glass-effect-strong rounded-2xl p-8 border border-border/50">
          <div className="flex items-center justify-center mb-8">
            {isError ? (
              <AlertCircle className="h-16 w-16 text-red-400" />
            ) : isSuccess ? (
              <CheckCircle className="h-16 w-16 text-primary animate-pulse-slow" />
            ) : (
              <div className="relative">
                <Music className="h-16 w-16 text-primary animate-float" />
                <div className="absolute inset-0 h-16 w-16 text-primary/20 animate-glow rounded-full"></div>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gradient mb-4">MyVibeLytics</h1>

          <div className="flex items-center justify-center space-x-3 mb-6">
            {!isError && !isSuccess && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
            <p className="text-foreground text-lg">{status}</p>
          </div>

          {!isError && !isSuccess && (
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-spotify rounded-full animate-pulse"></div>
            </div>
          )}

          {isSuccess && (
            <div className="mt-4">
              <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
          )}

          {isError && (
            <div className="mt-4">
              <p className="text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
