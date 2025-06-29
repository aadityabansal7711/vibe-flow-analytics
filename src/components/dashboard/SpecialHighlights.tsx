
import React, { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, MessageCircle, CheckCircle, Music, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  preview_url?: string;
  external_urls: { spotify: string };
  uri: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  followers: { total: number };
  images: { url: string }[];
  popularity: number;
  external_urls: { spotify: string };
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
  hasActiveSubscription,
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

      // Create playlist first
      const createRes = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: `AI-generated playlist with 50+ unique tracks based on your music taste. Created by MyVibeLyrics on ${currentDate.toLocaleDateString()}. Discover new music that matches your vibe!`,
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
      setMessage('Generating 50+ AI-powered unique recommendations...');

      // Generate multiple batches of recommendations with more variety
      const allTracks = new Map(); // Use Map to ensure uniqueness by track ID
      const batchSize = 20;
      const totalBatches = 5;

      for (let batch = 0; batch < totalBatches; batch++) {
        const seedParams = [];
        
        // Rotate seeds for variety and use different combinations
        if (seedArtists.length > 0) {
          const artistIndex1 = batch % seedArtists.length;
          const artistIndex2 = (batch + 1) % seedArtists.length;
          if (artistIndex1 !== artistIndex2 && seedArtists.length > 1) {
            seedParams.push(`seed_artists=${seedArtists[artistIndex1]},${seedArtists[artistIndex2]}`);
          } else {
            seedParams.push(`seed_artists=${seedArtists[artistIndex1]}`);
          }
        }
        
        if (seedTracks.length > 0 && batch < 3) { // Use tracks as seeds only for first 3 batches
          const trackIndex = batch % seedTracks.length;
          seedParams.push(`seed_tracks=${seedTracks[trackIndex]}`);
        }

        // Add genre seeds for more variety
        const genres = ['pop', 'rock', 'indie', 'electronic', 'hip-hop', 'alternative', 'folk', 'jazz', 'classical', 'r-n-b'];
        const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 2);
        if (batch >= 3) { // Use genre seeds for later batches
          seedParams.push(`seed_genres=${randomGenres.join(',')}`);
        }

        // Enhanced audio features with more variation
        const audioFeatures = [
          'target_energy=0.8&target_danceability=0.7&target_valence=0.6',
          'target_energy=0.6&target_acousticness=0.4&target_valence=0.8',
          'target_energy=0.9&target_loudness=-6&target_tempo=130',
          'target_speechiness=0.1&target_instrumentalness=0.2&target_popularity=60',
          'target_liveness=0.3&target_danceability=0.8&target_energy=0.7'
        ];
        
        const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=${batchSize}&${seedParams.join('&')}&${audioFeatures[batch] || ''}&market=US`;
        
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
              // Add tracks to Map to ensure uniqueness
              recommendations.tracks.forEach((track: SpotifyTrack) => {
                if (!allTracks.has(track.id)) {
                  allTracks.set(track.id, track);
                }
              });
            }
          }
        } catch (err) {
          console.warn(`Error fetching batch ${batch}:`, err);
        }

        setProgress(40 + (batch + 1) * 8);
      }

      const uniqueTracks = Array.from(allTracks.values());

      if (uniqueTracks.length === 0) {
        throw new Error('No recommendations received from Spotify.');
      }

      setMessage(`Adding ${uniqueTracks.length} unique tracks to your playlist...`);
      setProgress(85);

      // Add tracks to playlist
      const trackUris = uniqueTracks.map(track => track.uri);
      
      const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uris: trackUris,
          position: 0
        })
      });

      if (!addTracksRes.ok) {
        const errorData = await addTracksRes.json();
        throw new Error(`Failed to add tracks to playlist: ${errorData.error?.message || addTracksRes.status}`);
      }

      setProgress(100);
      setMessage(`✅ Playlist created with ${uniqueTracks.length} unique tracks!`);
      setPlaylistUrl(playlist.external_urls.spotify);
      setPlaylistCreated(true);
      
      toast.success(`🎉 "${playlistName}" created with ${uniqueTracks.length} unique tracks!`, {
        duration: 5000,
        action: {
          label: 'Open in Spotify',
          onClick: () => window.open(playlist.external_urls.spotify, '_blank')
        }
      });
      
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
          <Zap className="mr-3 h-8 w-8 text-primary" />
          Special Features
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Premium AI-powered tools and community features to enhance your music experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Playlist Generator */}
        <Card className="card-hover border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
              AI Playlist Generator
            </CardTitle>
            <CardDescription>
              Create personalized playlists with 50+ unique tracks using advanced AI based on your listening habits
            </CardDescription>
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
                  <p>• Generates 50+ unique personalized recommendations</p>
                  <p>• Uses AI to create variety across different moods</p>
                  <p>• Ensures track uniqueness with advanced filtering</p>
                  <p>• Saves directly to your Spotify account</p>
                  <p>• Updates monthly with fresh discoveries</p>
                </div>
                
                <Button 
                  onClick={createAIPlaylist} 
                  disabled={isLocked || !spotifyAccessToken || !hasActiveSubscription || !isSpotifyWhitelisted} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLocked || !hasActiveSubscription ? (
                    'Premium Required'
                  ) : !isSpotifyWhitelisted ? (
                    'Spotify Access Limited'
                  ) : !spotifyAccessToken ? (
                    'Connect Spotify First'
                  ) : (
                    'Generate AI Playlist (50+ unique tracks)'
                  )}
                </Button>
              </>
            )}
            
            {!spotifyAccessToken && (
              <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
                <strong>Note:</strong> Spotify connection required for playlist creation. 
                Connect your account in the dashboard settings.
              </div>
            )}
            
            {(!hasActiveSubscription || isLocked) && (
              <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                <strong>Premium Feature:</strong> Upgrade to Premium to unlock AI playlist generation 
                and get unlimited personalized recommendations.
              </div>
            )}

            {!isSpotifyWhitelisted && (
              <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md">
                <strong>Limited Access:</strong> Spotify features are temporarily limited. Contact support for full access.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Chat - Coming Soon */}
        <Card className="card-hover border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
              MyVibeLytics Community
            </CardTitle>
            <CardDescription>
              Connect with music lovers worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Community Chat</h3>
              <p className="text-lg font-semibold text-muted-foreground">Coming Soon!</p>
              <p className="text-sm text-muted-foreground mt-4 max-w-sm mx-auto">
                Connect with fellow music enthusiasts, share discoveries, and discuss your favorite tracks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpecialHighlights;
