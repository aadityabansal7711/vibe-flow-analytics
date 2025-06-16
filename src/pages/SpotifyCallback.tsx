
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🎵 Starting Spotify callback handling...')
        console.log('🌐 Current URL:', window.location.href)
        console.log('🔍 Search params:', window.location.search)
        
        setStatus('Verifying authentication...')
        
        // Wait for auth to be ready with timeout
        let authTimeout = 0;
        while (loading && authTimeout < 50) { // 5 second timeout
          await new Promise(resolve => setTimeout(resolve, 100));
          authTimeout++;
        }
        
        if (loading) {
          console.error('❌ Auth timeout - still loading after 5 seconds')
          setError('Authentication timeout')
          setStatus('Authentication timeout...')
          setTimeout(() => navigate('/auth?error=auth_timeout'), 2000);
          return;
        }
        
        if (!user) {
          console.error('❌ No user found during callback')
          setError('Authentication required')
          setStatus('Authentication required...')
          setTimeout(() => navigate('/auth?error=no_user'), 2000);
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error_param = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('🔍 URL parameters extracted:', { 
          hasCode: !!code, 
          codeLength: code?.length,
          codePreview: code ? code.substring(0, 15) + '...' + code.substring(code.length - 15) : null,
          error: error_param, 
          state,
          userId: user.id,
          stateMatch: state === user.id,
          allParams: Object.fromEntries(urlParams.entries())
        })

        // Check for Spotify authorization errors
        if (error_param) {
          console.error('❌ Spotify auth error:', error_param)
          setError(`Spotify authorization failed: ${error_param}`)
          setStatus('Authorization failed...')
          setTimeout(() => navigate('/dashboard?spotify_error=' + encodeURIComponent(error_param)), 2000);
          return;
        }

        // Check for authorization code
        if (!code || code.length < 10) {
          console.error('❌ Invalid or missing authorization code', { 
            code: code?.substring(0, 10) + '...',
            codeLength: code?.length 
          })
          setError('Invalid authorization code received')
          setStatus('Invalid authorization code...')
          setTimeout(() => navigate('/dashboard?spotify_error=invalid_code'), 2000);
          return;
        }

        // Validate state parameter for security
        if (state !== user.id) {
          console.error('❌ State mismatch - possible security issue', { 
            expected: user.id, 
            received: state 
          })
          setError('Security verification failed')
          setStatus('Security verification failed...')
          setTimeout(() => navigate('/dashboard?spotify_error=state_mismatch'), 2000);
          return;
        }

        setStatus('Exchanging authorization code...')
        console.log('🔄 Calling Supabase Edge Function for token exchange...')

        // Use dynamic redirect URI based on current origin
        const redirectUri = `${window.location.origin}/spotify-callback`
        console.log('🔗 Using redirect URI:', redirectUri)
        
        const requestBody = {
          code: code,
          redirect_uri: redirectUri
        }
        
        console.log('📤 Request body for token exchange:', {
          code: code.substring(0, 15) + '...' + code.substring(code.length - 15),
          redirect_uri: redirectUri,
          codeLength: code.length
        })

        // Call the Supabase Edge Function with comprehensive error handling
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('spotify-exchange', {
          body: requestBody
        })

        console.log('📊 Token exchange result:', { 
          hasData: !!tokenData, 
          hasToken: !!tokenData?.access_token,
          hasRefreshToken: !!tokenData?.refresh_token,
          errorMessage: tokenError?.message,
          tokenDataKeys: tokenData ? Object.keys(tokenData) : null,
          fullTokenError: tokenError,
          fullTokenData: tokenData
        })

        if (tokenError) {
          console.error('❌ Token exchange failed:', tokenError)
          setError(`Token exchange failed: ${tokenError.message}`)
          setDebugInfo({
            error: tokenError,
            requestBody,
            timestamp: new Date().toISOString()
          })
          setStatus('Token exchange failed...')
          setTimeout(() => navigate('/dashboard?spotify_error=token_exchange_failed'), 3000);
          return;
        }

        // Check if response contains error (from our edge function)
        if (tokenData?.error) {
          console.error('❌ Spotify API error:', tokenData)
          setError(`Spotify error: ${tokenData.error}`)
          setDebugInfo({
            spotifyError: tokenData,
            requestBody,
            timestamp: new Date().toISOString()
          })
          setStatus('Spotify API error...')
          setTimeout(() => navigate('/dashboard?spotify_error=spotify_api_error'), 3000);
          return;
        }

        if (!tokenData?.access_token) {
          console.error('❌ No access token received from exchange', tokenData)
          setError('No access token received')
          setDebugInfo({
            tokenData,
            requestBody,
            timestamp: new Date().toISOString()
          })
          setStatus('No access token received...')
          setTimeout(() => navigate('/dashboard?spotify_error=no_access_token'), 3000);
          return;
        }

        console.log('✅ Token exchange successful')
        setStatus('Fetching Spotify profile...')

        // Fetch Spotify profile with the access token
        console.log('👤 Fetching Spotify user profile...')
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { 
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('📊 Profile fetch response:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText,
          ok: profileResponse.ok,
          headers: Object.fromEntries(profileResponse.headers.entries())
        })

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('❌ Profile fetch failed:', {
            status: profileResponse.status,
            statusText: profileResponse.statusText,
            errorText,
            tokenPreview: tokenData.access_token?.substring(0, 20) + '...'
          })
          setError(`Failed to fetch Spotify profile (${profileResponse.status})`)
          setStatus('Failed to fetch profile...')
          setTimeout(() => navigate('/dashboard?spotify_error=profile_fetch_failed&status=' + profileResponse.status), 3000);
          return;
        }

        const profileData = await profileResponse.json();
        console.log('✅ Spotify profile fetched:', { 
          id: profileData.id, 
          displayName: profileData.display_name,
          email: profileData.email,
          images: profileData.images?.length || 0,
          country: profileData.country,
          followers: profileData.followers?.total
        })

        setStatus('Saving your Spotify connection...')

        // Calculate token expiry (default to 1 hour if not provided)
        const expiresInSeconds = tokenData.expires_in || 3600;
        const expiresAt = new Date(Date.now() + (expiresInSeconds * 1000));
        
        console.log('💾 Updating profile with Spotify data...')
        
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

        console.log('📝 Profile update data:', {
          spotify_user_id: updateData.spotify_user_id,
          spotify_display_name: updateData.spotify_display_name,
          has_avatar: !!updateData.spotify_avatar_url,
          token_expires: updateData.spotify_token_expires_at,
          hasTokens: !!(updateData.spotify_access_token && updateData.spotify_refresh_token)
        })

        try {
          await updateProfile(updateData);
          console.log('✅ Profile updated successfully')
        } catch (updateError: any) {
          console.error('❌ Profile update failed:', updateError)
          setError(`Failed to save connection: ${updateError.message}`)
          setStatus('Failed to save connection...')
          setTimeout(() => navigate('/dashboard?spotify_error=profile_update_failed'), 3000);
          return;
        }
        
        setStatus('Success! Redirecting...')
        
        // Clear URL parameters and redirect to dashboard
        window.history.replaceState({}, '', '/spotify-callback');
        
        // Verify the connection was saved by checking if it's accessible
        console.log('🔍 Verifying connection was saved...')
        setTimeout(() => {
          navigate('/dashboard?spotify_connected=true', { replace: true });
        }, 1000);

      } catch (err: any) {
        console.error('❌ Unexpected error in Spotify callback:', err)
        console.error('❌ Error stack:', err.stack)
        setError(`Connection failed: ${err.message || 'Unknown error'}`)
        setDebugInfo({
          error: err.message,
          stack: err.stack,
          timestamp: new Date().toISOString()
        })
        setStatus('Connection failed...')
        setTimeout(() => {
          navigate('/dashboard?spotify_error=' + encodeURIComponent(err.message || 'unexpected_error'));
        }, 3000);
      }
    };

    // Set up timeout protection (30 seconds)
    const timeoutId = setTimeout(() => {
      console.error('⏰ Callback handler timed out after 30 seconds')
      setError('Connection timed out')
      setStatus('Connection timed out...')
      navigate('/dashboard?spotify_error=timeout');
    }, 30000);

    // Start the callback handling
    handleCallback().finally(() => {
      clearTimeout(timeoutId);
    });

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, loading, navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        <div className="glass-effect-strong rounded-2xl p-8 border border-border/50">
          {/* Loading Animation */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          
          {/* Status */}
          <div className="text-white text-xl font-semibold mb-2">{status}</div>
          
          {/* Error Display */}
          {error ? (
            <div className="text-red-400 text-sm mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="font-medium mb-2">{error}</div>
              {debugInfo && (
                <details className="text-xs text-left">
                  <summary className="cursor-pointer text-red-300 mb-2">Debug Information</summary>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-40 text-red-200">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm mb-4">
              Please wait while we complete the setup
            </div>
          )}
          
          {/* Progress Indicator */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: status.includes('Initializing') ? '10%' :
                       status.includes('Verifying') ? '20%' :
                       status.includes('Exchanging') ? '40%' :
                       status.includes('Fetching') ? '60%' :
                       status.includes('Saving') ? '80%' :
                       status.includes('Success') ? '100%' : '30%'
              }}
            ></div>
          </div>
          
          {/* Debug Info */}
          <div className="text-xs text-muted-foreground mt-4 space-y-1">
            <div>Check browser console for detailed logs</div>
            {user && <div>User ID: {user.id.slice(0, 8)}...</div>}
            <div>Device: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</div>
            <div>Timestamp: {new Date().toISOString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
