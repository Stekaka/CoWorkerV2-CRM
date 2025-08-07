// Lägg till i din befintliga user/company databas

-- Exempel på user permissions (individuell nivå)
ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';

-- Exempel på company permissions (företagsnivå)  
ALTER TABLE companies ADD COLUMN enabled_modules JSONB DEFAULT '[]';

-- Exempel data:
/*
User permissions (överrides company):
{
  "modules": ["leads", "notes", "offers", "analytics"],
  "features": {
    "leads": ["create", "edit", "delete", "export"],
    "offers": ["create", "edit", "send"],
    "analytics": ["view", "export"]
  },
  "role": "admin" | "user" | "viewer"
}

Company permissions (bas för alla användare):
{
  "enabled_modules": ["leads", "notes", "offers"],
  "plan": "premium" | "basic" | "enterprise"
}
*/
