-- Add permissions columns to existing tables
-- This migration adds support for module-based access control

-- Add permissions column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- Add enabled_modules column to companies table  
ALTER TABLE companies ADD COLUMN IF NOT EXISTS enabled_modules JSONB DEFAULT '[]';

-- Add plan column to companies table (for subscription-based permissions)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'premium', 'enterprise'));

-- Create indexes for better performance on permission queries
CREATE INDEX IF NOT EXISTS idx_users_permissions ON users USING GIN(permissions);
CREATE INDEX IF NOT EXISTS idx_companies_enabled_modules ON companies USING GIN(enabled_modules);
CREATE INDEX IF NOT EXISTS idx_companies_plan ON companies(plan);

-- Insert example permissions data for testing
-- Update existing companies to have basic permissions
UPDATE companies 
SET enabled_modules = '["leads", "notes", "tasks"]'::jsonb,
    plan = 'basic'
WHERE enabled_modules = '[]'::jsonb OR enabled_modules IS NULL;

-- Example: Set admin permissions for admin users
UPDATE users 
SET permissions = '{
  "modules": ["leads", "notes", "offers", "tasks", "analytics", "settings"],
  "features": {
    "leads": ["view", "create", "edit", "delete", "export"],
    "notes": ["view", "create", "edit", "delete"],
    "offers": ["view", "create", "edit", "send", "delete"],
    "tasks": ["view", "create", "edit", "delete"],
    "analytics": ["view", "export"],
    "settings": ["view", "edit"]
  },
  "role": "admin"
}'::jsonb
WHERE role = 'admin';

-- Example: Set regular user permissions
UPDATE users 
SET permissions = '{
  "modules": ["leads", "notes", "tasks"],
  "features": {
    "leads": ["view", "create", "edit"],
    "notes": ["view", "create", "edit"],
    "tasks": ["view", "create", "edit"]
  },
  "role": "user"
}'::jsonb
WHERE role = 'user' AND (permissions = '{}'::jsonb OR permissions IS NULL);
