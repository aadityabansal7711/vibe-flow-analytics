
import React, { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, MessageCircle, UserPlus, CheckCircle, Music, Zap } from 'lucide-react';
import { toast } from 'sonner';
import ChatModal from '@/components/chat/ChatModal';

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
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const createAIPlaylist = async () => {
    if (!hasActiveSubscription || isLocked) {
      toast.error('Premium subscription required to create AI playlists');
      return;
    }

    if (!spotifyAccessToken) {
      toast.error('Please connect your Spotify account to create playlists');
      return;
    }

    if (topTracks.length === 0 && topArtists.length === 0 && recentlyPlayed.length === 0) {
      toast.error('Not enough listening data available. Please listen to more music on Spotify first.');
      return;
    }

    setIsCreating(true);
    setPlaylistCreated(false);
    setMessage('Analyzing your music taste...');
    setProgress(10);

    try {
      // Step 1: Prepare seeds from user's data
      const availableArtists = topArtists.length > 0 ? topArtists : [];
      const availableTracks = topTracks.length > 0 ? topTracks : recentlyPlayed.slice(0, 5);
      
      let artistSeeds = '';
      let trackSeeds = '';
      
      if (availableArtists.length > 0) {
        artistSeeds = availableArtists.slice(0, 2).map(a => a.id).join(',');
      }
      
      if (availableTracks.length > 0) {
        trackSeeds = availableTracks.slice(0, 3).map(t => t.id).join(',');
      }

      if (!artistSeeds && !trackSeeds) {
        throw new Error('Unable to generate recommendations - insufficient data');
      }

      setProgress(30);
      setMessage('Fetching AI-powered recommendations...');

      // Step 2: Get recommendations from Spotify
      const seedParams = [];
      if (artistSeeds) seedParams.push(`seed_artists=${artistSeeds}`);
      if (trackSeeds) seedParams.push(`seed_tracks=${trackSeeds}`);
      
      const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=50&${seedParams.join('&')}`;
      
      const recommendationsRes = await fetch(recommendationsUrl, {
        headers: { 
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!recommendationsRes.ok) {
        if (recommendationsRes.status === 401) {
          throw new Error('Spotify session expired. Please reconnect your account.');
        }
        throw new Error(`Failed to get recommendations: ${recommendationsRes.status}`);
      }

      const recommendations = await recommendationsRes.json();

      if (!recommendations.tracks || recommendations.tracks.length === 0) {
        throw new Error('No recommendations received from Spotify. Try again later.');
      }

      setProgress(60);
      setMessage('Creating your personalized playlist...');

      // Step 3: Create playlist
      const currentDate = new Date();
      const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const playlistName = `MyVibe AI Mix – ${monthYear}`;
      
      const createRes = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: `AI-generated playlist based on your music taste. Created by MyVibeLyrics on ${currentDate.toLocaleDateString()}. Discover new music that matches your vibe!`,
          public: false,
          collaborative: false
        })
      });

      if (!createRes.ok) {
        if (createRes.status === 401) {
          throw new Error('Spotify session expired. Please reconnect your account.');
        }
        throw new Error(`Failed to create playlist: ${createRes.status}`);
      }

      const playlist = await createRes.json();

      setProgress(80);
      setMessage('Adding tracks to your playlist...');

      // Step 4: Add tracks to playlist
      const trackUris = recommendations.tracks.map((track: any) => track.uri);
      
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
        throw new Error(`Failed to add tracks to playlist: ${addTracksRes.status}`);
      }

      setProgress(100);
      setMessage('✅ Playlist created successfully!');
      setPlaylistUrl(playlist.external_urls.spotify);
      setPlaylistCreated(true);
      
      toast.success(`🎉 "${playlistName}" created with ${trackUris.length} tracks!`, {
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
      } else if (error.message.includes('insufficient data')) {
        toast.error('Please listen to more music on Spotify to improve AI recommendations.');
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
    <>
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
                Create personalized playlists using advanced AI based on your listening habits
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
                    <p>• Generates 50 personalized song recommendations</p>
                    <p>• Saves directly to your Spotify account</p>
                    <p>• Updates monthly with fresh discoveries</p>
                  </div>
                  
                  <Button 
                    onClick={createAIPlaylist} 
                    disabled={isLocked || !spotifyAccessToken || !hasActiveSubscription} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105"
                  >
                    {isLocked || !hasActiveSubscription ? (
                      'Premium Required'
                    ) : !spotifyAccessToken ? (
                      'Connect Spotify First'
                    ) : (
                      'Generate AI Playlist'
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
            </CardContent>
          </Card>

          {/* Community Chat */}
          <Card className="card-hover border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                Community Chat
              </CardTitle>
              <CardDescription>
                Connect with music lovers worldwide - Free for everyone!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm p-3 bg-muted/50 rounded-md border-l-2 border-green-400">
                    <strong>🎶 LofiVibes:</strong> Just discovered an amazing chill-hop track! Anyone else into ambient beats?
                  </div>
                  <div className="text-sm p-3 bg-muted/50 rounded-md border-l-2 border-blue-400">
                    <strong>🔥 MusicLover:</strong> The new indie releases this month are incredible! Drop your favorites 👇
                  </div>
                  <div className="text-sm p-3 bg-muted/50 rounded-md border-l-2 border-purple-400">
                    <strong>🌟 VinyBot:</strong> Looking for underrated artists in electronic music. Help me discover!
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Available Chat Rooms:</strong></p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>"Top Tracks Talk" - Share your current favorites</li>
                      <li>"Mood Check" - Music for every emotion</li>
                      <li>"Now Playing" - Real-time listening sessions</li>
                      <li>"Vibe Swap" - Discover new genres together</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => setIsChatOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Join Community Chat</span>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      🎉 <strong>Free for all users!</strong> Create your username and start connecting
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ✨ Find friends by username • Real-time messaging • Music-focused discussions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default SpecialHighlights;
