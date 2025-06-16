import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, User, Album, Heart, Sparkles, Calendar } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const getMostRepeatedInRecent = () => {
    if (recentlyPlayed.length === 0) return null;

    const songCounts = recentlyPlayed.slice(0, 50).reduce((acc, track) => {
      const key = `${track.name}-${track.artists[0]?.name}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPlayed = Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0];
    const track = recentlyPlayed.find(t => `${t.name}-${t.artists[0]?.name}` === mostPlayed[0]);

    return { track, playCount: mostPlayed[1] };
  };

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

  const getMonthlyPlayData = () => {
    const monthlyCounts: { [key: string]: number } = {};
    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const date = new Date(track.played_at);
        const key = date.toLocaleString('default', { month: 'short' });
        monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
      }
    });

    return Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      plays: count
    }));
  };

  const mostRepeatedRecent = getMostRepeatedInRecent();
  const topAlbums = getTopAlbums();
  const monthlyPlayData = getMonthlyPlayData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Top Tracks */}
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

      {/* Top Artists */}
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

      {/* Top Albums */}
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

      {/* Top Track in Last 50 */}
      <FeatureCard
        title="Top Track (Last 50 Songs)"
        description="Your most repeated recent song"
        icon={<Heart className="h-5 w-5 text-red-400" />}
        isLocked={isLocked}
      >
        {mostRepeatedRecent && (
          <div className="text-center py-4">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{mostRepeatedRecent.track?.name}</h3>
            <p className="text-gray-300 text-sm">{mostRepeatedRecent.track?.artists[0]?.name}</p>
            <p className="text-red-400 text-xs mt-1">{mostRepeatedRecent.playCount} plays detected</p>
          </div>
        )}
      </FeatureCard>

      {/* Your 2024 Music Journey */}
      <FeatureCard
        title="Your 2024 Music Journey"
        description="A rewind of your sonic vibe"
        icon={<Sparkles className="h-5 w-5 text-yellow-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4 space-y-3">
          <div className="text-3xl font-bold text-yellow-400">{topTracks.length}</div>
          <p className="text-white">Top tracks discovered</p>
          <div className="text-xl font-semibold text-green-400">{topArtists.length}</div>
          <p className="text-gray-300 text-sm">Artists in rotation</p>
          <p className="text-xs text-muted-foreground mt-2">Total Listening Time: {(recentlyPlayed.length * 3).toFixed(0)} min</p>
          <p className="text-xs text-muted-foreground">Top Genre: Pop (sample)</p>
        </div>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyPlayData}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="plays" fill="#facc15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FeatureCard>
    </div>
  );
};

export default CoreInsights;
