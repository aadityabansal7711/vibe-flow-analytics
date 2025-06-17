
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";

interface Props {
  isLoading: boolean;
  handleDeleteAccount: () => void;
}

const DangerZone: React.FC<Props> = ({ isLoading, handleDeleteAccount }) => (
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
export default DangerZone;
