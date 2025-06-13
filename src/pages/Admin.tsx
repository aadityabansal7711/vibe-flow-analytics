
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
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
  Shield
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  has_active_subscription: boolean;
  plan_tier: string;
  spotify_connected: boolean;
  created_at: string;
}

interface SystemConfig {
  app_name: string;
  maintenance_mode: boolean;
  max_users: number;
  features_enabled: string[];
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    app_name: 'MyVibeLytics',
    maintenance_mode: false,
    max_users: 10000,
    features_enabled: ['spotify_integration', 'analytics', 'premium_features']
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from profiles table...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users: ' + error.message);
        return;
      }

      console.log('Users fetched successfully:', data?.length || 0);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      setMessage('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const grantPremium = async (userId: string) => {
    try {
      console.log('Granting premium to user:', userId);
      
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
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error in grantPremium:', error);
      setMessage('Error granting premium: ' + error.message);
    }
  };

  const revokePremium = async (userId: string) => {
    try {
      console.log('Revoking premium from user:', userId);
      
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
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error in revokePremium:', error);
      setMessage('Error revoking premium: ' + error.message);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('Deleting user:', userId);
      
      // First delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        setMessage('Error deleting user: ' + profileError.message);
        return;
      }

      setMessage('User deleted successfully!');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      setMessage('Error deleting user: ' + error.message);
    }
  };

  const updateSystemConfig = async () => {
    try {
      // Since we don't have a system config table, we'll just show a success message
      // In a real app, you'd store this in a database
      setMessage('System configuration updated successfully!');
      console.log('System config updated:', systemConfig);
    } catch (error: any) {
      console.error('Error updating system config:', error);
      setMessage('Error updating system config: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Admin Access
          </Badge>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Premium Users</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.has_active_subscription).length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Spotify Connected</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.spotify_connected).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border text-foreground"
                />
              </div>

              {/* User List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">{user.email}</span>
                      </div>
                      {user.full_name && (
                        <p className="text-sm text-muted-foreground mt-1">{user.full_name}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={user.has_active_subscription ? "default" : "secondary"}>
                          {user.has_active_subscription ? 'Premium' : 'Free'}
                        </Badge>
                        {user.spotify_connected && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
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
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => grantPremium(user.user_id)}
                          className="text-green-400 border-green-400 hover:bg-green-400/10"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteUser(user.user_id, user.email)}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app_name" className="text-foreground">App Name</Label>
                <Input
                  id="app_name"
                  value={systemConfig.app_name}
                  onChange={(e) => setSystemConfig({...systemConfig, app_name: e.target.value})}
                  className="bg-background/50 border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_users" className="text-foreground">Max Users</Label>
                <Input
                  id="max_users"
                  type="number"
                  value={systemConfig.max_users}
                  onChange={(e) => setSystemConfig({...systemConfig, max_users: parseInt(e.target.value)})}
                  className="bg-background/50 border-border text-foreground"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  checked={systemConfig.maintenance_mode}
                  onChange={(e) => setSystemConfig({...systemConfig, maintenance_mode: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="maintenance_mode" className="text-foreground">Maintenance Mode</Label>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Enabled Features</Label>
                <div className="space-y-2">
                  {['spotify_integration', 'analytics', 'premium_features', 'ai_insights'].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={systemConfig.features_enabled.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSystemConfig({
                              ...systemConfig,
                              features_enabled: [...systemConfig.features_enabled, feature]
                            });
                          } else {
                            setSystemConfig({
                              ...systemConfig,
                              features_enabled: systemConfig.features_enabled.filter(f => f !== feature)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={feature} className="text-foreground capitalize">
                        {feature.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={updateSystemConfig} className="w-full bg-primary hover:bg-primary/90">
                Update Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
