
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, User, Album, Heart, Sparkles, Calendar } from 'lucide-react';
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

interface CoreInsightsProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
}

const CoreInsights: React.FC<CoreInsightsProps> = ({ topTracks, topArtists, recentlyPlayed, isLocked }) => {
  // Find most played song of all time (using play count proxy via recently played frequency)
  const getMostPlayedSong = () => {
    if (topTracks.length === 0 && recentlyPlayed.length === 0) return null;

    // Use topTracks[0] if available (Spotify's long-term ranking)
    const mostPlayedTopTrack = topTracks[0];

    if (!mostPlayedTopTrack) return null;

    // Estimate recent play count from recentlyPlayed
    const recentCount = recentlyPlayed.filter(
      t => t.name === mostPlayedTopTrack.name && t.artists[0]?.name === mostPlayedTopTrack.artists[0]?.name
    ).length;

    return {
      track: mostPlayedTopTrack,
      playCount: `${recentCount}+ plays (recent only)`,
    };
  };

  // Get top albums from top tracks
  const getTopAlbums = () => {
    const albumCounts = topTracks.reduce((acc, track) => {
      const albumKey = track.album.name;
      if (!acc[albumKey]) {
        acc[albumKey] = {
          name: track.album.name,
          artist: track.artists[0]?.name,
          image: track.album.images[0]?.url,
          count: 0
        };
      }
      acc[albumKey].count++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(albumCounts).sort((a: any, b: any) => b.count - a.count).slice(0, 5);
  };

  const mostPlayedSong = getMostPlayedSong();
  const topAlbums = getTopAlbums();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Top Tracks - Free */}
      <FeatureCard
        title="Top Tracks"
        description="Your most played songs"
        icon={<Music className="h-5 w-5 text-primary" />}
        isLocked={false}
      >
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topTracks.slice(0, 10).map((track, index) => (
            <div key={track.id} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Top Artists - Free */}
      <FeatureCard
        title="Top Artists"
        description="Your favorite musicians"
        icon={<User className="h-5 w-5 text-accent" />}
        isLocked={false}
      >
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topArtists.slice(0, 10).map((artist, index) => (
            <div key={artist.id} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{artist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {artist.followers.total.toLocaleString()} followers
                </p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Top Albums - Free */}
      <FeatureCard
        title="Top Albums"
        description="Your most played albums"
        icon={<Album className="h-5 w-5 text-secondary" />}
        isLocked={false}
      >
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topAlbums.map((album, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center text-xs font-bold text-secondary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{album.name}</p>
                <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Most Played Song of All Time - Premium */}
      <FeatureCard
        title="Most Played Song of All Time"
        description="Your ultimate favorite track"
        icon={<Heart className="h-5 w-5 text-red-400" />}
        isLocked={isLocked}
      >
        {mostPlayedSong && (
          <div className="text-center py-4">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{mostPlayedSong.track?.name}</h3>
            <p className="text-gray-300 text-sm">{mostPlayedSong.track?.artists[0]?.name}</p>
            <p className="text-red-400 text-xs mt-1">{mostPlayedSong.playCount}</p>
          </div>
        )}
      </FeatureCard>

      {/* Wrapped in 2024 Music - Premium */}
      <FeatureCard
        title="Your 2024 Wrapped"
        description="Year in music summary"
        icon={<Sparkles className="h-5 w-5 text-yellow-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{topTracks.length}</div>
          <p className="text-white">Top tracks discovered</p>
          <div className="text-xl font-semibold text-green-400 mt-2">{topArtists.length}</div>
          <p className="text-gray-300 text-sm">Artists in rotation</p>
          <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400">
            <Calendar className="mr-1 h-3 w-3" />
            2024 Stats
          </Badge>
        </div>
      </FeatureCard>
    </div>
  );
};

export default CoreInsights;
