-- CLEANUP SCRIPT - Kör detta FÖRST för att rensa gamla tabeller
-- VARNING: Detta kommer ta bort ALL data från tidigare CRM-projekt!

-- Ta bort RLS policies först
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Admins can update their company" ON companies;
DROP POLICY IF EXISTS "Users can view users in their company" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users in their company" ON users;
DROP POLICY IF EXISTS "Users can view leads in their company" ON leads;
DROP POLICY IF EXISTS "Users can insert leads in their company" ON leads;
DROP POLICY IF EXISTS "Users can update leads in their company" ON leads;
DROP POLICY IF EXISTS "Users can delete leads in their company" ON leads;
DROP POLICY IF EXISTS "Users can view reminders in their company" ON reminders;
DROP POLICY IF EXISTS "Users can insert reminders in their company" ON reminders;
DROP POLICY IF EXISTS "Users can update reminders in their company" ON reminders;
DROP POLICY IF EXISTS "Users can delete reminders in their company" ON reminders;
DROP POLICY IF EXISTS "Users can view email campaigns in their company" ON email_campaigns;
DROP POLICY IF EXISTS "Users can insert email campaigns in their company" ON email_campaigns;
DROP POLICY IF EXISTS "Users can update email campaigns in their company" ON email_campaigns;
DROP POLICY IF EXISTS "Users can view files in their company" ON files;
DROP POLICY IF EXISTS "Users can insert files in their company" ON files;
DROP POLICY IF EXISTS "Users can delete files in their company" ON files;

-- Ta bort triggers
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
DROP TRIGGER IF EXISTS update_email_campaigns_updated_at ON email_campaigns;

-- Ta bort tabeller (i rätt ordning pga foreign keys)
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Ta bort funktioner
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Ta bort gamla tabeller från tidigare projekt om de finns
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS notes CASCADE;

COMMIT;
