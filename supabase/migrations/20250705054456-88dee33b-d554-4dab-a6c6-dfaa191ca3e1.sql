-- Add missing columns to giveaways table
ALTER TABLE public.giveaways 
ADD COLUMN IF NOT EXISTS result_announcement_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS giveaway_description TEXT,
ADD COLUMN IF NOT EXISTS entry_requirements TEXT DEFAULT 'Active Premium Subscription';

-- Fix RLS for promo_codes table to allow admin access
DROP POLICY IF EXISTS "Admin can manage promo codes" ON public.promo_codes;
CREATE POLICY "Admin can manage promo codes" 
ON public.promo_codes 
FOR ALL 
USING (true)
WITH CHECK (true);