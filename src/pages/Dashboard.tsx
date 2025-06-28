
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import useSpotifyData from '@/hooks/useSpotifyData';
import CoreInsights from '@/components/dashboard/CoreInsights';
import ListeningBehavior from '@/components/dashboard/ListeningBehavior';
import PersonalityAnalytics from '@/components/dashboard/PersonalityAnalytics';
import SpecialHighlights from '@/components/dashboard/SpecialHighlights';
import { 
  Music, 
  Clock, 
  Heart, 
  Sparkles,
  Share2,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { topTracks, topArtists, recentlyPlayed, loading, error, refetch } = useSpotifyData();
  const [activeTab, setActiveTab] = useState('core');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile?.spotify_connected) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-foreground">Spotify Connection Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please connect your Spotify account to access your music dashboard and analytics.
            </p>
            <Link to="/profile">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Music className="mr-2 h-4 w-4" />
                Connect Spotify Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLocked = !profile?.has_active_subscription && profile?.plan_tier !== 'premium';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your music insights...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl mb-4">Unable to load music data</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-gradient">Music Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Profile Settings
              </Button>
            </Link>
            <Link to="/weekly-giveaway">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Weekly Giveaway
              </Button>
            </Link>
            {(profile?.has_active_subscription || profile?.plan_tier === 'premium') && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Sparkles className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeTab === 'core' ? 'default' : 'outline'}
            onClick={() => setActiveTab('core')}
            className="text-sm"
          >
            <Music className="mr-2 h-4 w-4" />
            Core Insights
          </Button>
          <Button
            variant={activeTab === 'behavior' ? 'default' : 'outline'}
            onClick={() => setActiveTab('behavior')}
            className="text-sm"
          >
            <Clock className="mr-2 h-4 w-4" />
            Listening Behavior
          </Button>
          <Button
            variant={activeTab === 'personality' ? 'default' : 'outline'}
            onClick={() => setActiveTab('personality')}
            className="text-sm"
          >
            <Heart className="mr-2 h-4 w-4" />
            Personality & Mood
          </Button>
          <Button
            variant={activeTab === 'highlights' ? 'default' : 'outline'}
            onClick={() => setActiveTab('highlights')}
            className="text-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Special Highlights
          </Button>
          <Button
            variant={activeTab === 'cards' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cards')}
            className="text-sm"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Shareable Cards
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'core' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🎧 Core Listening Insights</h2>
            <CoreInsights
              topTracks={topTracks}
              topArtists={topArtists}
              recentlyPlayed={recentlyPlayed}
              isLocked={isLocked}
            />
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🕒 Listening Behavior & Patterns</h2>
            <ListeningBehavior
              topTracks={topTracks}
              recentlyPlayed={recentlyPlayed}
              isLocked={isLocked}
            />
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🎭 Personality & Mood Analytics</h2>
            <PersonalityAnalytics
              topTracks={topTracks}
              topArtists={topArtists}
              recentlyPlayed={recentlyPlayed}
              isLocked={isLocked}
            />
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🌟 Special Highlights</h2>
            <SpecialHighlights
              spotifyAccessToken={profile?.spotify_access_token || ''}
              spotifyUserId={profile?.spotify_user_id || ''}
              topTracks={topTracks}
              topArtists={topArtists}
              recentlyPlayed={recentlyPlayed}
              isLocked={isLocked}
              hasActiveSubscription={!!(profile?.has_active_subscription || profile?.plan_tier === 'premium')}
            />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">📱 Shareable Cards</h2>
            <Card className="glass-effect border-border/50">
              <CardContent className="text-center py-20">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Shareable Cards</h3>
                <p className="text-xl font-semibold text-muted-foreground">Coming Soon!</p>
                <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                  Create beautiful cards of your music insights to share with friends and social media.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
