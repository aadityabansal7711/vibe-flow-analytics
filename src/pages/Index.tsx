
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Play, 
  TrendingUp, 
  Music, 
  Headphones, 
  Sparkles, 
  ArrowRight,
  User,
  Heart,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Star,
  Shuffle,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  Disc3,
  Palette,
  PieChart,
  Volume2,
  Mic2,
  Radio
} from 'lucide-react';

const Index = () => {
  const { user, login } = useAuth();

  const features = [
    { icon: <Music className="h-5 w-5" />, title: "Top Tracks", description: "Your most played songs of all time" },
    { icon: <User className="h-5 w-5" />, title: "Top Artists", description: "Your favorite musicians and bands" },
    { icon: <Heart className="h-5 w-5" />, title: "Most Played Song", description: "Your ultimate favorite track ever" },
    { icon: <Sparkles className="h-5 w-5" />, title: "Wrapped 2024", description: "Your year in music highlights" },
    { icon: <Shuffle className="h-5 w-5" />, title: "AI Playlist", description: "Personalized playlists based on your taste" },
    { icon: <Clock className="h-5 w-5" />, title: "Time Preferences", description: "Morning vs night listening patterns" },
    { icon: <Calendar className="h-5 w-5" />, title: "Weekday vs Weekend", description: "How your listening changes by day" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "Monthly Trends", description: "Your listening evolution over time" },
    { icon: <Headphones className="h-5 w-5" />, title: "Daily Hours", description: "Average listening time per day" },
    { icon: <Activity className="h-5 w-5" />, title: "Listening Streaks", description: "Consecutive days of music" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "Year Comparison", description: "Compare your music habits yearly" },
    { icon: <Star className="h-5 w-5" />, title: "Music Personality", description: "Your unique musical profile" },
    { icon: <Heart className="h-5 w-5" />, title: "Mood in Music", description: "Emotional patterns in your listening" },
    { icon: <Calendar className="h-5 w-5" />, title: "Mood Timeline", description: "Month-wise and day-wise mood analysis" },
    { icon: <Timer className="h-5 w-5" />, title: "Hourly Favorites", description: "Top tracks by specific time blocks" },
    { icon: <PieChart className="h-5 w-5" />, title: "Top Genres", description: "Your musical taste breakdown" },
    { icon: <Trophy className="h-5 w-5" />, title: "Milestones", description: "Your music journey achievements" },
    { icon: <Zap className="h-5 w-5" />, title: "Hidden Gems", description: "Underrated songs you love" },
    { icon: <RotateCcw className="h-5 w-5" />, title: "Skip Analysis", description: "Songs completed vs skipped ratio" },
    { icon: <Target className="h-5 w-5" />, title: "Replay Score", description: "How often you replay favorites" },
    { icon: <Disc3 className="h-5 w-5" />, title: "Favorite Era", description: "Your preferred music decades" },
    { icon: <Palette className="h-5 w-5" />, title: "Genre Mood Map", description: "Interactive genre-emotion visualization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Music className="h-8 w-8 text-primary animate-pulse-slow" />
              <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={login} 
                className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 h-4 w-4" />
                Login with Spotify
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-8">
            <div className="relative">
              <Headphones className="h-24 w-24 text-primary mx-auto animate-float" />
              <div className="absolute inset-0 h-24 w-24 text-primary/20 animate-glow rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight">
            MyVibeLytics
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl leading-relaxed">
            Unlock the hidden patterns in your Spotify listening habits. Discover deep insights about your music taste with beautiful, interactive visualizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-xl px-8 py-4 text-lg font-semibold">
                  View Your Analytics <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={login} 
                size="lg" 
                className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-xl px-8 py-4 text-lg font-semibold"
              >
                Get Started Free <Play className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Link to="/buy">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary hover:scale-105 transform transition-all duration-200 px-8 py-4 text-lg font-semibold glass-effect"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                View Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Unlock Your Music DNA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover 22+ powerful insights about your Spotify listening habits
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect card-hover group cursor-pointer border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-foreground text-sm font-semibold">
                    <div className="text-primary group-hover:scale-110 transition-transform duration-200 p-2 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <span className="leading-tight">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="px-6 py-16 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-12">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/dashboard">
              <Card className="glass-effect card-hover group cursor-pointer border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 relative">
                    <BarChart3 className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Dashboard</h3>
                  <p className="text-muted-foreground text-sm">View all your analytics</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/buy">
              <Card className="glass-effect card-hover group cursor-pointer border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 relative">
                    <Sparkles className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Premium</h3>
                  <p className="text-muted-foreground text-sm">Unlock all features</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/contact">
              <Card className="glass-effect card-hover group cursor-pointer border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 relative">
                    <Mic2 className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Contact</h3>
                  <p className="text-muted-foreground text-sm">Get help & support</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/privacy">
              <Card className="glass-effect card-hover group cursor-pointer border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 relative">
                    <Radio className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Privacy</h3>
                  <p className="text-muted-foreground text-sm">Your data is secure</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/30 glass-effect-strong">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-foreground font-bold text-lg">MyVibeLytics</span>
            </div>
            <div className="flex space-x-8 text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors duration-200 font-medium">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors duration-200 font-medium">Privacy</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200 font-medium">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 MyVibeLytics. Discover your music DNA with beautiful analytics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
