
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Calendar, 
  Music, 
  Settings,
  Crown,
  Trash2,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, profile, signOut, updateProfile, connectSpotify, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including Spotify connections and analytics.'
    );

    if (!confirmDelete) return;

    const finalConfirm = confirm(
      'This is your final warning. Deleting your account will permanently remove:\n\n' +
      '• All your Spotify listening data\n' +
      '• Your premium subscription (if any)\n' +
      '• All analytics and insights\n' +
      '• Your profile and preferences\n\n' +
      'Type "DELETE" to confirm deletion.'
    );

    if (!finalConfirm) return;

    const userInput = prompt('Type "DELETE" to confirm account deletion:');
    if (userInput !== 'DELETE') {
      setMessage('Account deletion cancelled - confirmation text did not match.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Deleting user account:', user.id);

      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        setMessage('Failed to delete profile: ' + profileError.message);
        return;
      }

      // Then delete the auth user (this will cascade delete other related data)
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        // Even if auth deletion fails, we've deleted the profile, so sign out
        setMessage('Account data deleted. Signing out...');
      } else {
        setMessage('Account deleted successfully. Goodbye!');
      }

      // Sign out and redirect
      setTimeout(() => {
        signOut();
      }, 2000);

    } catch (error: any) {
      console.error('Error deleting account:', error);
      setMessage('Failed to delete account: ' + error.message);
    } finally {
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
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
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
              {/* Profile Picture & Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  {profile.spotify_avatar_url ? (
                    <img 
                      src={profile.spotify_avatar_url} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {profile.full_name || 'No name set'}
                  </h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={profile.has_active_subscription ? "default" : "secondary"}>
                      {profile.has_active_subscription ? 'Premium' : 'Free'}
                    </Badge>
                    {profile.spotify_connected && (
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        <Music className="mr-1 h-3 w-3" />
                        Spotify Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Name Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">Full Name</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Edit3 className="mr-2 h-3 w-3" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-background/50 border-border text-foreground"
                    />
                    <Button
                      onClick={handleUpdateName}
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? 'Updating...' : 'Update Name'}
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-background/30 rounded-lg border border-border">
                    <p className="text-foreground">{profile.full_name || 'No name set'}</p>
                  </div>
                )}
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Plan Tier</Label>
                    <p className="text-foreground font-medium capitalize">{profile.plan_tier || 'Free'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Member Since</Label>
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
                
                {!profile.spotify_connected && (
                  <Button 
                    onClick={connectSpotify}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Connect Spotify
                  </Button>
                )}
              </div>

              {/* Premium Status */}
              {!profile.has_active_subscription && (
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
              )}

              {/* Danger Zone */}
              <div className="border-t border-red-500/20 pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-red-400 font-medium flex items-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Danger Zone
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>

                  <Alert className="border-red-500/20 bg-red-500/5">
                    <AlertDescription className="text-sm">
                      <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account, 
                      remove all your data including Spotify connections, analytics, and any premium subscriptions.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isLoading ? 'Deleting Account...' : 'Delete Account'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
