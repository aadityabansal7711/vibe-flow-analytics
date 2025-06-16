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
    const genres = topArtists.flatMap((a) => a.genres);
    const uniqueGenres = new Set(genres).size;
    if (uniqueGenres > genres.length * 0.8) return 'The Explorer';
    if (uniqueGenres < genres.length * 0.3) return 'The Loyalist';
    return 'The Balanced Listener';
  };

  const getMoodAnalysis = () => {
    const genres = topArtists.flatMap((a) => a.genres.map((g) => g.toLowerCase()));
    const moodMap: Record<string, string[]> = {
      Happy: ['pop', 'dance', 'disco', 'funk'],
      Energetic: ['rock', 'metal', 'electro', 'techno', 'punk'],
      Chill: ['lo-fi', 'ambient', 'chill', 'indie', 'downtempo'],
      Melancholic: ['sad', 'blues', 'emo', 'alternative'],
      Romantic: ['r&b', 'soul', 'acoustic', 'romantic'],
    };

    const moodScores: Record<string, number> = {};
    let totalMatches = 0;

    Object.entries(moodMap).forEach(([mood, keywords]) => {
      const matchCount = genres.filter((genre) =>
        keywords.some((keyword) => genre.includes(keyword))
      ).length;
      moodScores[mood] = matchCount;
      totalMatches += matchCount;
    });

    const dominantMood = Object.entries(moodScores).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Eclectic';

    const moodPercentages: Record<string, number> = {};
    Object.entries(moodScores).forEach(([mood, count]) => {
      moodPercentages[mood] = totalMatches > 0 ? Math.round((count / totalMatches) * 100) : 0;
    });

    return { dominantMood, moodScores: moodPercentages };
  };

  const getGenreBreakdown = () => {
    const genres = topArtists.flatMap((a) => a.genres);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({
        genre,
        percentage: Math.round((count / genres.length) * 100),
      }));
  };

  const musicPersonality = getMusicPersonality();
  const moodAnalysis = getMoodAnalysis();
  const genreBreakdown = getGenreBreakdown();

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

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
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Adventurous</span>
              <span className="text-yellow-400">
                {musicPersonality === 'The Explorer' ? '89%' : '45%'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Loyal</span>
              <span className="text-blue-400">
                {musicPersonality === 'The Loyalist' ? '85%' : '50%'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Balanced</span>
              <span className="text-purple-400">
                {musicPersonality === 'The Balanced Listener' ? '80%' : '60%'}
              </span>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Mood Analysis */}
      <FeatureCard
        title="Your Mood in Music 2024"
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
            {Object.entries(moodAnalysis.moodScores)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([mood, score]) => (
                <div key={mood} className="flex justify-between text-sm">
                  <span className="text-gray-300">{mood}</span>
                  <span className="text-pink-400">{score}%</span>
                </div>
              ))}
          </div>
        </div>
      </FeatureCard>

      {/* Genre Breakdown */}
      <FeatureCard
        title="Genre Mood Map"
        description="Your genre preferences breakdown"
        icon={<Activity className="h-5 w-5 text-purple-400" />}
        isLocked={isLocked}
      >
        <div className="py-4 space-y-3">
          {genreBreakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="capitalize truncate">{item.genre.replace(/[-_]/g, ' ')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-purple-400 w-8 text-right">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Vibe of the Month */}
      <FeatureCard
        title="Vibe of the Month"
        description="Current month's music summary"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">{currentMonth} Vibes</h3>
          <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
            {genreBreakdown[0]?.genre.replace(/[-_]/g, ' ') || 'Mixed'} + {moodAnalysis.dominantMood}
          </Badge>
          <p className="text-sm text-muted-foreground">
            This month, your music leans towards {moodAnalysis.dominantMood.toLowerCase()} vibes.
          </p>
        </div>
      </FeatureCard>

      {/* Mood-Altering Tracks */}
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
                  {track.artists.map((artist) => artist.name).join(', ')}
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
