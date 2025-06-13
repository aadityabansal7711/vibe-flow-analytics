
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Error: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="glass-effect-strong rounded-2xl p-8 border border-border/50">
          <div className="flex items-center justify-center mb-8">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-gradient mb-4">Connection Failed</h1>
          
          <p className="text-muted-foreground mb-6">
            There was an issue connecting your Spotify account. Please try again.
          </p>

          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Music className="mr-2 h-4 w-4" />
                Try Connecting Again
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
