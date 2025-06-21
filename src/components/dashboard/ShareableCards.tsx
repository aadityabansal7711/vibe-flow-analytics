
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Calendar, Flame, Trophy, Target, Clock, TrendingUp, Copy, ExternalLink, Sparkles, Music, Star, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  plan_tier?: string;
  has_active_subscription?: boolean;
  plan_id?: string;
  spotify_connected?: boolean;
  spotify_user_id?: string;
  spotify_display_name?: string;
  spotify_avatar_url?: string;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
  spotify_token_expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface ShareableCardsProps {
  isLocked: boolean;
  profile: Profile | null;
}

const ShareableCards: React.FC<ShareableCardsProps> = ({ 
  isLocked, 
  profile 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCard = async (cardId: string) => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(cardId);
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = `${cardId}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Card downloaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate card');
      console.error('Card generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCard = async (cardId: string, title: string) => {
    try {
      const element = document.getElementById(cardId);
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            if (navigator.share) {
              const file = new File([blob], `${cardId}.png`, { type: 'image/png' });
              await navigator.share({
                title: title,
                text: 'Check out my music insights from MyVibeLyrics!',
                files: [file]
              });
            } else {
              // Fallback: copy to clipboard
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              toast.success('Card copied to clipboard!');
            }
          }
        });
      }
    } catch (error) {
      toast.error('Sharing not supported on this device');
      console.error('Share error:', error);
    }
  };

  const copyLink = async (cardTitle: string) => {
    const shareText = `🎵 Check out my ${cardTitle} from MyVibeLyrics! Discover your music DNA with AI-powered insights. #MyVibeLyrics #MusicAnalytics`;
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Mock data for demonstration - in real app, this would come from actual user analytics
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const userData = {
    name: profile?.full_name || profile?.spotify_display_name || 'Music Lover',
    avatar: profile?.spotify_avatar_url,
    listeningHours: Math.floor(Math.random() * 40) + 25,
    songsPlayed: Math.floor(Math.random() * 300) + 150,
    newArtists: Math.floor(Math.random() * 25) + 10,
    topGenre: 'Pop',
    currentStreak: Math.floor(Math.random() * 15) + 5,
    longestStreak: Math.floor(Math.random() * 30) + 15,
    totalDays: Math.floor(Math.random() * 200) + 100,
    energy: Math.floor(Math.random() * 30) + 70,
    happiness: Math.floor(Math.random() * 25) + 65,
    chill: Math.floor(Math.random() * 35) + 45
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
          <Share2 className="mr-3 h-10 w-10 text-primary" />
          Create Shareable Cards
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Generate beautiful, social media-ready cards to showcase your music journey and connect with fellow music lovers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Listening Streaks Card */}
        <div className="space-y-4">
          <div 
            id="listening-streaks-card" 
            className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Flame className="h-16 w-16" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <Activity className="h-20 w-20" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Flame className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Listening Streaks</h3>
                    <p className="text-white/80 text-lg">MyVibeLyrics Analytics</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg backdrop-blur-sm">
                  🔥 On Fire!
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-3">{userData.currentStreak}</div>
                  <div className="text-white/90 text-lg font-medium">Current Streak</div>
                  <div className="text-white/70 text-sm">Days in a row</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-3">{userData.longestStreak}</div>
                  <div className="text-white/90 text-lg font-medium">Longest Streak</div>
                  <div className="text-white/70 text-sm">Personal best</div>
                </div>
              </div>

              <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg text-white/90 font-medium">Streak Goal Progress</span>
                  <span className="text-lg font-bold">{userData.currentStreak}/30 days</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${(userData.currentStreak / 30) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{userData.totalDays} Total Days</div>
                <div className="text-white/80 text-lg">Active Music Listening</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('listening-streaks-card')}
              disabled={isGenerating}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('listening-streaks-card', 'My Listening Streaks')}
              variant="outline"
              className="flex-1 transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Listening Streaks')}
              variant="ghost"
              size="sm"
              className="transition-all duration-300 transform hover:scale-105"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Music Journey Card */}
        <div className="space-y-4">
          <div 
            id="music-journey-card" 
            className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
            
            {/* Decorative waveform bars */}
            <div className="absolute top-6 right-6 flex space-x-1 opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`bg-white rounded-full w-2 animate-pulse`} style={{height: `${20 + i * 10}px`, animationDelay: `${i * 0.1}s`}}></div>
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Trophy className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Music Journey</h3>
                    <p className="text-white/80 text-lg">{currentMonth}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg backdrop-blur-sm">
                  🎵 Vibes
                </Badge>
              </div>

              <div className="text-center mb-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="text-5xl">🎤</div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white/20 rounded-full p-2 backdrop-blur-sm">
                    <Music className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">{userData.name}</div>
                <div className="text-white/80 text-lg">
                  {userData.listeningHours} hours listened this month
                </div>
              </div>

              <div className="space-y-4 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Songs Discovered</span>
                  <span className="font-bold text-xl">{userData.songsPlayed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">New Artists</span>
                  <span className="font-bold text-xl">{userData.newArtists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Top Genre</span>
                  <span className="font-bold text-xl">{userData.topGenre}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('music-journey-card')}
              disabled={isGenerating}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('music-journey-card', 'My Music Journey')}
              variant="outline"
              className="flex-1 transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Music Journey')}
              variant="ghost"
              size="sm"
              className="transition-all duration-300 transform hover:scale-105"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Monthly Summary Card */}
        <div className="space-y-4">
          <div 
            id="monthly-summary-card" 
            className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Calendar className="h-16 w-16" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Calendar className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Monthly Summary</h3>
                    <p className="text-white/80 text-lg">{currentMonth}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg backdrop-blur-sm">
                  📊 Stats
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-3">{userData.listeningHours}h</div>
                  <div className="text-white/90 text-lg font-medium">Total Listening</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-3">{userData.songsPlayed}</div>
                  <div className="text-white/90 text-lg font-medium">Songs Played</div>
                </div>
              </div>

              <div className="space-y-4 bg-white/15 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">New Artists Discovered</span>
                  <span className="font-bold text-xl">{userData.newArtists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Most Played Genre</span>
                  <span className="font-bold text-xl">{userData.topGenre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Peak Listening Hour</span>
                  <span className="font-bold text-xl">8-9 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Music Discovery Score</span>
                  <span className="font-bold text-xl">8.5/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('monthly-summary-card')}
              disabled={isGenerating}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('monthly-summary-card', 'My Monthly Summary')}
              variant="outline"
              className="flex-1 transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Monthly Summary')}
              variant="ghost"
              size="sm"
              className="transition-all duration-300 transform hover:scale-105"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mood Analytics Card */}
        <div className="space-y-4">
          <div 
            id="mood-analytics-card" 
            className="relative bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Star className="h-16 w-16" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <TrendingUp className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Mood Analytics</h3>
                    <p className="text-white/80 text-lg">Your Musical Emotions</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg backdrop-blur-sm">
                  😊 Happy
                </Badge>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-white/90 font-medium text-lg">Energy Level</span>
                    <span className="font-bold text-xl">{userData.energy}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-3 transition-all duration-500" style={{ width: `${userData.energy}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-white/90 font-medium text-lg">Happiness</span>
                    <span className="font-bold text-xl">{userData.happiness}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-full h-3 transition-all duration-500" style={{ width: `${userData.happiness}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-white/90 font-medium text-lg">Chill Factor</span>
                    <span className="font-bold text-xl">{userData.chill}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full h-3 transition-all duration-500" style={{ width: `${userData.chill}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="text-center bg-white/15 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">Most Common Mood</div>
                <div className="text-white/90 text-lg font-medium">Upbeat & Energetic</div>
                <div className="text-white/70 text-sm mt-2">Based on your recent listening patterns</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('mood-analytics-card')}
              disabled={isGenerating}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('mood-analytics-card', 'My Mood Analytics')}
              variant="outline"
              className="flex-1 transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Mood Analytics')}
              variant="ghost"
              size="sm"
              className="transition-all duration-300 transform hover:scale-105"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-3">Share Your Music DNA</h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect with fellow music lovers and discover new connections through your shared musical journey. 
          Each card tells a unique story about your relationship with music.
        </p>
        <div className="flex justify-center space-x-4 mt-6">
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Music className="mr-2 h-4 w-4" />
            High-Quality PNG
          </Badge>
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Share2 className="mr-2 h-4 w-4" />  
            Social Media Ready
          </Badge>
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Glassmorphism Design
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ShareableCards;
