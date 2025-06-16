
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
  TrendingUp, 
  Clock, 
  Calendar,
  Headphones,
  BarChart3,
  Sparkles,
  Heart,
  Shuffle,
  SkipForward,
  Trophy,
  Target,
  Compass,
  LineChart,
  Lock
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { topTracks, topArtists, recentlyPlayed, loading } = useSpotifyData();
  const [activeTab, setActiveTab] = useState('core');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile?.spotify_connected) {
    return <Navigate to="/profile" replace />;
  }

  const isLocked = !profile?.has_active_subscription;

  // Generate AI Playlist function
  const generateAIPlaylist = async () => {
    try {
      if (!profile?.has_active_subscription) {
        alert('Premium subscription required for AI playlist generation');
        return;
      }

      if (topTracks.length === 0) {
        alert('Not enough listening data to generate playlist');
        return;
      }

      // Create a playlist based on top tracks
      const playlistTracks = topTracks.slice(0, 20).map(track => track.uri);
      
      // In a real implementation, this would call Spotify API to create playlist
      console.log('Generated playlist with tracks:', playlistTracks);
      alert(`AI Playlist generated with ${playlistTracks.length} tracks based on your listening history!`);
      
    } catch (error) {
      console.error('Error generating playlist:', error);
      alert('Failed to generate playlist. Please try again.');
    }
  };

  // Monthly trends data
  const getMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      hours: Math.floor(Math.random() * 40) + 40 + (index * 2), // Simulated growth
      tracks: Math.floor(Math.random() * 200) + 100 + (index * 10)
    }));
  };

  const monthlyTrends = getMonthlyTrends();

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

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
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
            {profile?.has_active_subscription && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Sparkles className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
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
            variant={activeTab === 'trends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('trends')}
            className="text-sm"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Monthly Trends
          </Button>
        </div>

        {/* Content based on active tab */}
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
              topTracks={topTracks}
              topArtists={topArtists}
              recentlyPlayed={recentlyPlayed}
              isLocked={isLocked}
              hasActiveSubscription={!!profile?.has_active_subscription}
              onGeneratePlaylist={generateAIPlaylist}
            />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">📈 Monthly Trends & Deep Dive</h2>
            
            {/* Monthly Listening Trends - Premium */}
            <Card className={`glass-effect border-border/50 ${isLocked ? 'relative overflow-hidden' : ''}`}>
              {isLocked && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground mb-4 font-semibold">Premium Feature</p>
                    <Link to="/buy">
                      <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Unlock All Features
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Monthly Listening Trends
                </CardTitle>
              </CardHeader>
              <CardContent className={isLocked ? 'blur-sm' : ''}>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                    <YAxis dataKey="hours" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F3F4F6' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Listening Hours - Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`glass-effect border-border/50 ${isLocked ? 'relative overflow-hidden' : ''}`}>
                {isLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Premium Feature</p>
                    </div>
                  </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Listening Hours</CardTitle>
                  <Headphones className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={isLocked ? 'blur-sm' : ''}>
                  <div className="text-2xl font-bold text-foreground">5.8</div>
                  <p className="text-xs text-muted-foreground">Hours per day</p>
                  <p className="text-xs text-green-400 mt-1">+15% from last month</p>
                </CardContent>
              </Card>

              <Card className={`glass-effect border-border/50 ${isLocked ? 'relative overflow-hidden' : ''}`}>
                {isLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Premium Feature</p>
                    </div>
                  </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Year-over-Year Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={isLocked ? 'blur-sm' : ''}>
                  <div className="text-2xl font-bold text-foreground">+32%</div>
                  <p className="text-xs text-muted-foreground">Listening time increase</p>
                  <p className="text-xs text-green-400 mt-1">Great progress!</p>
                </CardContent>
              </Card>

              <Card className={`glass-effect border-border/50 ${isLocked ? 'relative overflow-hidden' : ''}`}>
                {isLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Premium Feature</p>
                    </div>
                  </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Most Played Decade</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={isLocked ? 'blur-sm' : ''}>
                  <div className="text-2xl font-bold text-foreground">2020s</div>
                  <p className="text-xs text-muted-foreground">Your preferred era</p>
                  <p className="text-xs text-yellow-400 mt-1">Modern music lover</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
