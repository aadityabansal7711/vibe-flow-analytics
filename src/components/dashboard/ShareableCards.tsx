
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Calendar, Flame, Trophy, Target, Clock, TrendingUp, Copy, ExternalLink, Sparkles, Music, Star, Activity, User } from 'lucide-react';
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
  topTracks?: any[];
  topArtists?: any[];
  recentlyPlayed?: any[];
}

const ShareableCards: React.FC<ShareableCardsProps> = ({ 
  isLocked, 
  profile,
  topTracks = [],
  topArtists = [],
  recentlyPlayed = []
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
          useCORS: true,
          allowTaint: true
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
          useCORS: true,
          allowTaint: true
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

  // Calculate actual user data
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const userName = profile?.full_name || profile?.spotify_display_name || 'Music Lover';
  const userAvatar = profile?.spotify_avatar_url;
  
  const actualData = {
    totalTracks: topTracks.length + recentlyPlayed.length,
    topTrack: topTracks[0]?.name || 'No data yet',
    topArtist: topArtists[0]?.name || topTracks[0]?.artists[0]?.name || 'No data yet',
    listeningHours: Math.max(1, Math.floor(recentlyPlayed.length / 20)), // Estimate based on tracks
    songsPlayed: recentlyPlayed.length,
    newArtists: new Set(topArtists.map(a => a.name)).size,
    topGenre: topArtists[0]?.genres[0] || 'Various',
    avgPopularity: topTracks.length > 0 ? Math.round(topTracks.reduce((sum, t) => sum + t.popularity, 0) / topTracks.length) : 50,
    streakDays: Math.min(30, Math.max(1, recentlyPlayed.length / 5)), // Estimate
    discoveryScore: Math.min(10, Math.max(1, new Set([...topArtists.map(a => a.name), ...topTracks.map(t => t.artists[0]?.name)]).size / 2))
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
          <Share2 className="mr-3 h-10 w-10 text-primary" />
          Create Shareable Cards
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Generate beautiful, social media-ready cards showcasing your actual music journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Music Journey Card */}
        <div className="space-y-4">
          <div 
            id="music-journey-card" 
            className="relative bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            
            {/* Animated music waves */}
            <div className="absolute top-6 right-6 flex space-x-1 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-full w-1 animate-pulse h-${8 + i * 2}`} 
                  style={{animationDelay: `${i * 0.2}s`}}
                ></div>
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <Music className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">My Music Journey</h3>
                    <p className="text-white/80 text-sm">{currentMonth}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 backdrop-blur-sm">
                  🎵 MyVibeLyrics
                </Badge>
              </div>

              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white/20 rounded-full p-1 backdrop-blur-sm border border-white/30">
                    <Music className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-lg font-bold mb-1">{userName}</div>
                <div className="text-white/80 text-sm">
                  {actualData.listeningHours} hours • {actualData.songsPlayed} tracks this month
                </div>
              </div>

              <div className="space-y-3 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Top Track</span>
                  <span className="font-bold text-sm truncate max-w-[150px]">{actualData.topTrack}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Top Artist</span>
                  <span className="font-bold text-sm truncate max-w-[150px]">{actualData.topArtist}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">New Artists</span>
                  <span className="font-bold text-sm">{actualData.newArtists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Top Genre</span>
                  <span className="font-bold text-sm truncate max-w-[150px]">{actualData.topGenre}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('music-journey-card')}
              disabled={isGenerating}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('music-journey-card', 'My Music Journey')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Music Journey')}
              variant="ghost"
              size="sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Music Stats Card */}
        <div className="space-y-4">
          <div 
            id="music-stats-card" 
            className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Trophy className="h-16 w-16" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Music Stats</h3>
                    <p className="text-white/80 text-sm">{currentMonth} Highlights</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 backdrop-blur-sm">
                  📊 Stats
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{actualData.listeningHours}h</div>
                  <div className="text-white/90 text-sm font-medium">Total Listening</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{actualData.songsPlayed}</div>
                  <div className="text-white/90 text-sm font-medium">Songs Played</div>
                </div>
              </div>

              <div className="space-y-3 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Discovery Score</span>
                  <span className="font-bold text-sm">{actualData.discoveryScore.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Music Taste</span>
                  <span className="font-bold text-sm">{actualData.avgPopularity}% Mainstream</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Listening Streak</span>
                  <span className="font-bold text-sm">{Math.round(actualData.streakDays)} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Music Variety</span>
                  <span className="font-bold text-sm">{actualData.newArtists} artists</span>
                </div>
              </div>

              <div className="mt-4 text-center bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-sm font-bold mb-1">Music DNA</div>
                <div className="text-xs text-white/80">
                  {actualData.avgPopularity > 70 ? 'Mainstream Explorer' : 
                   actualData.avgPopularity > 40 ? 'Balanced Listener' : 'Underground Enthusiast'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('music-stats-card')}
              disabled={isGenerating}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('music-stats-card', 'My Music Stats')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Music Stats')}
              variant="ghost"
              size="sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Top Artists Showcase */}
        <div className="space-y-4">
          <div 
            id="top-artists-card" 
            className="relative bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <Star className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Top Artists</h3>
                    <p className="text-white/80 text-sm">Your Music Favorites</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 backdrop-blur-sm">
                  ⭐ Artists
                </Badge>
              </div>

              <div className="space-y-4">
                {(topArtists.length > 0 ? topArtists.slice(0, 5) : [{name: 'No data yet', genres: ['Various']}]).map((artist, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                    <div className="text-2xl font-bold text-white/60">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm truncate">{artist.name}</div>
                      <div className="text-xs text-white/70 truncate">
                        {artist.genres?.[0] || 'Various genres'}
                      </div>
                    </div>
                    <Music className="h-4 w-4 text-white/60" />
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-sm font-bold mb-1">Artist Discovery</div>
                <div className="text-xs text-white/80">
                  You've explored {actualData.newArtists} different artists this month
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('top-artists-card')}
              disabled={isGenerating}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('top-artists-card', 'My Top Artists')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Top Artists')}
              variant="ghost"
              size="sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Listening Activity Card */}
        <div className="space-y-4">
          <div 
            id="listening-activity-card" 
            className="relative bg-gradient-to-br from-orange-600 via-red-700 to-pink-800 p-8 rounded-3xl text-white shadow-2xl overflow-hidden min-h-[400px]"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Listening Activity</h3>
                    <p className="text-white/80 text-sm">Your Music Energy</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 backdrop-blur-sm">
                  ⚡ Active
                </Badge>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{Math.round(actualData.streakDays)}</div>
                <div className="text-white/90 text-lg font-medium">Day Streak</div>
                <div className="text-white/70 text-sm">Consistent listening</div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/90 text-sm">Daily Average</span>
                    <span className="font-bold text-sm">{Math.round(actualData.listeningHours / 30 * 60)}min</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/90 text-sm">Music Enthusiasm</span>
                    <span className="font-bold text-sm">High</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-full h-2 transition-all duration-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-sm font-bold mb-1">Activity Level</div>
                <div className="text-xs text-white/80">
                  {actualData.songsPlayed > 100 ? 'Music Addict 🎵' : 
                   actualData.songsPlayed > 50 ? 'Active Listener 🎧' : 
                   'Casual Listener 🎶'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => generateCard('listening-activity-card')}
              disabled={isGenerating}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button
              onClick={() => shareCard('listening-activity-card', 'My Listening Activity')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => copyLink('Listening Activity')}
              variant="ghost"
              size="sm"
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
          Connect with fellow music lovers and showcase your unique musical journey. 
          Each card uses your actual Spotify data to tell your story.
        </p>
        <div className="flex justify-center space-x-4 mt-6">
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Music className="mr-2 h-4 w-4" />
            Real Data
          </Badge>
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Share2 className="mr-2 h-4 w-4" />
            Social Ready
          </Badge>
          <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Beautiful Design
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ShareableCards;
