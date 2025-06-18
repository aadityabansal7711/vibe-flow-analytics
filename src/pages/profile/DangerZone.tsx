
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  profile: any;
}

const DangerZone: React.FC<Props> = ({ profile }) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Call the delete-user edge function
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: profile?.user_id }
      });

      if (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again or contact support.');
        return;
      }

      // Logout the user
      await logout();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default DangerZone;
