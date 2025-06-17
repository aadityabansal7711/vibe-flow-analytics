
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import EditName from './profile/EditName';
import ProfileInfo from './profile/ProfileInfo';
import DangerZone from './profile/DangerZone';
import { 
  Music, 
  User, 
  Settings, 
  LogOut, 
  Unlink,
  AlertTriangle,
  Crown
} from 'lucide-react';

const Profile = () => {
  const { user, profile, logout } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSpotifyDisconnect = async () => {
    const isPremium = profile?.has_active_subscription;
    
    if (isPremium) {
      const confirmed = confirm(
        '⚠️ WARNING: You have an active Premium subscription. Disconnecting Spotify will cancel your premium features and subscription. Are you sure you want to continue?'
      );
      if (!confirmed) return;
    } else {
      const confirmed = confirm('Are you sure you want to disconnect Spotify?');
      if (!confirmed) return;
    }

    setDisconnecting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          spotify_connected: false,
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_user_id: null,
          spotify_display_name: null,
          spotify_avatar_url: null,
          spotify_token_expires_at: null,
          // If premium, also revoke premium access
          ...(isPremium && {
            has_active_subscription: false,
            plan_tier: 'free',
            plan_id: 'free_tier',
            plan_start_date: null,
            plan_end_date: null
          })
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage('Spotify disconnected successfully' + (isPremium ? ' and premium subscription cancelled' : ''));
      
      // Refresh the page to update the context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setMessage('Error disconnecting Spotify: ' + error.message);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Music className="h-8 w-8 text-primary animate-pulse-slow" />
              <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-red-400 text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Account Overview */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <User className="h-5 w-5" />
                <span>Account Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">{user.email}</p>
                  <p className="text-muted-foreground text-sm">Account Email</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={profile?.has_active_subscription ? "default" : "secondary"}>
                    {profile?.has_active_subscription ? (
                      <>
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </>
                    ) : (
                      'Free Plan'
                    )}
                  </Badge>
                  {profile?.spotify_connected && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Music className="mr-1 h-3 w-3" />
                      Spotify Connected
                    </Badge>
                  )}
                </div>
              </div>
              
              {profile?.spotify_connected && (
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">
                        {profile.spotify_display_name || 'Spotify User'}
                      </p>
                      <p className="text-muted-foreground text-sm">Connected Spotify Account</p>
                    </div>
                    <Button
                      onClick={handleSpotifyDisconnect}
                      disabled={disconnecting}
                      variant="outline"
                      className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      {disconnecting ? 'Disconnecting...' : 'Disconnect Spotify'}
                    </Button>
                  </div>
                  
                  {profile?.has_active_subscription && (
                    <Alert className="mt-4 border-orange-400/50 bg-orange-400/5">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      <AlertDescription className="text-orange-300">
                        <strong>Warning:</strong> Disconnecting Spotify will cancel your Premium subscription and you'll lose access to premium features.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Information */}
          <ProfileInfo />

          {/* Edit Name */}
          <EditName />

          {/* Account Actions */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Settings className="h-5 w-5" />
                <span>Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                  <div>
                    <h3 className="text-foreground font-medium">Subscription Management</h3>
                    <p className="text-muted-foreground text-sm">
                      {profile?.has_active_subscription 
                        ? 'Manage your premium subscription and billing'
                        : 'Upgrade to premium for advanced features'
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = profile?.has_active_subscription ? '/profile' : '/buy'}
                  >
                    {profile?.has_active_subscription ? 'Manage' : 'Upgrade'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                  <div>
                    <h3 className="text-foreground font-medium">Data Export</h3>
                    <p className="text-muted-foreground text-sm">Download your data and insights</p>
                  </div>
                  <Button variant="outline" disabled>
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                  <div>
                    <h3 className="text-foreground font-medium">Privacy Settings</h3>
                    <p className="text-muted-foreground text-sm">Control your data and privacy preferences</p>
                  </div>
                  <Button variant="outline" disabled>
                    Manage Privacy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default Profile;
