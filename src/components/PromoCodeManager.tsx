import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Tag, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    discount_percentage: 10,
    max_uses: 100,
    expires_at: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast.error('Failed to fetch promo codes');
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    if (!newCode.code || !newCode.expires_at) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code: newCode.code.toUpperCase(),
          discount_percentage: newCode.discount_percentage,
          max_uses: newCode.max_uses,
          expires_at: newCode.expires_at,
          is_active: true,
          current_uses: 0
        });

      if (error) throw error;

      toast.success('Promo code created successfully!');
      setNewCode({ code: '', discount_percentage: 10, max_uses: 100, expires_at: '' });
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      if (error.code === '23505') {
        toast.error('Promo code already exists');
      } else {
        toast.error('Failed to create promo code');
      }
    } finally {
      setCreating(false);
    }
  };

  const togglePromoCode = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Promo code ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchPromoCodes();
    } catch (error) {
      console.error('Error updating promo code:', error);
      toast.error('Failed to update promo code');
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Promo Code */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Create New Promo Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Promo Code</Label>
              <Input
                id="code"
                placeholder="SUMMER2024"
                value={newCode.code}
                onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={newCode.discount_percentage}
                onChange={(e) => setNewCode({ ...newCode, discount_percentage: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={newCode.max_uses}
                onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={newCode.expires_at}
                onChange={(e) => setNewCode({ ...newCode, expires_at: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={createPromoCode} disabled={creating} className="w-full">
            {creating ? 'Creating...' : 'Create Promo Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Promo Codes */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Existing Promo Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promoCodes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No promo codes created yet.</p>
            ) : (
              promoCodes.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-4 border border-border/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-foreground">{promo.code}</h3>
                      <Badge variant={promo.is_active ? "default" : "secondary"}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {promo.discount_percentage}% off
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{promo.current_uses}/{promo.max_uses} uses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {new Date(promo.expires_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={promo.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => togglePromoCode(promo.id, promo.is_active)}
                  >
                    {promo.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodeManager;
