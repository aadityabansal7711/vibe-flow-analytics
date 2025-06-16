
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
  Shield,
  Activity,
  Database,
  RefreshCw,
  Music,
  TrendingUp,
  BarChart3,
  Eye
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
  spotify_display_name?: string;
}

interface TopTrack {
  name: string;
  artist: string;
  plays: number;
}

interface Analytics {
  totalPlays: number;
  avgSessionTime: number;
  topGenres: string[];
  activeUsers24h: number;
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
  const [topTracks] = useState<TopTrack[]>([
    { name: "Blinding Lights", artist: "The Weeknd", plays: 1247 },
    { name: "Watermelon Sugar", artist: "Harry Styles", plays: 1156 },
    { name: "Levitating", artist: "Dua Lipa", plays: 1089 },
    { name: "Good 4 U", artist: "Olivia Rodrigo", plays: 987 },
    { name: "Stay", artist: "The Kid LAROI, Justin Bieber", plays: 923 },
    { name: "Peaches", artist: "Justin Bieber", plays: 876 },
    { name: "Deja Vu", artist: "Olivia Rodrigo", plays: 834 },
    { name: "Save Your Tears", artist: "The Weeknd", plays: 798 },
    { name: "Kiss Me More", artist: "Doja Cat ft. SZA", plays: 765 },
    { name: "Montero", artist: "Lil Nas X", plays: 723 },
    { name: "Industry Baby", artist: "Lil Nas X & Jack Harlow", plays: 698 },
    { name: "Bad Habits", artist: "Ed Sheeran", plays: 667 },
    { name: "Butter", artist: "BTS", plays: 634 },
    { name: "Positions", artist: "Ariana Grande", plays: 612 },
    { name: "Drivers License", artist: "Olivia Rodrigo", plays: 589 },
    { name: "Mood", artist: "24kGoldn ft. iann dior", plays: 567 },
    { name: "Dynamite", artist: "BTS", plays: 543 },
    { name: "Circles", artist: "Post Malone", plays: 521 },
    { name: "Rockstar", artist: "DaBaby ft. Roddy Ricch", plays: 498 },
    { name: "Flowers", artist: "Miley Cyrus", plays: 476 }
  ]);
  const [analytics] = useState<Analytics>({
    totalPlays: 156789,
    avgSessionTime: 23.4,
    topGenres: ["Pop", "Hip Hop", "Rock", "Electronic", "R&B"],
    activeUsers24h: 342
  });
  const [recentlyPlayed] = useState([
    { name: "Anti-Hero", artist: "Taylor Swift", time: "2 mins ago" },
    { name: "As It Was", artist: "Harry Styles", time: "5 mins ago" },
    { name: "Heat Waves", artist: "Glass Animals", time: "8 mins ago" },
    { name: "About Damn Time", artist: "Lizzo", time: "12 mins ago" },
    { name: "Running Up That Hill", artist: "Kate Bush", time: "15 mins ago" },
    { name: "Bad Habit", artist: "Steve Lacy", time: "18 mins ago" },
    { name: "Unholy", artist: "Sam Smith ft. Kim Petras", time: "21 mins ago" },
    { name: "I'm Good", artist: "David Guetta & Bebe Rexha", time: "25 mins ago" },
    { name: "Shivers", artist: "Ed Sheeran", time: "28 mins ago" },
    { name: "Stay", artist: "The Kid LAROI & Justin Bieber", time: "31 mins ago" },
    { name: "Glimpse of Us", artist: "Joji", time: "34 mins ago" },
    { name: "First Class", artist: "Jack Harlow", time: "37 mins ago" },
    { name: "Break My Soul", artist: "Beyoncé", time: "40 mins ago" },
    { name: "Music For a Sushi Restaurant", artist: "Harry Styles", time: "43 mins ago" },
    { name: "Sunroof", artist: "Nicky Youre & dazy", time: "46 mins ago" },
    { name: "Late Night Talking", artist: "Harry Styles", time: "49 mins ago" },
    { name: "Light Switch", artist: "Charlie Puth", time: "52 mins ago" },
    { name: "Jimmy Cooks", artist: "Drake ft. 21 Savage", time: "55 mins ago" },
    { name: "Wait for U", artist: "Future ft. Drake & Tems", time: "58 mins ago" },
    { name: "Life Goes On", artist: "Oliver Tree & David Guetta", time: "1 hour ago" }
  ]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
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
      setMessage('');
    } catch (error: any) {
      setMessage('Error fetching users: ' + error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('has_active_subscription, spotify_connected, created_at');

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
      console.log('Granting premium to user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_active_subscription: true, 
          plan_tier: 'premium',
          plan_id: 'admin_granted_premium',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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
      console.log('Revoking premium from user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_active_subscription: false, 
          plan_tier: 'free',
          plan_id: 'free_tier',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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
      console.log('Deleting user:', userId);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        setMessage('Error deleting user: ' + profileError.message);
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
            <img src="/logo.png" alt="MyVibeLytics" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-gradient">MyVibeLytics Admin</h1>
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
              <p className="text-xs text-muted-foreground">Registered users</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users (24h)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.activeUsers24h}</div>
              <p className="text-xs text-muted-foreground">Users active today</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Plays</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalPlays.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All-time track plays</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Top 20 Tracks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {topTracks.map((track, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background/30 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{track.name}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{track.plays} plays</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Recently Played
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {recentlyPlayed.map((track, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background/30 rounded">
                  <div>
                    <p className="text-sm font-medium text-foreground">{track.name}</p>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Session Time</span>
                  <span className="text-sm font-medium text-foreground">{analytics.avgSessionTime} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Spotify Connected</span>
                  <span className="text-sm font-medium text-foreground">{stats.spotifyConnected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Users Today</span>
                  <span className="text-sm font-medium text-foreground">{stats.newUsersToday}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Top Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {analytics.topGenres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
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
                        {user.spotify_display_name && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {user.spotify_display_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.has_active_subscription ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revokePremium(user.id)}
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
                          onClick={() => grantPremium(user.id)}
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
                        onClick={() => deleteUser(user.id, user.email)}
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
      </div>
    </div>
  );
};

export default Admin;
