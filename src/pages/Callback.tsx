
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Loader2 } from 'lucide-react';

const Callback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing your Spotify login...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setStatus('Login cancelled or failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('No authorization code received');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        setStatus('Exchanging code for access token...');
        
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
            redirect_uri: `${window.location.origin}/callback`
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
        
        setStatus('Success! Redirecting to dashboard...');
        
        // Reload the page to trigger auth context update
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Failed to complete login. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <Music className="h-16 w-16 text-green-400 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">MyVibeLytics</h1>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="h-5 w-5 text-green-400 animate-spin" />
          <p className="text-gray-300">{status}</p>
        </div>
        
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;
