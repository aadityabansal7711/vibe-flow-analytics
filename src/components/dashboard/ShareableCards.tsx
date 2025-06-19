
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Calendar, Flame, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  preview_url?: string;
  external_urls: { spotify: string };
  uri: string;
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

interface Profile {
  user_id: string;
  email: string;
  full_name: string;
  has_active_subscription: boolean;
}

interface ShareableCardsProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  profile: Profile;
}

const ShareableCards: React.FC<ShareableCardsProps> = ({ 
  topTracks, 
  topArtists, 
  recentlyPlayed, 
  isLocked, 
  profile 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCard = async (cardId: string) => {
    setIsGenerating(true);
    const element = document.getElementById(cardId);
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `${cardId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
    setIsGenerating(false);
  };

  const shareCard = async (cardId: string, title: string) => {
    if (navigator.share) {
      const element = document.getElementById(cardId);
      if (element) {
        const canvas = await html2canvas(element);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `${cardId}.png`, { type: 'image/png' });
            await navigator.share({
              title: title,
              text: 'Check out my music insights!',
              files: [file]
            });
          }
        });
      }
    }
  };

  // Calculate listening streaks (mock data for now)
  const currentStreak = 7; // days
  const longestStreak = 23; // days
  const totalListeningDays = 156;
  const streakGoal = 30;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Create Shareable Cards
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate beautiful cards to share your music journey and listening streaks on social media
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listening Streaks Card */}
        <div className="space-y-4">
          <div 
            id="listening-streaks-card" 
            className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Flame className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Listening Streaks</h3>
                  <p className="text-white/80">MyVibeLyrics</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                🔥 On Fire!
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentStreak}</div>
                <div className="text-white/80 text-sm">Current Streak</div>
                <div className="text-white/60 text-xs">Days</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{longestStreak}</div>
                <div className="text-white/80 text-sm">Longest Streak</div>
                <div className="text-white/60 text-xs">Days</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Streak Goal Progress</span>
                <span className="text-sm font-semibold">{currentStreak}/{streakGoal} days</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(currentStreak / streakGoal) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="text-lg font-semibold">{totalListeningDays} Total Days</div>
              <div className="text-white/80 text-sm">Active Listening</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => generateCard('listening-streaks-card')}
              disabled={isGenerating}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => shareCard('listening-streaks-card', 'My Listening Streaks')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Top Artist Card */}
        <div className="space-y-4">
          <div 
            id="top-artist-card" 
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Top Artist</h3>
                  <p className="text-white/80">This Month</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                #1
              </Badge>
            </div>

            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-3xl">🎵</div>
              </div>
              <div className="text-2xl font-bold mb-2">
                {topArtists?.[0]?.name || 'Your Top Artist'}
              </div>
              <div className="text-white/80">
                {Math.floor(Math.random() * 50) + 20} hours listened
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Popularity</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Play Count</span>
                <span className="font-semibold">{Math.floor(Math.random() * 100) + 50} songs</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => generateCard('top-artist-card')}
              disabled={isGenerating}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => shareCard('top-artist-card', 'My Top Artist')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Monthly Summary Card */}
        <div className="space-y-4">
          <div 
            id="monthly-summary-card" 
            className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 rounded-2xl text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Monthly Summary</h3>
                  <p className="text-white/80">December 2024</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                New
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{Math.floor(Math.random() * 50) + 30}h</div>
                <div className="text-white/80 text-sm">Total Listening</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{Math.floor(Math.random() * 200) + 100}</div>
                <div className="text-white/80 text-sm">Songs Played</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">New Artists</span>
                <span className="font-semibold">{Math.floor(Math.random() * 20) + 5}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Top Genre</span>
                <span className="font-semibold">Pop</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Peak Hour</span>
                <span className="font-semibold">8-9 PM</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => generateCard('monthly-summary-card')}
              disabled={isGenerating}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => shareCard('monthly-summary-card', 'My Monthly Summary')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Mood Analytics Card */}
        <div className="space-y-4">
          <div 
            id="mood-analytics-card" 
            className="bg-gradient-to-br from-green-600 to-teal-600 p-8 rounded-2xl text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Mood Analytics</h3>
                  <p className="text-white/80">Your Vibe</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                😊 Happy
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/80">Energy</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/80">Happiness</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[78%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/80">Chill</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[65%]"></div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold">Most Common Mood</div>
              <div className="text-white/80 text-sm">Upbeat & Energetic</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => generateCard('mood-analytics-card')}
              disabled={isGenerating}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => shareCard('mood-analytics-card', 'My Mood Analytics')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground text-sm">
          Share your music journey with friends and discover new connections through music
        </p>
      </div>
    </div>
  );
};

export default ShareableCards;
