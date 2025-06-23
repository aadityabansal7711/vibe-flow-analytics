
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  DollarSign, 
  Mail, 
  Calendar,
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface AdminUser {
  user_id: string;
  email: string;
  full_name?: string;
  has_active_subscription: boolean;
  created_at: string;
  spotify_connected: boolean;
  plan_tier: string;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

interface CustomPricingForm {
  email: string;
  custom_price: string;
  discount_percentage: string;
  reason: string;
  valid_until: string;
}

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium' | 'cancelled'>('all');
  const [pricingForm, setPricingForm] = useState<CustomPricingForm>({
    email: '',
    custom_price: '',
    discount_percentage: '',
    reason: '',
    valid_until: '',
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchContactRequests();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactRequests(data || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    }
  };

  const createCustomPricing = async () => {
    if (!pricingForm.email || !pricingForm.custom_price) {
      toast.error('Email and custom price are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_pricing')
        .insert({
          email: pricingForm.email,
          custom_price: parseInt(pricingForm.custom_price) * 100, // Convert to paise
          discount_percentage: pricingForm.discount_percentage ? parseInt(pricingForm.discount_percentage) : null,
          reason: pricingForm.reason || null,
          valid_until: pricingForm.valid_until || null,
          is_active: true,
        });

      if (error) throw error;

      toast.success('Custom pricing created successfully');
      setPricingForm({
        email: '',
        custom_price: '',
        discount_percentage: '',
        reason: '',
        valid_until: '',
      });
    } catch (error) {
      console.error('Error creating custom pricing:', error);
      toast.error('Failed to create custom pricing');
    }
  };

  const updateContactRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Contact request status updated');
      fetchContactRequests();
    } catch (error) {
      console.error('Error updating contact request:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterType) {
      case 'free':
        return !user.has_active_subscription;
      case 'premium':
        return user.has_active_subscription;
      case 'cancelled':
        return user.plan_tier === 'cancelled';
      default:
        return true;
    }
  });

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <Badge variant="outline" className="text-blue-400 border-blue-400">
          <Settings className="mr-1 h-3 w-3" />
          Administrator
        </Badge>
      </div>

      {/* User Management */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Users className="h-6 w-6" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {(['all', 'free', 'premium', 'cancelled'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={filterType === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.has_active_subscription ? 'default' : 'outline'}>
                    {user.has_active_subscription ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge variant={user.spotify_connected ? 'default' : 'outline'}>
                    {user.spotify_connected ? 'Spotify Connected' : 'No Spotify'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Pricing */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <DollarSign className="h-6 w-6" />
            <span>Custom Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-foreground">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={pricingForm.email}
                onChange={(e) => setPricingForm({ ...pricingForm, email: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <Label htmlFor="custom_price" className="text-foreground">Custom Price (₹)</Label>
              <Input
                id="custom_price"
                type="number"
                placeholder="199"
                value={pricingForm.custom_price}
                onChange={(e) => setPricingForm({ ...pricingForm, custom_price: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <Label htmlFor="discount_percentage" className="text-foreground">Discount %</Label>
              <Input
                id="discount_percentage"
                type="number"
                placeholder="20"
                value={pricingForm.discount_percentage}
                onChange={(e) => setPricingForm({ ...pricingForm, discount_percentage: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <Label htmlFor="valid_until" className="text-foreground">Valid Until</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                value={pricingForm.valid_until}
                onChange={(e) => setPricingForm({ ...pricingForm, valid_until: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reason" className="text-foreground">Reason</Label>
            <Input
              id="reason"
              placeholder="Special discount for early adopter"
              value={pricingForm.reason}
              onChange={(e) => setPricingForm({ ...pricingForm, reason: e.target.value })}
              className="bg-background/50 border-border"
            />
          </div>
          <Button onClick={createCustomPricing} className="w-full">
            Create Custom Pricing
          </Button>
        </CardContent>
      </Card>

      {/* Contact Requests */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Mail className="h-6 w-6" />
            <span>Contact Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {contactRequests.map((request) => (
              <div key={request.id} className="p-4 rounded-lg bg-background/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{request.name}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={request.status === 'pending' ? 'destructive' : 'default'}>
                      {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {request.subject && (
                  <p className="text-sm font-medium text-foreground mb-1">Subject: {request.subject}</p>
                )}
                <p className="text-sm text-muted-foreground mb-3">{request.message}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateContactRequestStatus(request.id, 'resolved')}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateContactRequestStatus(request.id, 'in_progress')}
                  >
                    In Progress
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
