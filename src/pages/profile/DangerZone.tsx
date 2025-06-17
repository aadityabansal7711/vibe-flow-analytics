
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DangerZone = () => {
  const { user, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      '⚠️ DANGER: This will permanently delete your account and all associated data. This action cannot be undone. Type "DELETE" to confirm.'
    );
    
    if (!confirmed) return;

    const finalConfirm = prompt('Type "DELETE" to confirm account deletion:');
    if (finalConfirm !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user-account');
      
      if (error) throw error;

      alert('Account deleted successfully.');
      await logout();
    } catch (error: any) {
      setMessage('Error deleting account: ' + error.message);
      console.error('Delete account error:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="glass-effect border-red-400/50 bg-red-400/5">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>Danger Zone</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert className="border-red-400/50 bg-red-400/10">
            <AlertDescription className="text-red-300">{message}</AlertDescription>
          </Alert>
        )}

        <Alert className="border-red-400/50 bg-red-400/5">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your data, including Spotify connections, premium subscriptions, and analytics will be permanently deleted.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between p-4 bg-red-400/10 rounded-lg border border-red-400/30">
          <div>
            <h3 className="text-red-400 font-medium">Delete Account</h3>
            <p className="text-red-300 text-sm">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleting}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
