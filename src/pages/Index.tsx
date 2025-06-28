
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Music, 
  BarChart3, 
  Brain, 
  Users, 
  Crown, 
  Sparkles, 
  ArrowRight,
  Star,
  CheckCircle,
  HeadphonesIcon,
  TrendingUp,
  Zap,
  Clock,
  Heart,
  Share2,
  Target,
  Activity,
  MessageCircle,
  Award,
  Calendar,
  Globe,
  Mic
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Music className="h-6 w-6 text-green-500" />,
      title: "AI Curated Playlists",
      description: "Get personalized playlists with 100 unique songs tailored to your taste using advanced AI algorithms.",
      isPremium: true
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts and visualizations showing your listening trends, peak hours, and detailed musical journey insights.",
      isPremium: true
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Mood & Emotion Tracking",
      description: "Understand how your music reflects your emotions with sophisticated mood analysis and emotional pattern recognition.",
      isPremium: true
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Music Community",
      description: "Connect with fellow music lovers, share your taste, and discover new songs through our vibrant community features.",
      isPremium: false
    },
    {
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      title: "Listening Streaks",
      description: "Track your daily listening habits and maintain streaks to stay motivated in your musical journey.",
      isPremium: false
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      title: "Temporal Music Patterns",
      description: "Discover how your music taste changes throughout the day, week, and seasons with detailed temporal analysis.",
      isPremium: true
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6 text-cyan-500" />,
      title: "Audio Feature Analysis",
      description: "Deep technical analysis of your preferred audio characteristics like tempo, energy, danceability, and acoustics.",
      isPremium: true
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-500" />,
      title: "Music Goals & Tracking",
      description: "Set and track music discovery goals, listening targets and personal challenges to expand your musical horizons.",
      isPremium: true
    },
    {
      icon: <Zap className="h-6 w-6 text-green-400" />,
      title: "Real-time Insights",
      description: "Live updates and instant analysis as you listen, providing immediate feedback and insights about your current session.",
      isPremium: true
    },
    {
      icon: <Share2 className="h-6 w-6 text-pink-500" />,
      title: "Shareable Music Cards",
      description: "Create beautiful, shareable cards showcasing your music stats, top tracks, and listening achievements for social media.",
      isPremium: true
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      title: "Personality Analysis",
      description: "Discover your musical personality type based on your listening habits, genre preferences, and emotional connections.",
      isPremium: true
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      title: "Community Chat Rooms",
      description: "Join real-time discussions in themed rooms like 'Top Tracks Talk', 'Mood Check', and 'Vibe Swap' with fellow music lovers.",
      isPremium: true
    },
    {
      icon: <Award className="h-6 w-6 text-red-600" />,
      title: "Mood-Based Recommendations",
      description: "Get song suggestions based on your current emotional state and desired mood transitions throughout your day.",
      isPremium: true
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Global Music Trends",
      description: "Compare your taste with worldwide trends and discover what's popular in different regions and cultures.",
      isPremium: true
    },
    {
      icon: <Calendar className="h-6 w-6 text-amber-500" />,
      title: "Listening Activity Timeline",
      description: "Visual timeline of your music journey showing how your taste evolved over months and years.",
      isPremium: true
    },
    {
      icon: <Mic className="h-6 w-6 text-rose-500" />,
      title: "Music Achievements",
      description: "Unlock badges and achievements for discovering new genres, maintaining listening streaks, and exploring diverse music.",
      isPremium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <span className="text-xl font-bold text-gradient">MyVibeLyrics</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pricing">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Pricing
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                  <Music className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Weekly Giveaway Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400">
              <Crown className="h-5 w-5" />
              <span className="font-medium">Weekly Premium Giveaway - Premium Users Only!</span>
            </div>
            <Link to="/weekly-giveaway">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                Premium Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🎵 AI-Powered Music Analytics Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient mb-6">
            Discover Your
            <br />
            <span className="text-primary">Music DNA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Unlock deep insights into your Spotify listening habits with cutting-edge AI analytics. 
            Discover patterns, moods, and hidden connections in your music that you never knew existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Music className="mr-2 h-6 w-6" />
                Start Your Analysis
              </Button>
            </Link>
            <Link to="/buy">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Crown className="mr-2 h-5 w-5" />
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Unlock Your Music Analytics
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From basic insights to advanced AI-powered analysis of your musical journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`glass-effect card-hover relative ${feature.isPremium ? 'border-primary/30' : 'border-border/50'}`}>
                {feature.isPremium && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs">
                    <Crown className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Ready to Discover Your Music DNA?
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect your Spotify account and start exploring your musical personality today.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Music className="mr-2 h-6 w-6" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-6 w-6" />
              <span className="text-lg font-semibold text-foreground">MyVibeLyrics</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
