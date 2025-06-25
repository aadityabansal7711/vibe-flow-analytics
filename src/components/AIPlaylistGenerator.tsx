
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Music, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  spotifyAccessToken: string;
  spotifyUserId: string;
  topTracks: any[];
  topArtists: any[];
  recentlyPlayed: any[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
  onPlaylistCreated?: () => void;
}

const AIPlaylistGenerator: React.FC<Props> = ({
  spotifyAccessToken,
  spotifyUserId,
  topTracks,
  topArtists,
  recentlyPlayed,
  isLocked,
  hasActiveSubscription,
  onPlaylistCreated
}) => {
  const { isSpotifyWhitelisted } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');

  const createAIPlaylist = async () => {
    if (!hasActiveSubscription || isLocked) {
      toast.error('Premium subscription required to create AI playlists');
      return;
    }

    if (!isSpotifyWhitelisted) {
      toast.error('Spotify features are temporarily limited. Please contact support to enable full access.');
      return;
    }

    if (!spotifyAccessToken) {
      toast.error('Please connect your Spotify account to create playlists');
      return;
    }

    // Enhanced check for listening history
    if (!topTracks?.length && !topArtists?.length && !recentlyPlayed?.length) {
      toast.error('You need to have listening history to generate an AI playlist. Please listen to more music on Spotify first.');
      return;
    }

    const seedTracks = topTracks?.slice(0, 5).map(t => t.id) || [];
    const seedArtists = topArtists?.slice(0, 5).map(a => a.id) || [];

    // Fallback to recently played if no top data
    if (seedTracks.length === 0 && seedArtists.length === 0) {
      const recentTracks = recentlyPlayed?.slice(0, 3).map(t => t.id) || [];
      if (recentTracks.length === 0) {
        toast.error('Not enough listening data available. Please listen to more music on Spotify first.');
        return;
      }
      seedTracks.push(...recentTracks);
    }

    setIsCreating(true);
    setPlaylistCreated(false);
    setMessage('Analyzing your music taste...');
    setProgress(10);

    try {
      const currentDate = new Date();
      const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const playlistName = `MyVibe AI Mix – ${monthYear}`;

      setProgress(20);
      setMessage('Creating your personalized playlist...');

      // Create playlist
      const createRes = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: `AI-generated playlist with 100 tracks based on your music taste. Created by MyVibeLyrics on ${currentDate.toLocaleDateString()}. Discover new music that matches your vibe!`,
          public: false,
          collaborative: false
        })
      });

      if (!createRes.ok) {
        const errorData = await createRes.json();
        throw new Error(`Failed to create playlist: ${errorData.error?.message || createRes.status}`);
      }

      const playlist = await createRes.json();
      setProgress(40);
      setMessage('Generating 100 AI-powered recommendations...');

      // Generate recommendations in batches
      const allTracks = [];
      const batchSize = 20;
      const totalBatches = 5;

      for (let batch = 0; batch < totalBatches; batch++) {
        const seedParams = [];
        
        // Use different seeds for variety
        if (seedArtists.length > 0) {
          const artistIndex = batch % seedArtists.length;
          seedParams.push(`seed_artists=${seedArtists[artistIndex]}`);
        }
        
        if (seedTracks.length > 0) {
          const trackIndex = batch % seedTracks.length;
          seedParams.push(`seed_tracks=${seedTracks[trackIndex]}`);
        }

        // Add variety with different audio features
        const audioFeatures = [
          'target_energy=0.8&target_danceability=0.7',
          'target_valence=0.6&target_acousticness=0.3',
          'target_instrumentalness=0.1&target_loudness=-8',
          'target_speechiness=0.1&target_tempo=120',
          'target_liveness=0.2&target_popularity=70'
        ];
        
        const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=${batchSize}&${seedParams.join('&')}&${audioFeatures[batch] || ''}`;
        
        try {
          const recommendationsRes = await fetch(recommendationsUrl, {
            headers: { 
              'Authorization': `Bearer ${spotifyAccessToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (recommendationsRes.ok) {
            const recommendations = await recommendationsRes.json();
            if (recommendations.tracks) {
              allTracks.push(...recommendations.tracks);
            }
          } else {
            console.warn(`Batch ${batch} failed with status:`, recommendationsRes.status);
          }
        } catch (err) {
          console.warn(`Error fetching batch ${batch}:`, err);
        }

        setProgress(40 + (batch + 1) * 8);
      }

      if (allTracks.length === 0) {
        throw new Error('No recommendations received from Spotify. This might be due to limited listening history.');
      }

      setMessage(`Adding ${allTracks.length} tracks to your playlist...`);
      setProgress(85);

      // Remove duplicates
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      );

      // Add tracks to playlist
      const trackUris = uniqueTracks.map(track => track.uri);
      
      const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uris: trackUris.slice(0, 100),
          position: 0
        })
      });

      if (!addTracksRes.ok) {
        const errorData = await addTracksRes.json();
        throw new Error(`Failed to add tracks to playlist: ${errorData.error?.message || addTracksRes.status}`);
      }

      setProgress(100);
      setMessage(`✅ Playlist created with ${Math.min(trackUris.length, 100)} tracks!`);
      setPlaylistUrl(playlist.external_urls.spotify);
      setPlaylistCreated(true);
      
      toast.success(`🎉 "${playlistName}" created with ${Math.min(trackUris.length, 100)} tracks!`, {
        duration: 5000,
        action: {
          label: 'Open in Spotify',
          onClick: () => window.open(playlist.external_urls.spotify, '_blank')
        }
      });

      // Call callback to refresh analytics - DON'T change premium status
      if (onPlaylistCreated) {
        setTimeout(onPlaylistCreated, 2000);
      }
      
    } catch (error: any) {
      console.error('Playlist creation error:', error);
      setProgress(0);
      setMessage('');
      
      if (error.message.includes('session expired') || error.message.includes('401')) {
        toast.error('Your Spotify session has expired. Please reconnect your account.');
      } else if (error.message.includes('403')) {
        toast.error('Spotify access limited. Please contact support for full access.');
      } else {
        toast.error(`Failed to create playlist: ${error.message}`);
      }
    } finally {
      setTimeout(() => {
        if (!playlistCreated) {
          setIsCreating(false);
          setProgress(0);
          setMessage('');
        }
      }, 3000);
    }
  };

  const resetPlaylistCreation = () => {
    setIsCreating(false);
    setProgress(0);
    setMessage('');
    setPlaylistCreated(false);
    setPlaylistUrl('');
  };

  return (
    <Card className="card-hover border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          AI Playlist Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isCreating || playlistCreated) && (
          <div className="space-y-3">
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground flex items-center">
              {playlistCreated && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
              {message}
            </p>
            {playlistCreated && playlistUrl && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open(playlistUrl, '_blank')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Music className="mr-2 h-4 w-4" />
                  Open in Spotify
                </Button>
                <Button
                  onClick={resetPlaylistCreation}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
              </div>
            )}
          </div>
        )}
        
        {!isCreating && !playlistCreated && (
          <>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Uses your top tracks and artists as seeds</p>
              <p>• Generates 100 personalized song recommendations</p>
              <p>• Uses AI to create variety across different moods</p>
              <p>• Saves directly to your Spotify account</p>
            </div>
            
            <Button 
              onClick={createAIPlaylist} 
              disabled={isLocked || !spotifyAccessToken || !hasActiveSubscription || !isSpotifyWhitelisted} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLocked || !hasActiveSubscription ? (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Premium Required
                </>
              ) : !isSpotifyWhitelisted ? (
                'Spotify Access Limited'
              ) : !spotifyAccessToken ? (
                'Connect Spotify First'
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Playlist (100 tracks)
                </>
              )}
            </Button>
          </>
        )}
        
        {!spotifyAccessToken && (
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
            <strong>Note:</strong> Spotify connection required for playlist creation.
          </div>
        )}
        
        {(!hasActiveSubscription || isLocked) && (
          <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
            <strong>Premium Feature:</strong> Upgrade to Premium to unlock AI playlist generation.
          </div>
        )}

        {!isSpotifyWhitelisted && (
          <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md">
            <strong>Limited Access:</strong> Spotify features are temporarily limited. Contact support for full access.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPlaylistGenerator;
