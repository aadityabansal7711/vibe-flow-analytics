import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, SkipForward, RotateCcw, Target, Activity, Music, Mic2 } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface ListeningBehaviorProps {
  topTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
}

const ListeningBehavior: React.FC<ListeningBehaviorProps> = ({ topTracks, recentlyPlayed, isLocked }) => {
  // Time preference analysis
  const getTimePreference = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      plays: 0,
      label: i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i - 12}PM`
    }));

    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const hour = new Date(track.played_at).getHours();
        hourlyData[hour].plays++;
      }
    });

    const morningCount = hourlyData.slice(6, 12).reduce((sum, h) => sum + h.plays, 0);
    const afternoonCount = hourlyData.slice(12, 18).reduce((sum, h) => sum + h.plays, 0);
    const eveningCount = hourlyData.slice(18, 24).reduce((sum, h) => sum + h.plays, 0) + 
                          hourlyData.slice(0, 6).reduce((sum, h) => sum + h.plays, 0);

    let preference = 'Morning Listener';
    if (eveningCount > morningCount && eveningCount > afternoonCount) preference = 'Night Owl';
    else if (afternoonCount > morningCount) preference = 'Afternoon Vibes';

    return { preference, data: hourlyData.filter(h => h.plays > 0) };
  };

  // Weekday vs Weekend
  const getWeekdayPreference = () => {
    let weekdayCount = 0, weekendCount = 0;
    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const day = new Date(track.played_at).getDay();
        if (day === 0 || day === 6) weekendCount++;
        else weekdayCount++;
      }
    });
    return weekendCount > weekdayCount ? 'Weekend Warrior' : 'Weekday Warrior';
  };

  const getListeningStreak = () => {
    const dates = new Set(
      recentlyPlayed.map(track => new Date(track.played_at || '').toDateString())
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const check = new Date(today);
      check.setDate(today.getDate() - i);
      if (dates.has(check.toDateString())) streak++;
      else break;
    }
    return streak || 1;
  };

  const getSkipRate = () => {
    const avgPopularity = topTracks.reduce((sum, t) => sum + (t.popularity || 50), 0) / topTracks.length;
    return Math.round(100 - avgPopularity);
  };

  const getReplayScore = () => {
    const ids = recentlyPlayed.map(t => t.id);
    const unique = new Set(ids).size;
    const replayRatio = ((ids.length - unique) / ids.length) * 100;
    return Math.max(10, Math.min(100, Math.round(replayRatio + 50)));
  };

  const getDiscoveryScore = () => {
    const artists = recentlyPlayed.map(t => t.artists[0]?.name);
    const unique = new Set(artists).size;
    return Math.round(Math.min(10, (unique / recentlyPlayed.length) * 10 + 5) * 10) / 10;
  };

  const favoriteArtist = (() => {
    const freq: Record<string, number> = {};
    recentlyPlayed.forEach(t => {
      const artist = t.artists[0]?.name;
      if (artist) freq[artist] = (freq[artist] || 0) + 1;
    });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'Unknown';
  })();

  const avgDuration = (() => {
    const durations = recentlyPlayed.map(t => t.duration_ms || 0);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    return Math.round(avg / 1000);
  })();

  const timeData = getTimePreference();
  const weekdayPreference = getWeekdayPreference();
  const listeningStreak = getListeningStreak();
  const skipRate = getSkipRate();
  const replayScore = getReplayScore();
  const discoveryScore = getDiscoveryScore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard
        title="Time of Day Preference"
        description="Morning vs Night listening"
        icon={<Clock className="h-5 w-5 text-orange-400" />}
        isLocked={isLocked}
        className="md:col-span-2"
      >
        <div className="mb-4">
          <Badge variant="outline" className="text-orange-400 border-orange-400">
            {timeData.preference}
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={timeData.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="plays" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </FeatureCard>

      <FeatureCard
        title="Weekday vs Weekend"
        description="Listening pattern differences"
        icon={<Calendar className="h-5 w-5 text-indigo-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <Badge variant="outline" className="text-indigo-400 border-indigo-400 mb-4">
            {weekdayPreference}
          </Badge>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Listening Streaks"
        description="Consecutive days of listening"
        icon={<Activity className="h-5 w-5 text-red-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-red-400 mb-2">{listeningStreak}</div>
          <p className="text-white">Day streak</p>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Skips vs Completions"
        description="Songs played vs skipped"
        icon={<SkipForward className="h-5 w-5 text-orange-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-orange-400 mb-2">{skipRate}%</div>
          <p className="text-white">Skip rate (estimated)</p>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Replay Value Score"
        description="How often you replay songs"
        icon={<RotateCcw className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-green-400 mb-2">{replayScore}/100</div>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Discovery Score"
        description="New artist/song discovery ratio"
        icon={<Target className="h-5 w-5 text-cyan-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-cyan-400 mb-2">{discoveryScore}/10</div>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Most Frequent Artist"
        description="Your most heard artist"
        icon={<Mic2 className="h-5 w-5 text-purple-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-xl font-bold text-purple-400">{favoriteArtist}</div>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Average Track Duration"
        description="Average length of tracks played"
        icon={<Music className="h-5 w-5 text-pink-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-xl font-bold text-pink-400">{avgDuration} sec</div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default ListeningBehavior;
