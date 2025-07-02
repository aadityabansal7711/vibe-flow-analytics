
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Music, 
  BarChart3, 
  Brain, 
  Users, 
  Crown, 
  Sparkles, 
  ArrowRight,
  Star,
  CheckCircle,
  HeadphonesIcon,
  TrendingUp,
  Zap,
  Clock,
  Heart,
  Share2,
  Target,
  Activity,
  MessageCircle,
  Award,
  Calendar,
  Globe,
  Mic,
  Play,
  Volume2,
  Waves
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Music className="h-6 w-6 text-green-400" />,
      title: "AI Curated Playlists",
      description: "Get personalized playlists with 100 unique songs tailored to your taste using advanced AI algorithms.",
      category: "AI Features",
      accent: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts and visualizations showing your listening trends, peak hours, and detailed musical journey insights.",
      category: "Analytics",
      accent: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-400" />,
      title: "Mood & Emotion Tracking",
      description: "Understand how your music reflects your emotions with sophisticated mood analysis and emotional pattern recognition.",
      category: "Psychology",
      accent: "from-pink-500/20 to-rose-500/20"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Music Community",
      description: "Connect with fellow music lovers, share your taste, and discover new songs through our vibrant community features.",
      category: "Social",
      accent: "from-purple-500/20 to-violet-500/20"
    },
    {
      icon: <Activity className="h-6 w-6 text-orange-400" />,
      title: "Listening Streaks",
      description: "Track your daily listening habits and maintain streaks to stay motivated in your musical journey.",
      category: "Gamification",
      accent: "from-orange-500/20 to-amber-500/20"
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-400" />,
      title: "Personality Analysis",
      description: "Discover your musical personality type based on your listening habits, genre preferences, and emotional connections.",
      category: "Psychology",
      accent: "from-indigo-500/20 to-purple-600/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 blur-sm rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MyVibeLyrics
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pricing">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                  Pricing
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transform transition-all duration-300">
                  <Music className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Weekly Giveaway Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-amber-300">
              <Crown className="h-5 w-5 animate-pulse" />
              <span className="font-medium">Weekly Premium Giveaway - Premium Users Only!</span>
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <Link to="/weekly-giveaway">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 transition-all duration-300 shadow-lg">
                Premium Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-300 border-green-400/30 text-lg px-8 py-3 font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Waves className="mr-2 h-5 w-5" />
            Music Analytics Platform
          </Badge>
          
          <h1 className="text-6xl sm:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent block mb-4">
              Discover Your
            </span>
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse block">
              Music DNA
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Unlock deep insights into your Spotify listening habits with cutting-edge AI analytics. 
            Discover patterns, moods, and hidden connections in your music that you never knew existed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:shadow-green-500/25 hover:scale-110 transform transition-all duration-300 text-lg px-10 py-6 group">
                <Play className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                Start Your Analysis
                <Sparkles className="ml-3 h-5 w-5 group-hover:animate-spin" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/30 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 backdrop-blur-sm">
                <Crown className="mr-3 h-5 w-5" />
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Unlock Your Music
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              From basic insights to advanced AI-powered analysis of your musical journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 hover:border-slate-600/80 backdrop-blur-sm overflow-hidden relative transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-green-300 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1 bg-slate-700/50 text-slate-300">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-12 rounded-3xl backdrop-blur-xl border border-slate-700/50 overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-8 w-8 text-green-400 animate-pulse" />
                  <Waves className="h-6 w-6 text-blue-400 animate-bounce delay-200" />
                  <HeadphonesIcon className="h-8 w-8 text-purple-400 animate-pulse delay-500" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Ready to Discover Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Music DNA?
                </span>
              </h2>
              
              <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                Connect your Spotify account and start exploring your musical personality today.
              </p>
              
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-2xl hover:shadow-green-500/25 hover:scale-110 transform transition-all duration-300 text-lg px-12 py-6 group">
                  <Music className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                  Get Started Now
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLyrics" className="h-8 w-8" />
              <span className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MyVibeLyrics
              </span>
            </div>
            <div className="flex space-x-8 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-white transition-colors hover:scale-105 transform duration-200">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors hover:scale-105 transform duration-200">Terms</Link>
              <Link to="/contact" className="hover:text-white transition-colors hover:scale-105 transform duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
