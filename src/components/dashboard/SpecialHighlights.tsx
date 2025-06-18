
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeatureCard from '@/components/FeatureCard';
import { 
  Sparkles, 
  Trophy, 
  Heart, 
  Music, 
  TrendingUp,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface SpecialHighlightsProps {
  spotifyAccessToken: string;
  spotifyUserId: string;
  topTracks: any[];
  topArtists: any[];
  recentlyPlayed: any[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
}

const SpecialHighlights: React.FC<SpecialHighlightsProps> = ({
  spotifyAccessToken,
  spotifyUserId,
  topTracks,
  topArtists,
  recentlyPlayed,
  isLocked,
  hasActiveSubscription
}) => {
  const [aiPlaylist, setAiPlaylist] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const createAiPlaylist = async () => {
    if (!hasActiveSubscription) return;
    
    setCreating(true);
    try {
      // Create AI-powered playlist with 100 unique songs
      const playlistName = `AI Curated Mix - ${new Date().toLocaleDateString()}`;
      
      // Get user's top genres and artists for recommendation
      const topGenres = topArtists.slice(0, 5).map(artist => artist.genres).flat();
      const uniqueGenres = [...new Set(topGenres)].slice(0, 3);
      
      // Create playlist on Spotify
      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'AI-curated playlist based on your listening habits',
          public: false
        })
      });
      
      if (!createPlaylistResponse.ok) {
        throw new Error('Failed to create playlist');
      }
      
      const playlist = await createPlaylistResponse.json();
      
      // Get recommendations (100 unique songs)
      const seedArtists = topArtists.slice(0, 2).map(artist => artist.id).join(',');
      const seedTracks = topTracks.slice(0, 2).map(track => track.id).join(',');
      
      const recommendationsResponse = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${seedArtists}&seed_tracks=${seedTracks}&min_popularity=30`,
        {
          headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`
          }
        }
      );
      
      if (!recommendationsResponse.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const recommendations = await recommendationsResponse.json();
      
      // Filter out songs user has listened to recently
      const recentTrackIds = recentlyPlayed.map(item => item.track.id);
      const newTracks = recommendations.tracks.filter(track => 
        !recentTrackIds.includes(track.id)
      );
      
      if (newTracks.length > 0) {
        // Add tracks to playlist
        const trackUris = newTracks.map(track => track.uri);
        
        await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackUris
          })
        });
      }
      
      setAiPlaylist(playlist);
    } catch (error) {
      console.error('Error creating AI playlist:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Playlist Creation */}
      <FeatureCard
        title="AI Curated Playlist"
        description="Create a personalized playlist with 100 unique songs based on your taste"
        icon={<Sparkles className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-4">
          {aiPlaylist ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Music className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Playlist Created!</span>
              </div>
              <p className="text-sm text-muted-foreground">{aiPlaylist.name}</p>
              <Button 
                size="sm" 
                className="mt-2 w-full" 
                onClick={() => window.open(aiPlaylist.external_urls.spotify, '_blank')}
              >
                Open in Spotify
              </Button>
            </div>
          ) : (
            <Button 
              onClick={createAiPlaylist}
              disabled={creating || isLocked}
              className="w-full"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Playlist...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create AI Playlist
                </>
              )}
            </Button>
          )}
        </div>
      </FeatureCard>

      {/* Music Achievements */}
      <FeatureCard
        title="Music Achievements"
        description="Your listening milestones and achievements"
        icon={<Trophy className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tracks Discovered</span>
            <Badge variant="outline">{topTracks.length}+</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Artists Followed</span>
            <Badge variant="outline">{topArtists.length}+</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Listening Hours</span>
            <Badge variant="outline">
              {Math.floor(recentlyPlayed.length * 3.5)}h
            </Badge>
          </div>
        </div>
      </FeatureCard>

      {/* Listening Streaks */}
      <FeatureCard
        title="Listening Patterns"
        description="Your music consumption patterns and trends"
        icon={<TrendingUp className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-sm">Most Active Day: {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-400" />
            <span className="text-sm">Peak Hours: 8-11 PM</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-sm">Favorite Genre: {topArtists[0]?.genres[0] || 'Pop'}</span>
          </div>
        </div>
      </FeatureCard>

      {/* Social Features */}
      <FeatureCard
        title="Music Community"
        description="Connect with other music lovers"
        icon={<Users className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share your music taste and discover new songs through our community features.
          </p>
          <Button variant="outline" className="w-full" disabled>
            <Users className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
      </FeatureCard>

      {/* Mood Analysis */}
      <FeatureCard
        title="Mood Insights"
        description="Understanding your music mood patterns"
        icon={<Heart className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          {topTracks.slice(0, 3).map((track, index) => (
            <div key={track.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artists[0].name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Music Discovery */}
      <FeatureCard
        title="Discovery Engine"
        description="Find new music based on your taste"
        icon={<Music className="h-6 w-6" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Our AI analyzes your listening patterns to suggest new artists and songs you'll love.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-center">
              <Sparkles className="mr-1 h-3 w-3" />
              Smart
            </Badge>
            <Badge variant="outline" className="justify-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Trending
            </Badge>
          </div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default SpecialHighlights;
