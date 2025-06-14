
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, User, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const SpotifyConnect = () => {
  const { user, profile, connectSpotify, loading } = useAuth();

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

  if (profile?.spotify_connected) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground flex items-center justify-center">
            <Music className="mr-2 h-6 w-6 text-green-400" />
            Spotify Connected
          </CardTitle>
          <CardDescription>
            Connected as {profile.spotify_display_name || 'Unknown User'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            Your Spotify account is successfully connected. Enjoy your personalized music insights!
          </div>
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
      </CardContent>
    </Card>
  );
};

export default SpotifyConnect;
