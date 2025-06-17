
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Download, Music, Trophy, Heart, Sparkles, Calendar, Crown } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import html2canvas from 'html2canvas';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  popularity: number;
  uri: string;
  played_at?: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  followers: { total: number };
  images: { url: string }[];
  popularity: number;
}

interface ShareableCardsProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLocked: boolean;
  profile: any;
}

const ShareableCards: React.FC<ShareableCardsProps> = ({ 
  topTracks, 
  topArtists, 
  recentlyPlayed, 
  isLocked,
  profile 
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const downloadCard = async (cardId: string) => {
    const element = document.getElementById(cardId);
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0F172A',
        scale: 2,
        width: 400,
        height: 600
      });
      
      const link = document.createElement('a');
      link.download = `myvibelytics-${cardId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareCard = async (cardId: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${title} - MyVibeLytics`,
          text: `Check out my music stats from MyVibeLytics!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const topTrack = topTracks[0];
  const topArtist = topArtists[0];
  
  const getListeningStreak = () => {
    const dates = new Set(
      recentlyPlayed.map(track => new Date(track.played_at || '').toDateString())
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const check = new Date(today);
      check.setDate(today.getDate() - i);
      if (dates.has(check.toDateString())) streak++;
      else break;
    }
    return streak || 1;
  };

  const cards = [
    {
      id: 'top-track-card',
      title: 'Top Track',
      subtitle: 'My #1 Song',
      data: topTrack,
      type: 'track' as const,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'top-artist-card',
      title: 'Top Artist',
      subtitle: 'Most Played',
      data: topArtist,
      type: 'artist' as const,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'streak-card',
      title: 'Listening Streak',
      subtitle: 'Consecutive Days',
      data: { streak: getListeningStreak() },
      type: 'streak' as const,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'wrapped-card',
      title: 'My 2024 Wrapped',
      subtitle: 'Year in Music',
      data: { tracks: topTracks.length, artists: topArtists.length },
      type: 'wrapped' as const,
      gradient: 'from-yellow-600 to-orange-600'
    }
  ];

  const ShareableCard = ({ card }: { card: any }) => (
    <div
      id={card.id}
      className={`w-80 h-96 bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl`}
      style={{ minWidth: '320px', minHeight: '384px' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-6 w-6" />
          {profile?.has_active_subscription && (
            <Crown className="h-5 w-5 text-yellow-300" />
          )}
        </div>
        <h2 className="text-2xl font-bold">{card.title}</h2>
        <p className="text-white/80 text-sm">{card.subtitle}</p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
        {card.type === 'track' && card.data && (
          <>
            <Music className="h-16 w-16 mb-4 text-white/90" />
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{card.data.name}</h3>
            <p className="text-white/80 mb-4">{card.data.artists[0]?.name}</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #{1} Most Played
            </Badge>
          </>
        )}
        
        {card.type === 'artist' && card.data && (
          <>
            <Sparkles className="h-16 w-16 mb-4 text-white/90" />
            <h3 className="text-xl font-bold mb-2">{card.data.name}</h3>
            <p className="text-white/80 mb-4">{card.data.followers?.total?.toLocaleString()} followers</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Top Artist
            </Badge>
          </>
        )}
        
        {card.type === 'streak' && (
          <>
            <Trophy className="h-16 w-16 mb-4 text-white/90" />
            <div className="text-4xl font-bold mb-2">{card.data.streak}</div>
            <p className="text-white/80 mb-4">Days in a row</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Listening Streak
            </Badge>
          </>
        )}
        
        {card.type === 'wrapped' && (
          <>
            <Calendar className="h-16 w-16 mb-4 text-white/90" />
            <div className="text-3xl font-bold mb-1">{card.data.tracks}</div>
            <p className="text-white/80 text-sm mb-2">Top Tracks</p>
            <div className="text-2xl font-bold mb-1">{card.data.artists}</div>
            <p className="text-white/80 text-sm mb-4">Artists</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              2024 Wrapped
            </Badge>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-white/60 text-xs">Generated by MyVibeLytics</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <FeatureCard
            key={card.id}
            title={`${card.title} Card`}
            description={`Share your ${card.title.toLowerCase()} with friends`}
            icon={<Share2 className="h-5 w-5 text-primary" />}
            isLocked={isLocked}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <ShareableCard card={card} />
              </div>
              
              {!isLocked && (
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => downloadCard(card.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={() => shareCard(card.id, card.title)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </FeatureCard>
        ))}
      </div>
    </div>
  );
};

export default ShareableCards;
