
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3 } from "lucide-react";

interface Props {
  isEditing: boolean;
  setIsEditing: (x: boolean) => void;
  fullName: string;
  setFullName: (s: string) => void;
  isLoading: boolean;
  handleUpdateName: () => void;
  profile: any;
}

const EditName: React.FC<Props> = ({
  isEditing, setIsEditing, fullName, setFullName, isLoading, handleUpdateName, profile
}) => {
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

  return (
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
  );
};

export default EditName;
