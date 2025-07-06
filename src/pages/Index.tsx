
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Music, BarChart3, Brain, Users, Crown, Sparkles, ArrowRight, Star, CheckCircle, HeadphonesIcon, TrendingUp, Zap, Clock, Heart, Share2, Target, Activity, MessageCircle, Award, Calendar, Globe, Mic, Play, Volume2, Waves, Shuffle, Radio, Repeat, SkipForward, PauseCircle, Disc3, Headphones, Palette, LineChart } from 'lucide-react';

const Index = () => {
  const highlightFeatures = [{
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Top Artists Analysis",
    description: "View your most played artists with detailed statistics"
  }, {
    icon: <Activity className="h-8 w-8 text-purple-400" />,
    title: "Listening Insights",
    description: "Discover patterns in your music consumption habits"
  }, {
    icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
    title: "Music Trends",
    description: "Track your music evolution over time periods"
  }, {
    icon: <Music className="h-8 w-8 text-green-400" />,
    title: "Genre Analysis",
    description: "Detailed breakdown of your favorite music genres"
  }];

  const features = [
  // Analytics
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Top Artists & Tracks",
    description: "See your most played music",
    category: "Analytics"
  }, {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Listening History",
    description: "Track your music over time",
    category: "Analytics"
  }, {
    icon: <Clock className="h-5 w-5" />,
    title: "Time Analysis",
    description: "When you listen most",
    category: "Analytics"
  }, {
    icon: <Calendar className="h-5 w-5" />,
    title: "Monthly Reports",
    description: "Monthly music summaries",
    category: "Analytics"
  }, {
    icon: <LineChart className="h-5 w-5" />,
    title: "Genre Breakdown",
    description: "Your music taste analysis",
    category: "Analytics"
  },
  // Personality
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Music Profile",
    description: "Your musical personality insights",
    category: "Personality"
  }, {
    icon: <Heart className="h-5 w-5" />,
    title: "Mood Insights",
    description: "Emotion-based music analysis",
    category: "Personality"
  }, {
    icon: <Palette className="h-5 w-5" />,
    title: "Taste Profile",
    description: "Your unique music fingerprint",
    category: "Personality"
  }, {
    icon: <Target className="h-5 w-5" />,
    title: "Preference Mapping",
    description: "Visual taste preferences",
    category: "Personality"
  },
  // Sharing
  {
    icon: <Share2 className="h-5 w-5" />,
    title: "Share Stats",
    description: "Share your music insights",
    category: "Sharing"
  }, {
    icon: <Star className="h-5 w-5" />,
    title: "Music Cards",
    description: "Create shareable music cards",
    category: "Sharing"
  }, {
    icon: <Users className="h-5 w-5" />,
    title: "Compare with Friends",
    description: "See music compatibility",
    category: "Sharing"
  },
  // Premium Features
  {
    icon: <Crown className="h-5 w-5" />,
    title: "Advanced Analytics",
    description: "Detailed music insights",
    category: "Premium"
  }, {
    icon: <Zap className="h-5 w-5" />,
    title: "Export Data",
    description: "Download your music data",
    category: "Premium"
  }, {
    icon: <Award className="h-5 w-5" />,
    title: "Priority Support",
    description: "Get help when you need it",
    category: "Premium"
  }];

  return <div className="min-h-screen bg-[#191414] relative overflow-hidden">
      {/* Spotify-style animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#191414] via-[#121212] to-[#191414]">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#1DB954] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-[#9B59B6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00C3FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-[#191414]/90 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">
                MyVibeLyrics
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/pricing" className="text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/auth">
                <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-6 py-2 rounded-full transition-all hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Weekly Giveaway Banner */}
      <div className="relative z-40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-amber-300">
              <Crown className="h-5 w-5 animate-pulse" />
              <span className="font-medium">🎁 Weekly Premium Giveaway - Premium Users Only!</span>
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <Link to="/weekly-giveaway">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-full">
                Premium Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/30 px-6 py-2 text-sm font-medium backdrop-blur-sm rounded-full">
              <Waves className="mr-2 h-4 w-4" />
              Music Analytics Platform
            </Badge>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-white mb-2">
              Discover Your
            </span>
            <span className="block bg-gradient-to-r from-[#1DB954] via-[#00C3FF] to-[#9B59B6] bg-clip-text text-transparent">
              Music DNA
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Unlock mood, genre, and trend insights powered by Spotify data. 
            Understand your musical personality like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-xl">
                <Music className="mr-2 h-5 w-5" />
                Start My Analysis
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300">See Pricing</Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlightFeatures.map((feature, index) => <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Full Features Section */}
      <section className="relative z-20 px-4 sm:px-6 py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Complete Music</span>
              <br />
              <span className="bg-gradient-to-r from-[#1DB954] to-[#00C3FF] bg-clip-text text-transparent"> Analytics Suite</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From basic insights to advanced analysis of your musical journey
            </p>
          </div>

          {/* Feature Categories */}
          {['Analytics', 'Personality', 'Sharing', 'Premium'].map(category => <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center text-sm font-bold">
                  {features.filter(f => f.category === category).length}
                </span>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {features.filter(f => f.category === category).map((feature, index) => <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-[#1DB954] group-hover:text-[#1ed760] transition-colors">
                          {feature.icon}
                        </div>
                        <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                      </div>
                      <p className="text-white/60 text-xs leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-white/5 to-white/10 p-12 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 via-[#00C3FF]/10 to-[#9B59B6]/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-10 w-10 text-[#1DB954] animate-pulse" />
                  <Waves className="h-8 w-8 text-[#00C3FF] animate-bounce delay-200" />
                  <HeadphonesIcon className="h-10 w-10 text-[#9B59B6] animate-pulse delay-500" />
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-white block mb-2">Ready to discover how</span>
                <span className="bg-gradient-to-r from-[#1DB954] to-[#00C3FF] bg-clip-text text-transparent">
                  you listen?
                </span>
              </h2>
              
              <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
                Connect your Spotify account and start exploring your musical personality today.
              </p>
              
              <Link to="/auth">
                <Button size="lg" className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-12 py-4 rounded-full text-xl hover:scale-110 transform transition-all duration-300 shadow-2xl">
                  <Music className="mr-3 h-6 w-6" />
                  Connect to Spotify
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-[#191414]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
                <span className="text-xl font-bold text-white">MyVibeLyrics</span>
              </div>
              <p className="text-white/60 max-w-md">
                Advanced Spotify analytics platform helping you discover your unique music DNA and understand your listening patterns.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-white/60 hover:text-white transition-colors">Terms & Conditions</Link>
                <Link to="/refund-policy" className="block text-white/60 hover:text-white transition-colors">Refund Policy</Link>
                <Link to="/cancellation-policy" className="block text-white/60 hover:text-white transition-colors">Cancellation Policy</Link>
                <Link to="/shipping-delivery" className="block text-white/60 hover:text-white transition-colors">Shipping & Delivery</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/60">
                <p>📫 aadityabansal1112@gmail.com</p>
                <p>📍 India</p>
                <Link to="/contact" className="block text-[#1DB954] hover:text-[#1ed760] transition-colors">Get in touch →</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60">
              © 2025 MyVibeLyrics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
