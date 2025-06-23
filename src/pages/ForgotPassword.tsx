
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Check if we have access token in URL (reset mode)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      setIsResetMode(true);
    }
  }, [location]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: 'Reset email sent!',
          description: 'Check your email for password reset instructions.',
        });
        setSuccess(true);
      }
    } catch (e: any) {
      setError(e.message || "Failed to send reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
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
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        toast({
          title: 'Password updated!',
          description: "Your password has been successfully updated.",
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
              {isResetMode ? <Lock className="h-8 w-8 text-primary" /> : <Mail className="h-8 w-8 text-primary" />}
            </div>
            <CardTitle className="text-2xl text-foreground">
              {isResetMode ? 'Set New Password' : 'Reset Password'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isResetMode ? 'Enter your new password below' : 'Enter your email to receive reset instructions'}
            </p>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={isResetMode ? handleNewPassword : handlePasswordReset} className="space-y-6">
                {!isResetMode ? (
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-background/50 border-border text-foreground"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
                
                {error && (
                  <div className="text-red-400 text-sm mb-2">{error}</div>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-spotify"
                  disabled={submitting}
                >
                  {submitting ? (isResetMode ? "Updating..." : "Sending...") : (isResetMode ? "Update Password" : "Send Reset Email")}
                </Button>
                
                <div className="text-center mt-6">
                  <Link to="/auth" className="text-muted-foreground hover:text-primary text-sm">← Back to Login</Link>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-green-500 font-medium mb-4">
                  {isResetMode ? 'Password updated successfully!' : 'Reset email sent!'}
                </div>
                {isResetMode ? (
                  <p className="text-muted-foreground">Redirecting to login...</p>
                ) : (
                  <p className="text-muted-foreground">Check your email for further instructions.</p>
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
