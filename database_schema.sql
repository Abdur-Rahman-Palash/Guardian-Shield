-- Guardian Shield Database Schema
-- PostgreSQL schema for real-world deployment

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  child_name TEXT NOT NULL,
  mac_address TEXT UNIQUE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('laptop', 'smartphone', 'tablet', 'desktop')),
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'restricted')),
  last_seen TIMESTAMP WITH TIME ZONE,
  usage_time INTEGER DEFAULT 0, -- in minutes
  blocked_attempts INTEGER DEFAULT 0,
  alerts_triggered INTEGER DEFAULT 0,
  parental_level TEXT NOT NULL DEFAULT 'moderate' CHECK (parental_level IN ('lenient', 'moderate', 'strict')),
  settings JSONB DEFAULT '{}', -- device-specific settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  is_risky BOOLEAN DEFAULT FALSE,
  category TEXT,
  blocked BOOLEAN DEFAULT FALSE,
  visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER DEFAULT 0, -- in seconds
  screenshot_url TEXT, -- optional screenshot
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('blocked_site', 'unusual_activity', 'time_limit', 'risk_detected')),
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}', -- additional alert data
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily observations table
CREATE TABLE IF NOT EXISTS daily_observations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_usage_time INTEGER DEFAULT 0, -- in minutes
  blocked_sites INTEGER DEFAULT 0,
  alerts_triggered INTEGER DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  top_blocked_categories TEXT[] DEFAULT '{}',
  unusual_activity TEXT[] DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '{
    "adjust_settings": false,
    "conversation_topics": [],
    "time_restrictions": [],
    "new_rules": []
  }',
  ai_insights TEXT, -- AI-generated insights
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(device_id, date) -- One observation per device per day
);

-- Risky domains table
CREATE TABLE IF NOT EXISTS risky_domains (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('adult', 'gambling', 'illegal', 'social', 'gaming', 'other')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  active BOOLEAN DEFAULT TRUE,
  keywords TEXT[], -- keywords that trigger this domain
  description TEXT,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parental settings table
CREATE TABLE IF NOT EXISTS parental_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Content filters table
CREATE TABLE IF NOT EXISTS content_filters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  filter_type TEXT NOT NULL CHECK (filter_type IN ('keyword', 'domain', 'category', 'time_based')),
  filter_config JSONB NOT NULL, -- filter configuration
  active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0, -- higher priority = checked first
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time restrictions table
CREATE TABLE IF NOT EXISTS time_restrictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  allowed BOOLEAN DEFAULT TRUE, -- FALSE = blocked during this time
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (for parents to review)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL, -- report data
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_mac_address ON devices(mac_address);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_device_id ON site_visits(device_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_user_id ON site_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_visit_time ON site_visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_site_visits_blocked ON site_visits(blocked);
CREATE INDEX IF NOT EXISTS idx_alerts_device_id ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_daily_observations_device_id ON daily_observations(device_id);
CREATE INDEX IF NOT EXISTS idx_daily_observations_user_id ON daily_observations(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_observations_date ON daily_observations(date);
CREATE INDEX IF NOT EXISTS idx_risky_domains_domain ON risky_domains(domain);
CREATE INDEX IF NOT EXISTS idx_risky_domains_active ON risky_domains(active);
CREATE INDEX IF NOT EXISTS idx_risky_domains_category ON risky_domains(category);
CREATE INDEX IF NOT EXISTS idx_parental_settings_user_id ON parental_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_content_filters_user_id ON content_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_time_restrictions_device_id ON time_restrictions(device_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own devices" ON devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own devices" ON devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own devices" ON devices FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own site visits" ON site_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own site visits" ON site_visits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily observations" ON daily_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily observations" ON daily_observations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own parental settings" ON parental_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own parental settings" ON parental_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content filters" ON content_filters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own content filters" ON content_filters FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own time restrictions" ON time_restrictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own time restrictions" ON time_restrictions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Risky domains are readable by all authenticated users (read-only)
CREATE POLICY "Authenticated users can view risky domains" ON risky_domains FOR SELECT USING (auth.role() = 'authenticated');

-- Functions for automatic data cleanup and aggregation
CREATE OR REPLACE FUNCTION update_device_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE devices 
  SET last_seen = NEW.visit_time, updated_at = NOW()
  WHERE id = NEW.device_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_device_last_seen
  AFTER INSERT ON site_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_device_last_seen();

-- Function to automatically create daily observations
CREATE OR REPLACE FUNCTION create_daily_observation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_observations (device_id, date, user_id)
  VALUES (NEW.device_id, CURRENT_DATE, NEW.user_id)
  ON CONFLICT (device_id, date) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_daily_observation
  AFTER INSERT ON site_visits
  FOR EACH ROW
  EXECUTE FUNCTION create_daily_observation();

-- Function to update daily observation statistics
CREATE OR REPLACE FUNCTION update_daily_observation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE daily_observations 
  SET 
    total_usage_time = total_usage_time + NEW.duration,
    blocked_sites = blocked_sites + CASE WHEN NEW.blocked THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE device_id = NEW.device_id AND date = CURRENT_DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_observation_stats
  AFTER INSERT ON site_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_observation_stats();

-- Function to create alerts for risky sites
CREATE OR REPLACE FUNCTION create_risky_site_alert()
RETURNS TRIGGER AS $$
DECLARE
  alert_message TEXT;
BEGIN
  IF NEW.is_risky AND NEW.blocked THEN
    alert_message := format('Blocked risky site: %s (%s)', NEW.domain, COALESCE(NEW.category, 'Unknown'));
    
    INSERT INTO alerts (device_id, alert_type, message, severity, user_id)
    VALUES (NEW.device_id, 'blocked_site', alert_message, 'high', NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_risky_site_alert
  AFTER INSERT ON site_visits
  FOR EACH ROW
  EXECUTE FUNCTION create_risky_site_alert();

-- Insert default risky domains
INSERT INTO risky_domains (domain, category, severity, active, keywords) VALUES
  ('pornhub.com', 'adult', 'high', TRUE, ARRAY['porn', 'adult', 'xxx']),
  ('xvideos.com', 'adult', 'high', TRUE, ARRAY['porn', 'adult', 'xxx']),
  ('xnxx.com', 'adult', 'high', TRUE, ARRAY['porn', 'adult', 'xxx']),
  ('bet365.com', 'gambling', 'medium', TRUE, ARRAY['bet', 'gambling', 'casino']),
  ('williamhill.com', 'gambling', 'medium', TRUE, ARRAY['bet', 'gambling', 'casino']),
  ('paddypower.com', 'gambling', 'medium', TRUE, ARRAY['bet', 'gambling', 'casino']),
  ('darkweb.com', 'illegal', 'high', TRUE, ARRAY['dark', 'illegal', 'black']),
  ('illegaldrugs.com', 'illegal', 'high', TRUE, ARRAY['drug', 'illegal', 'narcotic']),
  ('facebook.com', 'social', 'low', TRUE, ARRAY['social', 'facebook']),
  ('instagram.com', 'social', 'low', TRUE, ARRAY['social', 'instagram']),
  ('twitter.com', 'social', 'low', TRUE, ARRAY['social', 'twitter']),
  ('tiktok.com', 'social', 'low', TRUE, ARRAY['social', 'tiktok'])
ON CONFLICT (domain) DO NOTHING;

-- Create default parental settings
INSERT INTO parental_settings (user_id, setting_key, setting_value, description)
SELECT 
  auth.uid(),
  'content_filtering',
  '{"enabled": true, "level": "moderate", "categories": ["adult", "gambling", "illegal"]}',
  'Default content filtering settings'
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email IS NOT NULL)
ON CONFLICT (user_id, setting_key) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE devices IS 'Registered devices for monitoring';
COMMENT ON TABLE site_visits IS 'Record of all website visits';
COMMENT ON TABLE alerts IS 'Alerts and notifications for parents';
COMMENT ON TABLE daily_observations IS 'Daily aggregated statistics and AI insights';
COMMENT ON TABLE risky_domains IS 'Predefined risky domains for content filtering';
COMMENT ON TABLE parental_settings IS 'User-specific parental control settings';
COMMENT ON TABLE content_filters IS 'Custom content filters';
COMMENT ON TABLE time_restrictions IS 'Time-based access restrictions';
COMMENT ON TABLE reports IS 'Generated reports for parents';
