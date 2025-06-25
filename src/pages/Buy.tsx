
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  Sparkles, 
  Music, 
  ArrowLeft,
  Brain,
  Share2,
  Gift,
  Zap,
  HeadphonesIcon,
  Users
} from 'lucide-react';

const Buy = () => {
  const { user, profile } = useAuth();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const basePrice = 499; // Fixed price of ₹499

  useEffect(() => {
    // Load Razorpay script properly
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    const cleanup = loadRazorpayScript();
    return cleanup;
  }, []);

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
                  <span className="text-4xl font-bold text-primary">₹{basePrice}</span>
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

                {/* Razorpay Payment Button Container */}
                <div className="mb-6">
                  <div id="razorpay-container">
                    {razorpayLoaded ? (
                      <form>
                        <script 
                          src="https://checkout.razorpay.com/v1/payment-button.js" 
                          data-payment_button_id="pl_Qjs2W5AhXxHlni" 
                          async
                        ></script>
                      </form>
                    ) : (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading payment options...</p>
                      </div>
                    )}
                  </div>
                </div>

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
                      Only ₹{basePrice} per year - less than ₹{Math.round(basePrice/12)} per month
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
