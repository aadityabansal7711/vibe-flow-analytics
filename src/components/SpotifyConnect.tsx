
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SpotifyConnect = () => {
  const { profile, connectSpotify } = useAuth();

  if (profile?.spotify_connected) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Music className="h-5 w-5 text-primary" />
            <span>Spotify Connected</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            {profile.spotify_avatar_url && (
              <img 
                src={profile.spotify_avatar_url} 
                alt="Spotify Profile" 
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="text-foreground font-medium">
                {profile.spotify_display_name || 'Connected User'}
              </p>
              <p className="text-muted-foreground text-sm">
                Account successfully linked
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <Music className="h-5 w-5 text-primary" />
          <span>Connect Spotify</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect your Spotify account to unlock personalized music analytics and insights.
        </p>
        <Button 
          onClick={connectSpotify}
          className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Connect Spotify Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpotifyConnect;
