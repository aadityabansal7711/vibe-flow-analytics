
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/FeatureCard';
import { 
  Music, 
  User, 
  TrendingUp, 
  Calendar, 
  Clock, 
  HeadphonesIcon,
  Heart,
  PieChart,
  Activity,
  Zap,
  Star,
  RotateCcw,
  Sparkles,
  Shuffle,
  ArrowLeft,
  Album,
  Target,
  Moon,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const Demo = () => {
  // Sample data for demo
  const sampleTracks = [
    { name: "Blinding Lights", artists: [{ name: "The Weeknd" }], popularity: 95 },
    { name: "Watermelon Sugar", artists: [{ name: "Harry Styles" }], popularity: 88 },
    { name: "Good 4 U", artists: [{ name: "Olivia Rodrigo" }], popularity: 92 },
    { name: "Levitating", artists: [{ name: "Dua Lipa" }], popularity: 89 },
    { name: "Stay", artists: [{ name: "The Kid LAROI" }], popularity: 85 }
  ];

  const sampleArtists = [
    { name: "The Weeknd", followers: { total: 45000000 } },
    { name: "Taylor Swift", followers: { total: 52000000 } },
    { name: "Post Malone", followers: { total: 38000000 } },
    { name: "Billie Eilish", followers: { total: 41000000 } },
    { name: "Drake", followers: { total: 55000000 } }
  ];

  const sampleAlbums = [
    { name: "After Hours", artist: "The Weeknd" },
    { name: "Fine Line", artist: "Harry Styles" },
    { name: "SOUR", artist: "Olivia Rodrigo" },
    { name: "Future Nostalgia", artist: "Dua Lipa" },
    { name: "Certified Lover Boy", artist: "Drake" }
  ];

  const genreData = [
    { name: 'Pop', value: 35, color: '#FF6B6B' },
    { name: 'Hip Hop', value: 25, color: '#4ECDC4' },
    { name: 'Rock', value: 20, color: '#45B7D1' },
    { name: 'Electronic', value: 12, color: '#96CEB4' },
    { name: 'Jazz', value: 8, color: '#FFEAA7' }
  ];

  const monthlyData = [
    { month: 'Jan', hours: 65, tracks: 180 },
    { month: 'Feb', hours: 72, tracks: 195 },
    { month: 'Mar', hours: 68, tracks: 210 },
    { month: 'Apr', hours: 85, tracks: 225 },
    { month: 'May', hours: 92, tracks: 240 },
    { month: 'Jun', hours: 78, tracks: 220 },
    { month: 'Jul', hours: 88, tracks: 260 },
    { month: 'Aug', hours: 95, tracks: 275 },
    { month: 'Sep', hours: 82, tracks: 255 },
    { month: 'Oct', hours: 90, tracks: 280 },
    { month: 'Nov', hours: 87, tracks: 270 },
    { month: 'Dec', hours: 93, tracks: 290 }
  ];

  const timeData = [
    { hour: '6AM', plays: 12, label: '6AM' },
    { hour: '9AM', plays: 25, label: '9AM' },
    { hour: '12PM', plays: 35, label: '12PM' },
    { hour: '3PM', plays: 28, label: '3PM' },
    { hour: '6PM', plays: 42, label: '6PM' },
    { hour: '9PM', plays: 38, label: '9PM' },
    { hour: '12AM', plays: 15, label: '12AM' }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/2cc35839-88fd-49dd-a53e-9bd266701d1b.png" alt="MyVibeLytics" className="h-10 w-10" />
            <span className="text-2xl font-bold text-foreground">MyVibeLytics</span>
          </Link>
          <div className="text-muted-foreground">
            Demo Dashboard - Sample Data
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
        <p className="text-primary font-medium">
          🎵 This is a demo with sample data. Connect your Spotify account to see your real music analytics!
        </p>
      </div>

      {/* 🎧 Core Listening Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">🎧 Core Listening Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Top Tracks - Free */}
          <FeatureCard
            title="Top Tracks"
            description="Your most played songs"
            icon={<Music className="h-5 w-5 text-primary" />}
            isLocked={false}
          >
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {sampleTracks.map((track, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{track.name}</p>
                    <p className="text-xs text-gray-300 truncate">{track.artists[0]?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Top Artists - Free */}
          <FeatureCard
            title="Top Artists"
            description="Your favorite musicians"
            icon={<User className="h-5 w-5 text-accent" />}
            isLocked={false}
          >
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {sampleArtists.map((artist, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{artist.name}</p>
                    <p className="text-xs text-gray-300">{artist.followers.total.toLocaleString()} followers</p>
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Top Albums - Free */}
          <FeatureCard
            title="Top Albums"
            description="Your most played albums"
            icon={<Album className="h-5 w-5 text-secondary" />}
            isLocked={false}
          >
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {sampleAlbums.map((album, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center text-xs font-bold text-secondary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{album.name}</p>
                    <p className="text-xs text-gray-300 truncate">{album.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Most Played Song of All Time - Premium */}
          <FeatureCard
            title="Most Played Song of All Time"
            description="Your ultimate favorite track"
            icon={<Heart className="h-5 w-5 text-red-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <Heart className="h-12 w-12 text-red-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Blinding Lights</h3>
              <p className="text-gray-300 text-sm">The Weeknd • 95% popularity</p>
              <p className="text-red-400 text-xs mt-1">247 plays detected</p>
            </div>
          </FeatureCard>

          {/* Your 2024 Wrapped - Premium */}
          <FeatureCard
            title="Your 2024 Wrapped"
            description="Year in music summary"
            icon={<Sparkles className="h-5 w-5 text-yellow-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-yellow-400 mb-2">2,847</div>
              <p className="text-white">Songs played this year</p>
              <div className="text-xl font-semibold text-green-400 mt-2">428 hours</div>
              <p className="text-gray-300 text-sm">Total listening time</p>
            </div>
          </FeatureCard>

          {/* Make Playlist - Premium */}
          <FeatureCard
            title="Make Playlist from Listening"
            description="AI-generated playlists"
            icon={<Shuffle className="h-5 w-5 text-green-400" />}
            isLocked={true}
          >
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white mb-4"
              disabled
            >
              <Music className="mr-2 h-4 w-4" />
              Generate AI Playlist
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">92%</div>
              <p className="text-xs text-muted-foreground">AI Match Score</p>
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* 🕒 Listening Behavior & Patterns */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">🕒 Listening Behavior & Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Time of Day Preference - Premium */}
          <FeatureCard
            title="Time of Day Preference"
            description="Morning vs Night listening"
            icon={<Clock className="h-5 w-5 text-orange-400" />}
            isLocked={true}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="plays" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </FeatureCard>

          {/* Listening Streaks - Premium */}
          <FeatureCard
            title="Listening Streaks"
            description="Consecutive days of listening"
            icon={<Activity className="h-5 w-5 text-red-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-red-400 mb-2">28</div>
              <p className="text-white">Day streak</p>
              <div className="text-sm text-gray-300 mt-2">Personal best: 45 days</div>
            </div>
          </FeatureCard>

          {/* Skip Rate - Premium */}
          <FeatureCard
            title="Skips vs Completions"
            description="Songs played vs skipped"
            icon={<RotateCcw className="h-5 w-5 text-orange-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-orange-400 mb-2">18%</div>
              <p className="text-white">Skip rate</p>
              <div className="text-sm text-gray-300 mt-2">Better than 82% of users</div>
            </div>
          </FeatureCard>

          {/* Replay Value Score - Premium */}
          <FeatureCard
            title="Replay Value Score"
            description="How often you replay songs"
            icon={<RotateCcw className="h-5 w-5 text-green-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-400 mb-2">8.9/10</div>
              <p className="text-white">Replay score</p>
              <div className="text-sm text-gray-300 mt-2">You love your favorites!</div>
            </div>
          </FeatureCard>

          {/* Discovery Score - Premium */}
          <FeatureCard
            title="Discovery Score"
            description="New artist/song discovery ratio"
            icon={<Target className="h-5 w-5 text-cyan-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-cyan-400 mb-2">8.5/10</div>
              <p className="text-white">Discovery score</p>
              <div className="text-sm text-gray-300 mt-2">Music exploration</div>
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* 🎭 Personality & Mood Analytics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">🎭 Personality & Mood Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Music Personality - Premium */}
          <FeatureCard
            title="Music Personality Profile"
            description="Your musical character type"
            icon={<Star className="h-5 w-5 text-yellow-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">The Explorer</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Adventurous</span>
                  <span className="text-yellow-400 text-sm">89%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Mainstream</span>
                  <span className="text-blue-400 text-sm">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Nostalgic</span>
                  <span className="text-purple-400 text-sm">45%</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Your Mood in Music - Premium */}
          <FeatureCard
            title="Your Mood in Music 2024"
            description="Emotional analysis of your listening"
            icon={<Heart className="h-5 w-5 text-pink-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <div className="text-xl font-bold text-foreground mb-2">Energetic</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Happy</span>
                  <span className="text-pink-400 text-sm">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Energetic</span>
                  <span className="text-pink-400 text-sm">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Chill</span>
                  <span className="text-pink-400 text-sm">42%</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Top Genres - Premium */}
          <FeatureCard
            title="Top Genres"
            description="Your musical taste breakdown"
            icon={<PieChart className="h-5 w-5 text-purple-400" />}
            isLocked={true}
            className="md:col-span-1"
          >
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </FeatureCard>
        </div>
      </div>

      {/* 🌟 Special Highlights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">🌟 Special Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Hidden Gems - Premium */}
          <FeatureCard
            title="Hidden Gem Discovery"
            description="Underrated songs you love"
            icon={<Zap className="h-5 w-5 text-cyan-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold text-sm">Midnight City</h4>
              <p className="text-gray-300 text-xs">M83 • 156 plays</p>
              <p className="text-cyan-400 text-xs mt-1">Hidden gem discovered</p>
            </div>
          </FeatureCard>

          {/* Late Night Repeat Offenders - Premium */}
          <FeatureCard
            title="Late Night Repeat Offenders"
            description="Songs often repeated late night"
            icon={<Moon className="h-5 w-5 text-purple-400" />}
            isLocked={true}
          >
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground truncate">Blinding Lights</p>
                <p className="text-xs text-muted-foreground truncate">The Weeknd</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground truncate">Good 4 U</p>
                <p className="text-xs text-muted-foreground truncate">Olivia Rodrigo</p>
              </div>
            </div>
          </FeatureCard>

          {/* Listening Milestones - Premium */}
          <FeatureCard
            title="Listening Milestones"
            description="Your musical journey markers"
            icon={<Award className="h-5 w-5 text-yellow-400" />}
            isLocked={true}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">1000th Song</span>
                <Award className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">500th Song</span>
                <Award className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">100th Song</span>
                <Award className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* 📈 Monthly Trends */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">📈 Monthly Trends & Deep Dive</h2>
        
        {/* Monthly Listening Trends - Premium */}
        <FeatureCard
          title="Monthly Listening Trends"
          description="Listening over time"
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          isLocked={true}
          className="mb-6"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis dataKey="hours" tick={{ fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </FeatureCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Average Listening Hours"
            description="Daily listening statistics"
            icon={<HeadphonesIcon className="h-5 w-5 text-green-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-green-400 mb-2">5.8</div>
              <p className="text-white">Hours per day</p>
              <div className="text-sm text-gray-300 mt-2">+15% from last month</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Year-over-Year Growth"
            description="Listening time increase"
            icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-blue-400 mb-2">+32%</div>
              <p className="text-white">Growth rate</p>
              <div className="text-sm text-gray-300 mt-2">Great progress!</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Most Played Decade"
            description="Your preferred era"
            icon={<Calendar className="h-5 w-5 text-purple-400" />}
            isLocked={true}
          >
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-purple-400 mb-2">2020s</div>
              <p className="text-white">Preferred era</p>
              <div className="text-sm text-gray-300 mt-2">Modern music lover</div>
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gradient mb-4">
            Ready to see YOUR real data?
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect your Spotify account to unlock personalized insights and analytics with all these features!
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
              <Music className="mr-2 h-6 w-6" />
              Connect Spotify Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Demo;
