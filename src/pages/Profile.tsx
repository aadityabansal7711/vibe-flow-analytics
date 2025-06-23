
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import SpotifyConnect from '@/components/SpotifyConnect';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import SubscriptionManager from '@/components/SubscriptionManager';
import ProfileInfo from '@/pages/profile/ProfileInfo';
import EditName from '@/pages/profile/EditName';
import DangerZone from '@/pages/profile/DangerZone';
import ProfileSettings from '@/pages/profile/ProfileSettings';
import { 
  ArrowLeft, 
  Sparkles,
  User,
  CreditCard,
  Settings,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

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
            variant={activeTab === 'subscription' ? 'default' : 'outline'}
            onClick={() => setActiveTab('subscription')}
            className="text-sm"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
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
                  <SpotifyConnect />
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'subscription' && (
            <SubscriptionManager />
          )}

          {activeTab === 'settings' && (
            <ProfileSettings profile={profile} />
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
