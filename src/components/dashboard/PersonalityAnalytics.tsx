import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Activity, TrendingUp } from 'lucide-react';
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

interface PersonalityAnalyticsProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
}

const PersonalityAnalytics: React.FC<PersonalityAnalyticsProps> = ({ 
  topTracks, 
  topArtists, 
  recentlyPlayed, 
  isLocked 
}) => {
  const getMusicPersonality = () => {
    const genres = topArtists.flatMap(a => a.genres);
    const uniqueGenreCount = new Set(genres).size;

    if (uniqueGenreCount > genres.length * 0.7) return 'The Explorer';
    if (uniqueGenreCount < genres.length * 0.3) return 'The Loyalist';
    return 'The Balanced Listener';
  };

  const getMoodAnalysis = () => {
    const genres = topArtists.flatMap(a => a.genres);
    const moodMap: Record<string, string[]> = {
      'Happy': ['pop', 'dance', 'disco'],
      'Energetic': ['rock', 'metal', 'electro'],
      'Chill': ['lo-fi', 'indie', 'folk'],
      'Melancholic': ['blues', 'sad', 'emo'],
      'Romantic': ['r&b', 'soul', 'love'],
    };

    const moodCounts: Record<string, number> = {};
    genres.forEach(genre => {
      for (const mood in moodMap) {
        if (moodMap[mood].some(tag => genre.toLowerCase().includes(tag))) {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
      }
    });

    const total = Object.values(moodCounts).reduce((a, b) => a + b, 0) || 1;
    const moodScores = Object.fromEntries(
      Object.entries(moodCounts).map(([mood, count]) => [mood, Math.round((count / total) * 100)])
    );

    const dominantMood = Object.entries(moodScores).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Eclectic';
    return { dominantMood, moodScores };
  };

  const getGenreBreakdown = () => {
    const genres = topArtists.flatMap(a => a.genres.map(g => g.toLowerCase()));
    const counts: Record<string, number> = {};
    genres.forEach(g => (counts[g] = (counts[g] || 0) + 1));
    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5);
    const total = sorted.reduce((sum, [, count]) => sum + count, 0) || 1;

    return sorted.map(([genre, count]) => ({
      genre,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const musicPersonality = getMusicPersonality();
  const moodAnalysis = getMoodAnalysis();
  const genreBreakdown = getGenreBreakdown();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard
        title="Music Personality Profile"
        description="Your musical character type"
        icon={<Star className="h-5 w-5 text-yellow-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">{musicPersonality}</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Adventurous</span><span>{musicPersonality === 'The Explorer' ? '85%' : '40%'}</span></div>
            <div className="flex justify-between"><span>Loyal</span><span>{musicPersonality === 'The Loyalist' ? '85%' : '45%'}</span></div>
            <div className="flex justify-between"><span>Balanced</span><span>{musicPersonality === 'The Balanced Listener' ? '80%' : '50%'}</span></div>
          </div>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Your Mood in Music 2025"
        description="Emotional analysis of your listening"
        icon={<Heart className="h-5 w-5 text-pink-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <Badge variant="outline" className="text-pink-400 border-pink-400 mb-4">
            {moodAnalysis.dominantMood}
          </Badge>
          {Object.entries(moodAnalysis.moodScores).slice(0, 3).map(([mood, score]) => (
            <div key={mood} className="flex justify-between text-sm">
              <span>{mood}</span>
              <span>{score}%</span>
            </div>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard
        title="Genre Mood Map"
        description="Your genre preferences breakdown"
        icon={<Activity className="h-5 w-5 text-purple-400" />}
        isLocked={isLocked}
      >
        <div className="py-4">
          {genreBreakdown.map(({ genre, percentage }, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm capitalize">{genre.replace(/[-_]/g, ' ')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard
        title="Vibe of the Month"
        description="Current month's music summary"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold">June Vibes</h3>
          <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
            {(genreBreakdown[0]?.genre || 'Mixed').replace(/[-_]/g, ' ')} + {moodAnalysis.dominantMood}
          </Badge>
          <p className="text-sm text-muted-foreground">
            This month’s vibe has been {moodAnalysis.dominantMood.toLowerCase()}.
          </p>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Top 3 Mood-Altering Tracks"
        description="Songs that shift your emotions"
        icon={<Heart className="h-5 w-5 text-red-400" />}
        isLocked={isLocked}
        className="md:col-span-2"
      >
        <div className="space-y-3">
          {topTracks.slice(0, 3).map((track, index) => (
            <div key={track.id} className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
              <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-red-400">#{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                {index === 0 ? 'Uplifting' : index === 1 ? 'Energizing' : 'Calming'}
              </Badge>
            </div>
          ))}
        </div>
      </FeatureCard>
    </div>
  );
};

export default PersonalityAnalytics;
