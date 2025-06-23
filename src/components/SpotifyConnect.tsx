
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Music, ExternalLink, RefreshCw, Unlink } from 'lucide-react';
import { toast } from 'sonner';

const SpotifyConnect = () => {
  const { profile, updateProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const connectSpotify = async () => {
    setConnecting(true);
    try {
      // Generate state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      
      // Store state in localStorage
      localStorage.setItem('spotify_auth_state', state);
      
      const clientId = 'your_spotify_client_id'; // This should come from environment
      const redirectUri = `${window.location.origin}/spotify-callback`;
      const scopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'playlist-modify-public',
        'playlist-modify-private'
      ].join(' ');

      const authUrl = `https://accounts.spotify.com/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
      toast.error('Failed to connect to Spotify');
      setConnecting(false);
    }
  };

  const disconnectSpotify = async () => {
    setDisconnecting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          spotify_connected: false,
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_user_id: null,
          spotify_display_name: null,
          spotify_avatar_url: null,
          spotify_token_expires_at: null
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      updateProfile();
      toast.success('Spotify account disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      toast.error('Failed to disconnect Spotify account');
    } finally {
      setDisconnecting(false);
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-refresh', {
        body: { user_id: profile?.user_id }
      });

      if (error) throw error;

      updateProfile();
      toast.success('Spotify token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing Spotify token:', error);
      toast.error('Failed to refresh Spotify token');
    }
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Music className="mr-2 h-5 w-5 text-green-500" />
          Spotify Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.spotify_connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {profile.spotify_avatar_url && (
                  <img
                    src={profile.spotify_avatar_url}
                    alt="Spotify Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {profile.spotify_display_name || 'Connected'}
                  </p>
                  <Badge className="bg-green-500 text-white">
                    Connected
                  </Badge>
                </div>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                <Music className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshToken}
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Token
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={disconnectSpotify}
                disabled={disconnecting}
                className="flex-1"
              >
                <Unlink className="mr-2 h-4 w-4" />
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Connected on: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
              {profile.spotify_token_expires_at && (
                <p>Token expires: {new Date(profile.spotify_token_expires_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Spotify Account</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Spotify account to unlock personalized music analytics and insights.
              </p>
              <Button
                onClick={connectSpotify}
                disabled={connecting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {connecting ? 'Connecting...' : 'Connect to Spotify'}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>What we'll access:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Your top tracks and artists</li>
                <li>Your recently played songs</li>
                <li>Create playlists for you (optional)</li>
                <li>Basic profile information</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotifyConnect;
