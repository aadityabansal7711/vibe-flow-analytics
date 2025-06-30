
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
      icon: <Music className="h-8 w-8 text-green-500" />,
      title: "AI Curated Playlists",
      description: "Get personalized playlists with 100 unique songs tailored to your taste using advanced AI algorithms.",
      category: "AI Features"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts and visualizations showing your listening trends, peak hours, and detailed musical journey insights.",
      category: "Analytics"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Mood & Emotion Tracking",
      description: "Understand how your music reflects your emotions with sophisticated mood analysis and emotional pattern recognition.",
      category: "Psychology"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Music Community",
      description: "Connect with fellow music lovers, share your taste, and discover new songs through our vibrant community features.",
      category: "Social"
    },
    {
      icon: <Activity className="h-8 w-8 text-orange-500" />,
      title: "Listening Streaks",
      description: "Track your daily listening habits and maintain streaks to stay motivated in your musical journey.",
      category: "Gamification"
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Temporal Music Patterns",
      description: "Discover how your music taste changes throughout the day, week, and seasons with detailed temporal analysis.",
      category: "Analytics"
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8 text-cyan-500" />,
      title: "Audio Feature Analysis",
      description: "Deep technical analysis of your preferred audio characteristics like tempo, energy, danceability, and acoustics.",
      category: "Technical"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-500" />,
      title: "Music Goals & Tracking",
      description: "Set and track music discovery goals, listening targets and personal challenges to expand your musical horizons.",
      category: "Goals"
    },
    {
      icon: <Zap className="h-8 w-8 text-green-400" />,
      title: "Real-time Insights",
      description: "Live updates and instant analysis as you listen, providing immediate feedback and insights about your current session.",
      category: "Live Features"
    },
    {
      icon: <Share2 className="h-8 w-8 text-pink-500" />,
      title: "Shareable Music Cards",
      description: "Create beautiful, shareable cards showcasing your music stats, top tracks, and listening achievements for social media.",
      category: "Social"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Personality Analysis",
      description: "Discover your musical personality type based on your listening habits, genre preferences, and emotional connections.",
      category: "Psychology"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Community Chat Rooms",
      description: "Join real-time discussions in themed rooms like 'Top Tracks Talk', 'Mood Check', and 'Vibe Swap' with fellow music lovers.",
      category: "Social"
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
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Pricing
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg">
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
              <Crown className="h-5 w-5 animate-pulse" />
              <span className="font-medium">Weekly Premium Giveaway - Premium Users Only!</span>
            </div>
            <Link to="/weekly-giveaway">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 transition-all duration-200">
                Premium Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-400/30 text-lg px-6 py-3 animate-fade-in font-semibold backdrop-blur-sm">
            🎵 Music Analytics Platform
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-bold text-gradient mb-8 animate-fade-in">
            Discover Your
            <br />
            <span className="text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text animate-pulse drop-shadow-lg">Music DNA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in">
            Unlock deep insights into your Spotify listening habits with cutting-edge AI analytics. 
            Discover patterns, moods, and hidden connections in your music that you never knew existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-110 transform transition-all duration-300 shadow-xl text-lg px-8 py-4">
                <Music className="mr-3 h-6 w-6" />
                Start Your Analysis
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                <Crown className="mr-3 h-5 w-5" />
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Unlock Your Music Analytics
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From basic insights to advanced AI-powered analysis of your musical journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect card-hover relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl border-border/50 hover:border-primary/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-2 rounded-lg bg-background/50 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1 opacity-70">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-12 rounded-3xl backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              Ready to Discover Your Music DNA?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Connect your Spotify account and start exploring your musical personality today.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-110 transform transition-all duration-300 shadow-xl text-lg px-10 py-5">
                <Music className="mr-3 h-6 w-6" />
                Get Started Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <span className="text-xl font-semibold text-foreground">MyVibeLyrics</span>
            </div>
            <div className="flex space-x-8 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors hover:scale-105 transform duration-200">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors hover:scale-105 transform duration-200">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors hover:scale-105 transform duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
