
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Gift, 
  Calendar, 
  Crown, 
  Clock, 
  Trophy,
  ArrowLeft,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';

interface Giveaway {
  id: string;
  gift_name: string;
  gift_image_url: string | null;
  gift_price: number;
  withdrawal_date: string;
  is_active: boolean;
  winner_user_id: string | null;
  created_at: string;
}

const WeeklyGiveaway = () => {
  const { user, profile } = useAuth();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('giveaways')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching giveaways:', fetchError);
        setError('Failed to load giveaways. Please try again later.');
        return;
      }
      
      setGiveaways(data || []);
    } catch (error) {
      console.error('Error fetching giveaways:', error);
      setError('Failed to load giveaways. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const activeGiveaways = giveaways.filter(g => g.is_active);
  const pastGiveaways = giveaways.filter(g => !g.is_active);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isEligible = user && profile?.has_active_subscription;

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Weekly Giveaways</h1>
            </div>
          </div>
          {!isEligible && (
            <Link to="/buy">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Enter
              </Button>
            </Link>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="glass-effect border-red-500/50 mb-8">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Giveaways</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchGiveaways} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Eligibility Status */}
        {!user ? (
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-8 text-center">
              <Gift className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Sign In to Participate</h2>
              <p className="text-muted-foreground mb-6">
                Create an account and upgrade to premium to participate in our weekly giveaways!
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
                <Link to="/buy">
                  <Button variant="outline">View Premium</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : !profile?.has_active_subscription ? (
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-8 text-center">
              <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Premium Required</h2>
              <p className="text-muted-foreground mb-6">
                Upgrade to premium to automatically enter all weekly giveaways and win amazing prizes!
              </p>
              <Link to="/buy">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">You're Entered!</h2>
              <p className="text-muted-foreground mb-4">
                As a premium member, you're automatically entered into all active giveaways. Good luck!
              </p>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Users className="mr-1 h-3 w-3" />
                Premium Member
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Active Giveaways */}
        {activeGiveaways.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-yellow-400" />
              Active Giveaways
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGiveaways.map((giveaway) => (
                <Card key={giveaway.id} className="glass-effect border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">${giveaway.gift_price}</div>
                        <div className="text-xs text-muted-foreground">Value</div>
                      </div>
                    </div>
                    <CardTitle className="text-foreground text-xl">{giveaway.gift_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {giveaway.gift_image_url && (
                      <img 
                        src={giveaway.gift_image_url} 
                        alt={giveaway.gift_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Ends: {formatDate(giveaway.withdrawal_date)}</span>
                    </div>
                    <div className="text-center">
                      {isEligible ? (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          ✓ You're Entered!
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                          Premium Required
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Giveaways */}
        {pastGiveaways.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-gray-400" />
              Past Giveaways
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastGiveaways.map((giveaway) => (
                <Card key={giveaway.id} className="glass-effect border-border/50 opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        Completed
                      </Badge>
                      <div className="text-right">
                        <div className="text-xl font-bold text-muted-foreground">${giveaway.gift_price}</div>
                        <div className="text-xs text-muted-foreground">Value</div>
                      </div>
                    </div>
                    <CardTitle className="text-foreground">{giveaway.gift_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Ended: {formatDate(giveaway.withdrawal_date)}</span>
                    </div>
                    {giveaway.winner_user_id && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          <Trophy className="mr-1 h-3 w-3" />
                          Winner Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Giveaways */}
        {giveaways.length === 0 && !error && (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-12 text-center">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">No Giveaways Yet</h2>
              <p className="text-muted-foreground mb-6">
                Check back soon! We'll be launching exciting weekly giveaways for our premium members.
              </p>
              <Link to="/buy">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card className="glass-effect border-border/50 mt-12">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1. Upgrade to Premium</h3>
                <p className="text-muted-foreground text-sm">Get premium access to unlock giveaway participation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">2. Automatic Entry</h3>
                <p className="text-muted-foreground text-sm">You're automatically entered into all active giveaways</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">3. Random Selection</h3>
                <p className="text-muted-foreground text-sm">Winners are randomly selected from eligible premium users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyGiveaway;
