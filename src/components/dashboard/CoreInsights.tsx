import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
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
  const getMostPlayedSong = () => {
    if (recentlyPlayed.length === 0) return null;

    const songCounts = recentlyPlayed.reduce((acc, track) => {
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

    return Object.values(albumCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  };

  const mostPlayedSong = getMostPlayedSong();
  const topAlbums = getTopAlbums();
  const totalListeningMs = recentlyPlayed.reduce((sum, track) => sum + (track.duration_ms || 0), 0);

  const genreFrequency: Record<string, number> = {};
  topArtists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
    });
  });
  const topGenre = Object.entries(genreFrequency).sort(([, a], [, b]) => b - a)[0]?.[0];

  const monthFrequency: Record<string, number> = {};
  recentlyPlayed.forEach(track => {
    if (track.played_at) {
      const date = new Date(track.played_at);
      const month = date.toLocaleString('default', { month: 'short' });
      monthFrequency[month] = (monthFrequency[month] || 0) + 1;
    }
  });
  const mostStreamedMonth = Object.entries(monthFrequency).sort(([, a], [, b]) => b - a)[0]?.[0];

  const chartData = Object.entries(monthFrequency).map(([month, count]) => ({ month, count }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard title="Top Tracks" description="Your most played songs" icon={<Music className="h-5 w-5 text-primary" />} isLocked={false}>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topTracks.slice(0, 10).map((track, index) => (
            <div key={track.id} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artists.map(a => a.name).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard title="Top Artists" description="Your favorite musicians" icon={<User className="h-5 w-5 text-accent" />} isLocked={false}>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topArtists.slice(0, 10).map((artist, index) => (
            <div key={artist.id} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{artist.name}</p>
                <p className="text-xs text-muted-foreground">{artist.followers.total.toLocaleString()} followers</p>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard title="Top Albums" description="Your most played albums" icon={<Album className="h-5 w-5 text-secondary" />} isLocked={false}>
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

      <FeatureCard title="Most Played Song of All Time" description="Your ultimate favorite track" icon={<Heart className="h-5 w-5 text-red-400" />} isLocked={isLocked}>
        {mostPlayedSong && (
          <div className="text-center py-4">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{mostPlayedSong.track?.name}</h3>
            <p className="text-gray-300 text-sm">{mostPlayedSong.track?.artists[0]?.name}</p>
            <p className="text-red-400 text-xs mt-1">{mostPlayedSong.playCount} plays detected</p>
          </div>
        )}
      </FeatureCard>

      <FeatureCard title="Your 2024 Music Journey" description="A rewind of your sonic vibe" icon={<Sparkles className="h-5 w-5 text-yellow-400" />} isLocked={isLocked}>
        <div className="text-center py-4 space-y-3">
          <div>
            <p className="text-white text-sm">You vibed to</p>
            <div className="text-3xl font-bold text-yellow-400">{topTracks.length}</div>
            <p className="text-white text-sm">unique tracks</p>
          </div>

          <div>
            <p className="text-white text-sm">Discovered</p>
            <div className="text-xl font-semibold text-green-400">{topArtists.length}</div>
            <p className="text-gray-300 text-sm">different artists</p>
          </div>

          <div>
            <p className="text-white text-sm">Total Listening Time</p>
            <div className="text-lg font-semibold text-blue-400">{(totalListeningMs / 3600000).toFixed(1)} hrs</div>
          </div>

          <div>
            <p className="text-white text-sm">Top Genre</p>
            <div className="text-md font-medium text-pink-400">{topGenre || 'Unknown'}</div>
          </div>

          <div>
            <p className="text-white text-sm">Most Streamed Month</p>
            <div className="text-md font-medium text-purple-400">{mostStreamedMonth || 'N/A'}</div>
          </div>

          <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400">
            <Calendar className="mr-1 h-3 w-3" />
            2024 Recap
          </Badge>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Bar dataKey="count" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default CoreInsights;