
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Search, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  is_online: boolean;
  last_seen: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_username: string;
  message: string;
  created_at: string;
}

const ChatPlatform: React.FC = () => {
  const { user, profile } = useAuth();
  const [username, setUsername] = useState('');
  const [hasUsername, setHasUsername] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      checkUserUsername();
    }
  }, [profile]);

  const checkUserUsername = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_users')
        .select('username, display_name')
        .eq('user_id', user?.id)
        .single();

      if (data && !error) {
        setUsername(data.username);
        setHasUsername(true);
        loadChatData();
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

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_users')
        .insert({
          user_id: user?.id,
          username: username.toLowerCase(),
          display_name: profile?.full_name || username,
          is_online: true,
          last_seen: new Date().toISOString()
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
      toast.success('Username created successfully!');
      loadChatData();
    } catch (error) {
      toast.error('Error creating username');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatData = async () => {
    // Load recent messages
    const { data: messagesData } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (messagesData) {
      setMessages(messagesData.reverse());
    }

    // Load online users
    const { data: usersData } = await supabase
      .from('chat_users')
      .select('*')
      .eq('is_online', true);

    if (usersData) {
      setOnlineUsers(usersData);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    const { data, error } = await supabase
      .from('chat_users')
      .select('*')
      .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
      .limit(10);

    if (data && !error) {
      setSearchResults(data);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user?.id,
          sender_username: username,
          message: newMessage.trim()
        });

      if (!error) {
        setNewMessage('');
        loadChatData(); // Refresh messages
      }
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  if (!hasUsername) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Create Your Username
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be your unique identifier in the chat
            </p>
          </div>
          <Button 
            onClick={createUsername} 
            disabled={isLoading || !username.trim()}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Username'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* User Search Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Find Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name"
              className="flex-1"
            />
            <Button onClick={searchUsers} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Search Results</h4>
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">@{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.display_name}</p>
                </div>
                <Badge variant={user.is_online ? "default" : "outline"}>
                  {user.is_online ? 'Online' : 'Offline'}
                </Badge>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Users className="mr-1 h-4 w-4" />
              Online Now ({onlineUsers.length})
            </h4>
            {onlineUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">@{user.username}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              Community Chat
            </span>
            <Badge variant="outline">@{username}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[480px]">
          {/* Messages Area */}
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
                    <span className="text-xs font-medium">@{message.sender_username}</span>
                    <span className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
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
  );
};

export default ChatPlatform;
