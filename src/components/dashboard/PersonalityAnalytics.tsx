
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
  // Music personality analysis
  const getMusicPersonality = () => {
    if (topArtists.length === 0) return 'The Explorer';
    
    const genres = topArtists.flatMap(artist => artist.genres);
    const uniqueGenres = new Set(genres).size;
    
    if (uniqueGenres > genres.length * 0.8) return 'The Explorer';
    if (uniqueGenres < genres.length * 0.3) return 'The Loyalist';
    return 'The Balanced Listener';
  };

  // Mood analysis based on genres and track characteristics
  const getMoodAnalysis = () => {
    const genres = topArtists.flatMap(artist => artist.genres);
    const moodMap: Record<string, string[]> = {
      'Happy': ['pop', 'dance', 'electronic', 'disco', 'funk'],
      'Energetic': ['rock', 'metal', 'punk', 'hardcore', 'electronic'],
      'Chill': ['indie', 'folk', 'ambient', 'lo-fi', 'downtempo'],
      'Melancholic': ['blues', 'sad', 'indie folk', 'alternative'],
      'Romantic': ['r&b', 'soul', 'love', 'acoustic'],
    };

    const moodScores: Record<string, number> = {};
    
    Object.entries(moodMap).forEach(([mood, keywords]) => {
      moodScores[mood] = genres.filter(genre => 
        keywords.some(keyword => genre.toLowerCase().includes(keyword))
      ).length;
    });

    const dominantMood = Object.entries(moodScores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Eclectic';

    return { dominantMood, moodScores };
  };

  // Get genre breakdown
  const getGenreBreakdown = () => {
    const genres = topArtists.flatMap(artist => artist.genres);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({
        genre,
        percentage: Math.round((count / genres.length) * 100)
      }));
  };

  const musicPersonality = getMusicPersonality();
  const moodAnalysis = getMoodAnalysis();
  const genreBreakdown = getGenreBreakdown();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Music Personality Profile - Premium */}
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
              <span className="text-gray-300 text-sm">Adventurous</span>
              <span className="text-yellow-400 text-sm">
                {musicPersonality === 'The Explorer' ? '89%' : '45%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Loyal</span>
              <span className="text-blue-400 text-sm">
                {musicPersonality === 'The Loyalist' ? '85%' : '50%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Balanced</span>
              <span className="text-purple-400 text-sm">
                {musicPersonality === 'The Balanced Listener' ? '80%' : '60%'}
              </span>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Your Mood in Music - Premium */}
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
            {Object.entries(moodAnalysis.moodScores).slice(0, 3).map(([mood, score]) => (
              <div key={mood} className="flex justify-between">
                <span className="text-gray-300 text-sm">{mood}</span>
                <span className="text-pink-400 text-sm">{score > 0 ? `${Math.round(score * 10)}%` : '0%'}</span>
              </div>
            ))}
          </div>
        </div>
      </FeatureCard>

      {/* Genre Mood Map - Premium */}
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
                      className="h-full bg-purple-400 transition-all duration-300"
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

      {/* Vibe of the Month - Premium */}
      <FeatureCard
        title="Vibe of the Month"
        description="Current month's music summary"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
        isLocked={isLocked}
      >
        <div className="text-center py-4">
          <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">December Vibes</h3>
          <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
            {genreBreakdown[0]?.genre.replace(/[-_]/g, ' ') || 'Mixed'} + {moodAnalysis.dominantMood}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your festive listening has been predominantly {moodAnalysis.dominantMood.toLowerCase()}
          </p>
        </div>
      </FeatureCard>

      {/* Top 3 Mood-Altering Tracks - Premium */}
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
