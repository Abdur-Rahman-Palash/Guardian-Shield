-- Guardian Shield Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  children TEXT[] DEFAULT '{}',
  guardian_phone TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'family', 'school')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create risky_sites table
CREATE TABLE IF NOT EXISTS risky_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('porn', 'gambling', 'other')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  child_name TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  screenshot TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  guardian_phone TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_risky_sites_domain ON risky_sites(domain);
CREATE INDEX IF NOT EXISTS idx_risky_sites_active ON risky_sites(active);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_domain ON alerts(domain);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risky_sites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can only update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can insert their own data (for registration)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for alerts table
-- Users can only view alerts for their children
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert alerts for their children
CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own alerts
CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts" ON alerts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for risky_sites table
-- Everyone can view active risky sites (for filtering)
CREATE POLICY "Anyone can view active risky sites" ON risky_sites
  FOR SELECT USING (active = true);

-- Only authenticated users can insert risky sites
CREATE POLICY "Authenticated users can insert risky sites" ON risky_sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update risky sites
CREATE POLICY "Authenticated users can update risky sites" ON risky_sites
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete risky sites
CREATE POLICY "Authenticated users can delete risky sites" ON risky_sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risky_sites_updated_at BEFORE UPDATE ON risky_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample risky sites (optional)
INSERT INTO risky_sites (domain, category, active) VALUES
('pornhub.com', 'porn', true),
('xvideos.com', 'porn', true),
('bet365.com', 'gambling', true),
('pokerstars.com', 'gambling', true),
('adultsite.com', 'other', true)
ON CONFLICT (domain) DO NOTHING;
