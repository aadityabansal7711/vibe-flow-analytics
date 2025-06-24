
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Mail
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  has_active_subscription: boolean;
  plan_tier: string;
  created_at: string;
  plan_end_date?: string;
}

interface CustomPricing {
  id: string;
  email: string;
  custom_price: number;
  discount_percentage?: number;
  valid_until?: string;
  is_active: boolean;
  reason?: string;
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

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [customPricing, setCustomPricing] = useState<CustomPricing[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Custom pricing form state
  const [newPricing, setNewPricing] = useState({
    email: '',
    custom_price: 199,
    discount_percentage: 0,
    valid_until: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch custom pricing
      const { data: pricingData, error: pricingError } = await supabase
        .from('custom_pricing')
        .select('*')
        .order('created_at', { ascending: false });

      if (pricingError) throw pricingError;
      setCustomPricing(pricingData || []);

      // Fetch contact requests
      const { data: contactData, error: contactError } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) throw contactError;
      setContactRequests(contactData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const createCustomPricing = async () => {
    try {
      const { error } = await supabase
        .from('custom_pricing')
        .insert({
          email: newPricing.email,
          custom_price: newPricing.custom_price,
          discount_percentage: newPricing.discount_percentage,
          valid_until: newPricing.valid_until || null,
          reason: newPricing.reason,
          is_active: true,
          created_by: user?.id
        });

      if (error) throw error;

      toast.success('Custom pricing created successfully');
      setNewPricing({
        email: '',
        custom_price: 199,
        discount_percentage: 0,
        valid_until: '',
        reason: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating custom pricing:', error);
      toast.error('Failed to create custom pricing');
    }
  };

  const togglePricingStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_pricing')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Pricing ${!isActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing');
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Contact request updated');
      fetchData();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact request');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterBy) {
      case 'premium':
        return matchesSearch && user.has_active_subscription;
      case 'free':
        return matchesSearch && !user.has_active_subscription;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && new Date(user.created_at) > weekAgo;
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === 'pricing' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pricing')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Custom Pricing
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('contacts')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Requests
          </Button>
        </div>
      </div>

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <div className="flex space-x-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                  <SelectItem value="recent">Recent Signups</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan_tier === 'premium' ? 'default' : 'secondary'}>
                        {user.plan_tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.has_active_subscription ? 'default' : 'outline'}>
                        {user.has_active_subscription ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.plan_end_date ? new Date(user.plan_end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPricing.email}
                    onChange={(e) => setNewPricing({ ...newPricing, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Custom Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPricing.custom_price}
                    onChange={(e) => setNewPricing({ ...newPricing, custom_price: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount %</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newPricing.discount_percentage}
                    onChange={(e) => setNewPricing({ ...newPricing, discount_percentage: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valid Until</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={newPricing.valid_until}
                    onChange={(e) => setNewPricing({ ...newPricing, valid_until: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={newPricing.reason}
                    onChange={(e) => setNewPricing({ ...newPricing, reason: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={createCustomPricing} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Pricing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Custom Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customPricing.map((pricing) => (
                    <TableRow key={pricing.id}>
                      <TableCell>{pricing.email}</TableCell>
                      <TableCell>₹{pricing.custom_price}</TableCell>
                      <TableCell>{pricing.discount_percentage || 0}%</TableCell>
                      <TableCell>
                        {pricing.valid_until ? new Date(pricing.valid_until).toLocaleDateString() : 'No limit'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pricing.is_active ? 'default' : 'secondary'}>
                          {pricing.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePricingStatus(pricing.id, pricing.is_active)}
                        >
                          {pricing.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'contacts' && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.subject || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'pending' ? 'outline' : 'default'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateContactStatus(request.id, 'resolved')}
                          disabled={request.status === 'resolved'}
                        >
                          Resolve
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Contact Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Name</Label>
                                <p>{request.name}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p>{request.email}</p>
                              </div>
                              <div>
                                <Label>Subject</Label>
                                <p>{request.subject || 'N/A'}</p>
                              </div>
                              <div>
                                <Label>Message</Label>
                                <p className="whitespace-pre-wrap">{request.message}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;
