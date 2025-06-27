import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Crown, Sparkles, Music, ArrowLeft,
  Brain, Share2, Gift, Zap, HeadphonesIcon, Users
} from 'lucide-react';

const Buy = () => {
  const { user, fetchProfile } = useAuth();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const razorpayRef = useRef<HTMLDivElement>(null);
  const basePrice = 499;

  if (!user) return <Navigate to="/auth" replace />;

  // Inject Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_Qjs2W5AhXxHlni');
    script.async = true;

    if (razorpayRef.current) {
      razorpayRef.current.innerHTML = ''; // Clean if rerendered
      razorpayRef.current.appendChild(script);
    }
  }, []);

  // Listen for postMessage payment success
  useEffect(() => {
    const handlePaymentSuccess = async (event: MessageEvent) => {
      if (event.data.type === 'payment_success') {
        setPaymentProcessing(true);
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              has_active_subscription: true,
              plan_tier: 'premium',
              plan_start_date: new Date().toISOString(),
              plan_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', user.id);

          if (error) throw error;
          if (fetchProfile) await fetchProfile();

          toast.success('🎉 Premium activated!');
          setTimeout(() => (window.location.href = '/dashboard'), 2000);
        } catch (err) {
          console.error('Subscription update error:', err);
          toast.error('Payment succeeded, but activation failed. Contact support.');
        } finally {
          setPaymentProcessing(false);
        }
      }
    };

    window.addEventListener('message', handlePaymentSuccess);
    return () => window.removeEventListener('message', handlePaymentSuccess);
  }, [user?.id, fetchProfile]);

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
          <div className="text-muted-foreground">Activating your subscription...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient flex items-center space-x-2">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="Logo" className="h-8 w-8" />
            <span>Upgrade to Premium</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Plan */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-primary/50">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Premium Plan</CardTitle>
                  </div>
                  <Badge className="animate-pulse">🌟 Most Popular</Badge>
                </div>
                <div className="text-4xl font-bold text-primary">
                  ₹{basePrice} <span className="text-base">/year</span>
                </div>
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

                <div className="mb-6 text-center">
                  <div ref={razorpayRef}></div>
                </div>

                <p className="text-center text-muted-foreground text-sm">
                  Secure one-time yearly payment via Razorpay.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Premium */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" /> Why Premium?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                {features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    {f.icon}
                    <div>
                      <h4 className="font-medium text-foreground">{f.text.split(' ')[1]}</h4>
                      <p className="text-sm">{f.text.split(' ').slice(2).join(' ')}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
