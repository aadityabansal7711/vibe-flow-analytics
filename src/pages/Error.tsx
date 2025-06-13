
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Music, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Error: React.FC = () => {
  const handleRetry = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="glass-effect-strong rounded-2xl p-8 border border-border/50">
          <div className="flex items-center justify-center mb-8">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-gradient mb-4">Connection Failed</h1>
          
          <p className="text-muted-foreground mb-6">
            There was an issue connecting your Spotify account. This could be due to:
          </p>

          <ul className="text-sm text-muted-foreground text-left mb-6 space-y-2">
            <li>• Network connectivity issues</li>
            <li>• Spotify authorization was cancelled</li>
            <li>• Temporary server error</li>
            <li>• Invalid or expired authorization code</li>
          </ul>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Link to="/dashboard">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Music className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            If the problem persists, please try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
