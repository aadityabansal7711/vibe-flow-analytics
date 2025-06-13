
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  ArrowLeft, 
  Play, 
  Heart, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  Headphones,
  BarChart3,
  Star
} from 'lucide-react';

const Demo = () => {
  // Sample data for demo
  const sampleTopTracks = [
    { name: "Blinding Lights", artists: [{ name: "The Weeknd" }], popularity: 95 },
    { name: "Shape of You", artists: [{ name: "Ed Sheeran" }], popularity: 92 },
    { name: "Someone Like You", artists: [{ name: "Adele" }], popularity: 89 },
    { name: "Bohemian Rhapsody", artists: [{ name: "Queen" }], popularity: 88 },
    { name: "Hotel California", artists: [{ name: "Eagles" }], popularity: 85 }
  ];

  const sampleTopArtists = [
    { name: "The Weeknd", genres: ["pop", "r&b"], followers: { total: 25000000 } },
    { name: "Ed Sheeran", genres: ["pop", "folk"], followers: { total: 20000000 } },
    { name: "Adele", genres: ["pop", "soul"], followers: { total: 18000000 } },
    { name: "Queen", genres: ["rock", "classic rock"], followers: { total: 15000000 } }
  ];

  const sampleGenres = [
    { genre: "Pop", percentage: 35 },
    { genre: "Rock", percentage: 25 },
    { genre: "R&B", percentage: 20 },
    { genre: "Electronic", percentage: 12 },
    { genre: "Folk", percentage: 8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <ArrowLeft className="h-6 w-6 text-primary" />
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
            </div>
          </Link>
          <Badge className="bg-gradient-spotify text-white">Demo Mode</Badge>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Demo Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Demo Dashboard</h1>
              <p className="text-xl text-muted-foreground">Experience all premium features with sample data</p>
              <Link to="/auth" className="inline-block mt-6">
                <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                  <Play className="mr-2 h-5 w-5" />
                  Connect Your Spotify
                </Button>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Tracks</p>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                    </div>
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Listening Hours</p>
                      <p className="text-2xl font-bold text-foreground">342</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Top Artists</p>
                      <p className="text-2xl font-bold text-foreground">89</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Music Score</p>
                      <p className="text-2xl font-bold text-foreground">92%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Top Tracks */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Star className="h-5 w-5" />
                    <span>Your Top Tracks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleTopTracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-effect border-border/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-spotify rounded-lg flex items-center justify-center">
                          <Music className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{track.name}</p>
                          <p className="text-muted-foreground text-sm">{track.artists[0].name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-primary border-primary/50">
                          {track.popularity}% match
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Artists */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Users className="h-5 w-5" />
                    <span>Your Top Artists</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleTopArtists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-effect border-border/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Headphones className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{artist.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {artist.genres.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-medium">
                          {(artist.followers.total / 1000000).toFixed(1)}M followers
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Genre Distribution */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <BarChart3 className="h-5 w-5" />
                    <span>Genre Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleGenres.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-foreground">{item.genre}</span>
                        <span className="text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Listening Patterns */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Clock className="h-5 w-5" />
                    <span>Listening Patterns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 glass-effect border-border/30 rounded-lg text-center">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-foreground font-semibold">Peak Day</p>
                      <p className="text-muted-foreground text-sm">Saturday</p>
                    </div>
                    <div className="p-4 glass-effect border-border/30 rounded-lg text-center">
                      <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-foreground font-semibold">Peak Time</p>
                      <p className="text-muted-foreground text-sm">8:00 PM</p>
                    </div>
                  </div>
                  <div className="p-4 glass-effect border-border/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-8 w-8 text-red-400" />
                      <div>
                        <p className="text-foreground font-semibold">Music Mood</p>
                        <p className="text-muted-foreground text-sm">Energetic & Uplifting (78% match)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="glass-effect-strong border-border/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gradient mb-4">Ready to See Your Real Data?</h3>
                <p className="text-muted-foreground mb-6">Connect your Spotify account to unlock personalized insights</p>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                    <Play className="mr-2 h-6 w-6" />
                    Get Started Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
