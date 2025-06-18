
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Lock, Crown } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

interface Props {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  profile?: any;
}

const ShareableCards: React.FC<Props> = ({ topTracks, topArtists, recentlyPlayed, isLocked, profile }) => {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateCard = async (cardId: string) => {
    if (isLocked) return;
    
    setGenerating(cardId);
    const element = document.getElementById(cardId);
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0a0a0f',
          scale: 2,
          width: 400,
          height: 600
        });
        
        const link = document.createElement('a');
        link.download = `myvibelytics-${cardId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error generating card:', error);
      }
    }
    setGenerating(null);
  };

  const shareCard = async (cardId: string) => {
    if (isLocked) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Music Stats',
          text: 'Check out my music analytics from MyVibeLytics!',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const topTrack = topTracks[0];
  const topArtist = topArtists[0];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">My Music Analytics</h2>
        <p className="text-muted-foreground">
          Create beautiful shareable cards showcasing your music taste
        </p>
        {isLocked && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Lock className="h-4 w-4" />
              <span>Upgrade to Premium to create shareable cards</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Top Track Card */}
        <div className="space-y-4">
          <div 
            id="top-track-card" 
            className="w-80 h-96 mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-6 w-6" />
                <span className="font-bold">MyVibeLytics</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold mb-2">My Top Track</h3>
                {topTrack && (
                  <>
                    {topTrack.album.images[0] && (
                      <img 
                        src={topTrack.album.images[0].url} 
                        alt={topTrack.name}
                        className="w-24 h-24 rounded-lg mb-4 shadow-lg"
                      />
                    )}
                    <h4 className="font-bold text-lg mb-1 line-clamp-2">{topTrack.name}</h4>
                    <p className="text-sm opacity-90 mb-4">{topTrack.artists[0]?.name}</p>
                  </>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-xs opacity-75">Discover your music DNA</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => generateCard('top-track-card')}
              disabled={isLocked || generating === 'top-track-card'}
              size="sm"
              className="flex-1"
            >
              {generating === 'top-track-card' ? (
                'Generating...'
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button
              onClick={() => shareCard('top-track-card')}
              disabled={isLocked}
              size="sm"
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
            className="w-80 h-96 mx-auto bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-6 w-6" />
                <span className="font-bold">MyVibeLytics</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold mb-2">My Top Artist</h3>
                {topArtist && (
                  <>
                    {topArtist.images[0] && (
                      <img 
                        src={topArtist.images[0].url} 
                        alt={topArtist.name}
                        className="w-24 h-24 rounded-full mb-4 shadow-lg"
                      />
                    )}
                    <h4 className="font-bold text-xl mb-2">{topArtist.name}</h4>
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {topArtist.genres.slice(0, 2).map((genre, index) => (
                        <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-xs opacity-75">Discover your music DNA</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => generateCard('top-artist-card')}
              disabled={isLocked || generating === 'top-artist-card'}
              size="sm"
              className="flex-1"
            >
              {generating === 'top-artist-card' ? (
                'Generating...'
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button
              onClick={() => shareCard('top-artist-card')}
              disabled={isLocked}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Stats Summary Card */}
        <div className="space-y-4">
          <div 
            id="stats-summary-card" 
            className="w-80 h-96 mx-auto bg-gradient-to-br from-red-500 via-yellow-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-6 w-6" />
                <span className="font-bold">MyVibeLytics</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-6 text-center">My Music Stats</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{topTracks.length}</div>
                    <div className="text-sm opacity-90">Top Tracks</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{topArtists.length}</div>
                    <div className="text-sm opacity-90">Top Artists</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{recentlyPlayed.length}</div>
                    <div className="text-sm opacity-90">Recent Plays</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs opacity-75">Discover your music DNA</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => generateCard('stats-summary-card')}
              disabled={isLocked || generating === 'stats-summary-card'}
              size="sm"
              className="flex-1"
            >
              {generating === 'stats-summary-card' ? (
                'Generating...'
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button
              onClick={() => shareCard('stats-summary-card')}
              disabled={isLocked}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="text-center mt-8">
          <Card className="glass-effect border-primary/20 max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Unlock Shareable Cards</h3>
              <p className="text-muted-foreground mb-4">
                Upgrade to Premium to create and share beautiful music cards
              </p>
              <Button className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ShareableCards;
