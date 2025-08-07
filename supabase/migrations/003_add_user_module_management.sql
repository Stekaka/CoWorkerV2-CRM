-- Utöka databas för avancerad användar- och modulhantering
-- Denna migration bygger vidare på 002_add_permissions.sql

-- Lägg till fler kolumner för användare
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Lägg till fler kolumner för företag
ALTER TABLE companies ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 5;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS current_users INTEGER DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS billing_email TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'cancelled'));
ALTER TABLE companies ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Skapa tabell för user invitations
CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'manager', 'user', 'viewer')) DEFAULT 'user',
    allowed_modules JSONB DEFAULT '[]',
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa tabell för module usage tracking
CREATE TABLE IF NOT EXISTS module_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    user_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMP WITH TIME ZONE,
    deactivated_at TIMESTAMP WITH TIME ZONE,
    monthly_cost DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, module_id)
);

-- Lägg till indexes för bättre prestanda
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_invited_by ON users(invited_by);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON companies(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON user_invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_invitations_expires_at ON user_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_module_usage_company_module ON module_usage(company_id, module_id);
CREATE INDEX IF NOT EXISTS idx_module_usage_is_active ON module_usage(is_active);

-- Funktion för att uppdatera current_users automatiskt
CREATE OR REPLACE FUNCTION update_company_user_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE companies 
        SET current_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE company_id = NEW.company_id AND status = 'active'
        )
        WHERE id = NEW.company_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Uppdatera för både old och new company om company_id ändras
        IF OLD.company_id != NEW.company_id THEN
            UPDATE companies 
            SET current_users = (
                SELECT COUNT(*) 
                FROM users 
                WHERE company_id = OLD.company_id AND status = 'active'
            )
            WHERE id = OLD.company_id;
        END IF;
        
        UPDATE companies 
        SET current_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE company_id = NEW.company_id AND status = 'active'
        )
        WHERE id = NEW.company_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE companies 
        SET current_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE company_id = OLD.company_id AND status = 'active'
        )
        WHERE id = OLD.company_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Skapa triggers för att automatiskt uppdatera användarantal
DROP TRIGGER IF EXISTS trigger_update_company_user_count ON users;
CREATE TRIGGER trigger_update_company_user_count
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION update_company_user_count();

-- RLS policies för nya tabeller
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_usage ENABLE ROW LEVEL SECURITY;

-- User invitations policies
CREATE POLICY "Users can view invitations in their company" ON user_invitations
    FOR SELECT USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage invitations in their company" ON user_invitations
    FOR ALL USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Module usage policies
CREATE POLICY "Users can view module usage in their company" ON module_usage
    FOR SELECT USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage module usage in their company" ON module_usage
    FOR ALL USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Uppdatera befintliga företag med korrekt användarantal
UPDATE companies 
SET current_users = (
    SELECT COUNT(*) 
    FROM users 
    WHERE users.company_id = companies.id
);

-- Sätt max_users baserat på plan
UPDATE companies 
SET max_users = CASE 
    WHEN plan = 'basic' THEN 5
    WHEN plan = 'premium' THEN 25
    WHEN plan = 'enterprise' THEN -1
    ELSE 5
END;

-- Skapa initial module usage records för befintliga företag
INSERT INTO module_usage (company_id, module_id, user_count, is_active, activated_at, monthly_cost)
SELECT 
    c.id as company_id,
    module_name,
    c.current_users,
    CASE 
        WHEN c.enabled_modules ? module_name THEN true
        WHEN module_name IN ('leads', 'notes', 'tasks', 'settings') THEN true -- Base modules
        ELSE false
    END as is_active,
    c.created_at as activated_at,
    CASE 
        WHEN c.enabled_modules ? module_name OR module_name IN ('leads', 'notes', 'tasks', 'settings') THEN
            CASE module_name
                WHEN 'offers' THEN 99.00
                WHEN 'campaigns' THEN 149.00
                WHEN 'economy' THEN 199.00
                WHEN 'analytics' THEN 129.00
                WHEN 'calendar' THEN 79.00
                WHEN 'contacts' THEN 299.00
                WHEN 'files' THEN 99.00
                ELSE 0.00
            END
        ELSE 0.00
    END as monthly_cost
FROM companies c
CROSS JOIN (
    SELECT unnest(ARRAY['leads', 'notes', 'offers', 'analytics', 'tasks', 'economy', 'campaigns', 'files', 'calendar', 'contacts', 'settings']) as module_name
) modules
WHERE NOT EXISTS (
    SELECT 1 FROM module_usage mu 
    WHERE mu.company_id = c.id AND mu.module_id = modules.module_name
);
