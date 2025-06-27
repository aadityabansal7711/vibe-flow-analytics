
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, SkipForward, Activity, TrendingUp } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { useAuth } from '@/contexts/AuthContext';

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
  const { profile } = useAuth();

  const getTimePreference = () => {
    if (!recentlyPlayed?.length) return { preference: 'No data available', data: [] };

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

    const preference = timeSlots.reduce((prev, curr) => (curr.plays > prev.plays ? curr : prev), timeSlots[0]).label.split(' ')[0];
    return { preference, data: timeSlots };
  };

  const getListeningStreak = () => {
    if (!recentlyPlayed?.length || !profile?.created_at) return { current: 0, longest: 0 };

    // Get the date when Spotify was connected
    const spotifyConnectedDate = new Date(profile.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique dates from recently played tracks (only after Spotify connection)
    const playedDates = new Set(
      recentlyPlayed.map(t => {
        try {
          const d = new Date(t.played_at || '');
          if (isNaN(d.getTime())) return null;
          // Only count dates after Spotify connection
          if (d < spotifyConnectedDate) return null;
          return d.toDateString();
        } catch {
          return null;
        }
      }).filter(Boolean) as string[]
    );

    // Calculate current streak (consecutive days from today backwards)
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      // Don't count dates before Spotify connection
      if (checkDate < spotifyConnectedDate) break;
      
      if (playedDates.has(checkDate.toDateString())) {
        currentStreak++;
      } else if (i > 0) {
        // Break streak if no activity (but allow today to be empty)
        break;
      }
    }

    // Calculate longest streak
    const sortedDates = Array.from(playedDates)
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { 
      current: Math.max(currentStreak, longestStreak > currentStreak ? currentStreak : longestStreak), 
      longest: Math.max(longestStreak, currentStreak) 
    };
  };

  const getSkipRate = () => {
    if (!topTracks.length) return { rate: 'No data', quality: 'No data available' };
    const avg = topTracks.reduce((a, t) => a + t.popularity, 0) / topTracks.length;
    const skip = Math.max(5, Math.min(50, 100 - avg));
    let quality = 'Standard';
    if (skip < 15) quality = 'Excellent - You love most songs!';
    else if (skip < 25) quality = 'Good - Selective listener';
    else if (skip < 35) quality = 'Average - Mixed preferences';
    else quality = 'High - Very selective';
    return { rate: `${Math.round(skip)}%`, quality };
  };

  const getAverageLength = () => {
    const valid = recentlyPlayed.filter(t => t.duration_ms);
    if (!valid.length) return 'No data';
    const avg = valid.reduce((a, t) => a + (t.duration_ms || 0), 0) / valid.length;
    return `${Math.floor(avg / 60000)}:${String(Math.floor((avg % 60000) / 1000)).padStart(2, '0')}`;
  };

  const mostActiveHour = () => {
    if (!recentlyPlayed.length) return 'No data';
    const hourCount = Array(24).fill(0);
    for (const t of recentlyPlayed) {
      const d = new Date(t.played_at || '');
      if (!isNaN(d.getTime())) hourCount[d.getHours()]++;
    }
    const h = hourCount.indexOf(Math.max(...hourCount));
    const format = (hr: number) => (hr === 0 ? '12 AM' : hr < 12 ? `${hr} AM` : hr === 12 ? '12 PM' : `${hr - 12} PM`);
    return `${format(h)} - ${format((h + 1) % 24)}`;
  };

  const timeData = getTimePreference();
  const streakData = getListeningStreak();
  const skipData = getSkipRate();
  const avgLength = getAverageLength();
  const activeTime = mostActiveHour();

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
            <div className="text-sm text-yellow-300 mb-3">Most Active: {activeTime}</div>
          </FeatureCard>

          <FeatureCard title="Listening Streaks" description="Your consistency since Spotify connection" icon={<Activity className="h-6 w-6 text-red-400" />} isLocked={isLocked}>
            <div className="space-y-3 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">{streakData.current}</div>
                <div className="text-sm text-red-300">Current Streak (Days)</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-red-300 mb-1">{streakData.longest}</div>
                <div className="text-xs text-red-200">Longest Streak</div>
              </div>
              <div className="text-xs text-red-100 mt-2">
                *Calculated since Spotify connection
              </div>
            </div>
          </FeatureCard>

          <FeatureCard title="Skip Behavior" description="How selective you are" icon={<SkipForward className="h-5 w-5 text-orange-400" />} isLocked={isLocked}>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-orange-400">{skipData.rate}</div>
              <div className="text-sm text-orange-300">Estimated Skip Rate</div>
              <div className="text-xs text-orange-200">{skipData.quality}</div>
            </div>
          </FeatureCard>

          <FeatureCard title="Song Length Preference" description="Your preferred track duration" icon={<Clock className="h-5 w-5 text-indigo-400" />} isLocked={isLocked}>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-indigo-400">{avgLength}</div>
              <div className="text-sm text-indigo-300">Average Length</div>
              <div className="text-xs text-indigo-200">Based on recent plays</div>
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
        </div>
      )}
    </div>
  );
};

export default ListeningBehavior;
