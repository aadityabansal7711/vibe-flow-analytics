
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  genres: string[];
}

interface ShareableCardsProps {
  isLocked: boolean;
  profile: any;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
}

const ShareableCards: React.FC<ShareableCardsProps> = ({ 
  isLocked, 
  profile, 
  topTracks, 
  topArtists, 
  recentlyPlayed 
}) => {
  const topTracksCardRef = useRef<HTMLDivElement>(null);
  const topArtistsCardRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async (cardRef: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download card');
    }
  };

  if (isLocked) {
    return (
      <div className="text-center py-12">
        <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Premium Feature</h3>
        <p className="text-muted-foreground mb-4">
          Upgrade to premium to create and download shareable cards
        </p>
      </div>
    );
  }

  if (!topTracks.length && !topArtists.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-foreground mb-2">No Data Available</h3>
        <p className="text-muted-foreground">
          Connect your Spotify account and listen to music to generate shareable cards
        </p>
      </div>
    );
  }

  // Calculate real stats
  const totalPlays = recentlyPlayed.length;
  const uniqueArtists = new Set(recentlyPlayed.map(t => t.artists[0]?.name)).size;
  const avgPopularity = topTracks.length > 0 
    ? Math.round(topTracks.reduce((sum, track) => sum + track.popularity, 0) / topTracks.length)
    : 0;

  const discoveryRate = totalPlays > 0 ? Math.round((uniqueArtists / totalPlays) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Shareable Cards</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautiful cards showcasing your music taste and stats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Tracks Card */}
        {topTracks.length > 0 && (
          <div className="space-y-4">
            <div 
              ref={topTracksCardRef}
              className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 rounded-2xl text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">My Top Tracks</h3>
                  <p className="text-purple-200">via MyVibeLytics</p>
                </div>
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-12 w-12" />
              </div>
              
              <div className="space-y-4">
                {topTracks.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-purple-300 w-8">
                      {index + 1}
                    </div>
                    {track.album.images[0] && (
                      <img 
                        src={track.album.images[0].url} 
                        alt={track.album.name}
                        className="w-12 h-12 rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.name}</p>
                      <p className="text-purple-200 text-sm truncate">
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-800 text-purple-100">
                      {track.popularity}%
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-purple-600">
                <p className="text-center text-purple-200 text-sm">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button 
              onClick={() => downloadCard(topTracksCardRef, 'my-top-tracks')}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Top Tracks Card
            </Button>
          </div>
        )}

        {/* Top Artists Card */}
        {topArtists.length > 0 && (
          <div className="space-y-4">
            <div 
              ref={topArtistsCardRef}
              className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-8 rounded-2xl text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">My Top Artists</h3>
                  <p className="text-emerald-200">via MyVibeLytics</p>
                </div>
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-12 w-12" />
              </div>
              
              <div className="space-y-4">
                {topArtists.slice(0, 5).map((artist, index) => (
                  <div key={artist.id} className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-emerald-300 w-8">
                      {index + 1}
                    </div>
                    {artist.images[0] && (
                      <img 
                        src={artist.images[0].url} 
                        alt={artist.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{artist.name}</p>
                      <p className="text-emerald-200 text-sm truncate">
                        {artist.genres.slice(0, 2).join(', ') || 'Various genres'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-800 text-emerald-100">
                      {artist.popularity}%
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-600">
                <p className="text-center text-emerald-200 text-sm">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button 
              onClick={() => downloadCard(topArtistsCardRef, 'my-top-artists')}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Top Artists Card
            </Button>
          </div>
        )}
      </div>

      {/* Music Stats Card */}
      <div className="space-y-4">
        <div 
          ref={statsCardRef}
          className="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-8 rounded-2xl text-white shadow-2xl max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">My Music Stats</h3>
              <p className="text-orange-200">via MyVibeLytics</p>
            </div>
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-12 w-12" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-300 mb-2">{totalPlays}</div>
              <div className="text-orange-200">Recent Plays</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-300 mb-2">{uniqueArtists}</div>
              <div className="text-red-200">Unique Artists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-300 mb-2">{avgPopularity}%</div>
              <div className="text-pink-200">Avg Popularity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">{discoveryRate}%</div>
              <div className="text-yellow-200">Discovery Rate</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-orange-600">
            <p className="text-center text-orange-200 text-sm">
              Generated on {new Date().toLocaleDateString()} • {profile?.full_name || 'Music Lover'}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => downloadCard(statsCardRef, 'my-music-stats')}
          className="w-full max-w-2xl mx-auto block"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Music Stats Card
        </Button>
      </div>
    </div>
  );
};

export default ShareableCards;
