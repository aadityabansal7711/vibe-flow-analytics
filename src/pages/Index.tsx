
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
  Zap
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
              <span className="text-xl font-bold text-gradient">MyVibeLytics</span>
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

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🎵 Your Music, Analyzed
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient mb-6">
            Discover Your Music
            <br />
            <span className="text-primary">Personality</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect your Spotify account and get deep insights into your music taste, 
            listening habits, and discover patterns you never knew existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Music className="mr-2 h-6 w-6" />
                Connect Spotify Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Crown className="mr-2 h-5 w-5" />
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Free Features */}
            <Card className="glass-effect border-border/50 card-hover">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6 text-green-500" />
                  <CardTitle className="text-foreground">Top Tracks</CardTitle>
                </div>
                <CardDescription>Your most played songs and favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  See your most played tracks, artists, and albums from your Spotify listening history.
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 card-hover">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-foreground">Basic Analytics</CardTitle>
                </div>
                <CardDescription>Essential music statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Get insights into your listening patterns and music preferences.
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 card-hover">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-purple-500" />
                  <CardTitle className="text-foreground">Community</CardTitle>
                </div>
                <CardDescription>Connect with other music lovers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Join our community of music enthusiasts and share your discoveries.
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="glass-effect border-primary/50 card-hover relative">
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-500" />
                  <CardTitle className="text-foreground">AI Personality Analysis</CardTitle>
                </div>
                <CardDescription>Deep psychological music insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Advanced AI analysis of your music personality, mood patterns, and listening behavior.
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/50 card-hover relative">
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  <CardTitle className="text-foreground">Advanced Analytics</CardTitle>
                </div>
                <CardDescription>Comprehensive listening insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Detailed listening patterns, time preferences, and musical journey analysis.
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/50 card-hover relative">
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <CardTitle className="text-foreground">AI Playlist Generator</CardTitle>
                </div>
                <CardDescription>Smart playlist creation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  AI-powered playlist generation based on your unique music taste and preferences.
                </div>
              </CardContent>
            </Card>
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
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-6 w-6" />
              <span className="text-lg font-semibold text-foreground">MyVibeLytics</span>
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
