
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Zap, Moon, TrendingUp } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  preview_url?: string;
  external_urls: { spotify: string };
  uri: string;
  played_at?: string;
  duration_ms?: number;
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

interface SpecialHighlightsProps {
  spotifyAccessToken: string;
  spotifyUserId: string;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
}

const SpecialHighlights: React.FC<SpecialHighlightsProps> = ({
  spotifyAccessToken,
  spotifyUserId,
  topTracks,
  recentlyPlayed,
  isLocked,
  hasActiveSubscription
}) => {
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const getHiddenGem = () => {
    if (topTracks.length === 0) return null;
    
    // Find tracks with low popularity but in user's top tracks
    const hiddenGems = topTracks.filter(track => track.popularity < 50);
    if (hiddenGems.length === 0) return topTracks[topTracks.length - 1];
    
    return hiddenGems[0];
  };

  const getLateNightTracks = () => {
    if (recentlyPlayed.length === 0) return [];
    
    // Filter tracks played between 10PM and 6AM
    return recentlyPlayed.filter(track => {
      if (!track.played_at) return false;
      const hour = new Date(track.played_at).getHours();
      return hour >= 22 || hour <= 6;
    }).slice(0, 3);
  };

  const handleGeneratePlaylist = async () => {
    if (!spotifyAccessToken || !spotifyUserId) return;
    setCreatingPlaylist(true);

    const uniqueSorted = Array.from(
      new Map(topTracks.map(t => [t.name + t.artists[0]?.name, t])).values()
    ).sort((a, b) => b.popularity - a.popularity).slice(0, 50);

    // 1. Create playlist
    const createRes = await fetch(
      `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'MyVibeLytics AI Playlist',
          public: false,
          description: 'Generated with MyVibeLytics'
        })
      }
    );
    if (!createRes.ok) {
      alert('Failed to create playlist.');
      setCreatingPlaylist(false);
      return;
    }
    const playlist = await createRes.json();
    const playlistId = playlist.id;

    // 2. Add tracks
    const uris = uniqueSorted.map(t => t.uri);
    const addRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris })
      }
    );

    setCreatingPlaylist(false);
    if (addRes.ok) {
      alert('🎉 Playlist created successfully! Check your library.');
    } else {
      alert('Failed to add tracks. Check your Spotify permissions.');
    }
  };

  const hiddenGem = getHiddenGem();
  const lateNightTracks = getLateNightTracks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Playlist Generator */}
      <FeatureCard
        title="Make Playlist from Listening"
        description="AI-generated playlists based on your taste"
        icon={<Music className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="space-y-4">
          <Button
            onClick={handleGeneratePlaylist}
            disabled={!hasActiveSubscription || creatingPlaylist}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {creatingPlaylist ? 'Creating...' : 'Generate AI Playlist'}
          </Button>
        </div>
      </FeatureCard>

      {/* Hidden Gem Discovery */}
      <FeatureCard
        title="Hidden Gem Discovery"
        description="Underrated tracks you love"
        icon={<Zap className="h-5 w-5 text-yellow-400" />}
        isLocked={isLocked}
      >
        {hiddenGem && (
          <div className="text-center py-4">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{hiddenGem.name}</h3>
            <p className="text-gray-300 text-sm">{hiddenGem.artists[0]?.name}</p>
            <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400">
              Popularity: {hiddenGem.popularity}%
            </Badge>
          </div>
        )}
      </FeatureCard>

      {/* Late Night Repeat Offenders */}
      <FeatureCard
        title="Late Night Repeat Offenders"
        description="Your midnight music choices"
        icon={<Moon className="h-5 w-5 text-blue-400" />}
        isLocked={isLocked}
      >
        <div className="space-y-2">
          {lateNightTracks.length > 0 ? (
            lateNightTracks.map((track, index) => (
              <div key={track.id} className="flex items-center space-x-2">
                <Moon className="h-4 w-4 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{track.name}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artists[0]?.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No late night tracks detected</p>
          )}
        </div>
      </FeatureCard>

      {/* Sleeper Hits */}
      <FeatureCard
        title="Sleeper Hits"
        description="Songs growing in your rotation"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
          <h3 className="text-white font-semibold">Coming Soon</h3>
          <p className="text-gray-300 text-sm">Track trend analysis</p>
        </div>
      </FeatureCard>
    </div>
  );
};

export default SpecialHighlights;
