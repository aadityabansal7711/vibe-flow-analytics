
-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the admin user (you'll need to update the password through the admin interface)
INSERT INTO public.admin_users (email, password_hash, full_name) 
VALUES ('aadityabansal1112@gmail.com', 'temp_hash', 'Aaditya Bansal');

-- Create user_management table for admin to control user access
CREATE TABLE public.user_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  premium_access BOOLEAN DEFAULT FALSE,
  notes TEXT,
  managed_by_admin UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_requests table for contact us functionality
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users (only admins can access)
CREATE POLICY "Admin users can view admin_users" 
ON public.admin_users FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policies for user_management (only admins can manage)
CREATE POLICY "Admin can manage all users" 
ON public.user_management FOR ALL 
USING (true);

-- Create policies for contact_requests (anyone can insert, admins can view)
CREATE POLICY "Anyone can submit contact requests" 
ON public.contact_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can view contact requests" 
ON public.contact_requests FOR SELECT 
USING (true);

-- Create function to sync user profiles with user_management
CREATE OR REPLACE FUNCTION public.sync_user_management()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_management (user_id, email, premium_access)
  VALUES (NEW.user_id, NEW.email, NEW.has_active_subscription)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    email = EXCLUDED.email,
    premium_access = EXCLUDED.premium_access,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync profiles with user_management
CREATE TRIGGER sync_user_management_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_management();
