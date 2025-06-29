
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Music, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Buy: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check if user already has an active subscription
  const hasActiveSubscription = profile?.has_active_subscription || profile?.plan_tier === 'premium';

  const plans = [
    {
      id: '3month_premium',
      name: '3 Month Premium',
      price: 199,
      originalPrice: 299,
      duration: '3 months',
      features: [
        'AI Curated Playlists (100 tracks)',
        'Advanced Analytics & Insights',
        'Mood & Personality Analysis',
        'Premium Community Access',
        'Priority Support',
        'Export Data Features'
      ],
      popular: true,
      disabled: hasActiveSubscription
    },
    {
      id: '1year_premium',
      name: '1 Year Premium',
      price: 699,
      originalPrice: 999,
      duration: '12 months',
      features: [
        'Everything in 3 Month Plan',
        'Advanced AI Recommendations',
        'Unlimited Playlist Generation',
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

    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      console.log('💳 Creating Razorpay order for plan:', plan.id);
      
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          amount: plan.price * 100,
          currency: 'INR',
          receipt: `receipt_${plan.id}_${Date.now()}`,
          plan_id: plan.id,
          user_id: user.id
        }
      });

      if (orderError) {
        console.error('❌ Order creation failed:', orderError);
        throw new Error(orderError.message || 'Failed to create order');
      }

      if (!orderData?.id) {
        console.error('❌ No order ID received:', orderData);
        throw new Error('Invalid order response from server');
      }

      console.log('✅ Order created successfully:', orderData.id);

      const options = {
        key: 'rzp_live_kVGmkkGPGHT2kI',
        amount: plan.price * 100,
        currency: 'INR',
        name: 'MyVibeLyrics',
        description: `${plan.name} Subscription`,
        order_id: orderData.id,
        handler: async function (response: any) {
          console.log('💰 Payment successful:', response);
          
          try {
            // Verify payment
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                plan_id: plan.id
              }
            });

            if (verificationError) {
              console.error('❌ Payment verification failed:', verificationError);
              toast.error('Payment verification failed. Please contact support.');
              return;
            }

            console.log('✅ Payment verified successfully');

            // Calculate subscription end date
            const startDate = new Date();
            const endDate = new Date();
            if (plan.id === '3month_premium') {
              endDate.setMonth(endDate.getMonth() + 3);
            } else if (plan.id === '1year_premium') {
              endDate.setFullYear(endDate.getFullYear() + 1);
            }

            // Update user profile with subscription details
            await updateProfile({
              plan_tier: 'premium',
              has_active_subscription: true,
              plan_id: plan.id,
              plan_start_date: startDate.toISOString(),
              plan_end_date: endDate.toISOString()
            });

            console.log('✅ Profile updated with subscription details');
            
            toast.success('🎉 Premium subscription activated successfully!', {
              duration: 5000
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);

          } catch (error: any) {
            console.error('❌ Post-payment processing error:', error);
            toast.error('Payment successful but activation failed. Please contact support.');
          }
        },
        prefill: {
          name: profile?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#1DB954'
        },
        modal: {
          ondismiss: function() {
            console.log('💰 Payment modal dismissed');
            setLoading(false);
            setSelectedPlan('');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('❌ Payment initialization error:', error);
      toast.error(error.message || 'Failed to initialize payment');
      setLoading(false);
      setSelectedPlan('');
    }
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
                <p className="text-green-300 text-sm">
                  You already have an active premium subscription. 
                  {profile?.plan_end_date && ` Expires on ${new Date(profile.plan_end_date).toLocaleDateString()}`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Sparkles className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-foreground mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.duration}</CardDescription>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                  {plan.originalPrice > plan.price && (
                    <span className="text-lg text-muted-foreground line-through">₹{plan.originalPrice}</span>
                  )}
                </div>
                {plan.originalPrice > plan.price && (
                  <Badge variant="outline" className="text-green-400 border-green-400 mt-2">
                    {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% OFF
                  </Badge>
                )}
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
                  disabled={loading || plan.disabled}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-spotify hover:scale-105' 
                      : 'bg-primary hover:bg-primary/90'
                  } transition-all duration-300`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.disabled ? (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Already Subscribed
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Choose {plan.name}
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
              We don't store your payment information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Buy;
