import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { Music, BarChart3, Heart, Users, Sparkles, TrendingUp, Clock, Headphones, Target, Zap, Star, Share2, Gift, Crown, Trophy, Calendar, Activity, SkipForward, RotateCcw, MessageCircle, Brain, Palette, Globe, Mic, Radio, Disc, Volume2, PlayCircle, Shuffle, Repeat, Search, Filter, Download, Upload, Settings, Eye, Lock, Unlock, Flame, Award, Lightbulb, Compass, Headset, Shield } from 'lucide-react';

const Index = () => {
  const allFeatures = [
    {
      icon: <Music className="h-6 w-6 text-green-400" />,
      title: "AI Curated Playlists",
      description: "Get personalized playlists with 100 unique songs tailored to your taste using advanced AI algorithms.",
      isLocked: false
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts and visualizations showing your listening trends, peak hours, and detailed musical journey insights.",
      isLocked: false
    },
    {
      icon: <Heart className="h-6 w-6 text-red-400" />,
      title: "Mood & Emotion Tracking",
      description: "Understand how your music reflects your emotions with sophisticated mood analysis and emotional pattern recognition.",
      isLocked: false
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Music Community",
      description: "Connect with fellow music lovers, share your taste, and discover new songs through our vibrant community features.",
      isLocked: false
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-400" />,
      title: "Listening Streaks",
      description: "Track your daily listening habits and maintain streaks to stay motivated in your musical journey.",
      isLocked: false
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
      title: "Temporal Music Patterns",
      description: "Discover how your music taste changes throughout the day, week, and seasons with detailed temporal analysis.",
      isLocked: false
    },
    {
      icon: <Headphones className="h-6 w-6 text-cyan-400" />,
      title: "Audio Feature Analysis",
      description: "Deep technical analysis of your preferred audio characteristics like tempo, energy, danceability, and acoustics.",
      isLocked: false
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-400" />,
      title: "Music Goals & Tracking",
      description: "Set and track music discovery goals, listening targets, and personal challenges to expand your musical horizons.",
      isLocked: false
    },
    {
      icon: <Zap className="h-6 w-6 text-pink-400" />,
      title: "Real-time Insights",
      description: "Live updates and instant analysis as you listen, providing immediate feedback and insights about your current session.",
      isLocked: false
    },
    {
      icon: <Share2 className="h-6 w-6 text-teal-400" />,
      title: "Shareable Music Cards",
      description: "Create beautiful, shareable cards showcasing your music stats, top tracks, and listening achievements for social media.",
      isLocked: false
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-400" />,
      title: "Personality Analysis",
      description: "Discover your musical personality type based on your listening habits, genre preferences, and emotional connections.",
      isLocked: false
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-emerald-400" />,
      title: "Community Chat Rooms",
      description: "Join real-time discussions in themed rooms like 'Top Tracks Talk', 'Mood Check', and 'Vibe Swap' with fellow music lovers.",
      isLocked: false
    },
    {
      icon: <Palette className="h-6 w-6 text-rose-400" />,
      title: "Mood-Based Recommendations",
      description: "Get song suggestions based on your current emotional state and desired mood transitions throughout your day.",
      isLocked: false
    },
    {
      icon: <Globe className="h-6 w-6 text-amber-400" />,
      title: "Global Music Trends",
      description: "Compare your taste with worldwide trends and discover what's popular in different regions and cultures.",
      isLocked: false
    },
    {
      icon: <Activity className="h-6 w-6 text-lime-400" />,
      title: "Listening Activity Timeline",
      description: "Visual timeline of your music journey showing how your taste evolved over months and years.",
      isLocked: false
    },
    {
      icon: <Award className="h-6 w-6 text-gold-400" />,
      title: "Music Achievements",
      description: "Unlock badges and achievements for discovering new genres, maintaining streaks, and exploring diverse artists.",
      isLocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MyVibeLyrics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/buy">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-all duration-300">
                  <Crown className="mr-2 h-4 w-4" />
                  Pricing
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Giveaway Banner */}
      <section className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-b border-amber-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4 text-center">
            <Crown className="h-6 w-6 text-amber-500 animate-bounce" />
            <span className="text-lg font-semibold text-amber-700 dark:text-amber-300">
              🎉 Weekly Premium Giveaway - Premium Users Only!
            </span>
            <Link to="/weekly-giveaway">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 transform hover:scale-105">
                <Gift className="mr-2 h-4 w-4" />
                Premium Entry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-12">
            <Badge variant="outline" className="text-primary border-primary/50 mb-8 bg-primary/5 px-4 py-2 animate-pulse-slow">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Music Analytics Platform
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Music DNA
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Unlock deep insights into your Spotify listening habits with cutting-edge AI analytics. 
              Discover patterns, moods, and hidden connections in your music that you never knew existed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-10 py-4 text-lg rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 animate-glow">
                <Music className="mr-3 h-6 w-6" />
                Start Your Analysis
              </Button>
            </Link>
            <Link to="/buy">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105">
                <Crown className="mr-3 h-6 w-6" />
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* All Features Grid - Unblurred */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="text-primary border-primary/50 mb-6 bg-primary/5 px-4 py-2">
              <Zap className="mr-2 h-4 w-4" />
              Complete Feature Set
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <Music className="inline-block mr-4 h-12 w-12 text-primary" />
              Everything You Need for
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Music Analytics
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools and insights to understand your music like never before - all features unlocked
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFeatures.map((feature, index) => (
              <div
                key={index}
                className="group card-hover bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl card-hover">
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 mb-8 bg-yellow-500/5 px-4 py-2">
              <Star className="mr-2 h-5 w-5" />
              Premium Experience
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <Crown className="inline-block mr-4 h-12 w-12 text-primary" />
              Unlock Advanced
              <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Analytics & Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Get access to premium features including AI playlists, detailed mood analysis, 
              social comparisons, unlimited shareable cards, and exclusive weekly giveaways.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/buy">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Go Premium Now
                </Button>
              </Link>
              <Link to="/weekly-giveaway">
                <Button size="lg" variant="outline" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950 px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105">
                  <Gift className="mr-3 h-6 w-6" />
                  Premium Giveaway
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/90 backdrop-blur-xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-semibold text-foreground mb-6 text-lg flex items-center">
                <Music className="mr-2 h-5 w-5 text-primary" />
                Product
              </h3>
              <ul className="space-y-3">
                <li><Link to="/buy" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/weekly-giveaway" className="text-muted-foreground hover:text-primary transition-colors">Premium Giveaway</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6 text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Company
              </h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6 text-lg flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Legal
              </h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
                <li><Link to="/cancellation-policy" className="text-muted-foreground hover:text-primary transition-colors">Cancellation Policy</Link></li>
                <li><Link to="/shipping-delivery" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6 text-lg flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Connect
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-10 w-10" />
                <span className="text-muted-foreground font-medium">MyVibeLyrics</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover your music DNA with AI-powered insights
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 MyVibeLyrics. All rights reserved. Made with ❤️ for music lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
