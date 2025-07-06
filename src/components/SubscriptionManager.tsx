
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Calendar, CreditCard, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  status: string;
  plan_type: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
}

const SubscriptionManager = () => {
  const { profile, updateProfile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', profile?.user_id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.has_active_subscription) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You're currently on the free plan</p>
            <Button asChild className="bg-gradient-to-r from-primary to-accent">
              <a href="/pricing">Upgrade to Premium</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === 'inr' ? '₹' : '$';
    return `${symbol}${(amount / 100).toFixed(0)}`;
  };

  const handleContactSupport = () => {
    window.open('mailto:aadityabansal1112@gmail.com?subject=Subscription Cancellation Request', '_blank');
  };

  // Show subscription details based on profile data
  const getSubscriptionDetails = () => {
    if (profile?.plan_id === '3month_premium') {
      return { planType: '3 Month Premium', amount: 14900, currency: 'inr' };
    } else if (profile?.plan_id === '1year_premium') {
      return { planType: '1 Year Premium', amount: 49900, currency: 'inr' };
    }
    return { planType: 'Premium Plan', amount: subscription?.amount || 0, currency: 'inr' };
  };

  const subscriptionDetails = getSubscriptionDetails();

  return (
    <Card className="glass-effect border-primary/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center">
            <Crown className="mr-2 h-5 w-5 text-primary" />
            Premium Subscription
          </CardTitle>
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium text-foreground">
              {subscriptionDetails.planType}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="font-medium text-foreground">
              {formatAmount(subscriptionDetails.amount, subscriptionDetails.currency)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Started On</p>
            <p className="font-medium text-foreground flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {profile?.plan_start_date ? formatDate(profile.plan_start_date) : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Valid Until</p>
            <p className="font-medium text-foreground flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {profile?.plan_end_date ? formatDate(profile.plan_end_date) : 'N/A'}
            </p>
          </div>
        </div>

        <Alert className="border-blue-500/20 bg-blue-500/5">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Your premium subscription is active and all premium features are unlocked!
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="destructive"
            onClick={handleContactSupport}
            className="flex-1"
          >
            Contact Support for Cancellation
          </Button>
          <Button
            variant="outline"
            onClick={fetchSubscription}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </div>

        {subscription && (
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
            <p>Payment ID: {subscription.razorpay_payment_id}</p>
            <p>Order ID: {subscription.razorpay_order_id}</p>
            <p>Status: {subscription.status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
