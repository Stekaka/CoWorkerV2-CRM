export const MOCK_COMPANIES = [
  {
    id: 'company-dronar',
    name: 'Drönarkompaniet',
    domain: 'dronarkompaniet.se',
    plan: 'premium',
    maxUsers: 25,
    currentUsers: 3,
    createdAt: '2025-01-15T09:00:00Z'
  }
];

export const MOCK_USERS = [
  {
    id: 'user-oliver',
    email: 'oliver@dronarkompaniet.se',
    name: 'Oliver Lundberg',
    role: 'admin',
    companyId: 'company-dronar',
    active: true,
    allowedModules: ['leads', 'offers', 'notes', 'calendar', 'economy', 'quotes'],
    lastActive: '2025-08-07T10:30:00Z',
    invitedAt: '2025-01-15T09:00:00Z',
    avatar: null
  },
  {
    id: 'user-anna',
    email: 'anna@dronarkompaniet.se',
    name: 'Anna Svensson',
    role: 'user',
    companyId: 'company-dronar',
    active: true,
    allowedModules: ['leads', 'notes', 'calendar'],
    lastActive: '2025-08-07T09:15:00Z',
    invitedAt: '2025-02-01T14:30:00Z',
    avatar: null
  },
  {
    id: 'user-erik',
    email: 'erik@dronarkompaniet.se',
    name: 'Erik Johansson',
    role: 'user',
    companyId: 'company-dronar',
    active: true,
    allowedModules: ['leads', 'offers', 'quotes'],
    lastActive: '2025-08-06T16:45:00Z',
    invitedAt: '2025-03-10T11:20:00Z',
    avatar: null
  }
];

export const MOCK_MODULES = [
  {
    id: 'leads',
    name: 'Leads & CRM',
    description: 'Hantera leads och kundrelationer',
    isCore: true,
    pricePerMonth: 0,
    category: 'core',
    features: ['Lead-hantering', 'Kundregister', 'Aktivitetslogg', 'Rapporter']
  },
  {
    id: 'notes',
    name: 'Anteckningar',
    description: 'Centraliserad anteckningshantering',
    isCore: true,
    pricePerMonth: 0,
    category: 'core',
    features: ['Rich text editor', 'Taggning', 'Sökfunktion', 'Delning']
  },
  {
    id: 'calendar',
    name: 'Kalender',
    description: 'Schemaläggning och tidsplanering',
    isCore: true,
    pricePerMonth: 0,
    category: 'core',
    features: ['Bokningar', 'Påminnelser', 'Synkronisering', 'Teamkalender']
  },
  {
    id: 'offers',
    name: 'Offerter',
    description: 'Skapa och skicka professionella offerter',
    isCore: false,
    pricePerMonth: 99,
    category: 'premium',
    features: ['Offertmallar', 'PDF-export', 'E-signering', 'Uppföljning']
  },
  {
    id: 'quotes',
    name: 'Prislistor',
    description: 'Hantera produkter och priser',
    isCore: false,
    pricePerMonth: 79,
    category: 'premium',
    features: ['Produktkatalog', 'Prissättning', 'Rabatter', 'Valutahantering']
  },
  {
    id: 'economy',
    name: 'Ekonomi',
    description: 'Ekonomisk översikt och rapporter',
    isCore: false,
    pricePerMonth: 149,
    category: 'premium',
    features: ['Finansrapporter', 'Budgetuppföljning', 'Kassaflöde', 'Fakturering']
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Automatisera arbetsflöden',
    isCore: false,
    pricePerMonth: 299,
    category: 'enterprise',
    features: ['Workflows', 'Triggers', 'API-integrationer', 'Schemaläggning']
  },
  {
    id: 'emails',
    name: 'E-post',
    description: 'E-postintegrationer och kampanjer',
    isCore: false,
    pricePerMonth: 89,
    category: 'premium',
    features: ['E-postkampanjer', 'Mallar', 'Spårning', 'Automatisering']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Detaljerad affärsanalys',
    isCore: false,
    pricePerMonth: 199,
    category: 'enterprise',
    features: ['Avancerade rapporter', 'Dashboards', 'KPI:er', 'Export']
  },
  {
    id: 'integrations',
    name: 'Integrationer',
    description: 'Tredjepartsintegrationer',
    isCore: false,
    pricePerMonth: 129,
    category: 'enterprise',
    features: ['API-anslutningar', 'Webhooks', 'Synkronisering', 'Custom']
  }
];

export const MOCK_COMPANY_MODULES = [
  // Drönarkompaniet's active modules
  { companyId: 'company-dronar', moduleId: 'leads', active: true },
  { companyId: 'company-dronar', moduleId: 'notes', active: true },
  { companyId: 'company-dronar', moduleId: 'calendar', active: true },
  { companyId: 'company-dronar', moduleId: 'offers', active: true },
  { companyId: 'company-dronar', moduleId: 'quotes', active: true },
  { companyId: 'company-dronar', moduleId: 'economy', active: true },
  { companyId: 'company-dronar', moduleId: 'automation', active: false },
  { companyId: 'company-dronar', moduleId: 'emails', active: false },
  { companyId: 'company-dronar', moduleId: 'analytics', active: false },
  { companyId: 'company-dronar', moduleId: 'integrations', active: false }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    displayName: 'Basic',
    description: 'Perfekt för små företag och startups',
    maxUsers: 5,
    pricePerMonth: 49,
    features: ['Grundmoduler', 'E-postsupport', '5 användare', 'Standardrapporter']
  },
  {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    description: 'För växande företag med fler behov',
    maxUsers: 25,
    pricePerMonth: 99,
    features: ['Alla Basic-funktioner', 'Tilläggsmoduler', '25 användare', 'Prioritetssupport', 'Avancerade rapporter']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise',
    description: 'Obegränsade användare och full funktionalitet',
    maxUsers: -1, // Unlimited
    pricePerMonth: 199,
    features: ['Alla Premium-funktioner', 'Obegränsade användare', 'Dedikerad support', 'Custom integrationer', 'SLA']
  }
];

// Helper functions
export function getCurrentUser() {
  // In a real app, this would come from auth context
  return MOCK_USERS.find(u => u.email === 'oliver@dronarkompaniet.se');
}

export function getUserCompany(userId: string) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return null;
  return MOCK_COMPANIES.find(c => c.id === user.companyId);
}

export function getCompanyUsers(companyId: string) {
  return MOCK_USERS.filter(u => u.companyId === companyId);
}

export function getCompanyModules(companyId: string) {
  const companyModules = MOCK_COMPANY_MODULES.filter(cm => cm.companyId === companyId);
  return MOCK_MODULES.map(module => ({
    ...module,
    active: companyModules.find(cm => cm.moduleId === module.id)?.active || false
  }));
}

export function getUserPermissions(userId: string, companyId: string) {
  const user = MOCK_USERS.find(u => u.id === userId && u.companyId === companyId);
  if (!user) return { isAdmin: false, allowedModules: [] };
  
  return {
    isAdmin: user.role === 'admin',
    allowedModules: user.allowedModules
  };
}
