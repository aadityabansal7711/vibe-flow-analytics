
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { Music, Shield, User, Key, Save } from 'lucide-react';

const Admin = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState('');

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

  const adminFeatures = [
    { name: 'User Management', count: '1,234' },
    { name: 'Premium Users', count: '567' },
    { name: 'Total Sessions', count: '12,345' },
    { name: 'Revenue (This Month)', count: '$8,910' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-red-400" />
          <span className="text-2xl font-bold text-white">Admin Panel</span>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-2">{feature.count}</div>
                <p className="text-gray-300 text-sm">{feature.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Management */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span>User Access Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userEmail" className="text-white">User Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="unlockAccess"
                    checked={isUnlocked}
                    onCheckedChange={setIsUnlocked}
                  />
                  <Label htmlFor="unlockAccess" className="text-white">
                    Grant Premium Access
                  </Label>
                </div>
                
                <Button
                  onClick={handleToggleAccess}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update User Access
                </Button>
                
                {message && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-sm">
                    {message}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Quick Actions</Label>
                  <div className="space-y-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                    >
                      View All Users
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                    >
                      Premium User Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                    >
                      Analytics Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Key className="h-5 w-5" />
              <span>System Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Spotify Client ID</Label>
                  <Input
                    value="fe34af0e9c494464a7a8ba2012f382bb"
                    readOnly
                    className="bg-white/5 border-white/20 text-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Supabase Project ID</Label>
                  <Input
                    value="wxwbfduhveewbuluetpb"
                    readOnly
                    className="bg-white/5 border-white/20 text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Domain</Label>
                  <Input
                    value="https://myvibelytics.com"
                    readOnly
                    className="bg-white/5 border-white/20 text-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">API Status</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 minutes ago', action: 'New user registered: john@example.com' },
                { time: '15 minutes ago', action: 'Premium upgrade: sarah@example.com' },
                { time: '1 hour ago', action: 'Analytics data refreshed' },
                { time: '2 hours ago', action: 'System backup completed' }
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                  <span className="text-white text-sm">{activity.action}</span>
                  <span className="text-gray-400 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
