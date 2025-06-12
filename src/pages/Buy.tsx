
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
  MapPin
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">MyVibeLytics</span>
        </Link>
        <Link to={user ? "/dashboard" : "/"}>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            {user ? 'Dashboard' : 'Home'}
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Unlock Your Music Story
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Get deep insights into your Spotify listening habits with premium analytics
          </p>
          
          {/* Region Indicator */}
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              Pricing for {region === 'IN' ? 'India' : region === 'US' ? 'United States' : region === 'EU' ? 'Europe' : 'your region'}
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free</CardTitle>
              <div className="text-3xl font-bold text-white">
                {pricing.symbol}0
                <span className="text-lg font-normal text-gray-300">/{pricing.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    {feature.icon}
                    <span className="text-white">{feature.name}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg border-green-400/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-white text-2xl">Premium</CardTitle>
              <div className="text-4xl font-bold text-white">
                {pricing.symbol}{pricing.price}
                <span className="text-lg font-normal text-gray-300">/{pricing.period}</span>
              </div>
              <p className="text-green-400 text-sm font-semibold">
                Everything in Free, plus:
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className={`h-4 w-4 ${feature.included ? 'text-green-400' : 'text-blue-400'}`} />
                    {feature.icon}
                    <span className={`${feature.included ? 'text-gray-300' : 'text-white font-semibold'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {isUnlocked ? (
                <Button className="w-full bg-gray-600" disabled>
                  Already Unlocked
                </Button>
              ) : (
                <Button 
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Unlock Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Showcase */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-300 text-sm">Deep insights into your listening patterns and trends</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Music Personality</h3>
              <p className="text-gray-300 text-sm">Discover your unique musical identity and preferences</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">AI-Powered Features</h3>
              <p className="text-gray-300 text-sm">Smart playlist generation and hidden gem discovery</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-300 text-sm">We accept all major credit cards, debit cards, and digital payment methods through Stripe.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-300 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Is my Spotify data safe?</h4>
              <p className="text-gray-300 text-sm">Absolutely. We only access your listening data with your permission and never store your Spotify login credentials.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Buy;
