-- SQL för att skapa Oliver som admin på Drönarkompaniet
-- VIKTIGT: Kör migration 003 FÖRST innan du kör detta!
-- Detta script förutsätter att alla tabeller från migration 003 redan finns

-- 1. Skapa organisation "Drönarkompaniet" (om den inte redan finns)
INSERT INTO organizations (name, created_at, updated_at)
VALUES ('Drönarkompaniet', now(), now())
ON CONFLICT (name) DO UPDATE SET updated_at = now();

-- 2. Skapa user profile för Oliver som admin (använd rätt user_id från auth.users)
-- OBS: Du måste ersätta 'OLIVER_USER_ID_FRÅN_AUTH_USERS' med det riktiga UUID:t för oliver@dronarkompaniet.se från auth.users tabellen

-- Först, hitta Oliver's user_id:
-- SELECT id FROM auth.users WHERE email = 'oliver@dronarkompaniet.se';

-- Sedan skapa profilen (ersätt OLIVER_USER_ID med rätt UUID):
INSERT INTO user_profiles (
  user_id, 
  email, 
  organization_id, 
  role, 
  full_name,
  created_at, 
  updated_at
)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'oliver@dronarkompaniet.se'),
  'oliver@dronarkompaniet.se',
  (SELECT id FROM organizations WHERE name = 'Drönarkompaniet'),
  'admin',
  'Oliver Eriksson',
  now(),
  now()
ON CONFLICT (user_id, organization_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = now();

-- 3. Skapa subscription för företaget (Premium plan)
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

-- 4. Lägg till några moduler för företaget
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

-- 5. Ge Oliver access till alla moduler
INSERT INTO user_module_access (
  user_id,
  organization_id,
  module_name,
  granted_by,
  granted_at,
  is_active,
  created_at,
  updated_at
)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'oliver@dronarkompaniet.se'),
  org.id,
  unnest(ARRAY['leads'::module_name, 'offers'::module_name, 'notes'::module_name, 'calendar'::module_name]),
  (SELECT id FROM auth.users WHERE email = 'oliver@dronarkompaniet.se'),
  now(),
  true,
  now(),
  now()
FROM organizations org
WHERE org.name = 'Drönarkompaniet'
ON CONFLICT (user_id, organization_id, module_name) 
DO UPDATE SET 
  is_active = true,
  updated_at = now();

-- Verifiera att allt skapades korrekt:
SELECT 
  u.email,
  up.role,
  up.full_name,
  o.name as organization_name,
  os.plan,
  os.status
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
JOIN organizations o ON up.organization_id = o.id
LEFT JOIN organization_subscriptions os ON o.id = os.organization_id
WHERE u.email = 'oliver@dronarkompaniet.se';
