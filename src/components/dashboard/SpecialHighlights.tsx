// Updated SpecialHighlights.tsx with AI Playlist and Full Features
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
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [playlistMessage, setPlaylistMessage] = useState('');

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
      const knownArtistNames = new Set(topArtists.flatMap((a) => a.name.toLowerCase()));
      let newCount = 0;
      recentlyPlayed.forEach((track) => {
        track.artists.forEach((artist) => {
          if (!knownArtistNames.has(artist.name.toLowerCase())) newCount++;
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

  const createAIPlaylist = async () => {
    if (!hasActiveSubscription) return;
    setCreatingPlaylist(true);
    setPlaylistMessage('');

    try {
      const processedArtists = new Set(topArtists.map(a => a.id));
      const relatedArtists = new Set<string>();

      for (const artist of topArtists.slice(0, 3)) {
        const res = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          data.artists.slice(0, 5).forEach((a: any) => {
            if (!processedArtists.has(a.id)) relatedArtists.add(a.id);
          });
        }
      }

      const seeds = [
        { seed_tracks: topTracks.slice(0, 5).map(t => t.id).join(',') },
        { seed_artists: Array.from(processedArtists).slice(0, 5).join(',') },
        { seed_artists: Array.from(relatedArtists).slice(0, 5).join(',') },
        {
          seed_tracks: topTracks.slice(0, 2).map(t => t.id).join(','),
          seed_artists: Array.from(processedArtists).slice(0, 3).join(',')
        },
      ];

      const allTracks = new Set<string>();
      for (const s of seeds) {
        const params = new URLSearchParams({
          limit: '50',
          market: 'IN',
          ...s
        });
        const res = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          data.tracks.forEach((track: any) => {
            if (!topTracks.some(t => t.id === track.id) && allTracks.size < 100) {
              allTracks.add(track.uri);
            }
          });
        }
      }

      const playlistRes = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `AI Discovery Mix - ${new Date().toLocaleDateString()}`,
          description: `100 personalized tracks based on your taste`,
          public: false
        })
      });

      const playlist = await playlistRes.json();
      await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: Array.from(allTracks) })
      });

      setPlaylistMessage(`AI playlist created with ${allTracks.size} tracks! Check your Spotify.`);
    } catch (e) {
      setPlaylistMessage('Something went wrong while creating the playlist.');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle><TrendingUp className="mr-2"/>Discovery Score</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{discoveryScore}%</div><p>Based on new artists played</p></CardContent></Card>

        <Card><CardHeader><CardTitle><Calendar className="mr-2"/>Listening Pattern</CardTitle></CardHeader>
          <CardContent>
            <p>Peak Hour: <strong>{listeningPattern.hour}</strong></p>
            <p>Active Day: <strong>{listeningPattern.day}</strong></p>
            <p>Streak: <strong>{listeningPattern.streak} days</strong></p>
          </CardContent></Card>

        <Card><CardHeader><CardTitle><Music className="mr-2"/>Audio Stats</CardTitle></CardHeader>
          <CardContent>
            <p>Energy: <Badge>{audioStats.energy}</Badge></p>
            <p>Danceability: <Badge>{audioStats.danceability}</Badge></p>
            <p>Valence: <Badge>{audioStats.valence}</Badge></p>
          </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle><ListMusic className="mr-2"/>AI Discovery Playlist</CardTitle></CardHeader>
        <CardContent>
          <Button disabled={creatingPlaylist || !hasActiveSubscription} onClick={createAIPlaylist} className="w-full">
            {creatingPlaylist ? (<><Shuffle className="mr-2 animate-spin"/>Generating...</>) : (<><PlayCircle className="mr-2"/>Generate Playlist</>)}
          </Button>
          {playlistMessage && (
            <Alert className="mt-4">
              <Music className="h-4 w-4" />
              <AlertDescription>{playlistMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialHighlights;
