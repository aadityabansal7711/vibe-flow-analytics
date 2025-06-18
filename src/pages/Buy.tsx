
import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';

const Buy = () => {
  const { user, profile } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const basePrice = 499; // INR
  const discountedPrice = Math.round(basePrice * (1 - promoDiscount / 100));

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

  const handlePayment = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would integrate with Razorpay here
      console.log('Processing payment for:', discountedPrice, 'INR');
      
      // For demo purposes, we'll simulate a successful payment
      // In production, you'd handle the actual Razorpay integration
      
      // Use promo code if valid
      if (promoDiscount > 0 && promoCode) {
        await supabase.rpc('use_promo_code', {
          promo_code: promoCode.trim().toUpperCase()
        });
      }

      // Update user subscription (in real app, this would be done after payment confirmation)
      // This is just for demo purposes
      alert(`Payment simulation: ₹${discountedPrice} - Razorpay integration needed for actual payments`);
      
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Unlimited music analytics",
    "Advanced mood analysis", 
    "Social music comparisons",
    "AI-powered insights",
    "Unlimited shareable cards",
    "Weekly giveaway entries",
    "Premium support",
    "Early access to new features"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Upgrade to Premium</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Premium Plan */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-primary/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Premium Plan</CardTitle>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
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

                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Crown className="mr-2 h-5 w-5" />
                      Pay ₹{discountedPrice} - Upgrade Now
                    </>
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-sm mt-4">
                  Secure payment powered by Razorpay. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <Card className="glass-effect border-border/50">
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
                  <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Giveaway Access</h4>
                    <p className="text-sm text-muted-foreground">Enter weekly giveaways for amazing prizes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-2">30-Day</div>
                <div className="text-muted-foreground">Money Back Guarantee</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
