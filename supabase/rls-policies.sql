-- Row Level Security Policies for Guardian Shield
-- These policies ensure user data isolation and security

-- Drop existing policies if they exist (for updates)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can insert own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can delete own alerts" ON alerts;
DROP POLICY IF EXISTS "Anyone can view active risky sites" ON risky_sites;
DROP POLICY IF EXISTS "Authenticated users can insert risky sites" ON risky_sites;
DROP POLICY IF EXISTS "Authenticated users can update risky sites" ON risky_sites;
DROP POLICY IF EXISTS "Authenticated users can delete risky sites" ON risky_sites;

-- Users Table Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Alerts Table Policies
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own alerts" ON alerts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Risky Sites Table Policies
CREATE POLICY "Anyone can view active risky sites" ON risky_sites
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can insert risky sites" ON risky_sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update risky sites" ON risky_sites
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete risky sites" ON risky_sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- Additional Security Policies for Admin Functions
-- These policies allow service role key to bypass RLS for admin operations

-- Create a function to check if user is admin (optional)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role or specific metadata
  RETURN auth.jwt() ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies (if needed for admin dashboard)
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all alerts" ON alerts
  FOR SELECT USING (is_admin());
