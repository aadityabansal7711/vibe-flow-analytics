
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, 
  Calendar, 
  Users, 
  Trophy,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Giveaway {
  id: string;
  gift_name: string;
  gift_price: number;
  gift_image_url?: string;
  withdrawal_date: string;
  winner_name?: string;
  winner_email?: string;
  is_active: boolean;
  created_at: string;
}

const WeeklyGiveaway = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      const { data, error } = await supabase
        .from('giveaways')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching giveaways:', error);
        toast.error('Failed to load giveaways');
        return;
      }

      setGiveaways(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load giveaways');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

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
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Weekly Giveaways</h1>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            <Gift className="mr-1 h-3 w-3" />
            Public Access
          </Badge>
        </div>

        {/* Description */}
        <Card className="glass-effect border-primary/50 mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Win Amazing Prizes!</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our weekly giveaways and win exciting prizes! Premium subscribers get automatic entries, 
                while free users can participate in special events.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current & Upcoming Giveaways */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-primary" />
            Current & Upcoming Giveaways
          </h3>

          {giveaways.length === 0 ? (
            <Card className="glass-effect border-border/50">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">No Active Giveaways</h3>
                <p className="text-muted-foreground">
                  Check back soon for exciting new giveaways!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giveaways.map((giveaway) => (
                <Card key={giveaway.id} className="glass-effect border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground text-lg">{giveaway.gift_name}</CardTitle>
                      <Badge variant={giveaway.is_active ? 'default' : 'secondary'}>
                        {giveaway.is_active ? 'Active' : 'Ended'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {giveaway.gift_image_url && (
                      <img 
                        src={giveaway.gift_image_url} 
                        alt={giveaway.gift_name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Prize Value:</span>
                        <span className="font-bold text-primary">{formatPrice(giveaway.gift_price)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Draw Date:</span>
                        <span className="text-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(giveaway.withdrawal_date)}
                        </span>
                      </div>

                      {giveaway.winner_name && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <div className="flex items-center justify-center">
                            <Trophy className="mr-2 h-4 w-4 text-primary" />
                            <span className="text-primary font-medium">
                              Winner: {giveaway.winner_name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {giveaway.is_active && !giveaway.winner_name && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Premium subscribers are automatically entered!
                        </p>
                        <Link to="/pricing">
                          <Button className="w-full bg-gradient-to-r from-primary to-accent">
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

        {/* How It Works */}
        <Card className="glass-effect border-border/50 mt-8">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Users className="mr-2 h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Subscribe Premium</h4>
                <p className="text-sm text-muted-foreground">
                  Get automatic entry to all weekly giveaways
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Weekly Draws</h4>
                <p className="text-sm text-muted-foreground">
                  Winners are selected randomly every week
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Win Prizes</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified if you win and claim your prize
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyGiveaway;
