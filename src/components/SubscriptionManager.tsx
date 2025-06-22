
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  razorpay_subscription_id: string;
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
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setCancelling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Subscription cancelled successfully');
        
        // Update local state
        await updateProfile({
          has_active_subscription: false,
          plan_tier: 'free',
          plan_id: 'free_tier'
        });
        
        setSubscription(null);
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
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

  if (!profile?.has_active_subscription || !subscription) {
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
              <a href="/buy">Upgrade to Premium</a>
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
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <Card className="glass-effect border-primary/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center">
            <Crown className="mr-2 h-5 w-5 text-primary" />
            Premium Subscription
          </CardTitle>
          <Badge className="bg-primary text-primary-foreground">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium text-foreground capitalize">
              {subscription.plan_type} Plan
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium text-foreground">
              {formatAmount(subscription.amount, subscription.currency)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Next Billing</p>
            <p className="font-medium text-foreground flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {formatDate(subscription.current_period_end)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Auto Renewal</p>
            <Badge variant={subscription.auto_renew ? "secondary" : "destructive"}>
              {subscription.auto_renew ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>

        <Alert className="border-yellow-500/20 bg-yellow-500/5">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            Cancelling your subscription will downgrade your account to the free plan at the end of your billing period.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={cancelling}
            className="flex-1"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
          <Button
            variant="outline"
            onClick={fetchSubscription}
            className="flex-1"
          >
            Refresh Status
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Subscription ID: {subscription.razorpay_subscription_id}</p>
          <p>Status: {subscription.status}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
