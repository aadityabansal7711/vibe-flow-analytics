
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Trash2, Unlink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProfileSettingsProps {
  profile: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile }) => {
  const { signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleDisconnectSpotify = async () => {
    try {
      await updateProfile({
        spotify_connected: false,
        spotify_user_id: null,
        spotify_display_name: null,
        spotify_avatar_url: null,
        spotify_access_token: null,
        spotify_refresh_token: null,
        spotify_token_expires_at: null
      });
      toast.success('Spotify disconnected successfully');
    } catch (error) {
      console.error('Disconnect Spotify error:', error);
      toast.error('Failed to disconnect Spotify');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sign Out */}
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Disconnect Spotify */}
          {profile?.spotify_connected && (
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Disconnect Spotify</h3>
                <p className="text-sm text-muted-foreground">
                  Remove Spotify connection from your account
                  {profile?.has_active_subscription && (
                    <span className="text-yellow-500 block mt-1">
                      ⚠️ Warning: You may lose premium features
                    </span>
                  )}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center">
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Spotify?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {profile?.has_active_subscription ? (
                        "This will disconnect your Spotify account. You may lose access to premium features that require Spotify data. Are you sure you want to continue?"
                      ) : (
                        "This will disconnect your Spotify account. You can reconnect it anytime. Are you sure you want to continue?"
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnectSpotify}>
                      Yes, Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">Control your data and privacy</p>
            </div>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>

          {/* Data Export */}
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download your account data</p>
            </div>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
