import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSpotify } from '@/contexts/SpotifyContext';
import CoreInsights from '@/components/dashboard/CoreInsights';
import ListeningBehavior from '@/components/dashboard/ListeningBehavior';
import PersonalityAnalytics from '@/components/dashboard/PersonalityAnalytics';
import ShareableCards from '@/components/dashboard/ShareableCards';
import SpecialHighlights from '@/components/dashboard/SpecialHighlights';
import { 
  Sparkles, 
  Lock, 
  Share,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { spotifyData, fetchSpotifyData } = useSpotify();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSpotifyData()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [user, fetchSpotifyData]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <img src="/lovable-uploads/7ff9a618-2e78-44bd-be12-56d460d9c38c.png" alt="MyVibeLytics" className="h-10 w-10" />
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
          <div className="flex items-center space-x-4">
            {profile?.has_active_subscription && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Sparkles className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
            <Link to="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <Card className="glass-effect border-border/50 p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gradient">
                Welcome, {profile?.full_name || user?.email}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dive into your personalized music analytics and discover what your Spotify listening habits reveal about you.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Profile */}
          <Link to="/profile" className="group">
            <Card className="glass-effect border-border/50 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <img
                    src={profile?.profile_picture_url || "/placeholder-profile.png"}
                    alt="Profile"
                    className="h-6 w-6 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                  <p className="text-muted-foreground text-sm">Manage your account settings</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Spotify Connect */}
          <Link to="/profile" className="group">
            <Card className="glass-effect border-border/50 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <img
                    src={profile?.spotify_avatar_url || "/spotify-logo.png"}
                    alt="Spotify"
                    className="h-6 w-6 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Spotify</h3>
                  <p className="text-muted-foreground text-sm">Connect or manage your Spotify account</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Pricing */}
          <Link to="/pricing" className="group">
            <Card className="glass-effect border-border/50 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
                  <p className="text-muted-foreground text-sm">Explore premium features and plans</p>
                </div>
              </div>
            </Card>
          </Link>
          
          {/* Community Chat */}
          <Link to="/community" className="group">
            <Card className="glass-effect border-border/50 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Community</h3>
                  <p className="text-muted-foreground text-sm">Chat with music lovers</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Premium Features Section */}
        {!profile?.has_active_subscription && (
          <div className="mb-8">
            <Card className="glass-effect border-border/50 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gradient mb-4">Unlock Premium Features</h2>
                <p className="text-muted-foreground mb-6">
                  Get deeper insights, advanced analytics, and exclusive features with our premium subscription.
                </p>
                <Link to="/pricing">
                  <Button className="bg-gradient-spotify">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Sections */}
        <div className="space-y-8">
          {/* Core Insights */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-6">Your Music Insights</h2>
            <CoreInsights spotifyData={spotifyData} />
          </div>

          {/* Listening Behavior */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-6">Listening Behavior</h2>
            <ListeningBehavior spotifyData={spotifyData} />
          </div>

          {/* Personality Analytics - Premium Feature */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Personality Analytics</h2>
              {!profile?.has_active_subscription && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
            {profile?.has_active_subscription ? (
              <PersonalityAnalytics spotifyData={spotifyData} />
            ) : (
              <Card className="glass-effect border-border/50 p-8 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Unlock detailed personality insights based on your music preferences
                </p>
                <Link to="/pricing">
                  <Button variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Shareable Cards - Premium Feature */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Shareable Music Cards</h2>
              {!profile?.has_active_subscription && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
            {profile?.has_active_subscription ? (
              <ShareableCards spotifyData={spotifyData} />
            ) : (
              <Card className="glass-effect border-border/50 p-8 text-center">
                <Share className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Create beautiful, shareable cards of your music insights and stats
                </p>
                <Link to="/pricing">
                  <Button variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Special Highlights */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-6">Special Highlights</h2>
            <SpecialHighlights spotifyData={spotifyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
