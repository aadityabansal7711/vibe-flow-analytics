
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link, Navigate } from 'react-router-dom';
import { User, Key, Save, LogOut, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Checking admin authentication...');
      const adminSession = localStorage.getItem('admin_session');
      const adminLoggedIn = localStorage.getItem('admin_logged_in');
      
      console.log('Admin session check:', { 
        hasSession: !!adminSession, 
        loggedIn: adminLoggedIn 
      });
      
      if (adminSession && adminLoggedIn === 'true') {
        try {
          const session = JSON.parse(adminSession);
          console.log('Parsed admin session:', session);
          
          if (session.email === 'aadityabansal1112@gmail.com') {
            console.log('✅ Admin authenticated');
            setIsAuthenticated(true);
            loadInitialData();
          } else {
            console.log('❌ Invalid admin email');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error parsing admin session:', error);
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_logged_in');
          setIsAuthenticated(false);
        }
      } else {
        console.log('❌ No valid admin session found');
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loadInitialData = async () => {
    console.log('📊 Loading initial admin data...');
    setDataLoading(true);
    
    try {
      await Promise.all([
        fetchUsers(),
        fetchContactRequests()
      ]);
      console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('👥 Fetching users...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }
      
      console.log('✅ Users fetched:', data?.length || 0);
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
      console.log('📬 Fetching contact requests...');
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error && error.code !== 'PGRST116') { // Ignore table doesn't exist error
        console.error('❌ Error fetching contact requests:', error);
        throw error;
      }
      
      console.log('✅ Contact requests fetched:', data?.length || 0);
      setContactRequests(data || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      // Don't show error toast for contact requests as table might not exist
    }
  };

  const handleLogout = () => {
    console.log('🚪 Admin logging out...');
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
    window.location.href = '/admin-login';
  };

  const clearAllUsers = async () => {
    if (!window.confirm('Are you sure you want to delete ALL users? This action cannot be undone.')) {
      return;
    }

    console.log('🗑️ Clearing all users...');
    setDataLoading(true);
    try {
      // Delete all users from profiles table
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (profilesError) throw profilesError;

      // Try to delete from other tables if they exist
      try {
        await supabase.from('subscriptions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('user_management').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (error) {
        console.log('Note: Some tables may not exist:', error);
      }

      setMessage('All users deleted successfully');
      await fetchUsers();
      
      toast({
        title: "Success",
        description: "All users have been deleted",
      });
    } catch (error: any) {
      console.error('Error deleting users:', error);
      setMessage('Failed to delete users');
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive"
      });
    }
    setDataLoading(false);
  };

  const handleToggleAccess = async () => {
    if (!userEmail) {
      setMessage('Please enter a user email');
      return;
    }

    console.log('🔄 Toggling access for:', userEmail);
    setDataLoading(true);
    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (userError || !user) {
        setMessage('User not found');
        setDataLoading(false);
        return;
      }

      // Update user's premium access
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_active_subscription: isUnlocked })
        .eq('email', userEmail);

      if (updateError) throw updateError;

      // Try to update user_management table if it exists
      try {
        await supabase
          .from('user_management')
          .upsert({
            user_id: user.user_id,
            email: userEmail,
            premium_access: isUnlocked,
            managed_by_admin: 'admin_id',
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.log('Note: user_management table may not exist:', error);
      }

      setMessage(`Access ${isUnlocked ? 'granted' : 'revoked'} for ${userEmail}`);
      
      // Refresh users list
      await fetchUsers();
      
      toast({
        title: "Success",
        description: `User access ${isUnlocked ? 'granted' : 'revoked'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating user access:', error);
      setMessage('Failed to update user access');
      toast({
        title: "Error",
        description: "Failed to update user access",
        variant: "destructive"
      });
    }
    setDataLoading(false);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-2xl font-bold text-gradient">MyVibeLytics Admin</span>
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
                {dataLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )}

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
                      disabled={dataLoading}
                      className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {dataLoading ? 'Updating...' : 'Update User Access'}
                    </Button>

                    <Button
                      onClick={clearAllUsers}
                      disabled={dataLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      {dataLoading ? 'Deleting...' : 'Delete All Users'}
                    </Button>
                    
                    {message && (
                      <div className="p-3 bg-primary/20 border border-primary/30 rounded text-primary text-sm">
                        {message}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-foreground text-lg">Recent Users ({users.length})</Label>
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
                              {user.spotify_connected && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 ml-1">
                                  Spotify
                                </span>
                              )}
                              <p className="text-muted-foreground text-xs mt-1">
                                {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {users.length === 0 && !dataLoading && (
                        <p className="text-muted-foreground text-center py-8">No users found</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Requests */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Requests ({contactRequests.length})</CardTitle>
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
                  {contactRequests.length === 0 && !dataLoading && (
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
                      <Label className="text-foreground">Current Environment</Label>
                      <Input
                        value={window.location.origin}
                        readOnly
                        className="bg-muted border-border text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Spotify Redirect URL</Label>
                      <Input
                        value={`${window.location.origin}/spotify-callback`}
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
