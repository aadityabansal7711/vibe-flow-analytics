import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, SkipForward, RotateCcw, Target, Activity } from 'lucide-react';
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
  const getTimePreference = () => {
    if (recentlyPlayed.length === 0) return { preference: 'No Data', data: [] };

    const timeSlots = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0,
      'Late Night': 0,
    };

    const hourlyData = [
      { label: 'Morning', plays: 0 },
      { label: 'Afternoon', plays: 0 },
      { label: 'Evening', plays: 0 },
      { label: 'Night', plays: 0 },
      { label: 'Late Night', plays: 0 },
    ];

    recentlyPlayed.forEach(track => {
      if (!track.played_at) return;
      const hour = new Date(track.played_at).getHours();
      if (hour >= 6 && hour < 12) {
        timeSlots.Morning++;
        hourlyData[0].plays++;
      } else if (hour >= 12 && hour < 16) {
        timeSlots.Afternoon++;
        hourlyData[1].plays++;
      } else if (hour >= 16 && hour < 20) {
        timeSlots.Evening++;
        hourlyData[2].plays++;
      } else if (hour >= 20 && hour < 24) {
        timeSlots.Night++;
        hourlyData[3].plays++;
      } else {
        timeSlots['Late Night']++;
        hourlyData[4].plays++;
      }
    });

    const preference = Object.entries(timeSlots).reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0];

    return { preference, data: hourlyData };
  };

  const getWeekdayPreference = () => {
    if (recentlyPlayed.length === 0) return 'No Data';

    let weekday = 0;
    let weekend = 0;

    recentlyPlayed.forEach(track => {
      if (!track.played_at) return;
      const day = new Date(track.played_at).getDay();
      if (day === 0 || day === 6) weekend++;
      else weekday++;
    });

    return weekend > weekday ? 'Weekend Warrior' : 'Weekday Warrior';
  };

  const getListeningStreak = () => {
    if (recentlyPlayed.length === 0) return 0;
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const listened = recentlyPlayed.some(track => {
        if (!track.played_at) return false;
        return new Date(track.played_at).toDateString() === checkDate.toDateString();
      });
      if (listened) streak++;
      else break;
    }
    return streak || 1;
  };

  const getSkipRate = () => {
    if (topTracks.length === 0) return 20;
    const avgPopularity = topTracks.reduce((sum, t) => sum + t.popularity, 0) / topTracks.length;
    return Math.max(5, Math.min(50, 100 - avgPopularity));
  };

  const getReplayScore = () => {
    if (topTracks.length === 0) return 60;
    const unique = new Set(topTracks.map(t => t.id)).size;
    const replay = ((topTracks.length - unique) / topTracks.length) * 100;
    return Math.round(replay + 40);
  };

  const getDiscoveryScore = () => {
    if (recentlyPlayed.length === 0) return 6.5;
    const uniqueArtists = new Set(recentlyPlayed.map(t => t.artists[0]?.name)).size;
    return Math.round((uniqueArtists / recentlyPlayed.length) * 10 * 10) / 10;
  };

  const getFrequentArtist = () => {
    const artistCount: { [key: string]: number } = {};
    recentlyPlayed.forEach(track => {
      const name = track.artists[0]?.name || 'Unknown';
      artistCount[name] = (artistCount[name] || 0) + 1;
    });
    return Object.entries(artistCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const getAverageDuration = () => {
    if (recentlyPlayed.length === 0) return 0;
    const total = recentlyPlayed.reduce((sum, t) => sum + (t.duration_ms || 0), 0);
    return Math.round(total / recentlyPlayed.length / 1000);
  };

  const timeData = getTimePreference();
  const weekdayPref = getWeekdayPreference();
  const streak = getListeningStreak();
  const skip = getSkipRate();
  const replay = getReplayScore();
  const discover = getDiscoveryScore();
  const frequentArtist = getFrequentArtist();
  const avgDuration = getAverageDuration();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <FeatureCard
        title="Time of Day Preference"
        description="When you listen the most"
        icon={<Clock className="h-4 w-4 text-yellow-400" />}
        isLocked={isLocked}
      >
        <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-3">
          {timeData.preference}
        </Badge>
        <ResponsiveContainer width="100%" height={160}>
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
        description="Your listening pattern"
        icon={<Calendar className="h-4 w-4 text-purple-400" />}
        isLocked={isLocked}
      >
        <Badge variant="outline" className="text-purple-400 border-purple-400 mb-3">
          {weekdayPref}
        </Badge>
      </FeatureCard>

      <FeatureCard
        title="Listening Streak"
        description="Days in a row"
        icon={<Activity className="h-4 w-4 text-red-400" />}
        isLocked={isLocked}
      >
        <div className="text-center text-2xl font-bold text-red-400">{streak} days</div>
      </FeatureCard>

      <FeatureCard
        title="Skips vs Completions"
        description="Estimated skip rate"
        icon={<SkipForward className="h-4 w-4 text-orange-400" />}
        isLocked={isLocked}
      >
        <div className="text-center text-xl text-orange-400 font-semibold">{skip}% Skip Rate</div>
      </FeatureCard>

      <FeatureCard
        title="Replay Value"
        description="How much you repeat"
        icon={<RotateCcw className="h-4 w-4 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center text-xl text-green-400 font-semibold">{replay}/100</div>
      </FeatureCard>

      <FeatureCard
        title="Discovery Score"
        description="How open you are to new music"
        icon={<Target className="h-4 w-4 text-cyan-400" />}
        isLocked={isLocked}
      >
        <div className="text-center text-xl text-cyan-400 font-semibold">{discover}/10</div>
      </FeatureCard>

      <FeatureCard
        title="Most Frequent Artist"
        description="Your most played artist recently"
        icon={<Clock className="h-4 w-4 text-indigo-400" />}
        isLocked={isLocked}
      >
        <div className="text-center text-lg text-indigo-400 font-medium">{frequentArtist}</div>
      </FeatureCard>

      <FeatureCard
        title="Average Song Duration"
        description="Your average song length"
        icon={<Clock className="h-4 w-4 text-white" />}
        isLocked={isLocked}
      >
        <div className="text-center text-lg text-white font-medium">{avgDuration} sec</div>
      </FeatureCard>
    </div>
  );
};

export default ListeningBehavior;
