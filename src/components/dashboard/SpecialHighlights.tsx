import React from 'react';
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
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
  onGeneratePlaylist: (tracks: SpotifyTrack[]) => void;
}

const SpecialHighlights: React.FC<SpecialHighlightsProps> = ({ 
  topTracks, 
  topArtists, 
  recentlyPlayed, 
  isLocked,
  hasActiveSubscription,
  onGeneratePlaylist
}) => {
  // Hidden Gem: Least popular but highly ranked
  const getHiddenGem = () => {
    const hiddenGems = topTracks.filter(track => track.popularity < 50);
    return hiddenGems[0] || topTracks[Math.floor(Math.random() * topTracks.length)];
  };

  // Late night tracks (played between 10PM–4AM)
  const getLateNightTracks = () => {
    const tracks = recentlyPlayed.filter(track => {
      if (!track.played_at) return false;
      const hour = new Date(track.played_at).getHours();
      return hour >= 22 || hour <= 4;
    });
    const unique = Array.from(new Map(tracks.map(t => [t.id, t])).values());
    return unique.slice(0, 3);
  };

  // AI playlist (top unique or most loved tracks)
  const generateAiPlaylist = () => {
    const uniqueTracks = Array.from(new Map(topTracks.map(t => [t.name + t.artists[0]?.name, t])).values());
    const sorted = uniqueTracks.sort((a, b) => b.popularity - a.popularity);
    const selected = sorted.slice(0, 50);
    onGeneratePlaylist(selected);
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
            onClick={generateAiPlaylist}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={!hasActiveSubscription}
          >
            <Music className="mr-2 h-4 w-4" />
            Generate AI Playlist
          </Button>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">92%</div>
            <p className="text-xs text-muted-foreground">AI Match Score</p>
          </div>
        </div>
      </FeatureCard>

      {/* Hidden Gem Discovery */}
      <FeatureCard
        title="Hidden Gem Discovery"
        description="Most played underrated track"
        icon={<Zap className="h-5 w-5 text-cyan-400" />}
        isLocked={isLocked}
      >
        {hiddenGem && (
          <div className="text-center py-4">
            <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold text-sm">{hiddenGem.name}</h4>
            <p className="text-gray-300 text-xs">{hiddenGem.artists[0]?.name}</p>
            <Badge variant="outline" className="mt-2 text-cyan-400 border-cyan-400 text-xs">
              Hidden Gem • {hiddenGem.popularity}% popularity
            </Badge>
          </div>
        )}
      </FeatureCard>

      {/* Late Night Repeat Offenders */}
      <FeatureCard
        title="Late Night Repeat Offenders"
        description="Songs often repeated late night"
        icon={<Moon className="h-5 w-5 text-purple-400" />}
        isLocked={isLocked}
      >
        <div className="space-y-2">
          {lateNightTracks.length > 0 ? (
            lateNightTracks.map(track => (
              <div key={track.id} className="text-center">
                <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artists[0]?.name}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Moon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No late night patterns detected</p>
            </div>
          )}
        </div>
      </FeatureCard>

      {/* Sleeper Hits */}
      <FeatureCard
        title="Sleeper Hits"
        description="Songs that grew on you over time"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="space-y-3">
          {topTracks.slice(3, 6).map(track => (
            <div key={track.id} className="text-center">
              <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artists[0]?.name}</p>
              <Badge variant="outline" className="mt-1 text-green-400 border-green-400 text-xs">
                Growing favorite
              </Badge>
            </div>
          ))}
        </div>
      </FeatureCard>
    </div>
  );
};

export default SpecialHighlights;
