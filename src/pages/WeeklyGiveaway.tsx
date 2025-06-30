
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, 
  Clock, 
  Users, 
  Crown, 
  Calendar,
  Trophy,
  Star,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Giveaway {
  id: string;
  gift_name: string;
  gift_image_url: string | null;
  gift_price: number;
  withdrawal_date: string;
  is_active: boolean;
  winner_user_id: string | null;
  winner_name: string | null;
  winner_email: string | null;
  created_at: string;
}

const WeeklyGiveaway = () => {
  const { user, profile } = useAuth();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('giveaways')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching giveaways:', error);
        setMessage('Error loading giveaways');
        return;
      }

      setGiveaways(data || []);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error loading giveaways');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (withdrawalDate: string) => {
    const now = new Date();
    const deadline = new Date(withdrawalDate);
    const timeDiff = deadline.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Ended';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else {
      return `${hours}h remaining`;
    }
  };

  const activeGiveaways = giveaways.filter(g => g.is_active);
  const completedGiveaways = giveaways.filter(g => !g.is_active);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading giveaways...</div>
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
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Weekly Giveaways</h1>
            </div>
          </div>
          {profile?.has_active_subscription && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Crown className="mr-1 h-3 w-3" />
              Premium Member
            </Badge>
          )}
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Premium Status */}
        {!profile?.has_active_subscription && (
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Required</h3>
              <p className="text-muted-foreground mb-4">
                Only Premium members are eligible for weekly giveaways. Upgrade now to participate!
              </p>
              <Link to="/buy">
                <Button className="bg-primary hover:bg-primary/90">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {profile?.has_active_subscription && (
          <Card className="glass-effect border-green-500/20 mb-8">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">You're Eligible!</h3>
              <p className="text-muted-foreground">
                As a Premium member, you're automatically entered into all active giveaways. Good luck!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Active Giveaways */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Gift className="mr-3 h-6 w-6 text-primary" />
            Active Giveaways ({activeGiveaways.length})
          </h2>
          
          {activeGiveaways.length === 0 ? (
            <Card className="glass-effect border-border/50">
              <CardContent className="p-8 text-center">
                <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Giveaways</h3>
                <p className="text-muted-foreground">
                  Check back soon for new exciting giveaways!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGiveaways.map((giveaway) => (
                <Card key={giveaway.id} className="glass-effect border-border/50 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Clock className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                      <Badge variant="outline" className="text-primary border-primary">
                        {formatPrice(giveaway.gift_price)}
                      </Badge>
                    </div>
                    <CardTitle className="text-foreground text-xl">{giveaway.gift_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {giveaway.gift_image_url && (
                      <img 
                        src={giveaway.gift_image_url} 
                        alt={giveaway.gift_name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span className="text-sm">Ends: {formatDate(giveaway.withdrawal_date)}</span>
                      </div>
                      <div className="flex items-center text-primary">
                        <Clock className="mr-2 h-4 w-4" />
                        <span className="font-medium">{getTimeRemaining(giveaway.withdrawal_date)}</span>
                      </div>
                    </div>

                    {profile?.has_active_subscription ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">You're entered!</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="flex items-center text-red-400 mb-2">
                          <XCircle className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">Premium Required</span>
                        </div>
                        <Link to="/buy">
                          <Button size="sm" className="w-full">
                            Upgrade to Enter
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Winners */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Trophy className="mr-3 h-6 w-6 text-yellow-400" />
            Past Winners ({completedGiveaways.length})
          </h2>
          
          {completedGiveaways.length === 0 ? (
            <Card className="glass-effect border-border/50">
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Past Winners Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to win a giveaway!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedGiveaways.map((giveaway) => (
                <Card key={giveaway.id} className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{giveaway.gift_name}</h3>
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            {formatPrice(giveaway.gift_price)}
                          </Badge>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          Ended: {formatDate(giveaway.withdrawal_date)}
                        </p>
                        {giveaway.winner_name && (
                          <div className="flex items-center gap-2 text-primary">
                            <Star className="h-4 w-4" />
                            <span className="font-medium">Winner: {giveaway.winner_name}</span>
                          </div>
                        )}
                      </div>
                      {giveaway.gift_image_url && (
                        <img 
                          src={giveaway.gift_image_url} 
                          alt={giveaway.gift_name}
                          className="w-16 h-16 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGiveaway;
