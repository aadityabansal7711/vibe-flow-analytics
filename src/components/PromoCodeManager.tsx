
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  RefreshCw,
  Percent,
  Calendar,
  Users
} from 'lucide-react';

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
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promo codes:', error);
        setMessage('Error fetching promo codes: ' + error.message);
        return;
      }

      setPromoCodes(data || []);
    } catch (error: any) {
      console.error('Error:', error);
      setMessage('Error fetching promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage('');
      
      if (!formData.code || !formData.discount_percentage || !formData.max_uses || !formData.expires_at) {
        setMessage('Please fill in all fields');
        return;
      }

      const promoData = {
        code: formData.code.toUpperCase(),
        discount_percentage: parseInt(formData.discount_percentage),
        max_uses: parseInt(formData.max_uses),
        expires_at: formData.expires_at,
        is_active: true
      };

      if (editingId) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingId);

        if (error) {
          setMessage('Error updating promo code: ' + error.message);
          return;
        }
        setMessage('Promo code updated successfully!');
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert(promoData);

        if (error) {
          setMessage('Error creating promo code: ' + error.message);
          return;
        }
        setMessage('Promo code created successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ code: '', discount_percentage: '', max_uses: '', expires_at: '' });
      await fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
  };

  const editPromoCode = (promoCode: PromoCode) => {
    setFormData({
      code: promoCode.code,
      discount_percentage: promoCode.discount_percentage.toString(),
      max_uses: promoCode.max_uses.toString(),
      expires_at: new Date(promoCode.expires_at).toISOString().slice(0, 16)
    });
    setEditingId(promoCode.id);
    setShowForm(true);
  };

  const deletePromoCode = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      return;
    }

    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) {
        setMessage('Error deleting promo code: ' + error.message);
        return;
      }

      setMessage('Promo code deleted successfully!');
      await fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error deleting promo code: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        setMessage('Error updating promo code: ' + error.message);
        return;
      }

      setMessage(`Promo code ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchPromoCodes();
    } catch (error: any) {
      setMessage('Error updating promo code: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading promo codes...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <Percent className="mr-2 h-5 w-5" />
            Promo Code Management ({promoCodes.length})
          </div>
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ code: '', discount_percentage: '', max_uses: '', expires_at: '' }); }}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'New Promo Code'}
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
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-background/30 rounded-lg border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Promo Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="SAVE20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage *</Label>
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
                <Label htmlFor="max_uses">Max Uses *</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expires_at">Expires At *</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">
                {editingId ? 'Update' : 'Create'} Promo Code
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
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
            promoCodes.map((promoCode) => (
              <div key={promoCode.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-foreground font-bold text-lg">{promoCode.code}</h3>
                    <Badge variant={promoCode.is_active ? "default" : "secondary"}>
                      {promoCode.discount_percentage}% OFF
                    </Badge>
                    <Badge variant={promoCode.is_active ? "default" : "secondary"}>
                      {promoCode.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{promoCode.current_uses}/{promoCode.max_uses} uses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires: {formatDate(promoCode.expires_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editPromoCode(promoCode)}
                    disabled={actionLoading === promoCode.id}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(promoCode.id, promoCode.is_active)}
                    disabled={actionLoading === promoCode.id}
                    className={promoCode.is_active ? "text-red-400 border-red-400" : "text-green-400 border-green-400"}
                  >
                    {actionLoading === promoCode.id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : promoCode.is_active ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePromoCode(promoCode.id, promoCode.code)}
                    disabled={actionLoading === promoCode.id}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    {actionLoading === promoCode.id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
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
