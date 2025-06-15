import React from "react";
import FeatureCard from "@/components/FeatureCard";
import SpotifyConnect from "@/components/SpotifyConnect";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
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
  Shuffle,
  Sparkles
} from "lucide-react";

type Props = {
  profile: any;
  user: any;
  isUnlocked: boolean;
  topTracks: any[];
  topArtists: any[];
  recentlyPlayed: any[];
  spotifyLoading: boolean;
  error: string | null;
  monthlyData: any[];
  genreData: any[];
  timeData: any[];
};

const DashboardFeatureGrid: React.FC<Props> = ({
  profile,
  user,
  isUnlocked,
  topTracks,
  topArtists,
  recentlyPlayed,
  spotifyLoading,
  error,
  monthlyData,
  genreData,
  timeData
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
        {/* Always Unlocked Features */}
        <FeatureCard
          title="Top Tracks"
          description="Your most played songs"
          icon={<Music className="h-5 w-5 text-primary" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {spotifyLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : topTracks.length > 0 ? (
              topTracks.slice(0, 25).map((track, i) => (
                <div key={track.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm break-all">{i + 1}. {track.name} - {track.artists[0]?.name}</span>
                </div>
              ))
            ) : (
              ['Blinding Lights - The Weeknd', 'Watermelon Sugar - Harry Styles', 'Levitating - Dua Lipa'].map((track, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm">{track}</span>
                </div>
              ))
            )}
          </div>
        </FeatureCard>

        <FeatureCard
          title="Top Artists"
          description="Your favorite musicians"
          icon={<User className="h-5 w-5 text-accent" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {spotifyLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : topArtists.length > 0 ? (
              topArtists.slice(0, 25).map((artist, i) => (
                <div key={artist.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-sm break-all">{i + 1}. {artist.name}</span>
                </div>
              ))
            ) : (
              ['The Weeknd', 'Dua Lipa', 'Harry Styles'].map((artist, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-sm">{artist}</span>
                </div>
              ))
            )}
          </div>
        </FeatureCard>

        <FeatureCard
          title="Recently Played"
          description="Your latest listening activity"
          icon={<Clock className="h-5 w-5 text-secondary" />}
          isLocked={false}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {spotifyLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : recentlyPlayed.length > 0 ? (
              recentlyPlayed.slice(0, 25).map((track, i) => (
                <div key={`${track.id}-${i}`} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white text-sm break-all">{i + 1}. {track.name} - {track.artists[0]?.name}</span>
                </div>
              ))
            ) : (
              ['After Hours', 'Fine Line', 'Future Nostalgia'].map((album, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white text-sm">{album}</span>
                </div>
              ))
            )}
          </div>
        </FeatureCard>

        {/* Premium Features */}
        <FeatureCard
          title="Most Played Song of All Time"
          description="Your ultimate favorite track"
          icon={<Heart className="h-5 w-5 text-red-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">
              {topTracks.length > 0 ? topTracks[0].name : 'Blinding Lights'}
            </h3>
            <p className="text-gray-300 text-sm">
              {topTracks.length > 0 ? `${topTracks[0].artists[0]?.name} • ${topTracks[0].popularity} popularity` : 'The Weeknd • 847 plays'}
            </p>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Your Year in Music"
          description="Your year in music"
          icon={<Sparkles className="h-5 w-5 text-yellow-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {topTracks.length > 0 ? topTracks.length * 15 : '2,847'}
            </div>
            <p className="text-white">Songs played this year</p>
            <div className="text-xl font-semibold text-green-400 mt-2">
              {topTracks.length > 0 ? Math.round(topTracks.length * 2.5) : '156'} hours
            </div>
            <p className="text-gray-300 text-sm">Total listening time</p>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Create Playlist from Listening"
          description="AI-generated playlists"
          icon={<Shuffle className="h-5 w-5 text-green-400" />}
          isLocked={!isUnlocked}
        >
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Generate Playlist
          </Button>
        </FeatureCard>

        <FeatureCard
          title="Time Preference"
          description="Morning vs Night listening"
          icon={<Clock className="h-5 w-5 text-orange-400" />}
          isLocked={!isUnlocked}
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
          isLocked={!isUnlocked}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-400">68%</div>
              <p className="text-gray-300 text-sm">Weekday</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">32%</div>
              <p className="text-gray-300 text-sm">Weekend</p>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Monthly Trends"
          description="Listening over time"
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          isLocked={!isUnlocked}
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
          title="Average Listening Hours"
          description="Daily listening statistics"
          icon={<HeadphonesIcon className="h-5 w-5 text-green-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-green-400 mb-2">4.2</div>
            <p className="text-white">Hours per day</p>
            <div className="text-sm text-gray-300 mt-2">+15% from last month</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Top Genres"
          description="Your musical taste breakdown"
          icon={<PieChart className="h-5 w-5 text-purple-400" />}
          isLocked={!isUnlocked}
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
          title="Listening Streaks"
          description="Consecutive days of listening"
          icon={<Activity className="h-5 w-5 text-red-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-red-400 mb-2">23</div>
            <p className="text-white">Day streak</p>
            <div className="text-sm text-gray-300 mt-2">Personal best: 45 days</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Music Personality"
          description="Your musical profile"
          icon={<Star className="h-5 w-5 text-yellow-400" />}
          isLocked={!isUnlocked}
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
          title="Mood in Music"
          description="Emotional patterns in your music"
          icon={<Heart className="h-5 w-5 text-pink-400" />}
          isLocked={!isUnlocked}
        >
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded p-2">
              <div className="text-lg font-semibold text-pink-400">Happy</div>
              <div className="text-xs text-gray-300">42%</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-lg font-semibold text-blue-400">Chill</div>
              <div className="text-xs text-gray-300">31%</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-lg font-semibold text-red-400">Energetic</div>
              <div className="text-xs text-gray-300">18%</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-lg font-semibold text-purple-400">Sad</div>
              <div className="text-xs text-gray-300">9%</div>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Skip Rate"
          description="Songs played vs skipped"
          icon={<RotateCcw className="h-5 w-5 text-orange-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-orange-400 mb-2">23%</div>
            <p className="text-white">Skip rate</p>
            <div className="text-sm text-gray-300 mt-2">Better than 78% of users</div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Hidden Gems"
          description="Underrated songs you love"
          icon={<Zap className="h-5 w-5 text-cyan-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold text-sm">
              {topTracks.length > 0 && topTracks[topTracks.length - 1] ? 
                topTracks[topTracks.length - 1].name : 'Midnight City'}
            </h4>
            <p className="text-gray-300 text-xs">
              {topTracks.length > 0 && topTracks[topTracks.length - 1] ? 
                `${topTracks[topTracks.length - 1].artists[0]?.name} • ${topTracks[topTracks.length - 1].popularity} popularity` : 
                'M83 • 156 plays'}
            </p>
            <p className="text-cyan-400 text-xs mt-1">Hidden gem discovered</p>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Replay Value"
          description="How often you replay songs"
          icon={<RotateCcw className="h-5 w-5 text-green-400" />}
          isLocked={!isUnlocked}
        >
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-green-400 mb-2">8.7</div>
            <p className="text-white">Replay score</p>
            <div className="text-sm text-gray-300 mt-2">You love your favorites!</div>
          </div>
        </FeatureCard>
      
  </div>
);

export default DashboardFeatureGrid;
