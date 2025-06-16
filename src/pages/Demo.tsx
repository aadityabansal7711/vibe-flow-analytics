
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  ArrowLeft, 
  Play
} from 'lucide-react';
import Dashboard from './Dashboard';

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <ArrowLeft className="h-6 w-6 text-primary" />
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/eeb01895-fadf-4b3f-9d3f-d61bb48673b0.png" alt="MyVibeLytics" className="h-8 w-8" />
              <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-spotify text-white">Demo Mode</Badge>
            <Link to="/auth">
              <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Connect Your Spotify
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Demo Notice */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-border/50 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Demo Dashboard</h2>
          <p className="text-muted-foreground">
            This is a preview of the MyVibeLytics dashboard with sample data. 
            <Link to="/auth" className="text-primary hover:underline ml-1">
              Sign up to see your real Spotify data!
            </Link>
          </p>
        </div>
      </div>

      {/* Render the actual Dashboard component */}
      <Dashboard />
    </div>
  );
};

export default Demo;
