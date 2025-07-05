import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import PromoCodeManager from '@/components/PromoCodeManager';
import GiveawayManager from '@/components/GiveawayManager';
import ContactRequestsManager from '@/components/ContactRequestsManager';
import { 
  Users, 
  UserCheck, 
  Settings, 
  Search, 
  Mail, 
  Calendar,
  Star,
  Trash2,
  Check,
  X,
  Shield,
  Activity,
  Database,
  RefreshCw,
  Music,
  Gift,
  Crown
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  has_active_subscription: boolean;
  plan_tier: string;
  spotify_connected: boolean;
  created_at: string;
  user_id: string;
}

const Admin = () => {
  // Check admin authentication
  const adminSession = localStorage.getItem('admin_session');
  if (!adminSession) {
    return <Navigate to="/admin-login" replace />;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    spotifyConnected: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users: ' + error.message);
        setUsers([]);
        return;
      }
      
      if (!data || !Array.isArray(data)) {
        setMessage('No user data found.');
        setUsers([]);
        return;
      }
      
      setUsers(data);
      setMessage('Users loaded successfully');
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      setMessage('Error fetching users: ' + error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_active_subscription, spotify_connected, created_at');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      if (data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        setStats({
          totalUsers: data.length,
          premiumUsers: data.filter(u => u.has_active_subscription).length,
          spotifyConnected: data.filter(u => u.spotify_connected).length,
          newUsersToday: data.filter(u => new Date(u.created_at) >= today).length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const grantPremium = async (userId: string) => {
    try {
      setActionLoading(userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_active_subscription: true, 
          plan_tier: 'premium',
          plan_id: 'admin_granted_premium'
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error granting premium:', error);
        setMessage('Error granting premium: ' + error.message);
        return;
      }

      setMessage('Premium access granted successfully!');
      await fetchUsers();
      await fetchStats();
    } catch (error: any) {
      console.error('Error in grantPremium:', error);
      setMessage('Error granting premium: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const revokePremium = async (userId: string) => {
    try {
      setActionLoading(userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_active_subscription: false, 
          plan_tier: 'free',
          plan_id: 'free_tier'
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error revoking premium:', error);
        setMessage('Error revoking premium: ' + error.message);
        return;
      }

      setMessage('Premium access revoked successfully!');
      await fetchUsers();
      await fetchStats();
    } catch (error: any) {
      console.error('Error in revokePremium:', error);
      setMessage('Error revoking premium: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        setMessage('Error deleting user: ' + error.message);
        return;
      }

      setMessage('User deleted successfully!');
      await fetchUsers();
      await fetchStats();
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      setMessage('Error deleting user: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchUsers} variant="outline" disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Shield className="mr-1 h-3 w-3" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Premium Users</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Spotify Connected</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.spotifyConnected}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? Math.round((stats.spotifyConnected / stats.totalUsers) * 100) : 0}% connection rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.newUsersToday}</div>
              <p className="text-xs text-muted-foreground">Users registered today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="giveaways" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="giveaways" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Giveaways
            </TabsTrigger>
            <TabsTrigger value="promos" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Promo Codes
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Requests
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="giveaways">
            <GiveawayManager />
          </TabsContent>

          <TabsContent value="promos">
            <PromoCodeManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactRequestsManager />
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border text-foreground"
                  />
                </div>

                {/* User List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">{user.email}</span>
                          </div>
                          {user.full_name && (
                            <p className="text-sm text-muted-foreground mb-2">{user.full_name}</p>
                          )}
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Joined {formatDate(user.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={user.has_active_subscription ? "default" : "secondary"}>
                              {user.has_active_subscription ? 'Premium' : 'Free'}
                            </Badge>
                            {user.spotify_connected && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                <Music className="mr-1 h-3 w-3" />
                                Spotify
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.has_active_subscription ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => revokePremium(user.user_id)}
                              disabled={actionLoading === user.id}
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              {actionLoading === user.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => grantPremium(user.user_id)}
                              disabled={actionLoading === user.id}
                              className="text-green-400 border-green-400 hover:bg-green-400/10"
                            >
                              {actionLoading === user.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.user_id, user.email)}
                            disabled={actionLoading === user.id}
                            className="text-red-400 border-red-400 hover:bg-red-400/10"
                          >
                            {actionLoading === user.id ? (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
