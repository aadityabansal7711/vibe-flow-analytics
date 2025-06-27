
import React, { useState, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SpotifyConnect from '@/components/SpotifyConnect';
import DangerZone from '@/pages/profile/DangerZone';
import EditName from '@/pages/profile/EditName';
import { 
  User, 
  Crown, 
  Music, 
  LogOut,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut, loading, fetchProfile } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  }, [signOut]);

  const handleSpotifyDisconnect = useCallback(async () => {
    // Show premium warning if user has active subscription
    if (profile?.has_active_subscription || profile?.plan_tier === 'premium') {
      const confirmed = window.confirm(
        '⚠️ PREMIUM SUBSCRIPTION WARNING ⚠️\n\nDisconnecting Spotify will IMMEDIATELY:\n• Cancel your premium subscription\n• Remove access to ALL premium features\n• This action CANNOT be undone\n\nYou will need to purchase a new subscription to regain premium access.\n\nAre you absolutely sure you want to continue?'
      );
      
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
          has_active_subscription: false,
          plan_tier: 'free'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Spotify disconnected and premium subscription cancelled');
      
      // Refresh profile data instead of full page reload
      if (fetchProfile) {
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      toast.error('Failed to disconnect Spotify');
    } finally {
      setDisconnecting(false);
    }
  }, [profile, user.id, fetchProfile]);

  const handleDashboardClick = useCallback((e: React.MouseEvent) => {
    if (!profile?.spotify_connected) {
      e.preventDefault();
      toast.error('Please connect your Spotify account first to access the dashboard');
    }
  }, [profile?.spotify_connected]);

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={profile?.spotify_connected ? "/dashboard" : "#"} onClick={handleDashboardClick}>
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {profile?.spotify_connected ? 'Back to Dashboard' : 'Dashboard (Connect Spotify First)'}
              </Button>
            </Link>
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            {(profile?.has_active_subscription || profile?.plan_tier === 'premium') && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="text-foreground font-medium">{user.email}</div>
              </div>
              
              <EditName profile={profile} />

              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-medium capitalize">
                    {profile?.plan_tier || 'free'}
                  </span>
                  {(profile?.has_active_subscription || profile?.plan_tier === 'premium') && (
                    <Crown className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Premium Subscription Warning */}
              {(profile?.has_active_subscription || profile?.plan_tier === 'premium') && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-400">
                      <strong>⚠️ PREMIUM SUBSCRIPTION WARNING:</strong> Disconnecting Spotify will immediately cancel your premium subscription and remove access to ALL premium features. You cannot reconnect as a premium user - you'll become a free user and need to purchase a new subscription.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spotify Connection */}
          <div className="space-y-6">
            <SpotifyConnect />
            
            {profile?.spotify_connected && (
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="mr-2 h-5 w-5" />
                    Spotify Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Connected Account</h4>
                        <p className="text-sm text-muted-foreground">
                          {profile.spotify_display_name || 'Spotify User'}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Button
                        onClick={handleSpotifyDisconnect}
                        disabled={disconnecting}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                      >
                        {disconnecting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        ) : (
                          <Music className="mr-2 h-4 w-4" />
                        )}
                        Disconnect Spotify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <Card className="glass-effect border-border/50 mt-8">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button onClick={handleSignOut} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              
              <Separator />
              
              <DangerZone profile={profile} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
