import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Lock, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, fullName);
        if (!result.error) {
          toast({
            title: "Account created!",
            description: "Check your email for a confirmation link before logging in.",
          });
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          navigate('/dashboard');
        }
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email above to reset password.");
      return;
    }
    setIsResetting(true);
    setError('');
    setResetSent(false);
    try {
      // Send password reset request to Supabase
      // @ts-ignore - resetPasswordForEmail is part of supabase.auth
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth' });
      if (error) {
        setError(error.message || "Failed to send reset email");
      } else {
        setResetSent(true);
        toast({
          title: "Check your email",
          description: "Password reset instructions have been sent.",
        });
      }
    } catch (err: any) {
      setError("Failed to send reset email, try again later.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="MyVibeLytics" className="h-10 w-10" />
            </div>
            <span className="text-3xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
        </div>

        <Card className="glass-effect-strong border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              {isSignUp ? <User className="h-8 w-8 text-primary" /> : <Lock className="h-8 w-8 text-primary" />}
            </div>
            <CardTitle className="text-2xl text-foreground">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp ? 'Start your music journey today' : 'Sign in to your account'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/50 border-border text-foreground"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border text-foreground"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border text-foreground pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {resetSent && (
                <div className="text-green-500 text-sm font-medium flex items-center gap-2">
                  <span>Password reset email sent. Please check your inbox!</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            {!isSignUp && (
              <div className="mt-4 text-center space-y-2">
                <button
                  onClick={handleForgotPassword}
                  className="text-primary underline hover:text-accent disabled:opacity-60 transition-colors text-sm block mb-1"
                  disabled={isResetting}
                  type="button"
                >
                  {isResetting ? "Sending reset email..." : "Forgot Password (Email)?"}
                </button>
                <Link
                  to="/forgot-password"
                  className="text-primary underline hover:text-accent transition-colors text-sm"
                >
                  Reset with code / link
                </Link>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
