
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Music, Headphones, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">MyVibeLytics</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Button onClick={login} className="bg-green-500 hover:bg-green-600 text-white">
              Login with Spotify
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8 animate-bounce">
          <Headphones className="h-24 w-24 text-green-400 mx-auto" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          MyVibeLytics
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
          Discover the hidden patterns in your music. Unlock deep insights about your Spotify listening habits with beautiful visualizations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg">
                View Analytics <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button onClick={login} size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg">
              Get Started Free <Play className="ml-2 h-5 w-5" />
            </Button>
          )}
          <Link to="/buy">
            <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 text-lg">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Top Tracks & Artists</h3>
              <p className="text-gray-300">Discover your most played music across different time periods</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Music Personality</h3>
              <p className="text-gray-300">Get insights into your musical mood and listening patterns</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <Music className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Listening Trends</h3>
              <p className="text-gray-300">Visualize your music consumption over time with beautiful charts</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/20 bg-black/20 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Music className="h-6 w-6 text-green-400" />
              <span className="text-white font-semibold">MyVibeLytics</span>
            </div>
            <div className="flex space-x-6 text-gray-300">
              <Link to="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-green-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
