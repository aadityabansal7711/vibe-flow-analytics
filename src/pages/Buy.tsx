import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomPricing } from '@/hooks/useCustomPricing';
import { usePromoCode } from '@/hooks/usePromoCode';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Gift,
  Percent,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Buy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const { customPricing } = useCustomPricing();
  const {
    promoCode,
    promoDiscount,
    promoMessage,
    validatingPromo,
    applyPromoCode,
    clearPromoCode,
    calculateDiscountedPrice
  } = usePromoCode();

  const [selectedPlan, setSelectedPlan] = useState<'3_month' | '1_year'>('1_year');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const planFromUrl = searchParams.get('plan');

  useEffect(() => {
    if (planFromUrl === '3_month' || planFromUrl === '1_year') {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/buy');
      return;
    }
  }, [user, navigate]);

  const getPrice = (plan: '3_month' | '1_year') => {
    if (customPricing?.is_active) {
      return customPricing.custom_price;
    }
    return plan === '3_month' ? 499 : 999;
  };

  const originalPrice = getPrice(selectedPlan);
  const finalPrice = calculateDiscountedPrice(originalPrice);
  const savings = originalPrice - finalPrice;

  const handlePromoCodeSubmit = async () => {
    if (!promoCodeInput.trim()) return;
    
    const result = await applyPromoCode(promoCodeInput);
    if (!result.valid) {
      setError(result.message);
    } else {
      setError('');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth?redirect=/buy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          plan_type: selectedPlan,
          user_id: user.id,
          promo_code: promoCode || null
        }
      });

      if (orderError) {
        throw new Error(orderError.message);
      }

      if (!data?.order_id || !data?.amount) {
        throw new Error('Invalid order data received');
      }

      const options = {
        key: 'rzp_live_LmiVXaXJlfkUke',
        amount: data.amount,
        currency: 'INR',
        name: 'MyVibeLytics',
        description: `${selectedPlan === '3_month' ? '3 Month' : '1 Year'} Premium Plan${promoCode ? ` (${promoCode} applied)` : ''}`,
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            const verifyResult = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                plan_type: selectedPlan,
                promo_code: promoCode || null
              }
            });

            if (verifyResult.error) {
              throw new Error('Payment verification failed');
            }

            // Use promo code if it was applied
            if (promoCode) {
              await supabase.rpc('use_promo_code', {
                promo_code: promoCode
              });
            }

            navigate('/dashboard?payment=success');
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: profile?.full_name || '',
          email: user.email || ''
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // Don't show payment options if user already has active subscription for the selected plan
  const hasActivePlan = profile?.has_active_subscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/pricing')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Premium Checkout
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400" />
                Choose Your Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 3 Month Plan */}
              <div 
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlan === '3_month' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => !hasActivePlan && setSelectedPlan('3_month')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">3 Month Plan</h3>
                    <p className="text-sm text-muted-foreground">Perfect for trying premium features</p>
                  </div>
                  <div className="text-right">
                    {promoCode && selectedPlan === '3_month' ? (
                      <div>
                        <div className="text-sm text-muted-foreground line-through">₹{getPrice('3_month')}</div>
                        <div className="text-xl font-bold text-foreground">₹{calculateDiscountedPrice(getPrice('3_month'))}</div>
                        <Badge variant="secondary" className="text-xs">
                          {promoDiscount}% OFF
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-foreground">₹{getPrice('3_month')}</div>
                    )}
                  </div>
                </div>
                {hasActivePlan && selectedPlan === '3_month' && (
                  <Badge className="mt-2 bg-green-500/20 text-green-400">
                    Currently Active
                  </Badge>
                )}
              </div>

              {/* 1 Year Plan */}
              <div 
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlan === '1_year' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => !hasActivePlan && setSelectedPlan('1_year')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">1 Year Plan</h3>
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
                        POPULAR
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Best value - Save more with annual billing</p>
                  </div>
                  <div className="text-right">
                    {promoCode && selectedPlan === '1_year' ? (
                      <div>
                        <div className="text-sm text-muted-foreground line-through">₹{getPrice('1_year')}</div>
                        <div className="text-xl font-bold text-foreground">₹{calculateDiscountedPrice(getPrice('1_year'))}</div>
                        <Badge variant="secondary" className="text-xs">
                          {promoDiscount}% OFF
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-foreground">₹{getPrice('1_year')}</div>
                    )}
                  </div>
                </div>
                {hasActivePlan && selectedPlan === '1_year' && (
                  <Badge className="mt-2 bg-green-500/20 text-green-400">
                    Currently Active
                  </Badge>
                )}
              </div>

              {/* Promo Code Section */}
              <div className="border-t border-border pt-4">
                <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Gift className="w-4 h-4 mr-2" />
                  Have a promo code?
                </Label>
                
                {promoCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 text-green-400 mr-2" />
                      <span className="font-medium text-green-400">{promoCode}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {promoDiscount}% OFF
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearPromoCode}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button
                      onClick={handlePromoCodeSubmit}
                      disabled={validatingPromo || !promoCodeInput.trim()}
                      variant="outline"
                    >
                      {validatingPromo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                )}
                
                {promoMessage && !promoCode && (
                  <p className="text-sm text-red-400 mt-2">{promoMessage}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {selectedPlan === '3_month' ? '3 Month' : '1 Year'} Premium Plan
                  </span>
                  <span className="text-foreground">₹{originalPrice}</span>
                </div>
                
                {promoCode && (
                  <>
                    <div className="flex justify-between text-green-400">
                      <span>Promo Code ({promoCode})</span>
                      <span>-₹{savings}</span>
                    </div>
                    <Separator className="bg-border/50" />
                  </>
                )}
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{finalPrice}</span>
                </div>
                
                {savings > 0 && (
                  <div className="text-center">
                    <Badge className="bg-green-500/20 text-green-400">
                      You save ₹{savings}!
                    </Badge>
                  </div>
                )}
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {hasActivePlan ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    You already have an active premium subscription!
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Pay ₹{finalPrice} & Upgrade Now
                    </>
                  )}
                </Button>
              )}

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Secure payment powered by Razorpay
                </p>
                <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                  <span>• 256-bit SSL encrypted</span>
                  <span>• PCI DSS compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features included */}
        <Card className="glass-effect border-border/50 mt-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              What's included in Premium:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Advanced Music Analytics',
                'Personalized Insights Dashboard',
                'AI-Powered Recommendations',
                'Unlimited Data Export',
                'Social Sharing Features',
                'Priority Customer Support',
                'Weekly Giveaway Participation',
                'Exclusive Beta Features'
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Buy;
