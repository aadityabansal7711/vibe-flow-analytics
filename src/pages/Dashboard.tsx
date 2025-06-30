
import React, { useState, useEffect, useCallback } from 'react';
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
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { topTracks, topArtists, recentlyPlayed, loading: dataLoading, error, refetch } = useSpotifyData();
  const [activeTab, setActiveTab] = useState('core');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConnectingMessage, setShowConnectingMessage] = useState(false);

  // Check if user has premium access
  const hasPremiumAccess = profile?.has_active_subscription || profile?.plan_tier === 'premium';

  // Show connecting message for 3 seconds when profile loads but spotify isn't connected yet
  useEffect(() => {
    if (profile && !profile.spotify_connected && !authLoading && !showConnectingMessage) {
      setShowConnectingMessage(true);
      const timer = setTimeout(() => {
        setShowConnectingMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profile?.spotify_connected, authLoading]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <div className="text-white text-xl">Loading your account...</div>
          <div className="text-muted-foreground mt-2">Please wait...</div>
        </div>
      </div>
    );
  }

  if (showConnectingMessage || (!profile?.spotify_connected && !dataLoading)) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
        <Card className="max-w-md w-full glass-effect">
          <CardHeader className="text-center">
            {showConnectingMessage ? (
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            )}
            <CardTitle className="text-2xl text-foreground">
              {showConnectingMessage ? 'Setting up your account...' : 'Spotify Connection Required'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {showConnectingMessage 
                ? 'Please wait while we prepare your dashboard...'
                : 'Please connect your Spotify account to access your music dashboard and analytics.'
              }
            </p>
            {!showConnectingMessage && (
              <Link to="/profile">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-200">
                  <Music className="mr-2 h-4 w-4" />
                  Connect Spotify Account
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLocked = !hasPremiumAccess;

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your music insights...</div>
          <div className="text-muted-foreground mt-2">This may take a few moments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
        <Card className="max-w-md w-full glass-effect">
          <CardContent className="text-center py-8">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl mb-4 text-foreground">Getting your music ready...</h2>
            <p className="text-muted-foreground mb-6">
              We're setting up your personalized analytics. This usually takes just a moment.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="w-full"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Continue
                  </>
                )}
              </Button>
              <Link to="/profile">
                <Button variant="outline" className="w-full">
                  Check Spotify Connection
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-10 w-10" />
            <h1 className="text-4xl font-bold text-gradient">Music Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Link to="/profile">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted hover:scale-105 transition-all duration-200">
                Profile Settings
              </Button>
            </Link>
            <Link to="/weekly-giveaway">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted hover:scale-105 transition-all duration-200">
                Weekly Giveaway
              </Button>
            </Link>
            {hasPremiumAccess && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400 animate-pulse">
                <Sparkles className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 p-1 bg-background/20 rounded-lg backdrop-blur-sm">
          <Button
            variant={activeTab === 'core' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('core')}
            className="text-sm hover:scale-105 transition-all duration-200"
          >
            <Music className="mr-2 h-4 w-4" />
            Core Insights
          </Button>
          <Button
            variant={activeTab === 'behavior' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('behavior')}
            className="text-sm hover:scale-105 transition-all duration-200"
          >
            <Clock className="mr-2 h-4 w-4" />
            Listening Behavior
          </Button>
          <Button
            variant={activeTab === 'personality' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('personality')}
            className="text-sm hover:scale-105 transition-all duration-200"
          >
            <Heart className="mr-2 h-4 w-4" />
            Personality & Mood
          </Button>
          <Button
            variant={activeTab === 'highlights' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('highlights')}
            className="text-sm hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Special Highlights
          </Button>
          <Button
            variant={activeTab === 'cards' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('cards')}
            className="text-sm hover:scale-105 transition-all duration-200"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Shareable Cards
          </Button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'core' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                🎧 <span className="ml-2">Core Listening Insights</span>
              </h2>
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
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                🕒 <span className="ml-2">Listening Behavior & Patterns</span>
              </h2>
              <ListeningBehavior
                topTracks={topTracks}
                recentlyPlayed={recentlyPlayed}
                isLocked={isLocked}
              />
            </div>
          )}

          {activeTab === 'personality' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                🎭 <span className="ml-2">Personality & Mood Analytics</span>
              </h2>
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
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                🌟 <span className="ml-2">Special Highlights</span>
              </h2>
              <SpecialHighlights
                spotifyAccessToken={profile?.spotify_access_token || ''}
                spotifyUserId={profile?.spotify_user_id || ''}
                topTracks={topTracks}
                topArtists={topArtists}
                recentlyPlayed={recentlyPlayed}
                isLocked={isLocked}
                hasActiveSubscription={hasPremiumAccess}
              />
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                📱 <span className="ml-2">Shareable Cards</span>
              </h2>
              <Card className="glass-effect border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="text-center py-20">
                  <div className="text-8xl mb-6 animate-pulse">🎁</div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Shareable Cards</h3>
                  <p className="text-xl font-semibold text-primary mb-2">Coming Soon!</p>
                  <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto leading-relaxed">
                    Create beautiful cards of your music insights to share with friends and social media.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
