
-- Create chat_users table for storing chat usernames and online status
CREATE TABLE public.chat_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for storing chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on chat_users
ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security (RLS) on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_users
-- Users can view all chat users (for searching and seeing who's online)
CREATE POLICY "Anyone can view chat users" 
  ON public.chat_users 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Users can only insert their own chat user record
CREATE POLICY "Users can create their own chat profile" 
  ON public.chat_users 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own chat user record
CREATE POLICY "Users can update their own chat profile" 
  ON public.chat_users 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own chat user record
CREATE POLICY "Users can delete their own chat profile" 
  ON public.chat_users 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
-- Anyone authenticated can view all chat messages
CREATE POLICY "Anyone can view chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Users can only insert messages as themselves
CREATE POLICY "Users can send their own messages" 
  ON public.chat_messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Users can update only their own messages
CREATE POLICY "Users can update their own messages" 
  ON public.chat_messages 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = sender_id);

-- Users can delete only their own messages
CREATE POLICY "Users can delete their own messages" 
  ON public.chat_messages 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX idx_chat_users_username ON public.chat_users(username);
CREATE INDEX idx_chat_users_user_id ON public.chat_users(user_id);
CREATE INDEX idx_chat_users_is_online ON public.chat_users(is_online);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
