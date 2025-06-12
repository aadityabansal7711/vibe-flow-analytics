
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [status, setStatus] = useState('Processing your Spotify connection...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Starting Spotify callback handling...');
      
      if (!user) {
        console.error('No user found for Spotify callback');
        setStatus('Please sign in first');
        setIsError(true);
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');

      console.log('Callback params:', { code: code?.substring(0, 10) + '...', error, state, userId: user.id });

      if (error) {
        console.error('Spotify auth error:', error);
        setStatus('Spotify connection cancelled or failed');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      if (!code || state !== user.id) {
        console.error('Invalid callback parameters', { hasCode: !!code, stateMatch: state === user.id });
        setStatus('Invalid callback parameters');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      try {
        setStatus('Exchanging code for access token...');
        console.log('Exchanging authorization code for tokens...');
        
        // Exchange code for access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('fe34af0e9c494464a7a8ba2012f382bb:b3aea9ce9dde43dab089f67962bea287')
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://vibe-flow-analytics.lovable.app/spotify-callback'
          })
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange failed:', tokenResponse.status, errorText);
          throw new Error('Failed to get access token');
        }

        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful, access token received');
        
        setStatus('Getting your Spotify profile...');
        
        // Get user profile
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        if (!profileResponse.ok) {
          console.error('Profile fetch failed:', profileResponse.status);
          throw new Error('Failed to get Spotify profile');
        }

        const profileData = await profileResponse.json();
        console.log('Spotify profile retrieved:', profileData.display_name);
        
        // Update user profile in database
        await updateProfile({
          spotify_connected: true,
          spotify_access_token: tokenData.access_token,
          spotify_refresh_token: tokenData.refresh_token,
          spotify_user_id: profileData.id,
          spotify_display_name: profileData.display_name,
          spotify_avatar_url: profileData.images?.[0]?.url
        });
        
        console.log('Profile updated successfully with Spotify data');
        setStatus('Success! Spotify connected to your account!');
        setIsSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Spotify callback error:', error);
        setStatus('Failed to connect Spotify. Please try again.');
        setIsError(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [navigate, user, updateProfile]);

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
            {!isError && !isSuccess && (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            )}
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
