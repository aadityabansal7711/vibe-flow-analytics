
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Users, Sparkles, Play, Heart, Share2, UserPlus, MessageCircle, Headphones, ListMusic } from 'lucide-react';
import { toast } from 'sonner';

interface SpecialHighlightsProps {
  spotifyData: any;
}

const SpecialHighlights: React.FC<SpecialHighlightsProps> = ({ spotifyData }) => {
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [playlistProgress, setPlaylistProgress] = useState(0);

  const createAiPlaylist = async () => {
    setIsCreatingPlaylist(true);
    setPlaylistProgress(0);

    try {
      // Simulate AI playlist creation with progress
      const steps = [
        { message: "Analyzing your music taste...", progress: 20 },
        { message: "Finding similar tracks...", progress: 40 },
        { message: "Discovering new artists...", progress: 60 },
        { message: "Curating perfect matches...", progress: 80 },
        { message: "Finalizing your playlist...", progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlaylistProgress(step.progress);
        toast.info(step.message);
      }

      // Simulate successful playlist creation
      toast.success("🎵 AI Curated Playlist Created! 100 songs tailored just for you.");
    } catch (error) {
      console.error('Error creating AI playlist:', error);
      toast.error("Failed to create playlist. Please try again.");
    } finally {
      setIsCreatingPlaylist(false);
      setPlaylistProgress(0);
    }
  };

  // Mock community data
  const communityStats = {
    totalMembers: 1247,
    activeNow: 89,
    songsShared: 3456,
    discussions: 234
  };

  const trendingInCommunity = [
    { title: "Chill Indie Vibes", artist: "Various Artists", likes: 342, shares: 89 },
    { title: "Workout Bangers 2025", artist: "Community Playlist", likes: 298, shares: 156 },
    { title: "Late Night Jazz", artist: "Jazz Collective", likes: 187, shares: 67 },
    { title: "Discover Weekly Gems", artist: "AI Curated", likes: 425, shares: 203 }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Special Highlights
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover AI-curated playlists and connect with fellow music lovers in our community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Curated Playlists */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Curated Playlists</CardTitle>
                <CardDescription>100 songs tailored to your unique taste</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ListMusic className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Your Perfect Mix</div>
                    <div className="text-sm text-muted-foreground">Based on your top tracks</div>
                  </div>
                </div>
                <Badge variant="secondary">100 songs</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Mood Discovery</div>
                    <div className="text-sm text-muted-foreground">Songs matching your vibe</div>
                  </div>
                </div>
                <Badge variant="secondary">100 songs</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Music className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Hidden Gems</div>
                    <div className="text-sm text-muted-foreground">Undiscovered tracks you'll love</div>
                  </div>
                </div>
                <Badge variant="secondary">100 songs</Badge>
              </div>
            </div>

            {isCreatingPlaylist && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Creating AI Playlist...</span>
                  <span className="text-sm text-muted-foreground">{playlistProgress}%</span>
                </div>
                <Progress value={playlistProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={createAiPlaylist}
              disabled={isCreatingPlaylist}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isCreatingPlaylist ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Playlist...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create AI Playlist (100 Songs)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Music Community */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Music Community</CardTitle>
                <CardDescription>Connect with fellow music lovers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{communityStats.activeNow}</div>
                <div className="text-sm text-muted-foreground">Online Now</div>
              </div>
            </div>

            {/* Trending Songs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Trending in Community</h4>
              {trendingInCommunity.slice(0, 3).map((song, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{song.title}</div>
                      <div className="text-xs text-muted-foreground">{song.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{song.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-3 w-3" />
                      <span>{song.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center justify-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Join Community</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Start Discussion</span>
              </Button>
            </div>

            <div className="text-center">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Users className="mr-2 h-4 w-4" />
                Explore Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Community Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Recent Community Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">MusicLover42</span>
                  <Badge variant="secondary" className="text-xs">New Member</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Just discovered this amazing indie playlist! The AI recommendations are spot on 🎵
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>2 minutes ago</span>
                  <button className="flex items-center space-x-1 hover:text-foreground">
                    <Heart className="h-3 w-3" />
                    <span>12</span>
                  </button>
                  <button className="hover:text-foreground">Reply</button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                J
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">JazzEnthusiast</span>
                  <Badge variant="outline" className="text-xs">Community Star</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created a new playlist: "Late Night Jazz Vibes" - 100 carefully selected tracks for your evening listening
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>15 minutes ago</span>
                  <button className="flex items-center space-x-1 hover:text-foreground">
                    <Heart className="h-3 w-3" />
                    <span>28</span>
                  </button>
                  <button className="hover:text-foreground">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialHighlights;
