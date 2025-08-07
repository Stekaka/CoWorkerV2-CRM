-- KOMPLETT MIGRATION: Skapa alla tabeller från början
-- Kör detta i Supabase SQL Editor

-- Skapa organizations-tabellen först (om den inte finns)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skapa user_profiles-tabellen (om den inte finns)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_organization UNIQUE (user_id, organization_id)
);

-- Nu kör resten av migration 003
-- Create enum for subscription plans
DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'enterprise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for module names
DO $$ BEGIN
  CREATE TYPE module_name AS ENUM (
    'leads', 'offers', 'notes', 'calendar', 'economy', 'automation', 
    'emails', 'calls', 'quotes', 'analytics', 'integrations'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name module_name NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_per_month INTEGER NOT NULL DEFAULT 0, -- Price in öre (1 kr = 100 öre)
  is_core BOOLEAN DEFAULT FALSE, -- Core modules included in all plans
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name subscription_plan NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  max_users INTEGER NOT NULL,
  price_per_month INTEGER NOT NULL, -- Price in öre
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create organization_subscriptions table
CREATE TABLE IF NOT EXISTS organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  plan subscription_plan NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_users INTEGER DEFAULT 0,
  billing_email TEXT,
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT fk_organization_subscriptions_organization
    FOREIGN KEY (organization_id) 
    REFERENCES organizations (id) 
    ON DELETE CASCADE
);

-- Create organization_modules table (modules purchased by organization)
CREATE TABLE IF NOT EXISTS organization_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  module_name module_name NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT fk_organization_modules_organization
    FOREIGN KEY (organization_id) 
    REFERENCES organizations (id) 
    ON DELETE CASCADE,
    
  CONSTRAINT unique_organization_module
    UNIQUE (organization_id, module_name)
);

-- Create user_module_access table (individual user access to modules)
CREATE TABLE IF NOT EXISTS user_module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  module_name module_name NOT NULL,
  granted_by UUID, -- User who granted this access
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT fk_user_module_access_user
    FOREIGN KEY (user_id) 
    REFERENCES auth.users (id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user_module_access_organization
    FOREIGN KEY (organization_id) 
    REFERENCES organizations (id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user_module_access_granted_by
    FOREIGN KEY (granted_by) 
    REFERENCES auth.users (id) 
    ON DELETE SET NULL,
    
  CONSTRAINT unique_user_organization_module
    UNIQUE (user_id, organization_id, module_name)
);

-- Insert default modules (only if not exists)
INSERT INTO modules (name, display_name, description, price_per_month, is_core) 
SELECT * FROM (VALUES
  ('leads'::module_name, 'Leads & CRM', 'Hantera leads och kundrelationer', 7900, true),
  ('offers'::module_name, 'Offerter', 'Skapa och skicka professionella offerter', 9900, false),
  ('notes'::module_name, 'Anteckningar', 'Centraliserad anteckningshantering', 4900, true),
  ('calendar'::module_name, 'Kalender', 'Schemaläggning och tidsplanering', 6900, true),
  ('economy'::module_name, 'Ekonomi', 'Ekonomisk översikt och rapporter', 14900, false),
  ('automation'::module_name, 'Automation', 'Automatisera arbetsflöden', 29900, false),
  ('emails'::module_name, 'E-post', 'E-postintegrationer och kampanjer', 8900, false),
  ('calls'::module_name, 'Samtal', 'Samtalshantering och loggning', 5900, false),
  ('quotes'::module_name, 'Prislistor', 'Hantera produkter och priser', 7900, false),
  ('analytics'::module_name, 'Analytics', 'Detaljerad affärsanalys', 19900, false),
  ('integrations'::module_name, 'Integrationer', 'Tredjepartsintegrationer', 12900, false)
) AS t(name, display_name, description, price_per_month, is_core)
ON CONFLICT (name) DO NOTHING;

-- Insert default subscription plans (only if not exists)
INSERT INTO subscription_plans (name, display_name, description, max_users, price_per_month) 
SELECT * FROM (VALUES
  ('basic'::subscription_plan, 'Basic', 'Perfekt för små företag och startups', 5, 4900),
  ('premium'::subscription_plan, 'Premium', 'För växande företag med fler behov', 25, 9900),
  ('enterprise'::subscription_plan, 'Enterprise', 'Obegränsade användare och full funktionalitet', -1, 19900)
) AS t(name, display_name, description, max_users, price_per_month)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_access ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM user_profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage profiles in their org" ON user_profiles;
CREATE POLICY "Admins can manage profiles in their org" ON user_profiles
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Modules are public
DROP POLICY IF EXISTS "Modules are viewable by everyone" ON modules;
CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Subscription plans are viewable by everyone" ON subscription_plans;
CREATE POLICY "Subscription plans are viewable by everyone" ON subscription_plans FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON TYPE subscription_plan TO authenticated;
GRANT USAGE ON TYPE module_name TO authenticated;
GRANT SELECT ON modules TO authenticated;
GRANT SELECT ON subscription_plans TO authenticated;
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON organization_subscriptions TO authenticated;
GRANT ALL ON organization_modules TO authenticated;
GRANT ALL ON user_module_access TO authenticated;
