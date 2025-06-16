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
  isLocked,
}) => {
  const getMusicPersonality = () => {
    if (topArtists.length === 0) return 'The Explorer';
    const genres = topArtists.flatMap(artist => artist.genres);
    const uniqueGenres = new Set(genres).size;

    if (uniqueGenres > genres.length * 0.8) return 'The Explorer';
    if (uniqueGenres < genres.length * 0.3) return 'The Loyalist';
    return 'The Balanced Listener';
  };

  const getMoodAnalysis = () => {
    const genres = topArtists.flatMap(artist => artist.genres.map(g => g.toLowerCase()));
    const moodMap: Record<string, string[]> = {
      'Happy': ['pop', 'dance', 'bollywood', 'funk'],
      'Energetic': ['rock', 'metal', 'punjabi', 'rap'],
      'Chill': ['indie', 'folk', 'ambient', 'lo-fi', 'acoustic'],
      'Melancholic': ['sad', 'blues', 'emotional'],
    };

    const moodScores: Record<string, number> = {};
    Object.entries(moodMap).forEach(([mood, keywords]) => {
      moodScores[mood] = genres.filter(genre =>
        keywords.some(keyword => genre.includes(keyword))
      ).length;
    });

    const totalScore = Object.values(moodScores).reduce((a, b) => a + b, 0);
    const moodPercents: Record<string, number> = {};
    Object.entries(moodScores).forEach(([mood, count]) => {
      moodPercents[mood] = totalScore ? Math.round((count / totalScore) * 100) : 0;
    });

    const dominantMood = Object.entries(moodScores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Eclectic';

    return { dominantMood, moodPercents };
  };

  const getGenreBreakdown = () => {
    const genres = topArtists.flatMap(artist => artist.genres.map(g => g.toLowerCase()));
    const genreCounts: Record<string, number> = {};
    genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const total = sortedGenres.reduce((sum, [, count]) => sum + count, 0);
    const percentages = sortedGenres.map(([genre, count]) => ({
      genre,
      percentage: Math.round((count / total) * 100),
    }));

    const actualTotal = percentages.reduce((sum, g) => sum + g.percentage, 0);
    const diff = 100 - actualTotal;
    if (percentages.length > 0) percentages[0].percentage += diff;

    return percentages;
  };

  const musicPersonality = getMusicPersonality();
  const moodAnalysis = getMoodAnalysis();
  const genreBreakdown = getGenreBreakdown();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Music Personality */}
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
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Adventurous</span>
              <span className="text-yellow-400 text-sm">{musicPersonality === 'The Explorer' ? '85%' : '45%'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Loyal</span>
              <span className="text-blue-400 text-sm">{musicPersonality === 'The Loyalist' ? '85%' : '45%'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Balanced</span>
              <span className="text-purple-400 text-sm">{musicPersonality === 'The Balanced Listener' ? '85%' : '45%'}</span>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Mood in Music */}
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
          <div className="space-y-2">
            {Object.entries(moodAnalysis.moodPercents)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([mood, percent]) => (
                <div className="flex justify-between" key={mood}>
                  <span className="text-sm text-muted-foreground">{mood}</span>
                  <span className="text-pink-400 text-sm">{percent}%</span>
                </div>
              ))}
          </div>
        </div>
      </FeatureCard>

      {/* Genre Mood Map */}
      <FeatureCard
        title="Genre Mood Map"
        description="Your genre preferences breakdown"
        icon={<Activity className="h-5 w-5 text-purple-400" />}
        isLocked={isLocked}
      >
        <div className="py-4">
          <div className="space-y-3">
            {genreBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-foreground capitalize truncate">
                  {item.genre.replace(/[-_]/g, ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-purple-400 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default PersonalityAnalytics;
