
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link, Navigate } from 'react-router-dom';
import { Music, Shield, User, Key, Save, LogOut, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  has_active_subscription: boolean;
  spotify_connected: boolean;
  created_at: string;
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

const Admin = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const adminEmail = localStorage.getItem('admin_email');
    
    if (adminLoggedIn === 'true' && adminEmail === 'aadityabansal1112@gmail.com') {
      setIsAuthenticated(true);
      fetchUsers();
      fetchContactRequests();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: "Failed to fetch contact requests",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
  };

  const handleToggleAccess = async () => {
    if (!userEmail) {
      setMessage('Please enter a user email');
      return;
    }

    setLoading(true);
    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (userError || !user) {
        setMessage('User not found');
        setLoading(false);
        return;
      }

      // Update user's premium access
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_active_subscription: isUnlocked })
        .eq('email', userEmail);

      if (updateError) throw updateError;

      // Also update user_management table
      const { error: managementError } = await supabase
        .from('user_management')
        .upsert({
          user_id: user.user_id,
          email: userEmail,
          premium_access: isUnlocked,
          managed_by_admin: 'admin_id', // You might want to get actual admin ID
          updated_at: new Date().toISOString()
        });

      if (managementError) throw managementError;

      setMessage(`Access ${isUnlocked ? 'granted' : 'revoked'} for ${userEmail}`);
      
      // Refresh users list
      fetchUsers();
      
      toast({
        title: "Success",
        description: `User access ${isUnlocked ? 'granted' : 'revoked'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user access:', error);
      setMessage('Failed to update user access');
      toast({
        title: "Error",
        description: "Failed to update user access",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  const premiumUsers = users.filter(user => user.has_active_subscription);
  const spotifyConnectedUsers = users.filter(user => user.spotify_connected);

  const adminStats = [
    { name: 'Total Users', count: users.length.toString(), icon: <Users className="h-6 w-6" />, color: 'text-blue-400' },
    { name: 'Premium Users', count: premiumUsers.length.toString(), icon: <DollarSign className="h-6 w-6" />, color: 'text-green-400' },
    { name: 'Spotify Connected', count: spotifyConnectedUsers.length.toString(), icon: <Activity className="h-6 w-6" />, color: 'text-purple-400' },
    { name: 'Contact Requests', count: contactRequests.length.toString(), icon: <TrendingUp className="h-6 w-6" />, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="MyVibeLytics" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-gradient">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground text-sm">Welcome, Admin</span>
            <Link to="/dashboard">
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
                Dashboard
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, index) => (
                <Card key={index} className="glass-effect card-hover border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.name}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* User Management */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <User className="h-5 w-5" />
                  <span>User Access Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="userEmail" className="text-foreground">User Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="user@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-background/50 border-border text-foreground"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="unlockAccess"
                        checked={isUnlocked}
                        onCheckedChange={setIsUnlocked}
                      />
                      <Label htmlFor="unlockAccess" className="text-foreground">
                        Grant Premium Access
                      </Label>
                    </div>
                    
                    <Button
                      onClick={handleToggleAccess}
                      disabled={loading}
                      className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Updating...' : 'Update User Access'}
                    </Button>
                    
                    {message && (
                      <div className="p-3 bg-primary/20 border border-primary/30 rounded text-primary text-sm">
                        {message}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-foreground text-lg">Recent Users</Label>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {users.slice(0, 5).map((user, index) => (
                        <div key={index} className="glass-effect border-border/30 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-foreground font-medium">{user.full_name || 'Unknown'}</p>
                              <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.has_active_subscription 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {user.has_active_subscription ? 'Premium' : 'Free'}
                              </span>
                              <p className="text-muted-foreground text-xs mt-1">
                                {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Requests */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {contactRequests.map((request, index) => (
                    <div key={index} className="glass-effect border-border/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-foreground font-medium">{request.name}</p>
                          <p className="text-muted-foreground text-sm">{request.email}</p>
                          {request.subject && (
                            <p className="text-foreground text-sm mt-1">Subject: {request.subject}</p>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{request.message}</p>
                    </div>
                  ))}
                  {contactRequests.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No contact requests yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Key className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Spotify Client ID</Label>
                      <Input
                        value="fe34af0e9c494464a7a8ba2012f382bb"
                        readOnly
                        className="bg-muted border-border text-muted-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Spotify Redirect URL</Label>
                      <Input
                        value="https://vibe-flow-analytics.lovable.app/spotify-callback"
                        readOnly
                        className="bg-muted border-border text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Domain</Label>
                      <Input
                        value="https://vibe-flow-analytics.lovable.app"
                        readOnly
                        className="bg-muted border-border text-muted-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">System Status</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-primary text-sm font-medium">All systems operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
