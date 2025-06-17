
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Percent, Calendar, Users } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    max_uses: '',
    expires_at: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      // Direct SQL query since table might not be in types yet
      const { data, error } = await supabase
        .rpc('get_promo_codes_admin');
      
      if (error) {
        console.error('Error fetching promo codes:', error);
        setMessage('Error fetching promo codes: ' + error.message);
        return;
      }

      if (data) {
        setPromoCodes(data);
      }
    } catch (error: any) {
      console.error('Error fetching promo codes:', error);
      setMessage('Error fetching promo codes: ' + error.message);
    }
  };

  const createPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .rpc('create_promo_code', {
          p_code: formData.code.toUpperCase(),
          p_discount_percentage: parseInt(formData.discount_percentage),
          p_max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
          p_expires_at: formData.expires_at || null
        });

      if (error) throw error;

      setMessage('Promo code created successfully!');
      setShowForm(false);
      setFormData({ code: '', discount_percentage: '', max_uses: '', expires_at: '' });
      fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error creating promo code: ' + error.message);
    }
  };

  const togglePromoCode = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .rpc('toggle_promo_code', {
          p_id: id,
          p_is_active: !currentStatus
        });

      if (error) throw error;
      fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error updating promo code: ' + error.message);
    }
  };

  const deletePromoCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const { error } = await supabase
        .rpc('delete_promo_code', {
          p_id: id
        });

      if (error) throw error;
      fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error deleting promo code: ' + error.message);
    }
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <Percent className="mr-2 h-5 w-5" />
            Promo Code Management ({promoCodes.length})
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Promo Code
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {showForm && (
          <form onSubmit={createPromoCode} className="mb-6 p-4 bg-background/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Promo Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="SAVE20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Discount % *</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                  placeholder="20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Max Uses (optional)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">Create Promo Code</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {promoCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No promo codes created yet. Create your first promo code above!</p>
            </div>
          ) : (
            promoCodes.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-foreground font-bold text-lg">{promo.code}</h3>
                    <Badge variant="secondary">{promo.discount_percentage}% OFF</Badge>
                    <Badge variant={promo.is_active ? "default" : "secondary"}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {promo.current_uses}/{promo.max_uses || '∞'} uses
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'No expiry'}
                    </div>
                    <div>
                      Created: {new Date(promo.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePromoCode(promo.id, promo.is_active)}
                  >
                    {promo.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePromoCode(promo.id)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodeManager;
