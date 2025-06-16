
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
  ArrowLeft
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
    { name: "The Weeknd" },
    { name: "Taylor Swift" },
    { name: "Post Malone" },
    { name: "Billie Eilish" },
    { name: "Drake" }
  ];

  const genreData = [
    { name: 'Pop', value: 35, color: '#FF6B6B' },
    { name: 'Hip Hop', value: 25, color: '#4ECDC4' },
    { name: 'Rock', value: 20, color: '#45B7D1' },
    { name: 'Electronic', value: 12, color: '#96CEB4' },
    { name: 'Jazz', value: 8, color: '#FFEAA7' }
  ];

  const monthlyData = [
    { month: 'Jan', hours: 65 },
    { month: 'Feb', hours: 72 },
    { month: 'Mar', hours: 68 },
    { month: 'Apr', hours: 85 },
    { month: 'May', hours: 92 },
    { month: 'Jun', hours: 78 }
  ];

  const timeData = [
    { hour: '6AM', plays: 12 },
    { hour: '9AM', plays: 25 },
    { hour: '12PM', plays: 35 },
    { hour: '3PM', plays: 28 },
    { hour: '6PM', plays: 42 },
    { hour: '9PM', plays: 38 },
    { hour: '12AM', plays: 15 }
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

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Free Features */}
        <FeatureCard
          title="Top Tracks"
          description="Your most played songs"
          icon={<Music className="h-5 w-5 text-primary" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {sampleTracks.map((track, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">{i + 1}. {track.name} - {track.artists[0]?.name}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard
          title="Top Artists"
          description="Your favorite musicians"
          icon={<User className="h-5 w-5 text-accent" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {sampleArtists.map((artist, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white text-sm">{i + 1}. {artist.name}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard
          title="Recently Played"
          description="Your latest listening activity"
          icon={<Clock className="h-5 w-5 text-secondary" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {sampleTracks.reverse().map((track, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white text-sm">{i + 1}. {track.name} - {track.artists[0]?.name}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Premium Features */}
        <FeatureCard
          title="Create Playlist from Listening"
          description="AI-generated playlists"
          icon={<Shuffle className="h-5 w-5 text-green-400" />}
          isLocked={true}
        >
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled
          >
            Generate Playlist
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Premium feature - Connect Spotify to unlock</p>
        </FeatureCard>

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
          </div>
        </FeatureCard>

        <FeatureCard
          title="Your Year in Music"
          description="Your year in music"
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

        <FeatureCard
          title="Time Preference"
          description="Morning vs Night listening"
          icon={<Clock className="h-5 w-5 text-orange-400" />}
          isLocked={true}
        >
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="plays" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </FeatureCard>

        <FeatureCard
          title="Weekday vs Weekend"
          description="Listening pattern differences"
          icon={<Calendar className="h-5 w-5 text-indigo-400" />}
          isLocked={true}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-400">72%</div>
              <p className="text-gray-300 text-sm">Weekday</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">28%</div>
              <p className="text-gray-300 text-sm">Weekend</p>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Monthly Trends"
          description="Listening over time"
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          isLocked={true}
          className="md:col-span-2"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis dataKey="hours" tick={{ fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </FeatureCard>

        <FeatureCard
          title="Top Genres"
          description="Your musical taste breakdown"
          icon={<PieChart className="h-5 w-5 text-purple-400" />}
          isLocked={true}
          className="md:col-span-2"
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                outerRadius={80}
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

        <FeatureCard
          title="Music Personality"
          description="Your musical profile"
          icon={<Star className="h-5 w-5 text-yellow-400" />}
          isLocked={true}
        >
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
        </FeatureCard>

        <FeatureCard
          title="Skip Rate"
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

        <FeatureCard
          title="Hidden Gems"
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

        <FeatureCard
          title="Replay Value"
          description="How often you replay songs"
          icon={<RotateCcw className="h-5 w-5 text-green-400" />}
          isLocked={true}
        >
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-green-400 mb-2">8.9</div>
            <p className="text-white">Replay score</p>
            <div className="text-sm text-gray-300 mt-2">You love your favorites!</div>
          </div>
        </FeatureCard>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gradient mb-4">
            Ready to see YOUR real data?
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect your Spotify account to unlock personalized insights and analytics
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
