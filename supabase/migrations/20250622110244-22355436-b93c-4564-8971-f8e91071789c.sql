
-- Add Razorpay-specific columns to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;

-- Add Razorpay customer tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create webhook events table for tracking
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy for webhook events (service role only)
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
FOR ALL
USING (true)
WITH CHECK (true);

-- Update profiles table to include profile picture
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
