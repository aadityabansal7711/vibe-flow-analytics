
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, Home, Music, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Error: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const details = searchParams.get('details');
  const status = searchParams.get('status');

  const getErrorMessage = () => {
    switch (reason) {
      case 'spotify_auth_error':
        return `Spotify authorization failed: ${details || 'Unknown error'}`;
      case 'no_auth_code':
        return 'No authorization code received from Spotify';
      case 'state_mismatch':
        return 'Security check failed - please try connecting again';
      case 'token_exchange_failed':
        return `Token exchange failed: ${details || 'Unknown error'}`;
      case 'no_access_token':
        return 'No access token received from Spotify';
      case 'profile_fetch_failed':
        return `Failed to fetch Spotify profile (Status: ${status || 'Unknown'})`;
      case 'timeout':
        return 'Connection timed out - please try again';
      case 'unexpected_error':
        return `Unexpected error: ${details || 'Unknown error'}`;
      default:
        return 'There was an issue connecting your Spotify account';
    }
  };

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
            {getErrorMessage()}
          </p>

          <div className="text-sm text-muted-foreground text-left mb-6 space-y-2">
            <p>This could be due to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Network connectivity issues</li>
              <li>Spotify authorization was cancelled</li>
              <li>Temporary server error</li>
              <li>Invalid or expired authorization code</li>
              <li>Incorrect redirect URI configuration</li>
            </ul>
          </div>

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

          <div className="text-xs text-muted-foreground mt-6 space-y-2">
            <p>If the problem persists:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Clear your browser cache</li>
              <li>Check if Spotify is down</li>
              <li>Try using an incognito/private window</li>
              <li>Contact support if needed</li>
            </ul>
            {reason && (
              <p className="text-xs opacity-75 mt-4">
                Error Code: {reason}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
