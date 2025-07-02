
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Trophy, 
  Clock, 
  Settings,
  RefreshCw,
  Star,
  Crown,
  Calendar,
  Target,
  Shuffle
} from 'lucide-react';

interface Giveaway {
  id: string;
  gift_name: string;
  gift_image_url: string | null;
  gift_price: number;
  withdrawal_date: string;
  result_announcement_time: string | null;
  is_active: boolean;
  winner_user_id: string | null;
  winner_name: string | null;
  winner_email: string | null;
  created_at: string;
  giveaway_description: string | null;
  entry_requirements: string | null;
}

interface PremiumUser {
  user_id: string;
  email: string;
  full_name: string | null;
  spotify_display_name: string | null;
  created_at: string;
}

const GiveawayManager = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [giveawayForm, setGiveawayForm] = useState({
    gift_name: '',
    gift_image_url: '',
    gift_price: '',
    withdrawal_date: '',
    result_announcement_time: '',
    giveaway_description: '',
    entry_requirements: 'Active Premium Subscription'
  });

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

      if (error) throw error;
      setGiveaways(data || []);
    } catch (error: any) {
      setMessage('Error fetching giveaways: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPremiumUsers = async (giveawayId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, spotify_display_name, created_at')
        .eq('has_active_subscription', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out users who have already won other giveaways
      const eligibleUsers = data?.filter(user => 
        !giveaways.some(g => g.winner_user_id === user.user_id && g.id !== giveawayId)
      ) || [];
      
      setPremiumUsers(eligibleUsers);
      setMessage(`Found ${eligibleUsers.length} eligible premium users`);
    } catch (error: any) {
      setMessage('Error fetching premium users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      
      const giveawayData = {
        gift_name: giveawayForm.gift_name,
        gift_image_url: giveawayForm.gift_image_url || null,
        gift_price: parseFloat(giveawayForm.gift_price),
        withdrawal_date: giveawayForm.withdrawal_date,
        result_announcement_time: giveawayForm.result_announcement_time || null,
        giveaway_description: giveawayForm.giveaway_description || null,
        entry_requirements: giveawayForm.entry_requirements,
        is_active: true
      };

      const { error } = await supabase
        .from('giveaways')
        .insert(giveawayData);

      if (error) throw error;
      
      setMessage('Giveaway created successfully!');
      setShowCreateForm(false);
      setGiveawayForm({
        gift_name: '',
        gift_image_url: '',
        gift_price: '',
        withdrawal_date: '',
        result_announcement_time: '',
        giveaway_description: '',
        entry_requirements: 'Active Premium Subscription'
      });
      await fetchGiveaways();
    } catch (error: any) {
      setMessage('Error creating giveaway: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectWinner = async (method: 'auto' | 'manual') => {
    if (!selectedGiveaway) return;
    
    try {
      setLoading(true);
      let winnerId = selectedWinner;
      
      if (method === 'auto') {
        if (premiumUsers.length === 0) {
          setMessage('No eligible users available');
          return;
        }
        const randomIndex = Math.floor(Math.random() * premiumUsers.length);
        winnerId = premiumUsers[randomIndex].user_id;
      }
      
      if (!winnerId) {
        setMessage('Please select a winner');
        return;
      }
      
      const winner = premiumUsers.find(u => u.user_id === winnerId);
      if (!winner) {
        setMessage('Winner not found');
        return;
      }

      const { error } = await supabase
        .from('giveaways')
        .update({
          winner_user_id: winner.user_id,
          winner_name: winner.full_name || winner.spotify_display_name || winner.email.split('@')[0],
          winner_email: winner.email,
          is_active: false
        })
        .eq('id', selectedGiveaway.id);

      if (error) throw error;
      
      setMessage(`Winner selected: ${winner.email}`);
      setShowWinnerSelection(false);
      setSelectedGiveaway(null);
      setSelectedWinner(null);
      await fetchGiveaways();
    } catch (error: any) {
      setMessage('Error selecting winner: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGiveawaySelect = async (giveaway: Giveaway) => {
    setSelectedGiveaway(giveaway);
    await fetchPremiumUsers(giveaway.id);
    setShowWinnerSelection(true);
  };

  const deleteGiveaway = async (giveawayId: string, giftName: string) => {
    if (!confirm(`Delete giveaway "${giftName}"?`)) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('giveaways')
        .delete()
        .eq('id', giveawayId);

      if (error) throw error;
      setMessage('Giveaway deleted successfully');
      await fetchGiveaways();
    } catch (error: any) {
      setMessage('Error deleting giveaway: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Weekly Giveaway Manager</h2>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Giveaway
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Create Giveaway Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Giveaway</DialogTitle>
          </DialogHeader>
          <form onSubmit={createGiveaway} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gift_name">Gift Name *</Label>
                <Input
                  id="gift_name"
                  value={giveawayForm.gift_name}
                  onChange={(e) => setGiveawayForm({...giveawayForm, gift_name: e.target.value})}
                  placeholder="Enter gift name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gift_price">Gift Price (₹) *</Label>
                <Input
                  id="gift_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={giveawayForm.gift_price}
                  onChange={(e) => setGiveawayForm({...giveawayForm, gift_price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="withdrawal_date">Entry Deadline *</Label>
                <Input
                  id="withdrawal_date"
                  type="datetime-local"
                  value={giveawayForm.withdrawal_date}
                  onChange={(e) => setGiveawayForm({...giveawayForm, withdrawal_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="result_announcement_time">Result Announcement Time</Label>
                <Input
                  id="result_announcement_time"
                  type="datetime-local"
                  value={giveawayForm.result_announcement_time}
                  onChange={(e) => setGiveawayForm({...giveawayForm, result_announcement_time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gift_image_url">Gift Image URL</Label>
              <Input
                id="gift_image_url"
                type="url"
                value={giveawayForm.gift_image_url}
                onChange={(e) => setGiveawayForm({...giveawayForm, gift_image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="giveaway_description">Description</Label>
              <Textarea
                id="giveaway_description"
                value={giveawayForm.giveaway_description}
                onChange={(e) => setGiveawayForm({...giveawayForm, giveaway_description: e.target.value})}
                placeholder="Describe the giveaway..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="entry_requirements">Entry Requirements</Label>
              <Input
                id="entry_requirements"
                value={giveawayForm.entry_requirements}
                onChange={(e) => setGiveawayForm({...giveawayForm, entry_requirements: e.target.value})}
                placeholder="Active Premium Subscription"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
                Create Giveaway
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Winner Selection Dialog */}
      <Dialog open={showWinnerSelection} onOpenChange={setShowWinnerSelection}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Select Winner - {selectedGiveaway?.gift_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">{premiumUsers.length} Eligible Premium Users</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => selectWinner('auto')} className="bg-green-600 hover:bg-green-700">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Auto Select
                </Button>
                <Button 
                  onClick={() => selectWinner('manual')} 
                  disabled={!selectedWinner}
                  variant="outline"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Select Winner
                </Button>
              </div>
            </div>

            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {premiumUsers.map((user) => (
                <div 
                  key={user.user_id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedWinner === user.user_id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedWinner(user.user_id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {user.full_name || user.spotify_display_name || user.email.split('@')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Member since: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <Badge variant="secondary">Premium</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Giveaways List */}
      <div className="grid gap-4">
        {giveaways.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Giveaways Yet</h3>
              <p className="text-muted-foreground">Create your first giveaway to get started!</p>
            </CardContent>
          </Card>
        ) : (
          giveaways.map((giveaway) => (
            <Card key={giveaway.id} className="overflow-hidden">
              <div className="flex">
                {giveaway.gift_image_url && (
                  <img 
                    src={giveaway.gift_image_url} 
                    alt={giveaway.gift_name}
                    className="w-24 h-24 object-cover"
                  />
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{giveaway.gift_name}</h3>
                        <Badge variant="outline" className="text-primary border-primary">
                          ₹{giveaway.gift_price}
                        </Badge>
                        <Badge variant={giveaway.is_active ? "default" : "secondary"}>
                          {giveaway.is_active ? 'Active' : 'Completed'}
                        </Badge>
                      </div>
                      
                      {giveaway.giveaway_description && (
                        <p className="text-sm text-muted-foreground mb-2">{giveaway.giveaway_description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Entry Deadline: {new Date(giveaway.withdrawal_date).toLocaleDateString()}
                        </div>
                        {giveaway.result_announcement_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Result: {new Date(giveaway.result_announcement_time).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {giveaway.winner_name && (
                        <div className="mt-2 flex items-center gap-2 text-green-400">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">Winner: {giveaway.winner_name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {giveaway.is_active && !giveaway.winner_user_id && (
                        <Button
                          size="sm"
                          onClick={() => handleGiveawaySelect(giveaway)}
                          className="bg-primary"
                        >
                          <Trophy className="mr-2 h-3 w-3" />
                          Select Winner
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteGiveaway(giveaway.id, giveaway.gift_name)}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GiveawayManager;
