
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, TrendingUp } from 'lucide-react';
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

interface ListeningBehaviorProps {
  topTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
}

const ListeningBehavior: React.FC<ListeningBehaviorProps> = ({ topTracks, recentlyPlayed, isLocked }) => {
  const getTimePreference = () => {
    if (!recentlyPlayed?.length) return { preference: 'No data available', mostActive: 'No data' };

    const timeSlots = [
      { label: 'Early Morning (5-8 AM)', range: [5, 8], plays: 0 },
      { label: 'Morning (8-12 PM)', range: [8, 12], plays: 0 },
      { label: 'Afternoon (12-5 PM)', range: [12, 17], plays: 0 },
      { label: 'Evening (5-8 PM)', range: [17, 20], plays: 0 },
      { label: 'Night (8-11 PM)', range: [20, 23], plays: 0 },
      { label: 'Late Night (11-5 AM)', range: [23, 5], plays: 0 },
    ];

    for (const track of recentlyPlayed) {
      const date = new Date(track.played_at || '');
      if (isNaN(date.getTime())) continue;
      const hour = date.getHours();

      for (const slot of timeSlots) {
        const [start, end] = slot.range;
        if (start < end) {
          if (hour >= start && hour < end) slot.plays++;
        } else {
          if (hour >= start || hour < end) slot.plays++;
        }
      }
    }

    const mostActiveSlot = timeSlots.reduce((prev, curr) => (curr.plays > prev.plays ? curr : prev), timeSlots[0]);
    const preference = mostActiveSlot.label.split(' ')[0];
    
    // Get most active hour
    const hourCount = Array(24).fill(0);
    for (const t of recentlyPlayed) {
      const d = new Date(t.played_at || '');
      if (!isNaN(d.getTime())) hourCount[d.getHours()]++;
    }
    const h = hourCount.indexOf(Math.max(...hourCount));
    const formatHour = (hr: number) => (hr === 0 ? '12 AM' : hr < 12 ? `${hr} AM` : hr === 12 ? '12 PM' : `${hr - 12} PM`);
    const mostActive = `${formatHour(h)} - ${formatHour((h + 1) % 24)}`;

    return { preference, mostActive };
  };

  const getListeningStreak = () => {
    if (!recentlyPlayed?.length) return { current: 0, longest: 0 };

    const playedDates = new Set(
      recentlyPlayed.map(t => {
        try {
          const d = new Date(t.played_at || '');
          return isNaN(d.getTime()) ? null : d.toDateString();
        } catch {
          return null;
        }
      }).filter(Boolean) as string[]
    );

    let currentStreak = 0;
    let checkingDate = new Date();

    // Check current streak
    while (playedDates.has(checkingDate.toDateString())) {
      currentStreak++;
      checkingDate.setDate(checkingDate.getDate() - 1);
    }

    return { current: currentStreak || 1, longest: playedDates.size };
  };

  const getAverageLength = () => {
    const valid = recentlyPlayed.filter(t => t.duration_ms);
    if (!valid.length) return 'No data';
    const avg = valid.reduce((a, t) => a + (t.duration_ms || 0), 0) / valid.length;
    return `${Math.floor(avg / 60000)}:${String(Math.floor((avg % 60000) / 1000)).padStart(2, '0')}`;
  };

  const timeData = getTimePreference();
  const streakData = getListeningStreak();
  const avgLength = getAverageLength();

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

      {recentlyPlayed.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Listening Data Available</h3>
            <p className="text-muted-foreground">
              Start listening to music on Spotify to see your behavior patterns here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <FeatureCard title="Peak Listening Times" description="When you're most active musically" icon={<Clock className="h-5 w-5 text-yellow-400" />} isLocked={isLocked}>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-3">
              {timeData.preference} Listener
            </Badge>
            <div className="text-sm text-yellow-300 mb-3">Most Active: {timeData.mostActive}</div>
          </FeatureCard>

          <FeatureCard title="Listening Streaks" description="Your consistency tracking" icon={<Activity className="h-6 w-6 text-red-400" />} isLocked={isLocked}>
            <div className="space-y-3 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">{streakData.current}</div>
                <div className="text-sm text-red-300">Current Streak (Days)</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-red-300 mb-1">{streakData.longest}</div>
                <div className="text-xs text-red-200">Total Active Days</div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard title="Song Length Preference" description="Your preferred track duration" icon={<Clock className="h-5 w-5 text-indigo-400" />} isLocked={isLocked}>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-indigo-400">{avgLength}</div>
              <div className="text-sm text-indigo-300">Average Length</div>
              <div className="text-xs text-indigo-200">Based on {recentlyPlayed.length} recent plays</div>
            </div>
          </FeatureCard>

          <FeatureCard title="Listening Intensity" description="How engaged you are" icon={<Activity className="h-5 w-5 text-pink-400" />} isLocked={isLocked}>
            <div className="text-center space-y-2">
              <div className="text-xl font-bold text-pink-400">
                {recentlyPlayed.length > 50 ? 'High' : recentlyPlayed.length > 20 ? 'Medium' : 'Light'}
              </div>
              <div className="text-sm text-pink-300">Engagement Level</div>
              <div className="text-xs text-pink-200">{recentlyPlayed.length} recent tracks analyzed</div>
            </div>
          </FeatureCard>

          <FeatureCard title="Music Discovery" description="How much you explore new music" icon={<TrendingUp className="h-5 w-5 text-green-400" />} isLocked={isLocked}>
            <div className="text-center space-y-2">
              <div className="text-xl font-bold text-green-400">
                {(() => {
                  const uniqueArtists = new Set(recentlyPlayed.map(t => t.artists[0]?.name)).size;
                  const discoveryRate = recentlyPlayed.length > 0 ? (uniqueArtists / recentlyPlayed.length * 100) : 0;
                  return discoveryRate > 70 ? 'Explorer' : discoveryRate > 40 ? 'Balanced' : 'Focused';
                })()}
              </div>
              <div className="text-sm text-green-300">Discovery Style</div>
              <div className="text-xs text-green-200">
                {new Set(recentlyPlayed.map(t => t.artists[0]?.name)).size} unique artists
              </div>
            </div>
          </FeatureCard>
        </div>
      )}
    </div>
  );
};

export default ListeningBehavior;
