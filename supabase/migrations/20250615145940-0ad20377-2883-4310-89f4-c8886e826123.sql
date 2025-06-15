
-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop conflicting or old insert policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create the proper insert policy for normal users
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
