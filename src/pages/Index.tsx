
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { 
  Music, 
  BarChart3, 
  Heart, 
  Users, 
  Sparkles, 
  TrendingUp,
  Clock,
  Headphones,
  Target,
  Zap,
  Star,
  Share2
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Music className="h-6 w-6" />,
      title: "Music DNA Analysis",
      description: "Deep dive into your musical personality with AI-powered insights about your listening habits, mood patterns, and genre preferences.",
      available: true
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts and visualizations showing your listening trends, peak hours, and detailed breakdowns of your musical journey.",
      available: true
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Mood & Emotion Tracking",
      description: "Understand how your music reflects your emotions with sophisticated mood analysis and emotional pattern recognition.",
      available: true
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Music Insights",
      description: "Compare your music taste with friends and discover how your listening habits align with different communities.",
      available: true
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Predictive Recommendations",
      description: "Get AI-powered predictions about what you'll love next based on your evolving music taste and listening patterns.",
      available: true
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Temporal Music Patterns",
      description: "Discover how your music taste changes throughout the day, week, and seasons with detailed temporal analysis.",
      available: true
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audio Feature Analysis",
      description: "Deep technical analysis of your preferred audio characteristics like tempo, energy, danceability, and acoustics.",
      available: true
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Music Goals & Tracking",
      description: "Set and track music discovery goals, listening targets, and personal challenges to expand your musical horizons.",
      available: true
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Insights",
      description: "Live updates and instant analysis as you listen, providing immediate feedback and insights about your current session.",
      available: true
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Shareable Music Cards",
      description: "Create beautiful, shareable cards showcasing your music stats, top tracks, and listening achievements for social media.",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gradient">MyVibeLytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/buy">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Pricing
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="text-primary border-primary mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Music Analytics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Discover Your
              <br />
              <span className="text-primary">Music DNA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Unlock deep insights into your Spotify listening habits with AI-powered analytics. 
              Discover patterns, moods, and hidden connections in your music that you never knew existed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                <Music className="mr-2 h-5 w-5" />
                Start Your Analysis
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted px-8 py-3 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Songs Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Analytics Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools to understand your music like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                available={feature.available}
                isLocked={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-2xl p-8 border border-border/50">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-6">
              <Star className="mr-2 h-4 w-4" />
              Premium Experience
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Unlock Advanced Analytics
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get access to premium features including detailed mood analysis, 
              social comparisons, and unlimited shareable cards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/buy">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Go Premium
                </Button>
              </Link>
              <Link to="/weekly-giveaway">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted px-8 py-3">
                  Join Weekly Giveaway
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/10 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/demo" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link to="/buy" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link to="/weekly-giveaway" className="text-muted-foreground hover:text-primary">Giveaways</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="text-muted-foreground hover:text-primary">Refund Policy</Link></li>
                <li><Link to="/cancellation-policy" className="text-muted-foreground hover:text-primary">Cancellation Policy</Link></li>
                <li><Link to="/shipping-delivery" className="text-muted-foreground hover:text-primary">Shipping & Delivery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="flex items-center space-x-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
                <span className="text-muted-foreground">MyVibeLytics</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MyVibeLytics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
