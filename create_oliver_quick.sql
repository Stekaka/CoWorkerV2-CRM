-- Quick setup för Oliver admin (utan Docker/Supabase CLI)
-- VARNING: Detta förutsätter att migration 003 redan är körbar i produktionsdatabasen

-- 1. Skapa organisation "Drönarkompaniet"
INSERT INTO organizations (name, created_at, updated_at)
VALUES ('Drönarkompaniet', now(), now())
ON CONFLICT (name) DO UPDATE SET updated_at = now();

-- 2. Skapa user profile för Oliver
-- OBS: Vi använder ett dummy user_id som sedan måste uppdateras med riktigt auth.user ID
INSERT INTO user_profiles (
  user_id, 
  email, 
  organization_id, 
  role, 
  full_name,
  created_at, 
  updated_at
)
VALUES (
  'TEMP_OLIVER_ID_REPLACE_ME', -- Detta måste ersättas med riktigt user_id från auth.users
  'oliver@dronarkompaniet.se',
  (SELECT id FROM organizations WHERE name = 'Drönarkompaniet'),
  'admin',
  'Oliver Eriksson',
  now(),
  now()
)
ON CONFLICT (user_id, organization_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = now();

-- 3. Skapa subscription för företaget
INSERT INTO organization_subscriptions (
  organization_id,
  plan,
  status,
  current_users,
  created_at,
  updated_at
)
SELECT 
  (SELECT id FROM organizations WHERE name = 'Drönarkompaniet'),
  'premium'::subscription_plan,
  'active',
  1,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM organization_subscriptions 
  WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Drönarkompaniet')
);

-- 4. Lägg till moduler för företaget
INSERT INTO organization_modules (
  organization_id,
  module_name,
  is_enabled,
  purchased_at,
  created_at,
  updated_at
)
SELECT 
  org.id,
  unnest(ARRAY['leads'::module_name, 'offers'::module_name, 'notes'::module_name, 'calendar'::module_name]),
  true,
  now(),
  now(),
  now()
FROM organizations org
WHERE org.name = 'Drönarkompaniet'
ON CONFLICT (organization_id, module_name) 
DO UPDATE SET 
  is_enabled = true,
  updated_at = now();

-- Verifiera organisationer och profiler:
SELECT 
  o.name as organization_name,
  up.email,
  up.role,
  up.full_name
FROM organizations o
LEFT JOIN user_profiles up ON o.id = up.organization_id
WHERE o.name = 'Drönarkompaniet';
