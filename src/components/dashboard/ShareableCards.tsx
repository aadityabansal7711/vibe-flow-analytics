
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useSpotifyData from '@/hooks/useSpotifyData';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Share2, Music, User, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

const ShareableCards = () => {
  const { user } = useAuth();
  const { topTracks, topArtists, loading } = useSpotifyData();
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadCard = async (cardId: string) => {
    setDownloading(cardId);
    try {
      const element = document.getElementById(cardId);
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0f0f23',
          scale: 2,
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `${cardId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error downloading card:', error);
    } finally {
      setDownloading(null);
    }
  };

  const shareCard = async (cardId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Music Stats - MyVibeLytics',
          text: 'Check out my music listening stats!',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topTrack = topTracks?.[0];
  const topArtist = topArtists?.[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Create Shareable Cards</h2>
        <p className="text-muted-foreground">Download or share your unique music insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Track Card */}
        <div className="space-y-4">
          <div 
            id="top-track-card" 
            className="relative p-8 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
              minHeight: '400px'
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-white h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6" />
                  <span className="font-bold">MyVibeLytics</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  #1 Track
                </Badge>
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold mb-2">My Top Track</h3>
                {topTrack ? (
                  <>
                    <p className="text-3xl font-black mb-2 leading-tight">{topTrack.name}</p>
                    <p className="text-xl opacity-90 mb-4">by {topTrack.artists[0]?.name}</p>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Most Played
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-xl">Connect Spotify to see your top track!</p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm opacity-75">@{user?.email?.split('@')[0] || 'user'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadCard('top-track-card')}
              disabled={downloading === 'top-track-card'}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === 'top-track-card' ? 'Downloading...' : 'Download'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareCard('top-track-card')}
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
            className="relative p-8 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #0891b2 50%, #7c3aed 100%)',
              minHeight: '400px'
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-white h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6" />
                  <span className="font-bold">MyVibeLytics</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  #1 Artist
                </Badge>
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold mb-2">My Top Artist</h3>
                {topArtist ? (
                  <>
                    <p className="text-3xl font-black mb-4 leading-tight">{topArtist.name}</p>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                        <User className="mr-1 h-3 w-3" />
                        Favorite Artist
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-xl">Connect Spotify to see your top artist!</p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm opacity-75">@{user?.email?.split('@')[0] || 'user'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadCard('top-artist-card')}
              disabled={downloading === 'top-artist-card'}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === 'top-artist-card' ? 'Downloading...' : 'Download'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareCard('top-artist-card')}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Music Discovery Card */}
        <div className="space-y-4">
          <div 
            id="music-discovery-card" 
            className="relative p-8 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              minHeight: '400px'
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-white h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6" />
                  <span className="font-bold">MyVibeLytics</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Discovery
                </Badge>
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold mb-4">Music Explorer</h3>
                <div className="text-6xl font-black mb-2">85%</div>
                <p className="text-xl mb-4">Discovery Score</p>
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Adventurous Listener
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm opacity-75">@{user?.email?.split('@')[0] || 'user'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadCard('music-discovery-card')}
              disabled={downloading === 'music-discovery-card'}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === 'music-discovery-card' ? 'Downloading...' : 'Download'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareCard('music-discovery-card')}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Listening Streak Card */}
        <div className="space-y-4">
          <div 
            id="listening-streak-card" 
            className="relative p-8 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #facc15 100%)',
              minHeight: '400px'
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-white h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6" />
                  <span className="font-bold">MyVibeLytics</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Streak
                </Badge>
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold mb-4">My Listening Streak</h3>
                <div className="text-6xl font-black mb-2">7</div>
                <p className="text-xl mb-4">Days in a row</p>
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                    <Calendar className="mr-1 h-3 w-3" />
                    Daily Listener
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm opacity-75">@{user?.email?.split('@')[0] || 'user'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadCard('listening-streak-card')}
              disabled={downloading === 'listening-streak-card'}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === 'listening-streak-card' ? 'Downloading...' : 'Download'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareCard('listening-streak-card')}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableCards;
