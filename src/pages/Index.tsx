
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Play, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Music, 
  Star, 
  Clock, 
  Heart,
  Sparkles,
  Crown,
  Shield,
  ArrowRight,
  CheckCircle,
  Gift,
  Calendar,
  Activity,
  Zap,
  RotateCcw,
  Shuffle,
  PieChart,
  HeadphonesIcon
} from "lucide-react";
import { Instagram } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <Music className="h-8 w-8 text-primary" />,
      title: "Top Tracks & Artists",
      description: "Discover your most played songs and favorite artists with detailed listening statistics"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-400" />,
      title: "Listening Trends",
      description: "Track your music habits over time with beautiful charts and analytics"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: "Genre Distribution",
      description: "See your musical taste breakdown across different genres and moods"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-400" />,
      title: "Time Patterns",
      description: "Understand when and how you listen to music throughout the day"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-400" />,
      title: "Music Personality",
      description: "Get insights into your musical personality and listening habits"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: "Hidden Gems",
      description: "Discover underrated tracks you love and new music recommendations"
    },
    {
      icon: <Shuffle className="h-8 w-8 text-green-500" />,
      title: "AI Playlist Generator",
      description: "Generate custom playlists based on your listening patterns and preferences"
    },
    {
      icon: <Activity className="h-8 w-8 text-red-500" />,
      title: "Listening Streaks",
      description: "Track your consecutive days of music listening and beat your records"
    },
    {
      icon: <Calendar className="h-8 w-8 text-indigo-400" />,
      title: "Weekday vs Weekend Analysis",
      description: "Compare your music preferences between work days and weekends"
    },
    {
      icon: <PieChart className="h-8 w-8 text-purple-500" />,
      title: "Genre Deep Dive",
      description: "Detailed breakdown of your favorite music genres with visual charts"
    },
    {
      icon: <Zap className="h-8 w-8 text-cyan-400" />,
      title: "Music Discovery Score",
      description: "See how adventurous you are with discovering new artists and songs"
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-orange-400" />,
      title: "Skip Rate & Replay Analysis",
      description: "Understand your listening behavior with skip rates and replay statistics"
    }
  ];

  const premiumFeatures = [
    "Advanced Analytics Dashboard",
    "AI-Generated Playlists",
    "Detailed Listening History", 
    "Music Mood Analysis",
    "Personalized Insights",
    "Export Your Data",
    "Priority Support",
    "Early Access to New Features"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-10 w-10" />
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/demo">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                View Demo
              </Button>
            </Link>
            <Link to="/weekly-giveaway">
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                <Gift className="mr-2 h-4 w-4" />
                Weekly Giveaway
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-spotify text-white">
              <Sparkles className="mr-1 h-4 w-4" />
              Your Music, Analyzed
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Discover Your Music DNA
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect your Spotify account and unlock deep insights into your listening habits, 
              discover new music, and see your musical journey like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                  <Play className="mr-2 h-6 w-6" />
                  Connect Spotify Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                  See Demo
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Powerful Music Analytics
            </h2>
            <p className="text-xl text-muted-foreground">
              Get insights that Spotify doesn't show you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Giveaway Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Gift className="mr-1 h-4 w-4" />
            Weekly Giveaway
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Win Amazing Prizes Every Week!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Premium users are automatically entered into our weekly giveaways. From headphones to concert tickets, we give away awesome music-related prizes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/weekly-giveaway">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                <Gift className="mr-2 h-6 w-6" />
                View Current Giveaway
              </Button>
            </Link>
            <Link to="/buy">
              <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                Upgrade to Enter
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white">
              <Crown className="mr-1 h-4 w-4" />
              Premium Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Unlock Your Full Music Potential
            </h2>
            <p className="text-xl text-muted-foreground">
              Get advanced analytics and AI-powered insights
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link to="/buy">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                    <Crown className="mr-2 h-6 w-6" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-effect border-border/50 p-8 rounded-xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-spotify rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">Advanced Analytics</h3>
                      <p className="text-muted-foreground text-sm">Deep dive into your music data</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">89% Match</div>
                    <div className="text-muted-foreground text-sm">Your music personality score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Connect With Us
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Follow us for updates and music insights
          </p>
          <div className="flex justify-center">
            <a 
              href="https://instagram.com/myvibelytics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Instagram className="h-6 w-6" />
              <span className="font-semibold">@myvibelytics</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Ready to Discover Your Music DNA?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your Spotify account and start exploring your music like never before
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
              <Play className="mr-2 h-6 w-6" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
                <span className="text-xl font-bold text-gradient">MyVibeLytics</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Discover your music DNA with powerful Spotify analytics
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-foreground font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/demo" className="block text-muted-foreground hover:text-foreground">Demo</Link>
                <Link to="/buy" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link to="/weekly-giveaway" className="block text-muted-foreground hover:text-foreground">Weekly Giveaway</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-foreground font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-foreground font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
                <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 MyVibeLytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
