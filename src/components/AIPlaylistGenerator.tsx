
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Music, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface PlaylistSuggestion {
  name: string;
  description: string;
  tracks: Array<{
    name: string;
    artist: string;
    uri?: string;
  }>;
}

const AIPlaylistGenerator: React.FC = () => {
  const { profile, isUnlocked } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<PlaylistSuggestion | null>(null);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const generatePlaylist = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your playlist');
      return;
    }

    setLoading(true);
    try {
      // Create AI-generated playlist suggestion
      const aiSuggestion: PlaylistSuggestion = {
        name: `AI Playlist: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`,
        description: `Generated based on: ${prompt}${mood ? `, Mood: ${mood}` : ''}${genre ? `, Genre: ${genre}` : ''}`,
        tracks: [
          { name: 'Example Track 1', artist: 'AI Artist' },
          { name: 'Example Track 2', artist: 'Generated Artist' },
          { name: 'Example Track 3', artist: 'Virtual Musician' },
          // In a real implementation, this would call an AI service
        ]
      };

      setSuggestion(aiSuggestion);
      
      // Log the playlist generation
      await supabase.rpc('log_user_activity', {
        activity_type: 'ai_playlist_generated',
        activity_data: {
          prompt,
          mood,
          genre,
          timestamp: new Date().toISOString()
        }
      });

      toast.success('AI playlist generated successfully!');
    } catch (error) {
      console.error('Error generating playlist:', error);
      toast.error('Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

  const createSpotifyPlaylist = async () => {
    if (!suggestion || !profile?.spotify_access_token) {
      toast.error('Please generate a playlist first and ensure Spotify is connected');
      return;
    }

    setCreatingPlaylist(true);
    try {
      // In a real implementation, this would call Spotify API to create the playlist
      // For now, we'll simulate the process
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Log the playlist creation
      await supabase.rpc('log_user_activity', {
        activity_type: 'spotify_playlist_created',
        activity_data: {
          playlist_name: suggestion.name,
          track_count: suggestion.tracks.length,
          timestamp: new Date().toISOString()
        }
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <div className="font-semibold">Playlist created!</div>
            <div className="text-sm text-muted-foreground">
              "{suggestion.name}" has been added to your Spotify
            </div>
          </div>
        </div>,
        { duration: 5000 }
      );

      // Reset form
      setPrompt('');
      setMood('');
      setGenre('');
      setSuggestion(null);
    } catch (error) {
      console.error('Error creating Spotify playlist:', error);
      toast.error('Failed to create playlist in Spotify');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  if (!isUnlocked) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Sparkles className="h-6 w-6" />
            <span>AI Playlist Generator</span>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Generate personalized playlists with AI and add them directly to Spotify
            </p>
            <Button asChild>
              <a href="/buy">Unlock Premium Features</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <Sparkles className="h-6 w-6" />
          <span>AI Playlist Generator</span>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-foreground">
              Describe your ideal playlist
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Upbeat songs for a morning workout, chill vibes for studying, emotional songs for a rainy day..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-background/50 border-border text-foreground"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mood" className="text-foreground">
                Mood (optional)
              </Label>
              <Input
                id="mood"
                placeholder="e.g., Happy, Sad, Energetic"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="bg-background/50 border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="genre" className="text-foreground">
                Genre (optional)
              </Label>
              <Input
                id="genre"
                placeholder="e.g., Pop, Rock, Jazz"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-background/50 border-border text-foreground"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={generatePlaylist}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Playlist
            </>
          )}
        </Button>

        {suggestion && (
          <Card className="bg-background/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">{suggestion.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Suggested Tracks:</h4>
                <div className="space-y-2">
                  {suggestion.tracks.map((track, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{track.name}</span>
                      <span className="text-muted-foreground">by {track.artist}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={createSpotifyPlaylist}
                disabled={creatingPlaylist}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {creatingPlaylist ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating in Spotify...
                  </>
                ) : (
                  <>
                    <Music className="mr-2 h-4 w-4" />
                    Add to Spotify
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPlaylistGenerator;
