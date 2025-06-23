
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Extract the access token (one-time token) from URL (provided by Supabase in reset link)
  const getAccessToken = () => {
    const params = new URLSearchParams(location.search);
    return params.get('access_token');
  };
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      setError("Invalid or expired reset link. Please request a new password reset.");
    }
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accessToken) {
      setError("Invalid or expired reset link. Please request a new password reset.");
      return;
    }
    
    if (!password || !confirm) {
      setError('Please fill out both fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setSubmitting(true);

    try {
      // Dynamically import supabase client to avoid SSR issues
      const { createClient } = await import('@supabase/supabase-js');
      // Create a new supabase client for just this operation
      const supabaseUrl = "https://wxwbfduhveewbuluetpb.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2JmZHVodmVld2J1bHVldHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODkxNzYsImV4cCI6MjA2NDk2NTE3Nn0.xZYb93_kej1HPbQEKbSrBh_T0Zm27y8WoZ5oxuo7FeA";
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Set session with the one-time access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });

      if (sessionError) {
        setError("Invalid or expired reset link. Please request a new password reset.");
        return;
      }

      // Use access token to update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) {
        setError(updateError.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        toast({
          title: 'Password reset successful!',
          description: "Your password has been updated. Redirecting to login...",
        });
        setTimeout(() => navigate('/auth'), 2000);
      }
    } catch (e: any) {
      setError(e.message || "Unexpected error resetting password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <img src="/lovable-uploads/7ff9a618-2e78-44bd-be12-56d460d9c38c.png" alt="MyVibeLytics" className="h-12 w-12" />
            </div>
            <span className="text-3xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
        </div>
        <Card className="glass-effect-strong border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">Reset Your Password</CardTitle>
            <p className="text-muted-foreground">Enter your new password below</p>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="new-password" className="text-foreground">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    minLength={6}
                    autoComplete="new-password"
                    required
                    onChange={e => setPassword(e.target.value)}
                    className="bg-background/50 border-border text-foreground"
                    placeholder="Enter your new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirm}
                    minLength={6}
                    autoComplete="new-password"
                    required
                    onChange={e => setConfirm(e.target.value)}
                    className="bg-background/50 border-border text-foreground"
                    placeholder="Confirm your new password"
                  />
                </div>
                {error && (
                  <div className="text-red-400 text-sm mb-2">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-spotify"
                  disabled={submitting || !accessToken}
                >
                  {submitting ? "Resetting..." : "Reset Password"}
                </Button>
                <div className="text-center mt-6">
                  <Link to="/auth" className="text-muted-foreground hover:text-primary text-sm">← Back to Login</Link>
                </div>
              </form>
            ) : (
              <div className="text-green-500 font-medium text-center">
                Password updated! Redirecting to login...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
