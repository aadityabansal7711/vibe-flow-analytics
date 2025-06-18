
-- Create promo_codes table for admin management
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for promo codes (admin only)
CREATE POLICY "Allow public to read active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = true AND expires_at > now());

-- Update giveaways table to include winner details
ALTER TABLE public.giveaways 
ADD COLUMN IF NOT EXISTS winner_name TEXT,
ADD COLUMN IF NOT EXISTS winner_email TEXT;

-- Create function to validate promo codes
CREATE OR REPLACE FUNCTION validate_promo_code(promo_code TEXT)
RETURNS TABLE(
  valid BOOLEAN,
  discount_percentage INTEGER,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Check if code exists and is active
  SELECT * INTO code_record
  FROM promo_codes 
  WHERE code = promo_code 
    AND is_active = true 
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Invalid or expired promo code'::TEXT;
    RETURN;
  END IF;
  
  -- Check if code has remaining uses
  IF code_record.current_uses >= code_record.max_uses THEN
    RETURN QUERY SELECT false, 0, 'Promo code usage limit reached'::TEXT;
    RETURN;
  END IF;
  
  -- Valid code
  RETURN QUERY SELECT true, code_record.discount_percentage, 'Valid promo code'::TEXT;
END;
$$;

-- Create function to use promo code
CREATE OR REPLACE FUNCTION use_promo_code(promo_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE promo_codes 
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE code = promo_code 
    AND is_active = true 
    AND expires_at > now()
    AND current_uses < max_uses;
  
  RETURN FOUND;
END;
$$;
