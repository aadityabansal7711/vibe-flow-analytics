
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link, Navigate } from 'react-router-dom';
import { Music, Shield, User, Key, Save, LogOut, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

const Admin = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const adminEmail = localStorage.getItem('admin_email');
    
    if (adminLoggedIn === 'true' && adminEmail === 'aadityabansal1112@gmail.com') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
  };

  const handleToggleAccess = () => {
    if (!userEmail) {
      setMessage('Please enter a user email');
      return;
    }

    // Simulate user access toggle
    setMessage(`Access ${isUnlocked ? 'granted' : 'revoked'} for ${userEmail}`);
    
    // In a real app, this would make an API call to update the database
    console.log(`Toggling access for ${userEmail} to ${isUnlocked}`);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  const adminStats = [
    { name: 'Total Users', count: '1,234', icon: <Users className="h-6 w-6" />, color: 'text-blue-400' },
    { name: 'Premium Users', count: '567', icon: <DollarSign className="h-6 w-6" />, color: 'text-green-400' },
    { name: 'Daily Active Users', count: '892', icon: <Activity className="h-6 w-6" />, color: 'text-purple-400' },
    { name: 'Monthly Revenue', count: '$8,910', icon: <TrendingUp className="h-6 w-6" />, color: 'text-yellow-400' }
  ];

  const recentUsers = [
    { name: 'John Doe', email: 'john@example.com', status: 'Premium', joined: '2 hours ago' },
    { name: 'Sarah Smith', email: 'sarah@example.com', status: 'Free', joined: '5 hours ago' },
    { name: 'Mike Johnson', email: 'mike@example.com', status: 'Premium', joined: '1 day ago' },
    { name: 'Emily Davis', email: 'emily@example.com', status: 'Free', joined: '2 days ago' }
  ];

  const recentActivity = [
    { time: '2 minutes ago', action: 'New user registered', user: 'john@example.com' },
    { time: '15 minutes ago', action: 'Premium upgrade', user: 'sarah@example.com' },
    { time: '1 hour ago', action: 'Analytics data refreshed', user: 'System' },
    { time: '2 hours ago', action: 'Spotify connection', user: 'mike@example.com' },
    { time: '3 hours ago', action: 'Dashboard accessed', user: 'emily@example.com' }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary animate-pulse-slow" />
              <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
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
                      className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Update User Access
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
                      {recentUsers.map((user, index) => (
                        <div key={index} className="glass-effect border-border/30 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-foreground font-medium">{user.name}</p>
                              <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.status === 'Premium' 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {user.status}
                              </span>
                              <p className="text-muted-foreground text-xs mt-1">{user.joined}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      <Label className="text-foreground">Admin Email</Label>
                      <Input
                        value="aadityabansal1112@gmail.com"
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

            {/* Recent Activity */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-border/20 last:border-b-0">
                      <div>
                        <span className="text-foreground text-sm font-medium">{activity.action}</span>
                        <p className="text-muted-foreground text-xs">{activity.user}</p>
                      </div>
                      <span className="text-muted-foreground text-xs">{activity.time}</span>
                    </div>
                  ))}
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
