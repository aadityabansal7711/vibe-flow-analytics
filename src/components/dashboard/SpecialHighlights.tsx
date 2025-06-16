import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Zap, Moon, TrendingUp } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

// ... SpotifyTrack and SpotifyArtist interfaces remain unchanged

interface SpecialHighlightsProps {
  // include spotifyAccessToken & spotifyUserId
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

  const getHiddenGem = /* unchanged */;

  const getLateNightTracks = /* unchanged */;

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
      {/* ... same as before ... */}

      {/* Late Night Repeat Offenders */}
      {/* ... same as before ... */}

      {/* Sleeper Hits */}
      {/* ... same as before ... */}
    </div>
  );
};

export default SpecialHighlights;
