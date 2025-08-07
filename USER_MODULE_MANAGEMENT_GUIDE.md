# Användar- och Modulhantering - Implementation Guide

## Översikt

Detta system bygger vidare på det befintliga permissions-systemet och lägger till komplett användar- och modulhantering inspirerat av Fortnox. Systemet inkluderar:

- **Användarhantering**: Bjud in, hantera roller och modulbehörigheter
- **Modulhantering**: Aktivera/deaktivera moduler med prishantering  
- **Abonnemangsplaner**: Basic, Premium, Enterprise med olika begränsningar
- **Admin Dashboard**: Enhetlig vy för all administration

## Databasstruktur

### Utökade tabeller

```sql
-- Users (utökad)
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN invited_by UUID;
ALTER TABLE users ADD COLUMN invited_at TIMESTAMP;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Companies (utökad) 
ALTER TABLE companies ADD COLUMN max_users INTEGER DEFAULT 5;
ALTER TABLE companies ADD COLUMN current_users INTEGER DEFAULT 0;
ALTER TABLE companies ADD COLUMN billing_email TEXT;
ALTER TABLE companies ADD COLUMN subscription_status TEXT DEFAULT 'active';

-- Nya tabeller
CREATE TABLE user_invitations (...);
CREATE TABLE module_usage (...);
```

### Modulkonfiguration

Moduler definieras i `/src/config/modules.ts`:

```typescript
const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'offers',
    name: 'Offerter & Försäljning',
    price_per_month: 99,
    category: 'premium',
    is_base: false,
    min_plan: 'basic'
  }
  // ... fler moduler
];
```

## Komponentstruktur

### AdminDashboard
Huvudkomponent med tabs för översikt, användare och moduler.

```tsx
import { AdminDashboard } from '@/components/admin';

<AdminDashboard />
```

### UserManagement
Hantera användare, roller och modulbehörigheter.

```tsx
import { UserManagement } from '@/components/admin';

<UserManagement />
```

### ModuleManagement  
Aktivera/deaktivera moduler och hantera abonnemang.

```tsx
import { ModuleManagement } from '@/components/admin';

<ModuleManagement />
```

## Hooks

### useUserManagement
```typescript
const {
  users,
  company,
  loading,
  inviteUser,
  updateUserModules,
  updateUserRole,
  removeUser
} = useUserManagement();
```

### useModuleManagement
```typescript
const {
  company,
  activeModules,
  loading,
  toggleModule,
  getTotalMonthlyCost,
  getAvailableModules
} = useModuleManagement();
```

## Användning

### 1. Kör databasmigrationen

```sql
-- Kör 003_add_user_module_management.sql i Supabase
```

### 2. Implementera admin-sidan

```tsx
// /src/app/admin/page.tsx
import { requireAdmin } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin';
import { PermissionsProvider } from '@/providers/PermissionsProvider';

export default async function AdminPage() {
  const user = await requireAdmin();
  
  return (
    <PermissionsProvider user={user}>
      <AdminDashboard />
    </PermissionsProvider>
  );
}
```

### 3. Lägg till navigation

```tsx
// I din dashboard/navigation
<Link href="/admin">
  <PermissionGate requiredRole="admin">
    Administratörspanel
  </PermissionGate>
</Link>
```

### 4. Integrera med befintliga komponenter

```tsx
// Använd permissions i komponenter
import { useHasModule, useIsAdmin } from '@/providers/PermissionsProvider';

function OfferButton() {
  const hasOffers = useHasModule('offers');
  const isAdmin = useIsAdmin();
  
  if (!hasOffers) return null;
  
  return <Button>Skapa offert</Button>;
}
```

## Funktioner

### Användarhantering

- **Bjud in användare**: E-post med roller och moduler
- **Hantera roller**: Admin, Manager, User, Viewer
- **Modulbehörigheter**: Individuella eller ärvda från företag
- **Användarstatus**: Active, Pending, Inactive

### Modulhantering

- **Bas-moduler**: Leads, Tasks, Notes (alltid aktiva)
- **Premium-moduler**: Offers (99kr), Campaigns (149kr), Economy (199kr)
- **Enterprise-moduler**: Advanced Contacts (299kr)
- **Priser**: Automatisk beräkning av månadskostnad

### Abonnemangsplaner

- **Basic**: 5 användare, 49kr/användare, bas-moduler
- **Premium**: 25 användare, 99kr/användare, premium-moduler
- **Enterprise**: Obegränsat, 199kr/användare, alla moduler

## Säkerhet

- **RLS policies**: Automatiskt skydd på databas-nivå
- **Role-based access**: Admin krävs för användar-/modulhantering
- **Permission inheritance**: Användare ärver företagets aktiva moduler

## Anpassning

### Lägg till ny modul

1. Uppdatera `MODULE_DEFINITIONS` i `/src/config/modules.ts`
2. Lägg till i permissions-systemet
3. Skapa UI-komponenter för modulen

### Ändra prismodell

1. Uppdatera `PLAN_CONFIGS` och `MODULE_DEFINITIONS`
2. Kör databas-migration för att uppdatera befintliga data

### Anpassa roller

1. Uppdatera `UserRole` typ i `/src/types/user-management.ts`
2. Uppdatera databas-constraints
3. Anpassa UI-komponenter

## Framtida utveckling

- **E-post notifieringar**: Automatiska inbjudningar och påminnelser
- **Billing integration**: Stripe/faktureringslogik
- **Audit logging**: Spåra alla administrativa ändringar
- **Bulk operations**: Hantera flera användare samtidigt
- **SSO integration**: Single Sign-On för Enterprise-kunder

## Felsökning

### Vanliga problem

1. **"Modules not loading"**: Kontrollera RLS policies och user permissions
2. **"User creation fails"**: Verifiera max_users begränsningar
3. **"Module activation fails"**: Kontrollera plan-behörigheter

### Debug-tips

```typescript
// Logga permissions
console.log('User permissions:', user.permissions);
console.log('Company modules:', company.enabled_modules);
console.log('Available modules:', getAvailableModules());
```

## Support

För frågor och support, kontakta utvecklingsteamet eller se dokumentationen på GitHub.
