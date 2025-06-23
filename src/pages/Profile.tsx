
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import EditName from '@/pages/profile/EditName';
import { 
  User, 
  Music, 
  Crown, 
  Settings, 
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, loading, signOut, disconnectSpotify, isUnlocked } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setSigningOut(false);
    }
  };

  const handleDisconnectSpotify = async () => {
    if (isUnlocked) {
      toast.error('Premium users cannot disconnect Spotify to ensure continuous access to advanced features.');
      return;
    }

    setDisconnecting(true);
    try {
      await disconnectSpotify();
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
    } finally {
      setDisconnecting(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (profile?.has_active_subscription) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
          <Crown className="mr-1 h-3 w-3" />
          Premium Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Free Plan
      </Badge>
    );
  };

  const getSpotifyStatus = () => {
    if (profile?.spotify_connected) {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Not Connected
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            {getSubscriptionStatus()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <User className="h-6 w-6" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <ProfilePictureUpload />
                  <div className="flex-1">
                    <EditName />
                    <p className="text-sm text-muted-foreground mt-2">
                      Email: {profile?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member since: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spotify Integration */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Music className="h-6 w-6" />
                  <span>Spotify Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Connection Status</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.spotify_connected 
                        ? `Connected as ${profile.spotify_display_name || 'Unknown'}` 
                        : 'Not connected to Spotify'
                      }
                    </p>
                  </div>
                  {getSpotifyStatus()}
                </div>

                {profile?.spotify_connected && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-400">Disconnect Spotify</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isUnlocked 
                            ? 'Premium users cannot disconnect Spotify to ensure continuous access to advanced features.'
                            : 'Disconnecting will remove all your music data and insights.'
                          }
                        </p>
                        {!isUnlocked && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="mt-3"
                                disabled={disconnecting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {disconnecting ? 'Disconnecting...' : 'Disconnect Spotify'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Disconnect Spotify?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove all your Spotify data and you'll lose access to your music insights. 
                                  You can reconnect anytime.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDisconnectSpotify}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Disconnect
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Settings className="h-6 w-6" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={signingOut}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {signingOut ? 'Signing Out...' : 'Sign Out'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to sign out? You'll need to sign in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSignOut}>
                            Sign Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Info */}
          <div className="space-y-6">
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Crown className="h-6 w-6" />
                  <span>Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {getSubscriptionStatus()}
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-foreground">
                      Plan: {profile?.plan_tier?.charAt(0).toUpperCase() + profile?.plan_tier?.slice(1) || 'Free'}
                    </p>
                    
                    {profile?.has_active_subscription ? (
                      <>
                        {profile.plan_start_date && (
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(profile.plan_start_date).toLocaleDateString()}
                          </p>
                        )}
                        {profile.plan_end_date && (
                          <p className="text-xs text-muted-foreground">
                            Expires: {new Date(profile.plan_end_date).toLocaleDateString()}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Upgrade to unlock premium features
                      </p>
                    )}
                  </div>

                  {!profile?.has_active_subscription && (
                    <Link to="/buy" className="block mt-4">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="mr-2 h-4 w-4" />
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/weekly-giveaway">
                  <Button variant="outline" className="w-full justify-start">
                    <Crown className="mr-2 h-4 w-4" />
                    Weekly Giveaway
                  </Button>
                </Link>
                {!profile?.has_active_subscription && (
                  <Link to="/buy">
                    <Button variant="outline" className="w-full justify-start">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Account
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
