
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
  Album,
  Heart,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Volume2,
  Shuffle,
  RotateCcw,
  MapPin,
  Target,
  Mic2,
  Radio,
  Timer,
  Trophy,
  Disc3,
  Palette
} from 'lucide-react';

const Index = () => {
  const { user, login } = useAuth();

  const features = [
    { icon: <Music className="h-6 w-6" />, title: "Top Tracks", description: "Your most played songs" },
    { icon: <User className="h-6 w-6" />, title: "Top Artists", description: "Your favorite musicians" },
    { icon: <Heart className="h-6 w-6" />, title: "Most Played Song of All Time", description: "Your ultimate favorite track" },
    { icon: <Sparkles className="h-6 w-6" />, title: "Wrapped in 2024 Music", description: "Your year in music" },
    { icon: <Shuffle className="h-6 w-6" />, title: "Make a Playlist Based on My Listening", description: "AI-generated playlists" },
    { icon: <Clock className="h-6 w-6" />, title: "Time of Day Preference Morning vs Night", description: "When you listen most" },
    { icon: <Calendar className="h-6 w-6" />, title: "Weekday vs Weekend Listening", description: "Listening pattern differences" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Monthly Listening Trends", description: "Listening over time" },
    { icon: <Headphones className="h-6 w-6" />, title: "Average Listening Hours per Day", description: "Daily listening statistics" },
    { icon: <Activity className="h-6 w-6" />, title: "Listening Streaks", description: "Consecutive days of listening" },
    { icon: <BarChart3 className="h-6 w-6" />, title: "Year-over-Year Comparison", description: "Compare your music habits" },
    { icon: <Star className="h-6 w-6" />, title: "Music Personality Profile", description: "Your musical profile" },
    { icon: <Heart className="h-6 w-6" />, title: "Your Mood in Music (2024)", description: "Emotional patterns in your music" },
    { icon: <Calendar className="h-6 w-6" />, title: "Month-wise & Day-wise Mood", description: "Mood tracking over time" },
    { icon: <Timer className="h-6 w-6" />, title: "Most Played Music at Specific Times", description: "Top tracks by hour block" },
    { icon: <PieChart className="h-6 w-6" />, title: "Top Genres of the Year", description: "Your musical taste breakdown" },
    { icon: <Trophy className="h-6 w-6" />, title: "Listening Milestones Timeline", description: "Your music journey milestones" },
    { icon: <Zap className="h-6 w-6" />, title: "Hidden Gem: Most Played Underrated", description: "Underrated songs you love" },
    { icon: <RotateCcw className="h-6 w-6" />, title: "Skips vs Completions Ratio", description: "Songs played vs skipped" },
    { icon: <Target className="h-6 w-6" />, title: "Replay Value Score", description: "How often you replay songs" },
    { icon: <Disc3 className="h-6 w-6" />, title: "Most Played Decade / Era", description: "Your favorite music eras" },
    { icon: <Palette className="h-6 w-6" />, title: "Genre Mood Map", description: "Interactive genre-mood visualization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 glass-effect">
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">MyVibeLytics</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Button onClick={login} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Login with Spotify
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8 animate-bounce">
          <Headphones className="h-24 w-24 text-primary mx-auto animate-glow" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-gradient">
          MyVibeLytics
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
          Discover the hidden patterns in your music. Unlock deep insights about your Spotify listening habits with beautiful visualizations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                View Analytics <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button onClick={login} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
              Get Started Free <Play className="ml-2 h-5 w-5" />
            </Button>
          )}
          <Link to="/buy">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Unlock Your Music DNA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3 text-foreground text-sm">
                    <div className="text-primary group-hover:scale-110 transition-transform">
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
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/dashboard">
              <Card className="glass-effect hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard</h3>
                  <p className="text-muted-foreground text-sm">View all your analytics</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/buy">
              <Card className="glass-effect hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pricing</h3>
                  <p className="text-muted-foreground text-sm">Unlock premium features</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/contact">
              <Card className="glass-effect hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Mic2 className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Contact</h3>
                  <p className="text-muted-foreground text-sm">Get in touch with us</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/privacy">
              <Card className="glass-effect hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Radio className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Privacy</h3>
                  <p className="text-muted-foreground text-sm">Your data is safe</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border glass-effect">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-foreground font-semibold">MyVibeLytics</span>
            </div>
            <div className="flex space-x-6 text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
