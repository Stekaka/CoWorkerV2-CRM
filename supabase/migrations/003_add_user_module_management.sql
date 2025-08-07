-- Migration: Add User and Module Management System
-- Description: Creates complete enterprise user and module management system with Fortnox-inspired pricing

-- Create enum for subscription plans
CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'enterprise');

-- Create enum for module names
CREATE TYPE module_name AS ENUM (
  'leads', 'offers', 'notes', 'calendar', 'economy', 'automation', 
  'emails', 'calls', 'quotes', 'analytics', 'integrations'
);

-- Create modules table
CREATE TABLE modules (
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
CREATE TABLE subscription_plans (
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
CREATE TABLE organization_subscriptions (
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
CREATE TABLE organization_modules (
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
CREATE TABLE user_module_access (
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

-- Create user_invitations table
CREATE TABLE user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  organization_id UUID NOT NULL,
  invited_by UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  modules module_name[] DEFAULT '{}', -- Array of module names
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, expired, cancelled
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT fk_user_invitations_organization
    FOREIGN KEY (organization_id) 
    REFERENCES organizations (id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user_invitations_invited_by
    FOREIGN KEY (invited_by) 
    REFERENCES auth.users (id) 
    ON DELETE CASCADE
);

-- Create module_usage_tracking table
CREATE TABLE module_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  module_name module_name NOT NULL,
  action TEXT NOT NULL, -- 'access', 'create', 'update', 'delete', etc.
  metadata JSONB DEFAULT '{}',
  tracked_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT fk_module_usage_tracking_user
    FOREIGN KEY (user_id) 
    REFERENCES auth.users (id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_module_usage_tracking_organization
    FOREIGN KEY (organization_id) 
    REFERENCES organizations (id) 
    ON DELETE CASCADE
);

-- Insert default modules
INSERT INTO modules (name, display_name, description, price_per_month, is_core) VALUES
  ('leads', 'Leads & CRM', 'Hantera leads och kundrelationer', 7900, true),
  ('offers', 'Offerter', 'Skapa och skicka professionella offerter', 9900, false),
  ('notes', 'Anteckningar', 'Centraliserad anteckningshantering', 4900, true),
  ('calendar', 'Kalender', 'Schemaläggning och tidsplanering', 6900, true),
  ('economy', 'Ekonomi', 'Ekonomisk översikt och rapporter', 14900, false),
  ('automation', 'Automation', 'Automatisera arbetsflöden', 29900, false),
  ('emails', 'E-post', 'E-postintegrationer och kampanjer', 8900, false),
  ('calls', 'Samtal', 'Samtalshantering och loggning', 5900, false),
  ('quotes', 'Prislistor', 'Hantera produkter och priser', 7900, false),
  ('analytics', 'Analytics', 'Detaljerad affärsanalys', 19900, false),
  ('integrations', 'Integrationer', 'Tredjepartsintegrationer', 12900, false);

-- Insert default subscription plans (Fortnox-inspired pricing)
INSERT INTO subscription_plans (name, display_name, description, max_users, price_per_month) VALUES
  ('basic', 'Basic', 'Perfekt för små företag och startups', 5, 4900),    -- 49 kr/month
  ('premium', 'Premium', 'För växande företag med fler behov', 25, 9900), -- 99 kr/month  
  ('enterprise', 'Enterprise', 'Obegränsade användare och full funktionalitet', -1, 19900); -- 199 kr/month

-- Create indexes for performance
CREATE INDEX idx_organization_subscriptions_organization_id ON organization_subscriptions (organization_id);
CREATE INDEX idx_organization_modules_organization_id ON organization_modules (organization_id);
CREATE INDEX idx_organization_modules_module_name ON organization_modules (module_name);
CREATE INDEX idx_user_module_access_user_id ON user_module_access (user_id);
CREATE INDEX idx_user_module_access_organization_id ON user_module_access (organization_id);
CREATE INDEX idx_user_module_access_module_name ON user_module_access (module_name);
CREATE INDEX idx_user_invitations_organization_id ON user_invitations (organization_id);
CREATE INDEX idx_user_invitations_email ON user_invitations (email);
CREATE INDEX idx_user_invitations_token ON user_invitations (invitation_token);
CREATE INDEX idx_module_usage_tracking_user_id ON module_usage_tracking (user_id);
CREATE INDEX idx_module_usage_tracking_organization_id ON module_usage_tracking (organization_id);
CREATE INDEX idx_module_usage_tracking_module_name ON module_usage_tracking (module_name);
CREATE INDEX idx_module_usage_tracking_tracked_at ON module_usage_tracking (tracked_at);

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Modules and subscription_plans are public read-only
CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);
CREATE POLICY "Subscription plans are viewable by everyone" ON subscription_plans FOR SELECT USING (true);

-- Organization subscriptions - only organization members can view
CREATE POLICY "Organization subscriptions viewable by organization members" ON organization_subscriptions
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Organization modules - only organization members can view/manage
CREATE POLICY "Organization modules viewable by organization members" ON organization_modules
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization modules manageable by admins" ON organization_modules
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- User module access - users can view their own, admins can manage all in org
CREATE POLICY "Users can view their own module access" ON user_module_access
  FOR SELECT USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admins can manage user module access" ON user_module_access
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- User invitations - organization members can view, admins can manage
CREATE POLICY "Organization members can view invitations" ON user_invitations
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage invitations" ON user_invitations
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admins can update invitations" ON user_invitations
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Module usage tracking - users can create their own, organization can view
CREATE POLICY "Users can track their own module usage" ON module_usage_tracking
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Organization members can view usage tracking" ON module_usage_tracking
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create functions for common operations

-- Function to check if user has access to a module
CREATE OR REPLACE FUNCTION user_has_module_access(
  p_user_id UUID,
  p_organization_id UUID,
  p_module_name module_name
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has direct access to the module
  RETURN EXISTS (
    SELECT 1 FROM user_module_access uma
    WHERE uma.user_id = p_user_id
      AND uma.organization_id = p_organization_id
      AND uma.module_name = p_module_name
      AND uma.is_active = true
      AND (uma.expires_at IS NULL OR uma.expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's module permissions
CREATE OR REPLACE FUNCTION get_user_module_permissions(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS TABLE (
  module_name module_name,
  has_access BOOLEAN,
  granted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.name::module_name,
    COALESCE(uma.is_active, false) AND (uma.expires_at IS NULL OR uma.expires_at > now()) as has_access,
    uma.granted_at,
    uma.expires_at
  FROM modules m
  LEFT JOIN user_module_access uma ON (
    uma.user_id = p_user_id 
    AND uma.organization_id = p_organization_id 
    AND uma.module_name = m.name
  )
  ORDER BY m.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invite user to organization
CREATE OR REPLACE FUNCTION invite_user_to_organization(
  p_email TEXT,
  p_organization_id UUID,
  p_role TEXT DEFAULT 'user',
  p_modules module_name[] DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  invitation_id UUID;
  invitation_token TEXT;
BEGIN
  -- Generate unique invitation token
  invitation_token := encode(gen_random_bytes(32), 'hex');
  
  -- Create invitation
  INSERT INTO user_invitations (
    email, organization_id, invited_by, role, modules, invitation_token
  ) VALUES (
    p_email, p_organization_id, auth.uid(), p_role, p_modules, invitation_token
  ) RETURNING id INTO invitation_id;
  
  RETURN invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(
  p_invitation_token TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  invitation_record RECORD;
  profile_id UUID;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM user_invitations 
  WHERE invitation_token = p_invitation_token
    AND status = 'pending'
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Create user profile if it doesn't exist
  INSERT INTO user_profiles (
    user_id, email, organization_id, role
  ) VALUES (
    auth.uid(), 
    invitation_record.email, 
    invitation_record.organization_id, 
    invitation_record.role
  ) ON CONFLICT (user_id, organization_id) DO UPDATE SET
    role = invitation_record.role,
    updated_at = now()
  RETURNING id INTO profile_id;
  
  -- Grant module access
  IF array_length(invitation_record.modules, 1) > 0 THEN
    INSERT INTO user_module_access (
      user_id, organization_id, module_name, granted_by
    )
    SELECT 
      auth.uid(),
      invitation_record.organization_id,
      unnest(invitation_record.modules),
      invitation_record.invited_by
    ON CONFLICT (user_id, organization_id, module_name) DO UPDATE SET
      is_active = true,
      granted_by = invitation_record.invited_by,
      granted_at = now(),
      updated_at = now();
  END IF;
  
  -- Mark invitation as accepted
  UPDATE user_invitations 
  SET status = 'accepted', accepted_at = now(), updated_at = now()
  WHERE id = invitation_record.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track module usage
CREATE OR REPLACE FUNCTION track_module_usage(
  p_module_name module_name,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS void AS $$
DECLARE
  user_org_id UUID;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO user_org_id
  FROM user_profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  IF user_org_id IS NOT NULL THEN
    INSERT INTO module_usage_tracking (
      user_id, organization_id, module_name, action, metadata
    ) VALUES (
      auth.uid(), user_org_id, p_module_name, p_action, p_metadata
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_subscriptions_updated_at BEFORE UPDATE ON organization_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_modules_updated_at BEFORE UPDATE ON organization_modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_module_access_updated_at BEFORE UPDATE ON user_module_access 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE ON user_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON TYPE subscription_plan TO authenticated;
GRANT USAGE ON TYPE module_name TO authenticated;
GRANT SELECT ON modules TO authenticated;
GRANT SELECT ON subscription_plans TO authenticated;
GRANT ALL ON organization_subscriptions TO authenticated;
GRANT ALL ON organization_modules TO authenticated;
GRANT ALL ON user_module_access TO authenticated;
GRANT ALL ON user_invitations TO authenticated;
GRANT ALL ON module_usage_tracking TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION user_has_module_access TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_module_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION invite_user_to_organization TO authenticated;
GRANT EXECUTE ON FUNCTION accept_invitation TO authenticated;
GRANT EXECUTE ON FUNCTION track_module_usage TO authenticated;
