-- Fix för cirkulär RLS policy på users-tabellen
-- Detta bör köras i Supabase SQL Editor

-- Ta bort ALLA befintliga policies för users-tabellen
DROP POLICY IF EXISTS "Users can view users in their company" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users in their company" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;

-- Ta bort ALLA befintliga policies för companies-tabellen
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Admins can update their company" ON companies;
DROP POLICY IF EXISTS "Allow company read" ON companies;
DROP POLICY IF EXISTS "Allow company creation" ON companies;

-- Skapa nya, enkla policies som inte är cirkulära
-- För users-tabellen
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Allow user creation" ON users
    FOR INSERT WITH CHECK (true);

-- För companies-tabellen
CREATE POLICY "Allow company read" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Allow company creation" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow company update" ON companies
    FOR UPDATE USING (true);
