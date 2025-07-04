
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  const adminSession = localStorage.getItem('admin_session');
  if (adminSession) {
    try {
      const session = JSON.parse(adminSession);
      if (session.email === 'aadityabansal1112@gmail.com') {
        return <Navigate to="/admin" replace />;
      }
    } catch (error) {
      // Clear invalid session
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_logged_in');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting admin login for:', email);
      
      // Simple direct authentication check
      if (email === 'aadityabansal1112@gmail.com' && password === 'Hyundai1$') {
        console.log('✅ Admin credentials verified');
        
        // Store admin session in localStorage
        const adminData = {
          id: 'admin-user-id',
          email: email,
          full_name: 'Admin User',
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('admin_session', JSON.stringify(adminData));
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_email', email);

        console.log('✅ Admin login successful, redirecting to admin page');
        navigate('/admin');
      } else {
        console.log('❌ Invalid admin credentials provided:', { 
          email, 
          passwordLength: password.length,
          expectedEmail: 'aadityabansal1112@gmail.com'
        });
        setError('Invalid admin credentials. Please check your email and password.');
      }
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="glass-effect border-border/50">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">Admin Portal</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Access restricted to administrators only</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
