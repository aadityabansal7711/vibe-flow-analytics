
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  profile: any;
}

const EditName: React.FC<Props> = ({ profile }) => {
  const { user, fetchProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);

  // Add null check to prevent runtime errors
  if (!profile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-medium">Full Name</Label>
        </div>
        <div className="p-3 bg-background/30 rounded-lg border border-border">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleUpdateName = async () => {
    if (!user || !fullName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Name updated successfully');
      setIsEditing(false);
      
      // Refresh profile data
      if (fetchProfile) {
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-medium">Full Name</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              setFullName(profile.full_name || '');
            }
          }}
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
            disabled={isLoading || !fullName.trim()}
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
  );
};

export default EditName;
