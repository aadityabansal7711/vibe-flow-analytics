
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings,
  Crown,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Music,
  User,
  LogOut,
  AlertTriangle,
  Unlink
} from 'lucide-react';

import ProfileInfo from "./profile/ProfileInfo";
import EditName from "./profile/EditName";
import DangerZone from "./profile/DangerZone";

const Profile: React.FC = () => {
  const { user, profile, signOut, updateProfile, connectSpotify, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);

  // Show loading while authentication is being resolved
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      setMessage('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ full_name: fullName });
      setMessage('Name updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating name:', error);
      setMessage('Failed to update name: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectSpotify = async () => {
    if (profile.has_active_subscription && !showDisconnectWarning) {
      setShowDisconnectWarning(true);
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        spotify_connected: false,
        spotify_user_id: null,
        spotify_display_name: null,
        spotify_avatar_url: null,
        spotify_access_token: null,
        spotify_refresh_token: null,
        spotify_token_expires_at: null,
        // If they had premium, remove it when disconnecting
        ...(profile.has_active_subscription && {
          has_active_subscription: false,
          plan_tier: 'free'
        })
      });
      setMessage('Spotify account disconnected successfully!');
      setShowDisconnectWarning(false);
    } catch (error: any) {
      console.error('Error disconnecting Spotify:', error);
      setMessage('Failed to disconnect Spotify: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage('Failed to sign out. Please try again.');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPremium = profile?.has_active_subscription || false;

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
          </div>
          <Button 
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
        
        {/* Message Alert */}
        {message && (
          <Alert className="mb-6"><AlertDescription>{message}</AlertDescription></Alert>
        )}

        {/* Disconnect Warning */}
        {showDisconnectWarning && (
          <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/5">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Warning:</strong> You have an active premium subscription. Disconnecting Spotify will cancel your premium subscription and you'll lose access to premium features. Are you sure you want to continue?
              <div className="flex gap-2 mt-3">
                <Button 
                  onClick={handleDisconnectSpotify}
                  size="sm"
                  variant="destructive"
                >
                  Yes, Disconnect & Cancel Premium
                </Button>
                <Button 
                  onClick={() => setShowDisconnectWarning(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileInfo profile={profile} />
              <EditName
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                fullName={fullName}
                setFullName={setFullName}
                isLoading={isLoading}
                handleUpdateName={handleUpdateName}
                profile={profile}
              />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-muted-foreground text-sm">Plan Tier</div>
                    <p className="text-foreground font-medium capitalize flex items-center gap-2">
                      {profile.plan_tier || 'Free'}
                      {isPremium && <Crown className="h-4 w-4 text-yellow-400" />}
                    </p>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Member Since</div>
                    <p className="text-foreground font-medium">
                      {profile.created_at ? formatDate(profile.created_at) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spotify Connection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-foreground font-medium">Spotify Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.spotify_connected 
                        ? `Connected as ${profile.spotify_display_name || 'Unknown'}` 
                        : 'Connect your Spotify account for personalized insights'
                      }
                    </p>
                  </div>
                  {profile.spotify_connected ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                
                {!profile.spotify_connected ? (
                  <Button 
                    onClick={connectSpotify}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Connect Spotify
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDisconnectSpotify}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    {isLoading ? 'Disconnecting...' : 'Disconnect Spotify'}
                  </Button>
                )}
              </div>

              {/* Premium Management */}
              {!isPremium ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-foreground font-medium">Upgrade to Premium</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unlock advanced analytics, AI insights, and unlimited features
                  </p>
                  <Link to="/buy">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-foreground font-medium">Premium Subscription</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have access to all premium features
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                    onClick={() => window.open('https://billing.stripe.com/p/login/test_bIY1479wT5LLesU8ww', '_blank')}
                  >
                    Manage Subscription
                  </Button>
                </div>
              )}
              
              <DangerZone profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
