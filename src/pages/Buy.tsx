import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Music, 
  BarChart3, 
  Users, 
  ArrowLeft,
  Percent,
  Tag,
  Brain,
  MessageCircle,
  Share2,
  Gift,
  Zap,
  HeadphonesIcon
} from 'lucide-react';

const Buy = () => {
  const { user, profile, updateProfile } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const basePrice = 499; // INR
  const discountedPrice = Math.round(basePrice * (1 - promoDiscount / 100));

  // Check for payment success in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('razorpay_payment_id');
    const orderId = urlParams.get('razorpay_order_id');
    const signature = urlParams.get('razorpay_signature');

    if (paymentId && orderId && signature) {
      handlePaymentSuccess(paymentId, orderId, signature);
    }
  }, []);

  const handlePaymentSuccess = async (paymentId: string, orderId: string, signature: string) => {
    setPaymentProcessing(true);
    try {
      // Update user profile to premium
      await updateProfile({
        has_active_subscription: true,
        plan_tier: 'premium',
        plan_id: 'premium_monthly',
        used_promo_code: promoCode || null
      });

      // Use promo code if valid
      if (promoDiscount > 0 && promoCode) {
        await supabase.rpc('use_promo_code', {
          promo_code: promoCode.trim().toUpperCase()
        });
      }

      // Create subscription record with dates
      const planEndDate = new Date();
      planEndDate.setMonth(planEndDate.getMonth() + 1); // 1 month from now

      await supabase.from('subscriptions').insert({
        user_id: user.id,
        status: 'active',
        plan_type: 'monthly',
        amount: discountedPrice,
        currency: 'inr',
        current_period_start: new Date().toISOString(),
        current_period_end: planEndDate.toISOString()
      });

      // Clear URL params and redirect to dashboard
      window.history.replaceState({}, document.title, '/buy');
      window.location.href = '/dashboard?upgraded=true';
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment successful but there was an error upgrading your account. Please contact support.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('');
      setPromoDiscount(0);
      return;
    }

    setCheckingPromo(true);
    try {
      const { data, error } = await supabase.rpc('validate_promo_code', {
        promo_code: promoCode.trim().toUpperCase()
      });

      if (error) {
        console.error('Error validating promo code:', error);
        setPromoMessage('Error validating promo code');
        setPromoDiscount(0);
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        if (result.valid) {
          setPromoDiscount(result.discount_percentage);
          setPromoMessage(`${result.message} - ${result.discount_percentage}% off applied!`);
        } else {
          setPromoDiscount(0);
          setPromoMessage(result.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setPromoMessage('Error validating promo code');
      setPromoDiscount(0);
    } finally {
      setCheckingPromo(false);
    }
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
          <div className="text-white text-lg">Processing your payment...</div>
          <div className="text-muted-foreground">Please wait while we upgrade your account</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Upgrade to Premium</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Premium Plan */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-primary/50 overflow-hidden card-hover">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Premium Plan</CardTitle>
                  </div>
                  <Badge className="bg-primary text-primary-foreground animate-pulse">
                    🌟 Most Popular
                  </Badge>
                </div>
                <div className="flex items-baseline space-x-2">
                  {promoDiscount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-muted-foreground line-through">₹{basePrice}</span>
                      <span className="text-4xl font-bold text-primary">₹{discountedPrice}</span>
                      <Badge variant="destructive" className="ml-2">
                        {promoDiscount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-primary">₹{basePrice}</span>
                  )}
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                      {feature.icon}
                      <span className="text-foreground font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Section */}
                <div className="bg-background/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Have a promo code?</span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button 
                      onClick={validatePromoCode}
                      disabled={checkingPromo || !promoCode.trim()}
                      variant="outline"
                      size="sm"
                      className="transition-all duration-300 hover:scale-105"
                    >
                      {checkingPromo ? 'Checking...' : 'Apply'}
                    </Button>
                  </div>
                  {promoMessage && (
                    <Alert className={`mt-3 ${promoDiscount > 0 ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                      <Percent className="h-4 w-4" />
                      <AlertDescription className={promoDiscount > 0 ? 'text-green-400' : 'text-red-400'}>
                        {promoMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Razorpay Payment Button */}
                <div className="text-center mb-4">
                  <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg">
                    <div className="mb-4">
                      <Crown className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-white mb-1">Pay ₹{discountedPrice}</h3>
                      <p className="text-white/80">Secure payment via Razorpay</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ 
                      __html: `<form><script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_Qjs2W5AhXxHlni" data-amount="${discountedPrice * 100}" async></script></form>` 
                    }} />
                  </div>
                </div>

                <p className="text-center text-muted-foreground text-sm">
                  Secure payment via Razorpay. Cancel anytime from your profile.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <Card className="glass-effect border-border/50 card-hover">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  Why Premium?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Music className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Unlimited Analytics</h4>
                    <p className="text-sm text-muted-foreground">Access all advanced features without limits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">AI Insights</h4>
                    <p className="text-sm text-muted-foreground">Get personalized AI-powered recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Community Access</h4>
                    <p className="text-sm text-muted-foreground">Join exclusive chat rooms and music discussions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Gift className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Giveaway Access</h4>
                    <p className="text-sm text-muted-foreground">Enter weekly giveaways for amazing prizes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
