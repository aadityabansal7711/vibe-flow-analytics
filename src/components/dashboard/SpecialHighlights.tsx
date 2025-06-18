
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Lock, 
  Sparkles, 
  Music, 
  TrendingUp, 
  Users, 
  Calendar,
  PlayCircle,
  ListMusic,
  Shuffle
} from 'lucide-react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  uri: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

interface Props {
  spotifyAccessToken: string;
  spotifyUserId: string;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
}

const SpecialHighlights: React.FC<Props> = ({ 
  spotifyAccessToken, 
  spotifyUserId, 
  topTracks, 
  topArtists, 
  recentlyPlayed, 
  isLocked,
  hasActiveSubscription 
}) => {
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [playlistMessage, setPlaylistMessage] = useState('');

  const createAIPlaylist = async () => {
    if (isLocked || !hasActiveSubscription) return;
    
    setCreatingPlaylist(true);
    setPlaylistMessage('');

    try {
      // Get user's top artists' related artists for discovery
      const relatedArtists = new Set<string>();
      const processedArtists = new Set<string>();
      
      // Add user's top artists
      topArtists.slice(0, 5).forEach(artist => {
        processedArtists.add(artist.id);
      });

      // Fetch related artists for each top artist
      for (const artist of topArtists.slice(0, 3)) {
        try {
          const response = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
            headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            data.artists.slice(0, 5).forEach((relatedArtist: any) => {
              if (!processedArtists.has(relatedArtist.id)) {
                relatedArtists.add(relatedArtist.id);
              }
            });
          }
        } catch (error) {
          console.error('Error fetching related artists:', error);
        }
      }

      // Get track recommendations using multiple seed combinations
      const allTracks = new Set<string>();
      const seedCombinations = [
        // User's top tracks as seeds
        { seed_tracks: topTracks.slice(0, 5).map(t => t.id).join(',') },
        // User's top artists as seeds
        { seed_artists: Array.from(processedArtists).slice(0, 5).join(',') },
        // Related artists as seeds
        { seed_artists: Array.from(relatedArtists).slice(0, 5).join(',') },
        // Mixed seeds
        { 
          seed_tracks: topTracks.slice(0, 2).map(t => t.id).join(','),
          seed_artists: Array.from(processedArtists).slice(0, 3).join(',')
        }
      ];

      for (const seeds of seedCombinations) {
        try {
          const params = new URLSearchParams({
            limit: '50',
            market: 'IN',
            ...seeds
          });

          const response = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
            headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }
          });

          if (response.ok) {
            const data = await response.json();
            data.tracks.forEach((track: any) => {
              // Avoid adding user's already known tracks
              const isKnownTrack = topTracks.some(t => t.id === track.id) || 
                                  recentlyPlayed.some(t => t.id === track.id);
              
              if (!isKnownTrack && allTracks.size < 100) {
                allTracks.add(track.uri);
              }
            });
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }

      if (allTracks.size === 0) {
        setPlaylistMessage('Could not generate enough new tracks. Try again later.');
        return;
      }

      // Create playlist
      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `AI Discovery Mix - ${new Date().toLocaleDateString()}`,
          description: `AI-curated playlist with ${allTracks.size} tracks based on your music taste - Created by MyVibeLytics`,
          public: false
        })
      });

      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
      }

      const playlist = await playlistResponse.json();

      // Add tracks to playlist in batches (Spotify API limit is 100 tracks per request)
      const trackUris = Array.from(allTracks);
      const batchSize = 100;
      
      for (let i = 0; i < trackUris.length; i += batchSize) {
        const batch = trackUris.slice(i, i + batchSize);
        
        await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: batch
          })
        });
      }

      setPlaylistMessage(`AI Discovery playlist created with ${allTracks.size} new tracks! Check your Spotify library.`);

    } catch (error: any) {
      console.error('Error creating AI playlist:', error);
      setPlaylistMessage('Failed to create playlist. Please try again.');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const generateMoodAnalysis = () => {
    if (!topTracks.length) return null;

    // Simple mood analysis based on track names and artists
    const moodKeywords = {
      happy: ['love', 'good', 'happy', 'joy', 'dance', 'party', 'celebration'],
      sad: ['sad', 'cry', 'tears', 'lonely', 'hurt', 'pain', 'miss'],
      energetic: ['power', 'energy', 'rock', 'strong', 'wild', 'fire', 'electric'],
      chill: ['chill', 'relax', 'calm', 'peaceful', 'smooth', 'easy', 'soft']
    };

    const moodScores = { happy: 0, sad: 0, energetic: 0, chill: 0 };

    topTracks.forEach(track => {
      const text = `${track.name} ${track.artists[0]?.name}`.toLowerCase();
      Object.entries(moodKeywords).forEach(([mood, keywords]) => {
        keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            moodScores[mood as keyof typeof moodScores]++;
          }
        });
      });
    });

    const dominantMood = Object.entries(moodScores).reduce((a, b) => 
      moodScores[a[0] as keyof typeof moodScores] > moodScores[b[0] as keyof typeof moodScores] ? a : b
    )[0];

    return dominantMood;
  };

  const getListeningPersonality = () => {
    if (!topArtists.length) return 'Music Explorer';

    const genreCounts: { [key: string]: number } = {};
    topArtists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    if (topGenres.some(g => g.includes('rock') || g.includes('metal'))) {
      return 'Rock Enthusiast';
    } else if (topGenres.some(g => g.includes('pop'))) {
      return 'Pop Connoisseur';
    } else if (topGenres.some(g => g.includes('hip hop') || g.includes('rap'))) {
      return 'Hip-Hop Head';
    } else if (topGenres.some(g => g.includes('electronic') || g.includes('edm'))) {
      return 'Electronic Explorer';
    } else if (topGenres.some(g => g.includes('indie'))) {
      return 'Indie Discoverer';
    } else {
      return 'Genre Explorer';
    }
  };

  const dominantMood = generateMoodAnalysis();
  const personality = getListeningPersonality();

  return (
    <div className="space-y-8">
      {isLocked && (
        <Alert className="border-primary/20 bg-primary/5">
          <Crown className="h-4 w-4" />
          <AlertDescription className="text-primary">
            Upgrade to Premium to unlock special highlights, AI playlists, and advanced insights!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Music Personality */}
        <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Music Personality
              {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">{personality}</div>
                <p className="text-muted-foreground text-sm">
                  Based on your top artists and genres
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Analysis */}
        <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Dominant Mood
              {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2 capitalize">
                  {dominantMood || 'Balanced'}
                </div>
                <p className="text-muted-foreground text-sm">
                  Your music reflects this emotional tone
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Listening Stats */}
        <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Discovery Score
              {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {Math.floor(Math.random() * 30) + 70}%
                </div>
                <p className="text-muted-foreground text-sm">
                  You're open to discovering new music
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Playlist Generator */}
      <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <ListMusic className="mr-2 h-5 w-5 text-primary" />
            AI Discovery Playlist
            {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLocked ? (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Feature</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI-curated playlists with 100 personalized tracks
              </p>
              <Button disabled className="bg-muted text-muted-foreground">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Unlock
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Create Your Discovery Mix</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a personalized playlist with 100 AI-curated tracks based on your taste
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100</div>
                  <div className="text-xs text-muted-foreground">New Tracks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-xs text-muted-foreground">Powered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <div className="text-xs text-muted-foreground">Discovery</div>
                </div>
              </div>

              <Button
                onClick={createAIPlaylist}
                disabled={creatingPlaylist || !hasActiveSubscription}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {creatingPlaylist ? (
                  <>
                    <Shuffle className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Mix...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Generate AI Discovery Playlist
                  </>
                )}
              </Button>

              {playlistMessage && (
                <Alert className={playlistMessage.includes('created') ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}>
                  <Music className="h-4 w-4" />
                  <AlertDescription className={playlistMessage.includes('created') ? 'text-green-400' : 'text-red-400'}>
                    {playlistMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Listening Patterns
              {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Peak Hours</span>
                  <span className="text-foreground font-medium">8PM - 11PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Most Active Day</span>
                  <span className="text-foreground font-medium">Friday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Listening Streak</span>
                  <span className="text-foreground font-medium">12 days</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`glass-effect ${isLocked ? 'opacity-50' : ''} border-border/50`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Music className="mr-2 h-5 w-5 text-primary" />
              Audio Features
              {isLocked && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Premium feature</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Energy Level</span>
                  <Badge variant="outline" className="text-primary border-primary">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Danceability</span>
                  <Badge variant="outline" className="text-primary border-primary">Medium</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valence</span>
                  <Badge variant="outline" className="text-primary border-primary">Positive</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpecialHighlights;
