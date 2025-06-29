
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Crown, Sparkles, Music, ArrowLeft,
  Brain, Share2, Gift, Zap, HeadphonesIcon, Users,
  CheckCircle, Clock
} from 'lucide-react';

const Buy = () => {
  const { user, fetchProfile } = useAuth();
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!user) return <Navigate to="/auth" replace />;

  const handlePayment = (duration: '3months' | '1year') => {
    setPaymentProcessing(true);
    
    const paymentLinks = {
      '3months': 'https://rzp.io/rzp/78Yfxf5v',
      '1year': 'https://rzp.io/rzp/pttq9Cd'
    };

    // Store payment info in localStorage for callback
    localStorage.setItem('pending_payment', JSON.stringify({
      duration,
      userId: user.id,
      timestamp: Date.now()
    }));

    // Open payment link in same tab
    window.location.href = paymentLinks[duration];
  };

  // Check for successful payment on page load
  useEffect(() => {
    const checkPendingPayment = async () => {
      const pendingPayment = localStorage.getItem('pending_payment');
      if (pendingPayment) {
        try {
          const paymentInfo = JSON.parse(pendingPayment);
          
          // Check if payment was made recently (within last 10 minutes)
          const timeDiff = Date.now() - paymentInfo.timestamp;
          if (timeDiff < 10 * 60 * 1000) { // 10 minutes
            toast.info('Checking payment status...');
            await handleSuccessfulPayment(paymentInfo.duration);
          }
        } catch (error) {
          console.error('Error parsing pending payment:', error);
        } finally {
          localStorage.removeItem('pending_payment');
        }
      }

      // Also check URL params for payment success
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success') {
        const duration = urlParams.get('duration');
        if (duration) {
          await handleSuccessfulPayment(duration as '3months' | '1year');
        }
      }
    };

    checkPendingPayment();
  }, []);

  const handleSuccessfulPayment = async (duration: '3months' | '1year') => {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (duration === '3months' ? 3 : 12));

      console.log('Updating subscription for user:', user.id, 'Duration:', duration);

      const { error } = await supabase
        .from('profiles')
        .update({
          has_active_subscription: true,
          plan_tier: 'premium',
          plan_start_date: new Date().toISOString(),
          plan_end_date: endDate.toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Subscription update error:', error);
        throw error;
      }
      
      console.log('Subscription updated successfully');
      
      if (fetchProfile) await fetchProfile();
      
      const durationText = duration === '3months' ? '3 months' : '1 year';
      toast.success(`🎉 Premium activated successfully for ${durationText}!`);
      
      // Clear URL params and redirect to dashboard
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => (window.location.href = '/dashboard'), 2000);
    } catch (err) {
      console.error('Subscription update error:', err);
      toast.error('Payment succeeded, but activation failed. Please contact support.');
    }
  };

  // Manual activation button for testing
  const handleManualActivation = async () => {
    await handleSuccessfulPayment('3months');
  };

  const features = [
    { icon: <Sparkles className="h-5 w-5 text-primary" />, text: "🔓 Unlimited music analytics" },
    { icon: <Brain className="h-5 w-5 text-purple-500" />, text: "🎭 Advanced mood + personality analysis" },
    { icon: <Users className="h-5 w-5 text-blue-500" />, text: "🤝 Compare music taste with friends" },
    { icon: <Music className="h-5 w-5 text-green-500" />, text: "🤖 AI-powered song & playlist insights" },
    { icon: <Share2 className="h-5 w-5 text-pink-500" />, text: "📤 Unlimited shareable cards" },
    { icon: <Gift className="h-5 w-5 text-yellow-500" />, text: "🎁 Weekly giveaway entries" },
    { icon: <Zap className="h-5 w-5 text-orange-500" />, text: "🚀 Early access to all new features" },
    { icon: <HeadphonesIcon className="h-5 w-5 text-cyan-500" />, text: "🧑‍💼 Priority support" }
  ];

  if (paymentProcessing) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-lg">Redirecting to payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient flex items-center space-x-2">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-8 w-8" />
            <span>Upgrade to Premium</span>
          </h1>
        </div>

        {/* Debug section - remove this after testing */}
        <div className="mb-4">
          <Button 
            onClick={handleManualActivation}
            variant="outline" 
            size="sm"
            className="bg-green-600 text-white"
          >
            🔧 Activate 3 Months Premium (Debug)
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3 Months Plan */}
          <Card className="glass-effect border-blue-500/50 hover:border-blue-500/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-2xl text-foreground">3 Months Plan</CardTitle>
                </div>
                <Badge className="animate-pulse bg-blue-600">💫 Best Value</Badge>
              </div>
              <div className="text-4xl font-bold text-blue-500">
                ₹149 <span className="text-base">/3 months</span>
              </div>
              <p className="text-sm text-muted-foreground">*Including GST</p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    {f.icon}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handlePayment('3months')}
                disabled={paymentProcessing}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <Crown className="mr-2 h-5 w-5" />
                Get 3 Months Premium - ₹149
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-4">
                Secure payment via Razorpay. Best value for trying premium features.
              </p>
            </CardContent>
          </Card>

          {/* 1 Year Plan */}
          <Card className="glass-effect border-primary/50 hover:border-primary/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Crown className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl text-foreground">Annual Plan</CardTitle>
                </div>
                <Badge className="animate-pulse bg-primary">🌟 Most Popular</Badge>
              </div>
              <div className="text-4xl font-bold text-primary">
                ₹499 <span className="text-base">/year</span>
              </div>
              <p className="text-sm text-muted-foreground">*Including GST</p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    {f.icon}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handlePayment('1year')}
                disabled={paymentProcessing}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <Crown className="mr-2 h-5 w-5" />
                Get Annual Premium - ₹499
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-4">
                Secure payment via Razorpay. Save more with annual billing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features comparison */}
        <div className="mt-16">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Why Choose Premium?</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Playlists</h3>
                <p className="text-sm text-muted-foreground">100 unique songs curated by AI</p>
              </div>
              <div className="text-center">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Personality Analysis</h3>
                <p className="text-sm text-muted-foreground">Deep insights into your music DNA</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Social Features</h3>
                <p className="text-sm text-muted-foreground">Compare with friends & community</p>
              </div>
              <div className="text-center">
                <Gift className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Weekly Giveaways</h3>
                <p className="text-sm text-muted-foreground">Exclusive premium member rewards</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Buy;
