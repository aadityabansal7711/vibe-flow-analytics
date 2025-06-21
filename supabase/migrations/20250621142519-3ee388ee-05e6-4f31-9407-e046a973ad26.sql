
-- Add missing fields to chat_messages table
ALTER TABLE public.chat_messages 
ADD COLUMN sender_display_name TEXT,
ADD COLUMN message_type TEXT DEFAULT 'text',
ADD COLUMN is_flagged BOOLEAN DEFAULT false,
ADD COLUMN metadata JSONB;

-- Update existing records to have the new fields
UPDATE public.chat_messages 
SET sender_display_name = sender_username,
    message_type = 'text',
    is_flagged = false
WHERE sender_display_name IS NULL;

-- Add missing fields to chat_users table  
ALTER TABLE public.chat_users
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN favorite_genres TEXT[];

-- Create friend_requests table
CREATE TABLE public.friend_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create friend_connections table
CREATE TABLE public.friend_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'accepted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create flagged_content table
CREATE TABLE public.flagged_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  content_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for friend_requests
CREATE POLICY "Users can view their own friend requests" 
  ON public.friend_requests 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friend requests" 
  ON public.friend_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own friend requests" 
  ON public.friend_requests 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = receiver_id);

-- RLS policies for friend_connections
CREATE POLICY "Users can view their own friend connections" 
  ON public.friend_connections 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend connections" 
  ON public.friend_connections 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for flagged_content
CREATE POLICY "Users can view flagged content they reported" 
  ON public.flagged_content 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = reported_by);

CREATE POLICY "Users can flag content" 
  ON public.flagged_content 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);
