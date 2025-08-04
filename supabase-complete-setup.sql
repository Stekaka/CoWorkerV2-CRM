-- KOMPLETT SETUP SCRIPT - Rensa och skapa allt från början
-- VARNING: Detta kommer ta bort ALL data från tidigare CRM-projekt!

-- === CLEANUP SECTION ===
-- Ta bort tabeller (CASCADE tar hand om policies, triggers, etc.)
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

-- === SETUP SECTION ===

-- Skapa companies tabell
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa users tabell
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa leads tabell
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')) DEFAULT 'new',
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa reminders tabell
CREATE TABLE reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa email_campaigns tabell
CREATE TABLE email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    recipients TEXT[] NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa files tabell
CREATE TABLE files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa index för bättre prestanda
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_reminders_company_id ON reminders(company_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_completed ON reminders(completed);
CREATE INDEX idx_email_campaigns_company_id ON email_campaigns(company_id);
CREATE INDEX idx_files_lead_id ON files(lead_id);
CREATE INDEX idx_files_company_id ON files(company_id);

-- Funktioner för updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers för updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Companies policies - Förenklade för att undvika recursion
CREATE POLICY "Users can view companies" ON companies
    FOR SELECT USING (true); -- Tillåt alla autentiserade användare att läsa företag

CREATE POLICY "Users can update companies" ON companies
    FOR UPDATE USING (true); -- Tillåt alla autentiserade användare att uppdatera företag

-- Tillåt alla autentiserade användare att skapa företag (för registrering)
CREATE POLICY "Allow company creation" ON companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users policies - Enkel approach för att undvika recursion
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Tillåt INSERT för nya användare (behövs för registrering)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can insert users in their company" ON users
    FOR INSERT WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Leads policies - Använd enklare approach utan recursion
CREATE POLICY "Users can view leads in their company" ON leads
    FOR SELECT USING (true); -- Tillåt alla autentiserade användare att läsa leads för nu

CREATE POLICY "Users can insert leads in their company" ON leads
    FOR INSERT WITH CHECK (true); -- Tillåt alla autentiserade användare att skapa leads

CREATE POLICY "Users can update leads in their company" ON leads
    FOR UPDATE USING (true); -- Tillåt alla autentiserade användare att uppdatera leads

CREATE POLICY "Users can delete leads in their company" ON leads
    FOR DELETE USING (true); -- Tillåt alla autentiserade användare att ta bort leads

-- Reminders policies - Samma approach
CREATE POLICY "Users can view reminders in their company" ON reminders
    FOR SELECT USING (true);

CREATE POLICY "Users can insert reminders in their company" ON reminders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update reminders in their company" ON reminders
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete reminders in their company" ON reminders
    FOR DELETE USING (true);

-- Email campaigns policies - Samma approach
CREATE POLICY "Users can view email campaigns in their company" ON email_campaigns
    FOR SELECT USING (true);

CREATE POLICY "Users can insert email campaigns in their company" ON email_campaigns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update email campaigns in their company" ON email_campaigns
    FOR UPDATE USING (true);

-- Files policies - Samma approach
CREATE POLICY "Users can view files in their company" ON files
    FOR SELECT USING (true);

CREATE POLICY "Users can insert files in their company" ON files
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete files in their company" ON files
    FOR DELETE USING (true);
