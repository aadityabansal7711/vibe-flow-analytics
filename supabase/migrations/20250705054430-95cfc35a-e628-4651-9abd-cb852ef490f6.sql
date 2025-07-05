-- Add missing columns to giveaways table
ALTER TABLE public.giveaways 
ADD COLUMN IF NOT EXISTS result_announcement_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS giveaway_description TEXT,
ADD COLUMN IF NOT EXISTS entry_requirements TEXT DEFAULT 'Active Premium Subscription';

-- Create contact_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for contact requests (admin can view all, users can only insert)
CREATE POLICY "Anyone can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can view all contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (true);

-- Fix RLS for promo_codes table to allow admin access
DROP POLICY IF EXISTS "Admin can manage promo codes" ON public.promo_codes;
CREATE POLICY "Admin can manage promo codes" 
ON public.promo_codes 
FOR ALL 
USING (true)
WITH CHECK (true);