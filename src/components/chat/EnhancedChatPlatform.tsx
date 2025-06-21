
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Search, Users, Send, UserPlus, Settings, Shield, Music, Heart, MessageSquare, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  is_online: boolean;
  last_seen: string;
  avatar_url?: string;
  bio?: string;
  favorite_genres?: string[];
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_username: string;
  sender_display_name?: string;
  message: string;
  created_at: string;
  is_flagged?: boolean;
  message_type?: string;
  metadata?: any;
}

const EnhancedChatPlatform: React.FC = () => {
  const { user, profile } = useAuth();
  const [username, setUsername] = useState('');
  const [hasUsername, setHasUsername] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('community');
  const [userProfile, setUserProfile] = useState<ChatUser | null>(null);

  useEffect(() => {
    if (profile?.full_name) {
      checkUserUsername();
    }
  }, [profile]);

  useEffect(() => {
    if (hasUsername) {
      loadChatData();
      setupRealtimeSubscriptions();
    }
  }, [hasUsername]);

  const checkUserUsername = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data && !error) {
        setUsername(data.username);
        setUserProfile(data);
        setHasUsername(true);
      }
    } catch (error) {
      console.log('No username found, user needs to create one');
    }
  };

  const createUsername = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    // Content moderation check
    const suspiciousPatterns = [
      /spam/i, /hack/i, /scam/i, /porn/i, /drug/i, /violence/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(username));
    if (isSuspicious) {
      toast.error('Username contains inappropriate content. Please choose another.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_users')
        .insert({
          user_id: user?.id,
          username: username.toLowerCase(),
          display_name: profile?.full_name || username,
          is_online: true,
          last_seen: new Date().toISOString(),
          avatar_url: profile?.spotify_avatar_url || null,
          bio: 'Music enthusiast 🎵',
          favorite_genres: []
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Username already taken. Please choose another one.');
        } else {
          toast.error('Error creating username');
        }
        return;
      }

      setHasUsername(true);
      toast.success('Welcome to MyVibeLyrics Community!');
    } catch (error) {
      toast.error('Error creating username');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Subscribe to user status changes
    const usersChannel = supabase
      .channel('chat_users')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_users' },
        () => {
          loadOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(usersChannel);
    };
  };

  const loadChatData = async () => {
    await Promise.all([
      loadMessages(),
      loadOnlineUsers()
    ]);
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data && !error) {
        // Ensure all messages have required fields
        const formattedMessages = data.map(msg => ({
          ...msg,
          sender_display_name: msg.sender_display_name || msg.sender_username,
          message_type: msg.message_type || 'text',
          is_flagged: msg.is_flagged || false
        }));
        setMessages(formattedMessages.reverse());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_users')
        .select('*')
        .eq('is_online', true)
        .order('last_seen', { ascending: false });

      if (data && !error) {
        setOnlineUsers(data);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('chat_users')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .neq('user_id', user?.id)
        .limit(10);

      if (data && !error) {
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Content moderation
    const message = newMessage.trim();
    const suspiciousPatterns = [
      /spam/i, /scam/i, /hack/i, /abuse/i, /hate/i, /violence/i, /porn/i, /drug/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(message));
    
    if (isSuspicious) {
      toast.warning('Message flagged for review. Our team will check it shortly.');
      // Still send the message but mark it as flagged
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user?.id,
          sender_username: username,
          sender_display_name: userProfile?.display_name || username,
          message: message,
          message_type: 'text',
          is_flagged: isSuspicious
        });

      if (!error) {
        setNewMessage('');
      }
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  const sendFriendRequest = async (targetUsername: string) => {
    toast.success(`Friend request sent to @${targetUsername} (Feature coming soon!)`);
  };

  if (!hasUsername) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Join MyVibeLyrics Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Choose Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your unique username"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be your identity in the community
            </p>
          </div>
          <Button 
            onClick={createUsername} 
            disabled={isLoading || !username.trim()}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Join Community'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-[600px] max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="community">MyVibeLyrics Community</TabsTrigger>
          <TabsTrigger value="discover">Discover Users</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    Online ({onlineUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {onlineUsers.slice(0, 8).map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">@{user.username}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      MyVibeLyrics Community Chat
                    </span>
                    <Badge variant="outline">@{username}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 border rounded bg-muted/20">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-xs font-medium">
                              @{message.sender_username}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                            {message.is_flagged && (
                              <Flag className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your music thoughts..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Discover Music Lovers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or name"
                  className="flex-1"
                />
                <Button onClick={searchUsers}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={result.avatar_url} />
                          <AvatarFallback>{result.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{result.username}</p>
                          <p className="text-sm text-muted-foreground">{result.display_name}</p>
                          {result.bio && (
                            <p className="text-xs text-muted-foreground mt-1">{result.bio}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendFriendRequest(result.username)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userProfile.avatar_url} />
                      <AvatarFallback>{userProfile.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">@{userProfile.username}</h3>
                      <p className="text-muted-foreground">{userProfile.display_name}</p>
                      <div className="flex items-center mt-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${userProfile.is_online ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <span className="text-sm">{userProfile.is_online ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {userProfile.bio && (
                    <div>
                      <h4 className="font-medium mb-2">Bio</h4>
                      <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Music className="h-4 w-4" />
                    <span className="text-sm">Music enthusiast since joining MyVibeLyrics</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedChatPlatform;
