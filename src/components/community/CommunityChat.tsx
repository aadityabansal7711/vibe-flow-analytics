
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Users, Plus, Send, Hash, Lock, Globe } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  max_members: number;
  member_count?: number;
  created_at: string;
}

interface Message {
  id: string;
  sender_username: string;
  sender_display_name: string | null;
  message: string;
  created_at: string;
}

const CommunityChat = () => {
  const { user, profile } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    is_private: false
  });

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    if (activeGroup) {
      fetchMessages();
      // Set up real-time subscription for messages
      const channel = supabase
        .channel('group-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'group_messages',
            filter: `group_id=eq.${activeGroup.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeGroup]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_groups')
        .select('*, group_members(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupsWithCounts = data?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      })) || [];

      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    }
  };

  const fetchMessages = async () => {
    if (!activeGroup) return;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupForm.name.trim()) return;

    try {
      const { data: group, error: groupError } = await supabase
        .from('chat_groups')
        .insert({
          name: groupForm.name.trim(),
          description: groupForm.description.trim() || null,
          is_private: groupForm.is_private,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast.success('Group created successfully!');
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '', is_private: false });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast.success('Joined group successfully!');
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeGroup || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: activeGroup.id,
          sender_id: user.id,
          sender_username: profile?.email?.split('@')[0] || 'User',
          sender_display_name: profile?.full_name,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please login to access community chat</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Groups List */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Groups
            </div>
            <Button size="sm" onClick={() => setShowCreateGroup(!showCreateGroup)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCreateGroup && (
            <form onSubmit={createGroup} className="space-y-3 p-3 bg-background/30 rounded">
              <Input
                placeholder="Group name"
                value={groupForm.name}
                onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                required
              />
              <Input
                placeholder="Description (optional)"
                value={groupForm.description}
                onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={groupForm.is_private}
                  onChange={(e) => setGroupForm({...groupForm, is_private: e.target.checked})}
                />
                <label htmlFor="private" className="text-sm">Private group</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Create</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowCreateGroup(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  activeGroup?.id === group.id 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-background/30 border-border/50 hover:bg-background/50'
                }`}
                onClick={() => setActiveGroup(group)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {group.is_private ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                    <span className="font-medium text-foreground">{group.name}</span>
                  </div>
                  <Badge variant="outline">
                    {group.member_count || 0}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        {activeGroup ? (
          <Card className="glass-effect border-border/50 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5" />
                {activeGroup.name}
                {activeGroup.is_private && <Lock className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-96">
                {messages.map((message) => (
                  <div key={message.id} className="p-3 bg-background/30 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {message.sender_display_name || message.sender_username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-foreground">{message.message}</p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-effect border-border/50 h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a group to start chatting</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityChat;
