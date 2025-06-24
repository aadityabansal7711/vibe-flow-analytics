
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomPricing } from '@/hooks/useCustomPricing';
import { supabase } from '@/integrations/supabase/client';
import { 
  Crown, 
  Sparkles, 
  Music, 
  ArrowLeft,
  Tag,
  Brain,
  Share2,
  Gift,
  Zap,
  HeadphonesIcon,
  Users
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Buy = () => {
  const { user, profile } = useAuth();
  const { getPrice, getDiscount, hasCustomPricing } = useCustomPricing();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const basePrice = getPrice();
  const customDiscount = getDiscount();
  const totalDiscount = Math.max(promoDiscount, customDiscount);
  const discountedPrice = Math.round(basePrice * (1 - totalDiscount / 100));

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const handleSubscriptionPayment = async () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Please refresh the page and try again.');
      return;
    }

    setPaymentProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: orderData, error } = await supabase.functions.invoke('create-order', {
        body: {
          amount: discountedPrice * 100,
          currency: 'INR',
          user_id: user.id,
          promo_code: promoCode || null,
          discount: totalDiscount
        }
      });

      if (error) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: 'rzp_live_spLJgQSWhiE0KB',
        amount: discountedPrice * 100,
        currency: 'INR',
        name: 'MyVibeLytics',
        description: 'Premium Yearly Subscription',
        image: '/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          
          try {
            const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                amount: discountedPrice,
                promo_code: promoCode || null
              }
            });

            if (verifyError) {
              throw new Error('Payment verification failed');
            }

            window.location.href = '/dashboard?upgraded=true';
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment successful but verification failed. Please contact support.');
          }
        },
        prefill: {
          name: profile?.full_name || '',
          email: profile?.email || '',
        },
        notes: {
          user_id: user.id,
          promo_code: promoCode || '',
          discount: totalDiscount
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('Failed to initialize payment. Please try again.');
      setPaymentProcessing(false);
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
          <div className="text-muted-foreground">Please complete the payment process</div>
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
                  {(totalDiscount > 0 || hasCustomPricing) ? (
                    <>
                      {!hasCustomPricing && (
                        <span className="text-3xl font-bold text-muted-foreground line-through">₹499</span>
                      )}
                      <span className="text-4xl font-bold text-primary">₹{discountedPrice}</span>
                      {totalDiscount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {totalDiscount}% OFF
                        </Badge>
                      )}
                      {hasCustomPricing && (
                        <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                          Special Offer
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-primary">₹{basePrice}</span>
                  )}
                  <span className="text-muted-foreground">/year</span>
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

                {/* Promo Code Section - only show if no custom pricing */}
                {!hasCustomPricing && (
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
                        <AlertDescription className={promoDiscount > 0 ? 'text-green-400' : 'text-red-400'}>
                          {promoMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Custom Pricing Notice */}
                {hasCustomPricing && (
                  <Alert className="mb-6 border-green-500/20 bg-green-500/5">
                    <AlertDescription className="text-green-400">
                      🎉 You have a special offer! Enjoy premium features at a discounted price.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Payment Button */}
                <Button 
                  onClick={handleSubscriptionPayment}
                  disabled={paymentProcessing}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground text-lg py-6"
                >
                  {paymentProcessing ? 'Processing...' : `Pay ₹${discountedPrice}/year`}
                </Button>

                <p className="text-center text-muted-foreground text-sm mt-4">
                  Secure payment via Razorpay. One-time yearly payment.
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
                  <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">AI Insights</h4>
                    <p className="text-sm text-muted-foreground">Get personalized AI-powered recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Gift className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Great Value</h4>
                    <p className="text-sm text-muted-foreground">
                      {hasCustomPricing 
                        ? `Special price: ₹${discountedPrice} per year`
                        : `Only ₹${basePrice} per year - less than ₹${Math.round(basePrice/12)} per month`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Crown className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Premium Support</h4>
                    <p className="text-sm text-muted-foreground">Get priority help when you need it</p>
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
