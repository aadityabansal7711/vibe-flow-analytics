
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  Music, 
  ArrowLeft,
  Check,
  Brain,
  Share2,
  Gift,
  Zap,
  HeadphonesIcon,
  Users,
  BarChart3
} from 'lucide-react';

const Pricing = () => {
  const freeFeatures = [
    "Connect Spotify account",
    "Basic top tracks & artists",
    "Recent listening history",
    "Basic listening stats",
    "Community access"
  ];

  const premiumFeatures = [
    "Everything in Free",
    "🔓 Unlimited music analytics",
    "🎭 Advanced mood + personality analysis", 
    "🤝 Compare music taste with friends",
    "🤖 AI-powered song & playlist insights",
    "📤 Unlimited shareable cards",
    "🎁 Weekly premium giveaway entries",
    "🚀 Early access to all new features",
    "🧑‍💼 Priority support",
    "📊 Advanced listening behavior analysis",
    "🎯 Personalized music recommendations",
    "⚡ Real-time insights & notifications"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient flex items-center space-x-2">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-8 w-8" />
            <span>Choose Your Plan</span>
          </h1>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Unlock Your Complete Music Analytics Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade anytime to unlock advanced AI-powered insights, 
            personality analysis, and exclusive community features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-effect border-border/50 relative">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Music className="h-6 w-6 text-green-500" />
                <CardTitle className="text-2xl text-foreground">Free Plan</CardTitle>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">
                ₹0 <span className="text-base font-normal">/forever</span>
              </div>
              <p className="text-muted-foreground">Perfect to get started</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/auth" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Music className="mr-2 h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-effect border-primary/50 relative">
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              🌟 Most Popular
            </Badge>
            <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b text-center pb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl text-foreground">Premium Plan</CardTitle>
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                ₹499 <span className="text-base font-normal">/year</span>
              </div>
              <p className="text-muted-foreground">Complete music analytics experience</p>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/buy" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold py-3">
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Compare Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect">
              <CardHeader className="text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Analytics Depth</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong className="text-foreground">Free:</strong> Basic stats
                </div>
                <div>
                  <strong className="text-foreground">Premium:</strong> Advanced AI-powered insights
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="text-center">
                <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Personality Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong className="text-foreground">Free:</strong> Not available
                </div>
                <div>
                  <strong className="text-foreground">Premium:</strong> Complete personality profiling
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Community Features</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong className="text-foreground">Free:</strong> Basic access
                </div>
                <div>
                  <strong className="text-foreground">Premium:</strong> Full community + giveaways
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glass-effect text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Can I cancel anytime?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can disconnect your Spotify account and cancel your premium subscription at any time from your profile settings.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Is my data secure?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We only access your Spotify listening data and keep all information private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit/debit cards, UPI, and net banking through our secure Razorpay integration.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Do I need Spotify Premium?
                </h4>
                <p className="text-sm text-muted-foreground">
                  No, you can use MyVibeLyrics with any Spotify account - free or premium.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
