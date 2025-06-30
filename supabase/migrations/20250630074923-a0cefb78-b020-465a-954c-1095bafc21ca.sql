
-- Create RLS policy for admins to manage promo codes
CREATE POLICY "Allow admins to insert promo codes" ON public.promo_codes
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Allow admins to update promo codes" ON public.promo_codes
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Allow admins to delete promo codes" ON public.promo_codes
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Allow admins to view all promo codes" ON public.promo_codes
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND (expires_at IS NULL OR expires_at > now())
    )
  );
