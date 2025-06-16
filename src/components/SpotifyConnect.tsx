
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, User, Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';

const SpotifyConnect = () => {
  const { user, profile, connectSpotify, loading, isUnlocked, fetchProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [justConnected, setJustConnected] = useState(false);

  // Check for connection success or error in URL params
  useEffect(() => {
    const spotifyConnected = searchParams.get('spotify_connected');
    const spotifyError = searchParams.get('spotify_error');

    if (spotifyConnected === 'true') {
      setJustConnected(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
      // Fetch fresh profile data
      if (fetchProfile) {
        fetchProfile();
      }
    }

    if (spotifyError) {
      console.error('Spotify connection error:', spotifyError);
      // Clear the error parameter
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, fetchProfile]);

  if (loading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            You need to be logged in to connect your Spotify account
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
              'Your Spotify account is connected'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            You can now view your personalized music insights below!
          </div>
          {isUnlocked && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Premium Account Notice</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Premium users cannot disconnect their Spotify account to ensure continuous access to advanced analytics and features.
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
          Connect Your Spotify
        </CardTitle>
        <CardDescription>
          Connect your Spotify account to get personalized music insights and analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Music className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Top Tracks</p>
            </div>
            <div className="text-center">
              <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Top Artists</p>
            </div>
            <div className="text-center">
              <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Premium Insights</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={connectSpotify}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
        >
          <Music className="mr-2 h-5 w-5" />
          Connect with Spotify
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We'll redirect you to Spotify to authorize access to your music data. 
          Your data is kept private and secure.
        </p>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400 text-center">
            <strong>Note:</strong> Free users can connect and disconnect Spotify anytime. 
            Premium users cannot disconnect to ensure continuous access to advanced features.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyConnect;
