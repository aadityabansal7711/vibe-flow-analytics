
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

interface Props {
  profile: any;
}

const ProfileInfo: React.FC<Props> = ({ profile }) => {
  // Add null check to prevent runtime errors
  if (!profile) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
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
              <User className="mr-1 h-3 w-3" />
              Spotify Connected
            </Badge>
          )}
        </div>
        {(profile.has_active_subscription || profile.plan_tier === 'premium') && profile.plan_end_date && (
          <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Expires: {formatDate(profile.plan_end_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
