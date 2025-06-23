
-- Create tables only if they don't exist
DO $$
BEGIN
    -- Create user roles table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        CREATE TABLE public.user_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL DEFAULT 'user',
            granted_by UUID REFERENCES auth.users(id),
            granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            expires_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Create chat users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_users') THEN
        CREATE TABLE public.chat_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            username TEXT NOT NULL UNIQUE,
            display_name TEXT NOT NULL,
            avatar_url TEXT,
            bio TEXT,
            favorite_genres TEXT[],
            is_online BOOLEAN NOT NULL DEFAULT false,
            last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Create friend requests table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'friend_requests') THEN
        CREATE TABLE public.friend_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sender_id UUID NOT NULL,
            receiver_id UUID NOT NULL,
            sender_username TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Create friend connections table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'friend_connections') THEN
        CREATE TABLE public.friend_connections (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            friend_id UUID NOT NULL,
            status TEXT NOT NULL DEFAULT 'accepted',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Create chat messages table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_messages') THEN
        CREATE TABLE public.chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sender_id UUID NOT NULL,
            sender_username TEXT NOT NULL,
            sender_display_name TEXT,
            message TEXT NOT NULL,
            message_type TEXT DEFAULT 'text',
            metadata JSONB,
            is_flagged BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Create flagged content table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'flagged_content') THEN
        CREATE TABLE public.flagged_content (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content_type TEXT NOT NULL,
            content TEXT NOT NULL,
            reason TEXT NOT NULL,
            reported_by UUID,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;

    -- Enable RLS on tables
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.custom_pricing ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Drop and recreate user_roles policies
    DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
    
    CREATE POLICY "Admins can view all user roles" ON public.user_roles
        FOR SELECT USING (public.is_admin());
    
    CREATE POLICY "Admins can manage user roles" ON public.user_roles
        FOR ALL USING (public.is_admin());

    -- Drop and recreate custom_pricing policies
    DROP POLICY IF EXISTS "Admins can manage custom pricing" ON public.custom_pricing;
    
    CREATE POLICY "Admins can manage custom pricing" ON public.custom_pricing
        FOR ALL USING (public.is_admin());

    -- Drop and recreate user_activity policies
    DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
    DROP POLICY IF EXISTS "System can insert user activity" ON public.user_activity;
    
    CREATE POLICY "Users can view their own activity" ON public.user_activity
        FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    
    CREATE POLICY "System can insert user activity" ON public.user_activity
        FOR INSERT WITH CHECK (true);

    -- Chat users policies
    DROP POLICY IF EXISTS "Users can view chat users" ON public.chat_users;
    DROP POLICY IF EXISTS "Users can update their own chat profile" ON public.chat_users;
    DROP POLICY IF EXISTS "Users can create their chat profile" ON public.chat_users;
    
    CREATE POLICY "Users can view chat users" ON public.chat_users
        FOR SELECT USING (true);
    
    CREATE POLICY "Users can update their own chat profile" ON public.chat_users
        FOR UPDATE USING (user_id = auth.uid());
    
    CREATE POLICY "Users can create their chat profile" ON public.chat_users
        FOR INSERT WITH CHECK (user_id = auth.uid());

    -- Friend requests policies
    DROP POLICY IF EXISTS "Users can view their friend requests" ON public.friend_requests;
    DROP POLICY IF EXISTS "Users can send friend requests" ON public.friend_requests;
    DROP POLICY IF EXISTS "Users can update their friend requests" ON public.friend_requests;
    
    CREATE POLICY "Users can view their friend requests" ON public.friend_requests
        FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
    
    CREATE POLICY "Users can send friend requests" ON public.friend_requests
        FOR INSERT WITH CHECK (sender_id = auth.uid());
    
    CREATE POLICY "Users can update their friend requests" ON public.friend_requests
        FOR UPDATE USING (receiver_id = auth.uid());

    -- Friend connections policies
    DROP POLICY IF EXISTS "Users can view their connections" ON public.friend_connections;
    DROP POLICY IF EXISTS "Users can create connections" ON public.friend_connections;
    
    CREATE POLICY "Users can view their connections" ON public.friend_connections
        FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());
    
    CREATE POLICY "Users can create connections" ON public.friend_connections
        FOR INSERT WITH CHECK (user_id = auth.uid());

    -- Chat messages policies  
    DROP POLICY IF EXISTS "Users can view chat messages" ON public.chat_messages;
    DROP POLICY IF EXISTS "Users can send chat messages" ON public.chat_messages;
    
    CREATE POLICY "Users can view chat messages" ON public.chat_messages
        FOR SELECT USING (true);
    
    CREATE POLICY "Users can send chat messages" ON public.chat_messages
        FOR INSERT WITH CHECK (sender_id = auth.uid());

    -- Flagged content policies
    DROP POLICY IF EXISTS "Users can view flagged content" ON public.flagged_content;
    DROP POLICY IF EXISTS "Users can report content" ON public.flagged_content;
    
    CREATE POLICY "Users can view flagged content" ON public.flagged_content
        FOR SELECT USING (public.is_admin() OR reported_by = auth.uid());
    
    CREATE POLICY "Users can report content" ON public.flagged_content
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_chat_users_user_id ON public.chat_users(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_users_username ON public.chat_users(username);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON public.friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON public.friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_user ON public.friend_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_friend ON public.friend_connections(friend_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_pricing_user_id ON public.custom_pricing(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_pricing_email ON public.custom_pricing(email);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);
