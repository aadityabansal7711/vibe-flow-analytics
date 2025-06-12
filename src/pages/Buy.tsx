
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { detectUserRegion, getPricingForRegion } from '@/utils/pricing';
import { 
  Music, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Calendar, 
  BarChart3,
  Clock,
  Star,
  Zap,
  MapPin,
  ArrowRight,
  Crown,
  Shield
} from 'lucide-react';

const Buy = () => {
  const { user, isUnlocked } = useAuth();
  const [pricing, setPricing] = useState(getPricingForRegion('OTHER'));
  const [region, setRegion] = useState('OTHER');

  useEffect(() => {
    const detectedRegion = detectUserRegion();
    setRegion(detectedRegion);
    setPricing(getPricingForRegion(detectedRegion));
  }, []);

  const features = [
    { name: 'Top Tracks & Artists', included: true, icon: <Music className="h-4 w-4" /> },
    { name: 'Top Albums', included: true, icon: <Music className="h-4 w-4" /> },
    { name: 'Most Played Song of All Time', included: false, icon: <Heart className="h-4 w-4" /> },
    { name: '2024 Music Wrapped', included: false, icon: <Sparkles className="h-4 w-4" /> },
    { name: 'AI Playlist Generation', included: false, icon: <Zap className="h-4 w-4" /> },
    { name: 'Time Preference Analysis', included: false, icon: <Clock className="h-4 w-4" /> },
    { name: 'Monthly Listening Trends', included: false, icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Music Personality Profile', included: false, icon: <Star className="h-4 w-4" /> },
    { name: 'Mood Analysis', included: false, icon: <Heart className="h-4 w-4" /> },
    { name: 'Listening Streaks & Milestones', included: false, icon: <Calendar className="h-4 w-4" /> },
    { name: 'Advanced Analytics Dashboard', included: false, icon: <BarChart3 className="h-4 w-4" /> },
    { name: 'Hidden Gems Discovery', included: false, icon: <Zap className="h-4 w-4" /> }
  ];

  const handlePurchase = () => {
    // Simulate Stripe payment redirect
    console.log('Redirecting to Stripe payment...');
    alert('This would redirect to Stripe payment processing!');
  };

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
          <Link to={user ? "/dashboard" : "/"}>
            <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
              {user ? 'Dashboard' : 'Home'}
            </Button>
          </Link>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
                Unlock Your Music DNA
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                Get deep insights into your Spotify listening habits with premium analytics
              </p>
              
              {/* Region Indicator */}
              <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-8">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  Pricing for {region === 'IN' ? 'India' : region === 'US' ? 'United States' : region === 'EU' ? 'Europe' : 'your region'}
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Free Plan */}
              <Card className="glass-effect card-hover border-border/50 relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-foreground text-2xl mb-4">Free</CardTitle>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {pricing.symbol}0
                    <span className="text-lg font-normal text-muted-foreground">/{pricing.period}</span>
                  </div>
                  <p className="text-muted-foreground">Perfect to get started</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    {features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="text-primary p-1 rounded-lg bg-primary/10">
                          {feature.icon}
                        </div>
                        <span className="text-foreground">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="glass-effect card-hover border-primary/50 relative overflow-hidden transform scale-105">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-spotify"></div>
                <div className="absolute top-4 right-4 bg-gradient-spotify text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Crown className="h-3 w-3" />
                  <span>Popular</span>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-foreground text-2xl mb-4">Premium</CardTitle>
                  <div className="text-5xl font-bold text-gradient mb-2">
                    {pricing.symbol}{pricing.price}
                    <span className="text-lg font-normal text-muted-foreground">/{pricing.period}</span>
                  </div>
                  <p className="text-primary text-sm font-semibold">
                    Everything in Free, plus all premium features
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className={`h-5 w-5 flex-shrink-0 ${feature.included ? 'text-primary' : 'text-primary'}`} />
                        <div className={`p-1 rounded-lg ${feature.included ? 'text-muted-foreground bg-muted' : 'text-primary bg-primary/10'}`}>
                          {feature.icon}
                        </div>
                        <span className={`${feature.included ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {isUnlocked ? (
                    <Button className="w-full bg-muted text-muted-foreground" disabled>
                      <Shield className="mr-2 h-4 w-4" />
                      Already Unlocked
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground font-semibold"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Unlock Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Features Showcase */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="glass-effect card-hover border-border/50 text-center group">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-3">Advanced Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed">Deep insights into your listening patterns and musical evolution over time</p>
                </CardContent>
              </Card>

              <Card className="glass-effect card-hover border-border/50 text-center group">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Star className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-3">Music Personality</h3>
                  <p className="text-muted-foreground leading-relaxed">Discover your unique musical identity and taste preferences</p>
                </CardContent>
              </Card>

              <Card className="glass-effect card-hover border-border/50 text-center group">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Zap className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-3">AI-Powered Features</h3>
                  <p className="text-muted-foreground leading-relaxed">Smart playlist generation and hidden gem discovery powered by AI</p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground text-2xl text-center">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-foreground font-semibold mb-2 text-lg">What payment methods do you accept?</h4>
                  <p className="text-muted-foreground leading-relaxed">We accept all major credit cards, debit cards, and digital payment methods through Stripe.</p>
                </div>
                <div>
                  <h4 className="text-foreground font-semibold mb-2 text-lg">Can I cancel anytime?</h4>
                  <p className="text-muted-foreground leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                </div>
                <div>
                  <h4 className="text-foreground font-semibold mb-2 text-lg">Is my Spotify data safe?</h4>
                  <p className="text-muted-foreground leading-relaxed">Absolutely. We only access your listening data with your permission and never store your Spotify login credentials.</p>
                </div>
              </CardContent>
            </Card>
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
            <p className="text-muted-foreground text-xs mt-2">
              Owned by Arnam Enterprises | GST: 09ABZFA4207B1ZG
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Buy;
