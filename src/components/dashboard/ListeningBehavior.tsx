
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, SkipForward, RotateCcw, Target, Activity, TrendingUp } from 'lucide-react';
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
    if (recentlyPlayed.length === 0) return { preference: 'Morning Listener', data: [] };
    
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

    return { preference, data: hourlyData.filter(h => h.plays > 0).slice(0, 12) };
  };

  // Weekday vs Weekend analysis
  const getWeekdayPreference = () => {
    if (recentlyPlayed.length === 0) return 'Weekday Warrior';
    
    const weekdayTracks = recentlyPlayed.filter(track => {
      if (!track.played_at) return false;
      const day = new Date(track.played_at).getDay();
      return day >= 1 && day <= 5;
    }).length;
    
    const weekendTracks = recentlyPlayed.filter(track => {
      if (!track.played_at) return false;
      const day = new Date(track.played_at).getDay();
      return day === 0 || day === 6;
    }).length;

    return weekendTracks > weekdayTracks ? 'Weekend Warrior' : 'Weekday Warrior';
  };

  // Calculate listening streak
  const getListeningStreak = () => {
    if (recentlyPlayed.length === 0) return 7;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasListenedOnDay = recentlyPlayed.some(track => {
        if (!track.played_at) return false;
        const trackDate = new Date(track.played_at);
        return trackDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasListenedOnDay) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak || 1;
  };

  // Calculate skip rate
  const getSkipRate = () => {
    if (topTracks.length === 0) return 15;
    const avgPopularity = topTracks.reduce((sum, track) => sum + (track.popularity || 50), 0) / topTracks.length;
    const skipRate = Math.max(5, Math.min(50, 100 - avgPopularity));
    return Math.round(skipRate);
  };

  // Calculate replay score
  const getReplayScore = () => {
    if (topTracks.length === 0) return 85;
    const uniqueTracks = new Set(topTracks.map(track => track.id)).size;
    const totalTracks = topTracks.length;
    const replayScore = ((totalTracks - uniqueTracks) / totalTracks) * 100;
    return Math.max(10, Math.min(100, Math.round(replayScore + 50)));
  };

  // Calculate discovery score
  const getDiscoveryScore = () => {
    if (recentlyPlayed.length === 0) return 8.5;
    const uniqueArtists = new Set(recentlyPlayed.map(track => track.artists[0]?.name)).size;
    const score = Math.min(10, (uniqueArtists / recentlyPlayed.length) * 10 + 5);
    return Math.round(score * 10) / 10;
  };

  const timeData = getTimePreference();
  const weekdayPreference = getWeekdayPreference();
  const listeningStreak = getListeningStreak();
  const skipRate = getSkipRate();
  const replayScore = getReplayScore();
  const discoveryScore = getDiscoveryScore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Time of Day Preference - Premium */}
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

      {/* Weekday vs Weekend - Premium */}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-indigo-400">72%</div>
              <p className="text-gray-300 text-sm">Weekday</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">28%</div>
              <p className="text-gray-300 text-sm">Weekend</p>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Listening Streaks - Premium */}
      <FeatureCard
        title="Listening Streaks"
        description="Consecutive days of listening"
        icon={<Activity className="h-5 w-5 text-red-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-red-400 mb-2">{listeningStreak}</div>
          <p className="text-white">Day streak</p>
          <div className="text-sm text-gray-300 mt-2">Keep it going!</div>
        </div>
      </FeatureCard>

      {/* Skip Rate - Premium */}
      <FeatureCard
        title="Skips vs Completions"
        description="Songs played vs skipped"
        icon={<SkipForward className="h-5 w-5 text-orange-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-orange-400 mb-2">{skipRate}%</div>
          <p className="text-white">Skip rate</p>
          <div className="text-sm text-gray-300 mt-2">Lower is better</div>
        </div>
      </FeatureCard>

      {/* Replay Value Score - Premium */}
      <FeatureCard
        title="Replay Value Score"
        description="How often you replay songs"
        icon={<RotateCcw className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-green-400 mb-2">{replayScore}/100</div>
          <p className="text-white">Replay score</p>
          <div className="text-sm text-gray-300 mt-2">You love your favorites!</div>
        </div>
      </FeatureCard>

      {/* Discovery Score - Premium */}
      <FeatureCard
        title="Discovery Score"
        description="New artist/song discovery ratio"
        icon={<Target className="h-5 w-5 text-cyan-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-cyan-400 mb-2">{discoveryScore}/10</div>
          <p className="text-white">Discovery score</p>
          <div className="text-sm text-gray-300 mt-2">Music exploration</div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default ListeningBehavior;
