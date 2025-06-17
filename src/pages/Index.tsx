
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FeatureCard from '@/components/FeatureCard';
import { 
  Music, 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Calendar, 
  Star,
  Zap,
  ArrowRight,
  Play,
  Users,
  Award,
  Crown,
  ShoppingCart
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "Your Music DNA",
      description: "Discover patterns in your listening habits and understand your unique musical personality",
      available: true
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Deep insights into your listening trends, mood analysis, and time-based preferences",
      available: false
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered Features",
      description: "Smart playlist generation and personalized music recommendations",
      available: false
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Tracking",
      description: "See how your music taste evolves over time with detailed progression charts",
      available: false
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Mood Analysis",
      description: "Understand the emotional patterns in your music choices throughout different periods",
      available: false
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Listening Streaks",
      description: "Track your daily listening habits and build amazing music discovery streaks",
      available: false
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users", icon: <Users className="h-5 w-5" /> },
    { number: "500M+", label: "Songs Analyzed", icon: <Music className="h-5 w-5" /> },
    { number: "99%", label: "Satisfaction Rate", icon: <Award className="h-5 w-5" /> },
    { number: "24/7", label: "Support Available", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Music className="h-8 w-8 text-primary animate-pulse-slow" />
              <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Get Premium
            </Button>
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                Trusted by 10,000+ music lovers worldwide
              </Badge>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-8 leading-tight">
              Discover Your
              <br />
              <span className="text-primary">Music DNA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Uncover the hidden patterns in your Spotify listening habits. Get personalized insights, 
              AI-powered recommendations, and beautiful analytics that reveal your unique musical personality.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                    <Play className="mr-2 h-5 w-5" />
                    View My Analytics
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                    <Play className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              <Link to="/buy">
                <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary text-lg px-8 py-4">
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-primary">{stat.icon}</div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient mb-6">
              Everything You Need to Understand Your Music
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From basic listening statistics to advanced AI-powered insights, we provide a complete picture of your musical journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                {...feature} 
              />
            ))}
          </div>

          {/* CTA Section */}
          <Card className="glass-effect border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
            <CardContent className="relative p-12 text-center">
              <h3 className="text-4xl font-bold text-gradient mb-6">
                Ready to Discover Your Music DNA?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of music lovers who've already unlocked the secrets of their listening habits. 
                Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      View My Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4">
                      <Music className="mr-2 h-5 w-5" />
                      Connect Spotify
                    </Button>
                  </Link>
                )}
                <Link to="/buy">
                  <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8 py-4">
                    <Zap className="mr-2 h-5 w-5" />
                    Unlock Premium Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors duration-200 font-medium">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors duration-200 font-medium">Privacy</Link>
              <Link to="/refund-policy" className="hover:text-primary transition-colors duration-200 font-medium">Refund Policy</Link>
              <Link to="/cancellation-refund" className="hover:text-primary transition-colors duration-200 font-medium">Cancellation</Link>
              <Link to="/shipping-delivery" className="hover:text-primary transition-colors duration-200 font-medium">Shipping</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200 font-medium">Contact</Link>
              <Link to="/about" className="hover:text-primary transition-colors duration-200 font-medium">About</Link>
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
