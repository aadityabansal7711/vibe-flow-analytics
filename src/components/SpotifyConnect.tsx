
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, User, Crown, AlertTriangle, CheckCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';

const SpotifyConnect = () => {
  const { user, profile, connectSpotify, loading, isUnlocked, fetchProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [justConnected, setJustConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

  // Check for connection success or error in URL params - only once
  useEffect(() => {
    const spotifyConnected = searchParams.get('spotify_connected');
    const spotifyError = searchParams.get('spotify_error');

    if (spotifyConnected === 'true') {
      setJustConnected(true);
      setConnectionStatus('success');
      setConnectionError(null);
      // Clear params immediately
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('spotify_connected');
      setSearchParams(newParams, { replace: true });
      
      // Refresh profile
      if (fetchProfile) {
        fetchProfile();
      }
    }

    if (spotifyError) {
      console.error('Spotify connection error:', spotifyError);
      setConnectionError(decodeURIComponent(spotifyError));
      setConnectionStatus('error');
      setIsConnecting(false);
      // Clear error param
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('spotify_error');
      setSearchParams(newParams, { replace: true });
    }
  }, []); // Empty dependency array to run only once

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setConnectionError(null);
    
    try {
      await connectSpotify();
    } catch (error: any) {
      console.error('Connection error:', error);
      setConnectionError(error.message || 'Failed to connect to Spotify');
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  }, [connectSpotify]);

  if (loading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading your profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground flex items-center justify-center">
            <User className="mr-2 h-6 w-6" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            Please sign in to connect your Spotify account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/auth">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (connectionStatus === 'connecting' || isConnecting) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground flex items-center justify-center">
            <Wifi className="mr-2 h-6 w-6 animate-pulse text-primary" />
            Connecting to Spotify...
          </CardTitle>
          <CardDescription>
            Please wait while we establish your connection
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-muted-foreground">
              You may be redirected to Spotify for authorization...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profile?.spotify_connected || justConnected) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground flex items-center justify-center">
            <CheckCircle className="mr-2 h-6 w-6 text-green-400" />
            Spotify Connected Successfully!
          </CardTitle>
          <CardDescription>
            {profile?.spotify_display_name ? 
              `Connected as ${profile.spotify_display_name}` : 
              'Your Spotify account is now connected'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 font-medium">🎉 Connection Successful!</p>
            <p className="text-sm text-muted-foreground mt-2">
              You can now access all your personalized music insights and analytics.
            </p>
          </div>
          
          {isUnlocked && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">Premium Account Active</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Premium users have secure connection locks to ensure continuous access to advanced features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-foreground flex items-center justify-center">
          <Music className="mr-2 h-6 w-6" />
          Connect Your Spotify Account
        </CardTitle>
        <CardDescription>
          Connect your Spotify account to unlock personalized music insights and analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Error */}
        {connectionError && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              <strong>Connection Failed:</strong> {connectionError}
              <br />
              <span className="text-sm opacity-75">Please try again or contact support if the issue persists.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <Music className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Top Tracks & Artists</p>
          </div>
          <div className="text-center">
            <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Listening Patterns</p>
          </div>
          <div className="text-center">
            <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">AI Insights</p>
          </div>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all hover:scale-105"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting to Spotify...
            </>
          ) : (
            <>
              <Music className="mr-2 h-5 w-5" />
              Connect with Spotify
            </>
          )}
        </Button>

        <div className="space-y-3 text-xs text-muted-foreground">
          <p className="text-center">
            🔒 We'll redirect you to Spotify to authorize secure access to your music data.
          </p>
          
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-center">
              <strong>Note:</strong> Free users can connect/disconnect anytime. 
              Premium users get secure persistent connections for advanced features.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyConnect;
