
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/FeatureCard";
import { 
  Music, 
  BarChart3, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Heart,
  Star,
  Play,
  Headphones,
  Mic,
  Radio,
  Volume2
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      title: "Advanced Analytics",
      description: "Deep insights into your listening habits, top genres, and music discovery patterns."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
      title: "Trend Analysis", 
      description: "Track how your music taste evolves over time with detailed trend reports."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-400" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations and insights powered by advanced AI algorithms."
    },
    {
      icon: <Users className="h-8 w-8 text-yellow-400" />,
      title: "Social Features",
      description: "Share your music stats and discover what your friends are listening to."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-400" />,
      title: "Mood Tracking",
      description: "Understand the emotional patterns in your music and how they reflect your mood."
    },
    {
      icon: <Star className="h-8 w-8 text-orange-400" />,
      title: "Artist Discovery",
      description: "Find new artists based on your listening patterns and music DNA."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/lovable-uploads/8563991f-3de0-4c8c-a013-8421fc670873.png" alt="MyVibeLytics" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/demo">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                View Demo
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Music className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-spotify text-white px-4 py-2 text-sm font-medium">
              🎵 Connect Your Spotify Account
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-gradient mb-6 leading-tight">
            Your Music,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Analyzed
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover deep insights about your music taste, explore listening patterns, 
            and get personalized recommendations with our advanced Spotify analytics platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4">
                <Music className="mr-2 h-6 w-6" />
                Connect Spotify Now
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Floating Music Icons */}
          <div className="relative">
            <div className="absolute top-0 left-1/4 animate-bounce delay-1000">
              <Headphones className="h-8 w-8 text-green-400/60" />
            </div>
            <div className="absolute top-10 right-1/4 animate-bounce delay-2000">
              <Mic className="h-6 w-6 text-blue-400/60" />
            </div>
            <div className="absolute -top-5 left-1/3 animate-bounce">
              <Radio className="h-7 w-7 text-purple-400/60" />
            </div>
            <div className="absolute top-8 right-1/3 animate-bounce delay-3000">
              <Volume2 className="h-5 w-5 text-yellow-400/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Powerful Music Analytics
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock the full potential of your Spotify data with comprehensive analytics and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect-strong rounded-3xl p-12 border border-border/50">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              Ready to Explore Your Music?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect your Spotify account and start discovering insights about your music taste today.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200 text-lg px-8 py-4">
                <Music className="mr-2 h-6 w-6" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/lovable-uploads/8563991f-3de0-4c8c-a013-8421fc670873.png" alt="MyVibeLytics" className="h-6 w-6" />
            <span className="text-xl font-bold text-gradient">MyVibeLytics</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 MyVibeLytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
