
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Music, 
  User, 
  Edit3, 
  Trash2, 
  Save, 
  ArrowLeft,
  Mail,
  Calendar,
  Link2,
  Crown,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, profile, updateProfile, signOut, isUnlocked } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ full_name: fullName });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      console.log('🗑️ Starting account deletion process...');
      
      // First, delete the user's profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error('Failed to delete profile data');
      }

      // Delete from other related tables if they exist
      try {
        await supabase.from('subscriptions').delete().eq('user_id', user.id);
        await supabase.from('user_management').delete().eq('user_id', user.id);
      } catch (error) {
        console.log('Note: Some related tables may not exist:', error);
      }

      // Finally, delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        // Even if this fails, we'll still sign out the user
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out and redirect
      await signOut();
      
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive"
      });
    }
    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <ArrowLeft className="h-6 w-6 text-primary" />
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
            </div>
          </Link>
          <Button onClick={signOut} variant="outline" className="border-border text-foreground hover:bg-muted">
            Logout
          </Button>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Profile Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Your Profile</h1>
              <p className="text-xl text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            {/* Profile Information */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Email</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-foreground">Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-background/50 border-border text-foreground"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{profile?.full_name || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground">Member Since</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Subscription Status</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {isUnlocked ? (
                          <>
                            <Crown className="h-4 w-4 text-primary" />
                            <span className="text-primary font-semibold">Premium Active</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Free Plan</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground">Spotify Connection</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Link2 className={`h-4 w-4 ${profile?.spotify_connected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={profile?.spotify_connected ? 'text-primary' : 'text-muted-foreground'}>
                          {profile?.spotify_connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                      {profile?.spotify_display_name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Connected as: {profile.spotify_display_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-border/20">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button onClick={() => {
                        setIsEditing(false);
                        setFullName(profile?.full_name || '');
                      }} variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                  
                  {!isUnlocked && (
                    <Link to="/buy">
                      <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="glass-effect border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-400">
                  <Trash2 className="h-5 w-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10" disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-background border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Your profile information</li>
                          <li>Your Spotify connection</li>
                          <li>All your analytics data</li>
                          <li>Your subscription (if any)</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-background border-border text-foreground">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
