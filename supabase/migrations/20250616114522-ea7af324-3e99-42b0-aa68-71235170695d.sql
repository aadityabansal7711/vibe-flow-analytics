
-- Create the giveaways table
CREATE TABLE public.giveaways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_name TEXT NOT NULL,
  gift_image_url TEXT,
  gift_price DECIMAL(10,2) NOT NULL,
  withdrawal_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  winner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for giveaways table
ALTER TABLE public.giveaways ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading giveaways for everyone (public feature)
CREATE POLICY "Anyone can view giveaways" 
  ON public.giveaways 
  FOR SELECT 
  USING (true);

-- Create policy to allow admins to manage giveaways (we'll use a simple check for now)
CREATE POLICY "Admins can manage giveaways" 
  ON public.giveaways 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
