
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import SpotifyConnect from '@/components/SpotifyConnect';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import SubscriptionManager from '@/components/SubscriptionManager';
import ProfileInfo from '@/pages/profile/ProfileInfo';
import EditName from '@/pages/profile/EditName';
import DangerZone from '@/pages/profile/DangerZone';
import AdminPanel from '@/components/AdminPanel';
import { 
  ArrowLeft, 
  Sparkles,
  User,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Unlink,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is admin
  const isAdmin = profile?.email === 'admin@example.com';

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      toast.success('Name updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSpotifyDisconnect = async () => {
    if (profile?.has_active_subscription) {
      setShowDisconnectDialog(true);
      return;
    }
    
    await disconnectSpotify();
  };

  const disconnectSpotify = async () => {
    try {
      await updateProfile({
        spotify_connected: false,
        spotify_access_token: null,
        spotify_refresh_token: null,
        spotify_token_expires_at: null,
        spotify_user_id: null,
        spotify_display_name: null,
        spotify_avatar_url: null,
        // If user has premium subscription, revoke it
        ...(profile?.has_active_subscription && {
          has_active_subscription: false,
          plan_tier: 'free',
          plan_id: 'free_tier'
        })
      });
      
      toast.success('Spotify disconnected successfully');
      setShowDisconnectDialog(false);
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      toast.error('Failed to disconnect Spotify');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
            </div>
          </div>
          {profile?.has_active_subscription && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
            className="text-sm"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
            className="text-sm"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant={activeTab === 'danger' ? 'default' : 'outline'}
            onClick={() => setActiveTab('danger')}
            className="text-sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            Account
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === 'admin' ? 'default' : 'outline'}
              onClick={() => setActiveTab('admin')}
              className="text-sm"
            >
              <Crown className="mr-2 h-4 w-4" />
              Admin
            </Button>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfilePictureUpload />
                  </CardContent>
                </Card>

                {/* Profile Info */}
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileInfo profile={profile} />
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              {/* Name Editor */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditName 
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    fullName={fullName}
                    setFullName={setFullName}
                    isLoading={isLoading}
                    handleUpdateName={handleUpdateName}
                    profile={profile}
                  />
                </CardContent>
              </Card>

              <Separator className="my-6" />

              {/* Spotify Connection */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Spotify Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <SpotifyConnect />
                    {profile?.spotify_connected && (
                      <Button
                        variant="destructive"
                        onClick={handleSpotifyDisconnect}
                        className="w-full"
                      >
                        <Unlink className="mr-2 h-4 w-4" />
                        Disconnect Spotify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* General Settings */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Group Management</h4>
                      <p className="text-sm text-muted-foreground">Manage your music groups and communities</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data Privacy</h4>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sign Out */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Session Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'danger' && (
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DangerZone profile={profile} />
              </CardContent>
            </Card>
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminPanel />
          )}
        </div>
      </div>

      {/* Spotify Disconnect Warning Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Spotify?</DialogTitle>
            <DialogDescription>
              Warning: You have an active premium subscription. Disconnecting Spotify will also cancel your premium subscription and you'll lose access to all premium features immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={disconnectSpotify}>
              Disconnect & Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
