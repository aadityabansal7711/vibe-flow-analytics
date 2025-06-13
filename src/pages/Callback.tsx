
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Callback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing your Spotify login...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setStatus('Login cancelled or failed');
        setIsError(true);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('No authorization code received');
        setIsError(true);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        setStatus('Exchanging code for access token...');
        
        // Use consistent redirect URI
        const redirectUri = 'https://my-vibe-lytics.lovable.app/callback';
        
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('fe34af0e9c494464a7a8ba2012f382bb:b3aea9ce9dde43dab089f67962bea287')
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get access token');
        }

        const tokenData = await tokenResponse.json();
        
        setStatus('Getting your profile information...');
        
        // Get user profile
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to get user profile');
        }

        const profileData = await profileResponse.json();
        
        // Store tokens
        localStorage.setItem('spotify_access_token', tokenData.access_token);
        localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        
        // Create user object
        const user = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.display_name,
          image: profileData.images?.[0]?.url,
          spotifyId: profileData.id,
          unlocked: profileData.email === 'aadityabansal1112@gmail.com'
        };
        
        localStorage.setItem('myvibelytics_user', JSON.stringify(user));
        
        setStatus('Success! Welcome to MyVibeLytics!');
        setIsSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Failed to complete login. Please try again.');
        setIsError(true);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    // Add safety timeout
    const timeoutId = setTimeout(() => {
      if (!isSuccess && !isError) {
        setStatus('Connection timed out. Please try again.');
        setIsError(true);
        setTimeout(() => navigate('/'), 3000);
      }
    }, 30000);

    handleCallback().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigate, isSuccess, isError]);

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
              <p className="text-muted-foreground">Redirecting to home page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Callback;
