
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import useSpotifyData from '@/hooks/useSpotifyData';
import SpotifyConnect from '@/components/SpotifyConnect';
import CoreInsights from '@/components/dashboard/CoreInsights';
import ListeningBehavior from '@/components/dashboard/ListeningBehavior';
import PersonalityAnalytics from '@/components/dashboard/PersonalityAnalytics';
import SpecialHighlights from '@/components/dashboard/SpecialHighlights';
import ShareableCards from '@/components/dashboard/ShareableCards';
import { supabase } from '@/integrations/supabase/client';
import { 
  Music2, 
  BarChart3, 
  Brain, 
  Sparkles, 
  Crown, 
  Calendar,
  Share2,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile, isUnlocked } = useAuth();
  const { topTracks, topArtists, loading } = useSpotifyData();
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const createAIPlaylist = async () => {
    if (!profile?.spotify_access_token || !isUnlocked) return;

    setCreatingPlaylist(true);
    try {
      // Get user's top tracks for seeds
      const seeds = topTracks?.slice(0, 5).map(track => track.id).join(',') || '';
      
      // Get recommendations (100 tracks in batches)
      const recommendations = [];
      for (let i = 0; i < 5; i++) {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${seeds}&min_popularity=10&max_popularity=70`, {
          headers: {
            'Authorization': `Bearer ${profile.spotify_access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          recommendations.push(...data.tracks);
        }
      }

      // Remove duplicates and filter out tracks user already listens to frequently
      const uniqueTracks = recommendations.filter((track, index, arr) => 
        arr.findIndex(t => t.id === track.id) === index &&
        !topTracks?.some(topTrack => topTrack.id === track.id)
      ).slice(0, 100);

      // Create playlist
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${profile.spotify_access_token}` }
      });
      
      if (!userResponse.ok) throw new Error('Failed to get user profile');
      const userData = await userResponse.json();

      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${profile.spotify_access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `AI Discovery Mix - ${new Date().toLocaleDateString()}`,
          description: 'Curated by MyVibeLytics AI based on your music taste - 100 hidden gems!',
          public: false
        })
      });

      if (!playlistResponse.ok) throw new Error('Failed to create playlist');
      const playlist = await playlistResponse.json();

      // Add tracks to playlist in batches
      const trackUris = uniqueTracks.map(track => track.uri);
      for (let i = 0; i < trackUris.length; i += 100) {
        const batch = trackUris.slice(i, i + 100);
        await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${profile.spotify_access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris: batch })
        });
      }

      alert(`🎵 Created AI playlist with ${uniqueTracks.length} tracks! Check your Spotify app.`);
    } catch (error) {
      console.error('Error creating AI playlist:', error);
      alert('Failed to create AI playlist. Please try again.');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  if (!profile?.spotify_connected) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
        <SpotifyConnect />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Welcome back, {profile?.spotify_display_name || user?.email?.split('@')[0]}! 🎵
            </h1>
            <div className="flex items-center space-x-3">
              <Badge variant={isUnlocked ? "default" : "secondary"} className="flex items-center space-x-1">
                {isUnlocked ? <Crown className="h-3 w-3" /> : <Music2 className="h-3 w-3" />}
                <span>{isUnlocked ? 'Premium Member' : 'Free Plan'}</span>
              </Badge>
              {profile?.spotify_connected && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Music2 className="mr-1 h-3 w-3" />
                  Spotify Connected
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {isUnlocked && (
              <Button 
                onClick={createAIPlaylist}
                disabled={creatingPlaylist}
                className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200"
              >
                <Zap className="mr-2 h-4 w-4" />
                {creatingPlaylist ? 'Creating...' : 'AI Playlist (100 Songs)'}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Tracks</CardTitle>
              <Music2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topTracks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Available in your data</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Artists</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topArtists?.length || 0}</div>
              <p className="text-xs text-muted-foreground">In your music library</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Data Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">6M</div>
              <p className="text-xs text-muted-foreground">Months of history</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Features</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{isUnlocked ? '12' : '3'}</div>
              <p className="text-xs text-muted-foreground">Analytics available</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 glass-effect">
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Core Insights</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Listening Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Music Personality</span>
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Special Highlights</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Shareable Cards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <CoreInsights 
              topTracks={topTracks || []}
              topArtists={topArtists || []}
              recentlyPlayed={[]}
              isLocked={!isUnlocked}
            />
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <ListeningBehavior 
              topTracks={topTracks || []}
              recentlyPlayed={[]}
              isLocked={!isUnlocked}
            />
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <PersonalityAnalytics 
              topTracks={topTracks || []}
              topArtists={topArtists || []}
              recentlyPlayed={[]}
              isLocked={!isUnlocked}
            />
          </TabsContent>

          <TabsContent value="highlights" className="space-y-6">
            <SpecialHighlights 
              spotifyAccessToken={profile?.spotify_access_token || ''}
              spotifyUserId={profile?.spotify_user_id || ''}
              topTracks={topTracks || []}
              topArtists={topArtists || []}
              recentlyPlayed={[]}
              isLocked={!isUnlocked}
              profile={profile}
            />
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <ShareableCards />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
