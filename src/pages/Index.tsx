
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Music, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Heart,
  Star,
  Zap,
  Shield,
  Smartphone,
  Globe,
  ArrowRight,
  Play,
  Headphones,
  Calendar,
  Mic,
  Radio,
  Shuffle,
  Target,
  Award,
  PieChart,
  Activity
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient">
              Discover Your Music DNA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your Spotify listening data into beautiful, actionable insights. 
              Understand your musical journey like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-white px-8 py-6 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted px-8 py-6 text-lg">
                  <Music className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Comprehensive Analytics Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dive deep into your music preferences with our complete analytics suite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Listening Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track your listening habits, top artists, and favorite songs with detailed charts and graphs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Trend Analysis</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover how your music taste evolves over time with monthly and yearly trend reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Music DNA</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Analyze your music personality with mood detection and genre preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Time Patterns</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Understand when and how you listen to music throughout different times of day
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Hidden Gems</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover underrated tracks and artists you love that others might be missing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">2025 Wrapped</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get your personalized year-end music summary with beautiful visualizations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Genre Distribution</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Visualize your music taste across different genres with interactive charts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Artist Discovery</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Find new artists based on your listening patterns and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Listening Intensity</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track your music listening intensity and engagement levels over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Playlist Analysis</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Analyze your playlists and discover patterns in your music curation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shuffle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Skip Patterns</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Understand your skip behavior and what makes you engage with songs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Music Recommendations</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get personalized music recommendations based on your listening data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Music Achievements</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Unlock achievements and milestones based on your listening habits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-slate-500 to-gray-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Global Comparisons</CardTitle>
                <CardDescription className="text-muted-foreground">
                  See how your music taste compares to global and regional trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Mobile Insights</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Access your music analytics on-the-go with mobile-optimized insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-spotify rounded-full flex items-center justify-center mx-auto">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Connect Spotify</h3>
              <p className="text-muted-foreground">
                Securely link your Spotify account to start analyzing your music data
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Analyze Data</h3>
              <p className="text-muted-foreground">
                Our AI processes your listening history to generate meaningful insights
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Discover Insights</h3>
              <p className="text-muted-foreground">
                Explore beautiful dashboards and discover patterns in your music taste
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect-strong rounded-3xl p-12 border border-border/50">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Ready to Discover Your Music DNA?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of music lovers who have already unlocked the secrets of their listening habits
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-white px-12 py-6 text-lg">
                <Play className="mr-2 h-6 w-6" />
                Start Your Musical Journey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Music className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">MyVibeLytics</span>
              </div>
              <p className="text-muted-foreground">
                Discover the patterns in your music and unlock insights about your listening habits.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</Link></li>
                <li><Link to="/buy" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Connect</h4>
              <p className="text-muted-foreground">
                Follow us for updates and music insights
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 MyVibeLytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
