
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Music, BarChart3, Users, Zap, ArrowRight, Star, TrendingUp, Heart, Play } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

const Index = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Deep Analytics",
      description: "Comprehensive insights into your listening habits, top tracks, and musical journey over time.",
      isLocked: false
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Trend Analysis",
      description: "Track your music evolution and discover how your taste changes across different periods.",
      isLocked: false
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Personalized Insights",
      description: "Get personalized recommendations and insights based on your unique listening patterns.",
      isLocked: false
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Social Sharing",
      description: "Share your music stats and connect with friends who have similar music taste.",
      isLocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="MyVibeLytics" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/buy" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Play className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm font-medium">Now Available</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
                Your Music, 
                <br />Analyzed
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your Spotify data into beautiful insights. Discover your listening patterns, 
                track your musical journey, and rediscover your favorite songs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6">
                  <Music className="mr-2 h-5 w-5" />
                  Connect Spotify Free
                </Button>
              </Link>
              <Link to="/buy">
                <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary text-lg px-8 py-6">
                  View Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-6">Powerful Music Analytics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock insights about your music taste with our comprehensive analytics platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isLocked={feature.isLocked}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gradient mb-6">Ready to Explore Your Music?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your Spotify account and start discovering your musical insights today
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6">
              <Music className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="MyVibeLytics" className="h-8 w-8 object-contain" />
                <span className="text-xl font-bold text-gradient">MyVibeLytics</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Transform your Spotify data into beautiful insights and rediscover your music journey.
              </p>
            </div>
            
            <div>
              <h3 className="text-foreground font-medium mb-4">Product</h3>
              <div className="space-y-2">
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors block">About</Link>
                <Link to="/buy" className="text-muted-foreground hover:text-primary transition-colors block">Pricing</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors block">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-foreground font-medium mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors block">Privacy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors block">Terms</Link>
                <Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors block">Refund Policy</Link>
                <Link to="/cancellation-policy" className="text-muted-foreground hover:text-primary transition-colors block">Cancellation</Link>
              </div>
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
