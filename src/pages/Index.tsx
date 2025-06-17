import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Music,
  Sparkles,
  TrendingUp,
  BarChart3,
  Brain,
  Calendar,
  Zap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
  isLocked: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, available, isLocked }) => {
  return (
    <Card className="glass-effect card-hover border-border/50 text-center group">
      <CardContent className="p-8">
        <div className="relative mb-6">
          {icon}
          <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
        </div>
        <h3 className="text-foreground font-bold text-lg mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        {!available && (
          <div className="absolute top-2 right-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const features = [
    { icon: <Music className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'Top Tracks & Artists', description: 'See your most listened to songs and artists', available: true, key: 1 },
    { icon: <BarChart3 className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'Listening Trends', description: 'Track your listening habits over time', available: false, key: 2 },
    { icon: <Brain className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'Music Personality', description: 'Discover your unique music taste profile', available: false, key: 3 },
    { icon: <Calendar className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'Year in Review', description: 'Relive your top songs and artists from the past year', available: false, key: 4 },
    { icon: <Zap className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'AI Playlist Generator', description: 'Create custom playlists based on your listening history', available: false, key: 5 },
    { icon: <Sparkles className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />, title: 'Advanced Analytics', description: 'Unlock even more insights into your music habits', available: false, key: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-24">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
              Unlock Your Music DNA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Dive deep into your Spotify listening habits and discover what makes your music taste unique.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/buy">
                <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
          Explore Your Music Universe
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              available={feature.available}
              isLocked={!feature.available}
            />
          ))}
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
              <Link to="/refund-policy" className="hover:text-primary transition-colors duration-200 font-medium">Refund Policy</Link>
              <Link to="/cancellation-refund" className="hover:text-primary transition-colors duration-200 font-medium">Cancellation</Link>
              <Link to="/shipping-delivery" className="hover:text-primary transition-colors duration-200 font-medium">Shipping</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200 font-medium">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 MyVibeLytics. Discover your music DNA with beautiful analytics.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Owned by Arnam Enterprises | GST: 09ABZFA4207B1ZG
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
