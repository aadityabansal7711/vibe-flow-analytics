
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Music, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Buy: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  // Check if user already has an active subscription
  const hasActiveSubscription = profile?.has_active_subscription || profile?.plan_tier === 'premium';

  const plans = [
    {
      id: '3month_premium',
      name: '3 Month Premium',
      price: 149,
      duration: '3 months',
      link: 'https://rzp.io/rzp/IyWcC5m',
      features: [
        'Unlimited music analytics',
        'Advanced mood & personality analysis',
        'Compare music taste with friends',
        'Unlimited shareable cards',
        'Weekly premium giveaway entries',
        'Priority Support'
      ],
      popular: true,
      disabled: hasActiveSubscription
    },
    {
      id: '1year_premium',
      name: '1 Year Premium',
      price: 499,
      duration: '12 months',
      link: 'https://rzp.io/rzp/myvibelyrics',
      features: [
        'Everything in 3 Month Plan',
        'Advanced AI Recommendations',
        'Export your music data',
        'Premium Analytics Dashboard',
        'Early Access to New Features',
        'Dedicated Account Manager'
      ],
      popular: false,
      disabled: hasActiveSubscription
    }
  ];

  const handlePayment = async (plan: typeof plans[0]) => {
    if (!user) {
      toast.error('Please log in to purchase');
      navigate('/auth');
      return;
    }

    if (hasActiveSubscription) {
      toast.error('You already have an active subscription');
      return;
    }

    setRedirecting(true);
    toast.success(`Redirecting to payment for ${plan.name}...`);
    
    // Open payment link in new tab
    window.open(plan.link, '_blank');
    
    setTimeout(() => {
      setRedirecting(false);
    }, 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
        <Card className="max-w-md w-full glass-effect">
          <CardContent className="text-center py-8">
            <Music className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-foreground">Login Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to purchase a premium subscription</p>
            <Link to="/auth">
              <Button className="w-full bg-gradient-spotify">
                <Music className="mr-2 h-4 w-4" />
                Login to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pricing
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Choose Your Plan</h1>
              <p className="text-muted-foreground">Unlock premium features and analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
            <span className="text-xl font-bold text-gradient">MyVibeLyrics</span>
          </div>
        </div>

        {/* Active Subscription Notice */}
        {hasActiveSubscription && (
          <Card className="mb-8 border-green-500/30 bg-green-500/10">
            <CardContent className="flex items-center space-x-4 py-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-green-400">Active Premium Subscription</h3>
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  You already have an active premium subscription.
                  {profile?.plan_end_date && ` Expires on ${new Date(profile.plan_end_date).toLocaleDateString()}`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Notice */}
        <Card className="mb-8 border-blue-500/30 bg-blue-500/10">
          <CardContent className="flex items-center space-x-4 py-6">
            <AlertCircle className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400">Payment Information</h3>
              <p className="text-blue-300 text-sm">
                You can view pricing without login, but login is required to complete the purchase and activate your premium subscription.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative glass-effect transition-all duration-300 ${
              plan.popular 
                ? 'border-primary/50 hover:border-primary/70 scale-105' 
                : 'border-border/50 hover:border-primary/30'
            } ${plan.disabled ? 'opacity-60' : 'hover:shadow-2xl hover:scale-105'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-spotify text-white px-4 py-1">
                    <Crown className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-foreground mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.duration}</CardDescription>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handlePayment(plan)}
                  disabled={redirecting || plan.disabled}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-spotify hover:scale-105' 
                      : 'bg-primary hover:bg-primary/90'
                  } transition-all duration-300`}
                >
                  {redirecting ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Redirecting to Payment...
                    </>
                  ) : plan.disabled ? (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Already Subscribed
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Pay Now ₹{plan.price}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 glass-effect border-blue-500/20">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your payment is secured by Razorpay with 256-bit SSL encryption. 
              After successful payment, your premium subscription will be activated automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Buy;
