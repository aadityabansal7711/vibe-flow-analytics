
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Music, 
  BarChart3, 
  Users, 
  ArrowLeft,
  Tag,
  Brain,
  Share2,
  Gift,
  Zap,
  HeadphonesIcon
} from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);

  const basePrice = 499;
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

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const features = [
    { icon: <Sparkles className="h-5 w-5 text-primary" />, text: "🔓 Unlimited music analytics" },
    { icon: <Brain className="h-5 w-5 text-purple-500" />, text: "🎭 Advanced mood + personality analysis" },
    { icon: <Users className="h-5 w-5 text-blue-500" />, text: "🤝 Compare music taste with friends" },
    { icon: <Music className="h-5 w-5 text-green-500" />, text: "🤖 AI-powered song & playlist insights" },
    { icon: <Share2 className="h-5 w-5 text-pink-500" />, text: "📤 Unlimited shareable cards (Coming Soon)" },
    { icon: <Gift className="h-5 w-5 text-yellow-500" />, text: "🎁 Weekly giveaway entries" },
    { icon: <Zap className="h-5 w-5 text-orange-500" />, text: "🚀 Early access to all new features" },
    { icon: <HeadphonesIcon className="h-5 w-5 text-cyan-500" />, text: "🧑‍💼 Priority support" }
  ];

  const freeFeatures = [
    { icon: <Music className="h-5 w-5 text-green-500" />, text: "Basic music analytics" },
    { icon: <BarChart3 className="h-5 w-5 text-blue-500" />, text: "Limited insights" },
    { icon: <Users className="h-5 w-5 text-purple-500" />, text: "Community access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Choose Your Plan</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <Card className="glass-effect border-border/50 overflow-hidden card-hover">
            <CardHeader className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-b border-gray-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-6 w-6 text-gray-400" />
                  <CardTitle className="text-2xl text-foreground">Free Plan</CardTitle>
                </div>
                <Badge variant="outline" className="bg-gray-500/20 text-gray-300">
                  🆓 Always Free
                </Badge>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-400">₹0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                    {feature.icon}
                    <span className="text-foreground font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-effect border-primary/50 overflow-hidden card-hover relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                🌟 Most Popular
              </Badge>
            </div>
            
            <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b border-primary/30">
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl text-foreground">Premium Plan</CardTitle>
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
                    <AlertDescription className={promoDiscount > 0 ? 'text-green-400' : 'text-red-400'}>
                      {promoMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Razorpay Payment Button */}
              <div className="w-full mb-4">
                <form>
                  <script 
                    src="https://checkout.razorpay.com/v1/payment-button.js" 
                    data-payment_button_id="pl_Qjs2W5AhXxHlni" 
                    async
                  ></script>
                </form>
              </div>

              <p className="text-center text-muted-foreground text-sm mt-4">
                Secure payment via Razorpay. One-time yearly payment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
