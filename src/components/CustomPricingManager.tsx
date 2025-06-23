
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';

interface CustomPricing {
  id: string;
  user_id: string | null;
  email: string;
  custom_price: number;
  currency: string;
  discount_percentage: number | null;
  reason: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

const CustomPricingManager = () => {
  const [customPrices, setCustomPrices] = useState<CustomPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState<CustomPricing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    custom_price: '',
    discount_percentage: '',
    reason: '',
    valid_until: ''
  });

  useEffect(() => {
    fetchCustomPrices();
  }, []);

  const fetchCustomPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_pricing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom prices:', error);
        toast.error('Failed to load custom pricing');
        return;
      }

      setCustomPrices(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load custom pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.custom_price) {
      toast.error('Email and price are required');
      return;
    }

    try {
      const priceData = {
        email: formData.email,
        custom_price: parseInt(formData.custom_price) * 100, // Convert to paise
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
        reason: formData.reason || null,
        valid_until: formData.valid_until || null,
        is_active: true
      };

      if (editingPrice) {
        const { error } = await supabase
          .from('custom_pricing')
          .update(priceData)
          .eq('id', editingPrice.id);

        if (error) throw error;
        toast.success('Custom pricing updated successfully');
      } else {
        const { error } = await supabase
          .from('custom_pricing')
          .insert(priceData);

        if (error) throw error;
        toast.success('Custom pricing created successfully');
      }

      setShowForm(false);
      setEditingPrice(null);
      setFormData({ email: '', custom_price: '', discount_percentage: '', reason: '', valid_until: '' });
      await fetchCustomPrices();
    } catch (error: any) {
      console.error('Error saving custom pricing:', error);
      toast.error('Failed to save custom pricing');
    }
  };

  const handleEdit = (pricing: CustomPricing) => {
    setEditingPrice(pricing);
    setFormData({
      email: pricing.email,
      custom_price: (pricing.custom_price / 100).toString(),
      discount_percentage: pricing.discount_percentage?.toString() || '',
      reason: pricing.reason || '',
      valid_until: pricing.valid_until ? new Date(pricing.valid_until).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete custom pricing for ${email}?`)) return;

    try {
      const { error } = await supabase
        .from('custom_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Custom pricing deleted');
      await fetchCustomPrices();
    } catch (error) {
      console.error('Error deleting custom pricing:', error);
      toast.error('Failed to delete custom pricing');
    }
  };

  const filteredPrices = customPrices.filter(price =>
    price.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading custom pricing...</div>;
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Custom Pricing Management
          </div>
          <Button onClick={() => { setShowForm(!showForm); setEditingPrice(null); setFormData({ email: '', custom_price: '', discount_percentage: '', reason: '', valid_until: '' }); }}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Custom Price'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-background/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="custom_price">Price (₹) *</Label>
                <Input
                  id="custom_price"
                  type="number"
                  min="1"
                  value={formData.custom_price}
                  onChange={(e) => setFormData({...formData, custom_price: e.target.value})}
                  placeholder="199"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Discount % (optional)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until (optional)</Label>
                <Input
                  id="valid_until"
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Special discount for loyal customer"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">
                {editingPrice ? 'Update' : 'Create'} Custom Price
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingPrice(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredPrices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No custom pricing found for your search.' : 'No custom pricing set yet.'}
            </div>
          ) : (
            filteredPrices.map((pricing) => (
              <div key={pricing.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-foreground font-medium">{pricing.email}</span>
                    <Badge variant={pricing.is_active ? "default" : "secondary"}>
                      {pricing.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Price: ₹{pricing.custom_price / 100}</p>
                    {pricing.discount_percentage && (
                      <p>Discount: {pricing.discount_percentage}%</p>
                    )}
                    {pricing.reason && (
                      <p>Reason: {pricing.reason}</p>
                    )}
                    {pricing.valid_until && (
                      <p>Valid until: {new Date(pricing.valid_until).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(pricing)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(pricing.id, pricing.email)}
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

export default CustomPricingManager;
