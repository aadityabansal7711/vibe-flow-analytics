
-- Add RLS policy for profiles table to allow users to view and update their own profile
CREATE POLICY "Allow users to view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Ensure admin_users table has the correct admin user
INSERT INTO admin_users (email, password_hash, full_name, is_active) 
VALUES ('aadityabansal1112@gmail.com', 'Hyundai1$', 'Admin User', true)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;
