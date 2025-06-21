
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
  const getTimePreference = () => {
    if (recentlyPlayed.length === 0) return { preference: 'Loading...', data: [] };

    const timeSlots = {
      'Early Morning': 0,
      'Morning': 0,
      'Afternoon': 0,
      'Evening': 0,
      'Night': 0,
      'Late Night': 0,
    };

    const hourlyData = [
      { label: 'Early Morning (5-8 AM)', plays: 0, color: '#FF6B6B' },
      { label: 'Morning (8-12 PM)', plays: 0, color: '#4ECDC4' },
      { label: 'Afternoon (12-5 PM)', plays: 0, color: '#45B7D1' },
      { label: 'Evening (5-8 PM)', plays: 0, color: '#96CEB4' },
      { label: 'Night (8-11 PM)', plays: 0, color: '#FFEAA7' },
      { label: 'Late Night (11-5 AM)', plays: 0, color: '#DDA0DD' },
    ];

    recentlyPlayed.forEach(track => {
      if (!track.played_at) return;
      const hour = new Date(track.played_at).getHours();
      if (hour >= 5 && hour < 8) {
        timeSlots['Early Morning']++;
        hourlyData[0].plays++;
      } else if (hour >= 8 && hour < 12) {
        timeSlots['Morning']++;
        hourlyData[1].plays++;
      } else if (hour >= 12 && hour < 17) {
        timeSlots['Afternoon']++;
        hourlyData[2].plays++;
      } else if (hour >= 17 && hour < 20) {
        timeSlots['Evening']++;
        hourlyData[3].plays++;
      } else if (hour >= 20 && hour < 23) {
        timeSlots['Night']++;
        hourlyData[4].plays++;
      } else {
        timeSlots['Late Night']++;
        hourlyData[5].plays++;
      }
    });

    const preference = Object.entries(timeSlots).reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0];

    return { preference, data: hourlyData };
  };

  const getWeekdayPreference = () => {
    if (recentlyPlayed.length === 0) return 'Analyzing...';

    let weekdays = { count: 0, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };
    let weekends = { count: 0, days: ['Sat', 'Sun'] };

    recentlyPlayed.forEach(track => {
      if (!track.played_at) return;
      const day = new Date(track.played_at).getDay();
      if (day === 0 || day === 6) weekends.count++;
      else weekdays.count++;
    });

    const total = weekdays.count + weekends.count;
    const weekdayPercent = Math.round((weekdays.count / total) * 100);
    const weekendPercent = Math.round((weekends.count / total) * 100);

    if (weekendPercent > weekdayPercent) {
      return `Weekend Warrior (${weekendPercent}%)`;
    } else {
      return `Weekday Listener (${weekdayPercent}%)`;
    }
  };

  const getListeningStreak = () => {
    if (recentlyPlayed.length === 0) return { current: 0, longest: 0 };
    
    const today = new Date();
    const dates = new Set();
    
    // Get unique listening dates from recent plays
    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const date = new Date(track.played_at).toDateString();
        dates.add(date);
      }
    });
    
    const sortedDates = Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      if (sortedDates.includes(dateStr)) {
        currentStreak = i + 1;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.abs((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak + 1);
    
    return { current: currentStreak || 1, longest: longestStreak || 1 };
  };

  const getSkipRate = () => {
    if (topTracks.length === 0) return { rate: 'Loading...', quality: 'Calculating...' };
    
    const avgPopularity = topTracks.reduce((sum, t) => sum + t.popularity, 0) / topTracks.length;
    const skipRate = Math.max(5, Math.min(50, 100 - avgPopularity));
    
    let quality = 'Standard';
    if (skipRate < 15) quality = 'Excellent - You love most songs!';
    else if (skipRate < 25) quality = 'Good - Selective listener';
    else if (skipRate < 35) quality = 'Average - Mixed preferences';
    else quality = 'High - Very selective';
    
    return { rate: `${Math.round(skipRate)}%`, quality };
  };

  const getReplayHabits = () => {
    if (topTracks.length === 0) return { score: 'Loading...', habit: 'Analyzing...' };
    
    const uniqueTracks = new Set(topTracks.map(t => t.id)).size;
    const replayScore = Math.round(((topTracks.length - uniqueTracks) / topTracks.length) * 100) + 40;
    
    let habit = 'Balanced';
    if (replayScore > 80) habit = 'Heavy Replayer - You love your favorites!';
    else if (replayScore > 60) habit = 'Moderate Replayer - Mix of old & new';
    else if (replayScore > 40) habit = 'Light Replayer - Prefer variety';
    else habit = 'Explorer - Always seeking new music';
    
    return { score: `${replayScore}/100`, habit };
  };

  const getDiscoveryPattern = () => {
    if (recentlyPlayed.length === 0) return { score: 'Loading...', pattern: 'Analyzing...' };
    
    const uniqueArtists = new Set(recentlyPlayed.map(t => t.artists[0]?.name)).size;
    const discoveryScore = Math.round((uniqueArtists / recentlyPlayed.length) * 10 * 10) / 10;
    
    let pattern = 'Moderate Explorer';
    if (discoveryScore > 8) pattern = 'Adventure Seeker - Loves new artists!';
    else if (discoveryScore > 6) pattern = 'Curious Listener - Good variety';
    else if (discoveryScore > 4) pattern = 'Comfort Zone - Familiar artists';
    else pattern = 'Loyal Fan - Sticks to favorites';
    
    return { score: `${discoveryScore}/10`, pattern };
  };

  const getMostActiveTime = () => {
    if (recentlyPlayed.length === 0) return 'Loading data...';
    
    const hourCounts = new Array(24).fill(0);
    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const hour = new Date(track.played_at).getHours();
        hourCounts[hour]++;
      }
    });
    
    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    const formatHour = (hour) => {
      if (hour === 0) return '12 AM';
      if (hour < 12) return `${hour} AM`;
      if (hour === 12) return '12 PM';
      return `${hour - 12} PM`;
    };
    
    return `${formatHour(maxHour)} - ${formatHour((maxHour + 1) % 24)}`;
  };

  const getAverageSongLength = () => {
    if (recentlyPlayed.length === 0) return 'Loading...';
    
    const validTracks = recentlyPlayed.filter(t => t.duration_ms);
    if (validTracks.length === 0) return '3:30 (estimated)';
    
    const avgMs = validTracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0) / validTracks.length;
    const minutes = Math.floor(avgMs / 60000);
    const seconds = Math.floor((avgMs % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeData = getTimePreference();
  const weekdayPref = getWeekdayPreference();
  const streakData = getListeningStreak();
  const skipData = getSkipRate();
  const replayData = getReplayHabits();
  const discoveryData = getDiscoveryPattern();
  const activeTime = getMostActiveTime();
  const avgLength = getAverageSongLength();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
          <TrendingUp className="mr-3 h-8 w-8 text-primary" />
          Listening Behavior & Patterns
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Deep insights into your music consumption habits and listening patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FeatureCard
          title="Peak Listening Times"
          description="When you're most active musically"
          icon={<Clock className="h-5 w-5 text-yellow-400" />}
          isLocked={isLocked}
        >
          <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-3">
            {timeData.preference} Listener
          </Badge>
          <div className="text-sm text-yellow-300 mb-3">
            Most Active: {activeTime}
          </div>
          {timeData.data.length > 0 && (
            <div className="space-y-2">
              {timeData.data.map((slot, index) => {
                const totalPlays = timeData.data.reduce((sum, s) => sum + s.plays, 0);
                const percent = totalPlays > 0 ? ((slot.plays / totalPlays) * 100).toFixed(0) : 0;
                return (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-yellow-200">{slot.label.split(' ')[0]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-yellow-900/30 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-yellow-300 w-8">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </FeatureCard>

        <FeatureCard
          title="Weekly Listening Pattern"
          description="Weekday vs weekend preferences"
          icon={<Calendar className="h-5 w-5 text-purple-400" />}
          isLocked={isLocked}
        >
          <Badge variant="outline" className="text-purple-400 border-purple-400 mb-3">
            {weekdayPref}
          </Badge>
          <div className="text-sm text-purple-300">
            Based on your recent listening history
          </div>
        </FeatureCard>

        <FeatureCard
          title="Listening Streaks"
          description="Your consistency tracking"
          icon={<Activity className="h-6 w-6 text-red-400" />}
          isLocked={isLocked}
        >
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{streakData.current}</div>
              <div className="text-sm text-red-300">Current Streak (Days)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-red-300 mb-1">{streakData.longest}</div>
              <div className="text-xs text-red-200">Longest Streak</div>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Skip Behavior"
          description="How selective you are"
          icon={<SkipForward className="h-5 w-5 text-orange-400" />}
          isLocked={isLocked}
        >
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-orange-400">{skipData.rate}</div>
            <div className="text-sm text-orange-300">Estimated Skip Rate</div>
            <div className="text-xs text-orange-200">{skipData.quality}</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Replay Habits"
          description="How often you repeat songs"
          icon={<RotateCcw className="h-5 w-5 text-green-400" />}
          isLocked={isLocked}
        >
          <div className="text-center space-y-2">
            <div className="text-xl font-bold text-green-400">{replayData.score}</div>
            <div className="text-sm text-green-300">Replay Score</div>
            <div className="text-xs text-green-200">{replayData.habit}</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Discovery Pattern"
          description="How adventurous your taste is"
          icon={<Target className="h-5 w-5 text-cyan-400" />}
          isLocked={isLocked}
        >
          <div className="text-center space-y-2">
            <div className="text-xl font-bold text-cyan-400">{discoveryData.score}</div>
            <div className="text-sm text-cyan-300">Discovery Score</div>
            <div className="text-xs text-cyan-200">{discoveryData.pattern}</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Song Length Preference"
          description="Your preferred track duration"
          icon={<Clock className="h-5 w-5 text-indigo-400" />}
          isLocked={isLocked}
        >
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-indigo-400">{avgLength}</div>
            <div className="text-sm text-indigo-300">Average Length</div>
            <div className="text-xs text-indigo-200">Based on recent plays</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Listening Intensity"
          description="How engaged you are"
          icon={<Activity className="h-5 w-5 text-pink-400" />}
          isLocked={isLocked}
        >
          <div className="text-center space-y-2">
            <div className="text-xl font-bold text-pink-400">
              {recentlyPlayed.length > 50 ? 'High' : recentlyPlayed.length > 20 ? 'Medium' : 'Light'}
            </div>
            <div className="text-sm text-pink-300">Engagement Level</div>
            <div className="text-xs text-pink-200">
              {recentlyPlayed.length} recent tracks analyzed
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
};

export default ListeningBehavior;
