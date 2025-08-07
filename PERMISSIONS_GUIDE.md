# Modulbaserad Accesskontroll - Implementation Guide

## 🎯 Översikt
Denna lösning ger dig modulbaserad accesskontroll utan att störa din befintliga kod. All nuvarande funktionalitet bevaras 100%.

## 📊 Datamodell

### User Permissions (individuell nivå)
```sql
-- Lägg till i users tabellen
ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '{}';

-- Exempel data:
UPDATE users SET permissions = '{
  "modules": ["leads", "notes", "offers"],
  "features": {
    "leads": ["view", "create", "edit"],
    "offers": ["view", "create", "send"]
  },
  "role": "user"
}' WHERE id = 'user_id';
```

### Company Permissions (företagsnivå)
```sql
-- Lägg till i companies tabellen  
ALTER TABLE companies ADD COLUMN enabled_modules JSONB DEFAULT '[]';

-- Exempel data:
UPDATE companies SET enabled_modules = '["leads", "notes", "offers", "analytics"]' 
WHERE id = 'company_id';
```

## 🚀 Steg-för-steg Implementation

### 1. Lägg till PermissionsProvider i din App
```tsx
// I din layout.tsx eller _app.tsx
import { PermissionsProvider } from '@/providers/PermissionsProvider';

export default function RootLayout({ children }) {
  const { user } = useYourExistingAuth(); // Din nuvarande auth
  
  return (
    <PermissionsProvider user={user}>
      {children} {/* All din befintliga kod körs oförändrad */}
    </PermissionsProvider>
  );
}
```

### 2. Uppdatera Navigation (minimal förändring)
```tsx
// Wrappa befintliga nav items med PermissionGate
<PermissionGate module="leads">
  <YourExistingNavItem href="/leads" /> {/* Ingen ändring av NavItem */}
</PermissionGate>
```

### 3. Skydda Pages/Routes
**Metod A: HOC (rekommenderas)**
```tsx
// offers/page.tsx
export default withModuleAccess(YourExistingOffersPage, { module: 'offers' });
```

**Metod B: Wrapper i page**
```tsx
// offers/page.tsx  
export default function OffersPage() {
  return (
    <PermissionGate module="offers">
      <YourExistingOffersComponent />
    </PermissionGate>
  );
}
```

### 4. Conditional UI Elements
```tsx
// I befintliga komponenter
<PermissionGate module="leads" feature="create">
  <YourExistingCreateButton />
</PermissionGate>

// Eller med hooks
const canEdit = useHasFeature('leads', 'edit');
{canEdit && <YourExistingEditButton />}
```

## ✅ Vad som INTE behöver ändras

- **Befintliga komponenter** - All logik bevaras
- **API calls** - Funktionalitet fortsätter fungera
- **State management** - Hooks och context bevaras  
- **Routing logic** - Next.js routes fungerar som innan
- **Styling** - Tailwind klasser bevaras
- **Business logic** - All funktionalitet bevaras

## 🛡️ Säkerhetsrekommendationer

### Var du BÖR lägga permissions:
- ✅ **Navigation items** - Dölj moduler användaren inte har
- ✅ **Page level** - Skydda hela sidor/routes
- ✅ **Action buttons** - Skapa, redigera, ta bort knappar
- ✅ **Dashboard widgets** - Modulspecifika widgets

### Var du INTE bör lägga permissions (för att undvika regressions):
- ❌ **Deep component logic** - Riskerar att bryta befintlig funktionalitet
- ❌ **Utility functions** - Kan påverka oväntade ställen
- ❌ **Database queries** - Hantera i backend istället
- ❌ **Form validation** - Behåll befintlig validering

## 📝 Exempel på Permissions Setup

### Admin User
```json
{
  "modules": ["*"], // Wildcard för alla moduler
  "features": {
    "*": ["*"] // Alla rättigheter
  },
  "role": "admin"
}
```

### Regular User  
```json
{
  "modules": ["leads", "notes", "tasks"],
  "features": {
    "leads": ["view", "create", "edit"],
    "notes": ["view", "create", "edit"],
    "tasks": ["view", "create"]
  },
  "role": "user"
}
```

### Viewer Only
```json
{
  "modules": ["leads", "analytics"],
  "features": {
    "leads": ["view"],
    "analytics": ["view"]
  },
  "role": "viewer"
}
```

## 🔧 Hooks API Reference

```tsx
// Kontrollera modulåtkomst
const hasLeads = useHasModule('leads');

// Kontrollera specifik feature
const canCreateLeads = useHasFeature('leads', 'create');

// Kontrollera admin-rättigheter
const isAdmin = useIsAdmin();

// Get all info
const { hasModule, hasFeature, isAdmin, userRole, enabledModules } = usePermissions();
```

## 🎨 Migration Strategy

1. **Fas 1**: Lägg till provider och datamodell
2. **Fas 2**: Uppdatera navigation (low risk)
3. **Fas 3**: Skydda pages med HOC (medium risk)
4. **Fas 4**: Lägg till conditional buttons (low risk)
5. **Fas 5**: Finjustera permissions baserat på feedback

## 📊 Testning

```tsx
// Testa med mock user
const mockUser = {
  id: '1',
  role: 'user',
  permissions: {
    modules: ['leads', 'notes'],
    features: { leads: ['view', 'create'] }
  }
};

// Wrappa test med provider
<PermissionsProvider user={mockUser}>
  <YourComponent />
</PermissionsProvider>
```

## 🚨 Viktiga Notes

- **Backward compatibility**: All befintlig kod fortsätter fungera
- **Progressive enhancement**: Lägg till permissions gradvis
- **No breaking changes**: Inga ändringar av befintlig API
- **Server-side security**: Komplettera alltid med backend-validering
- **Performance**: Minimal påverkan tack vare React context optimering
