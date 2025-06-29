
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CheckCircle, Mail } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the access token from URL hash (Supabase sends it there)
  const getTokenFromHash = () => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    return hashParams.get('access_token');
  };

  const accessToken = getTokenFromHash();

  useEffect(() => {
    if (accessToken) {
      setMode('reset');
    } else {
      setMode('request');
    }
  }, [accessToken]);

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setError(error.message || "Failed to send reset email.");
      toast.error('Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
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
      // Use the access token to update the user's password directly
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      toast.success('Password reset successful!');
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || "Failed to reset password.");
      toast.error('Failed to reset password');
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
              <img src="/lovable-uploads/7ff9a618-2e78-44bd-be12-56d460d9c38c.png" alt="MyVibeLyrics" className="h-12 w-12" />
            </div>
            <span className="text-3xl font-bold text-gradient">MyVibeLyrics</span>
          </Link>
        </div>
        <Card className="glass-effect-strong border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              {success ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : mode === 'request' ? (
                <Mail className="h-8 w-8 text-primary" />
              ) : (
                <Lock className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl text-foreground">
              {success ? (
                mode === 'request' ? 'Check Your Email!' : 'Password Reset Complete!'
              ) : mode === 'request' ? (
                'Reset Your Password'
              ) : (
                'Set New Password'
              )}
            </CardTitle>
            <p className="text-muted-foreground">
              {success ? (
                mode === 'request' ? 
                'We\'ve sent you a password reset link' : 
                'Redirecting you to login...'
              ) : mode === 'request' ? (
                'Enter your email to receive a reset link'
              ) : (
                'Enter your new password below'
              )}
            </p>
          </CardHeader>
          <CardContent>
            {!success ? (
              mode === 'request' ? (
                <form onSubmit={handlePasswordResetRequest} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      autoComplete="email"
                      required
                      onChange={e => setEmail(e.target.value)}
                      className="bg-background/50 border-border text-foreground"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-spotify"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <div className="text-center mt-6">
                    <Link to="/auth" className="text-muted-foreground hover:text-primary text-sm">← Back to Login</Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-6">
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
                      disabled={!accessToken}
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
                      disabled={!accessToken}
                    />
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      {error}
                    </div>
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
              )
            ) : (
              <div className="text-center space-y-4">
                {mode === 'request' ? (
                  <>
                    <Mail className="h-16 w-16 mx-auto text-primary" />
                    <p className="text-foreground font-medium">Reset link sent successfully!</p>
                    <p className="text-sm text-muted-foreground">
                      Check your email inbox and click the link to reset your password.
                    </p>
                    <div className="text-center mt-6">
                      <Link to="/auth" className="text-muted-foreground hover:text-primary text-sm">← Back to Login</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                    <p className="text-green-500 font-medium">Password updated successfully!</p>
                    <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
