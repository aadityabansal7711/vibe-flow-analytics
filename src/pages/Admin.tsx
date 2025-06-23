
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CustomPricingManager from '@/components/CustomPricingManager';
import ContactRequestsManager from '@/components/ContactRequestsManager';
import PromoCodeManager from '@/components/PromoCodeManager';
import { 
  Users, 
  Crown, 
  Settings, 
  ArrowLeft, 
  DollarSign,
  MessageSquare,
  Tag,
  Activity,
  BarChart3
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  has_active_subscription: boolean;
  plan_tier: string;
  created_at: string;
  spotify_connected: boolean;
}

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  spotifyConnections: number;
}

const Admin = () => {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    spotifyConnections: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      // Check if user is admin using the is_admin function
      const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Use service role or ensure RLS allows admin access to all profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, has_active_subscription, plan_tier, created_at, spotify_connected')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        has_active_subscription: user.has_active_subscription,
        plan_tier: user.plan_tier,
        created_at: user.created_at,
        spotify_connected: user.spotify_connected
      }));

      setUsers(formattedUsers);

      // Calculate stats
      const totalUsers = formattedUsers.length;
      const premiumUsers = formattedUsers.filter(u => u.has_active_subscription).length;
      const freeUsers = totalUsers - premiumUsers;
      const spotifyConnections = formattedUsers.filter(u => u.spotify_connected).length;

      setStats({
        totalUsers,
        premiumUsers,
        freeUsers,
        spotifyConnections
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserPremium = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_active_subscription: !currentStatus,
          plan_tier: !currentStatus ? 'premium' : 'free'
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user premium status:', error);
    }
  };

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="glass-effect border-border/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            <Settings className="mr-1 h-3 w-3" />
            Admin Access
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                  <p className="text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.premiumUsers}</p>
                  <p className="text-muted-foreground">Premium Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.freeUsers}</p>
                  <p className="text-muted-foreground">Free Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.spotifyConnections}</p>
                  <p className="text-muted-foreground">Spotify Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Custom Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Contact Requests</span>
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Promo Codes</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border/20 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={user.has_active_subscription ? "default" : "secondary"}>
                              {user.plan_tier}
                            </Badge>
                            {user.spotify_connected && (
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                Spotify
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant={user.has_active_subscription ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleUserPremium(user.id, user.has_active_subscription)}
                      >
                        {user.has_active_subscription ? 'Remove Premium' : 'Grant Premium'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <CustomPricingManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactRequestsManager />
          </TabsContent>

          <TabsContent value="promo">
            <PromoCodeManager />
          </TabsContent>

          <TabsContent value="activity">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Activity Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Activity tracking functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
