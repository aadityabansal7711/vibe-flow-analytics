// Updated SpecialHighlights.tsx
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Button,
} from '@/components/ui/button';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Alert, AlertDescription,
} from '@/components/ui/alert';
import {
  Crown, Lock, Sparkles, Music, TrendingUp, Users, Calendar,
  PlayCircle, ListMusic, Shuffle,
} from 'lucide-react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  uri: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

interface Props {
  spotifyAccessToken: string;
  spotifyUserId: string;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  hasActiveSubscription: boolean;
}

const SpecialHighlights: React.FC<Props> = ({
  spotifyAccessToken,
  spotifyUserId,
  topTracks,
  topArtists,
  recentlyPlayed,
  isLocked,
  hasActiveSubscription,
}) => {
  const [audioStats, setAudioStats] = useState({ energy: '', danceability: '', valence: '' });
  const [discoveryScore, setDiscoveryScore] = useState(0);
  const [listeningPattern, setListeningPattern] = useState({ hour: '', day: '', streak: 0 });

  useEffect(() => {
    const fetchAudioFeatures = async () => {
      if (!topTracks.length) return;
      const ids = topTracks.map((t) => t.id).slice(0, 50).join(',');
      const res = await fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      });
      const data = await res.json();
      let totalEnergy = 0, totalDance = 0, totalValence = 0;
      data.audio_features.forEach((f: any) => {
        totalEnergy += f.energy;
        totalDance += f.danceability;
        totalValence += f.valence;
      });
      const count = data.audio_features.length;
      const getLevel = (val: number) => val > 0.66 ? 'High' : val > 0.33 ? 'Medium' : 'Low';
      setAudioStats({
        energy: getLevel(totalEnergy / count),
        danceability: getLevel(totalDance / count),
        valence: getLevel(totalValence / count) === 'High' ? 'Positive' : 'Neutral',
      });
    };

    const calcDiscoveryScore = () => {
      const knownArtistIds = new Set(topArtists.map((a) => a.id));
      let newCount = 0;
      recentlyPlayed.forEach((track) => {
        track.artists.forEach((artist) => {
          if (!knownArtistIds.has(artist.name)) newCount++;
        });
      });
      const score = Math.min(100, Math.floor((newCount / recentlyPlayed.length) * 100));
      setDiscoveryScore(score);
    };

    const calcListeningPattern = () => {
      const hourMap: { [key: string]: number } = {};
      const dayMap: { [key: string]: number } = {};
      const dateSet = new Set();

      recentlyPlayed.forEach((track: any) => {
        const dt = new Date(track.played_at);
        const h = dt.getHours();
        const d = dt.toLocaleDateString('en-US', { weekday: 'long' });
        const dateKey = dt.toDateString();
        dateSet.add(dateKey);
        hourMap[h] = (hourMap[h] || 0) + 1;
        dayMap[d] = (dayMap[d] || 0) + 1;
      });

      const peakHour = Object.entries(hourMap).reduce((a, b) => (+a[1] > +b[1] ? a : b))[0];
      const peakDay = Object.entries(dayMap).reduce((a, b) => (+a[1] > +b[1] ? a : b))[0];

      let streak = 0;
      let curr = new Date();
      while (dateSet.has(curr.toDateString())) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      }
      setListeningPattern({ hour: `${peakHour}:00`, day: peakDay, streak });
    };

    fetchAudioFeatures();
    calcDiscoveryScore();
    calcListeningPattern();
  }, [topTracks, topArtists, recentlyPlayed]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Discovery Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">{discoveryScore}%</div>
          <p className="text-muted-foreground text-sm">
            Based on new artists you listened to recently
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Listening Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Peak Hour: <strong>{listeningPattern.hour}</strong></p>
          <p className="text-sm">Most Active Day: <strong>{listeningPattern.day}</strong></p>
          <p className="text-sm">Listening Streak: <strong>{listeningPattern.streak} days</strong></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5 text-primary" />
            Audio Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Energy: <Badge>{audioStats.energy}</Badge></p>
          <p className="text-sm">Danceability: <Badge>{audioStats.danceability}</Badge></p>
          <p className="text-sm">Valence: <Badge>{audioStats.valence}</Badge></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialHighlights;
