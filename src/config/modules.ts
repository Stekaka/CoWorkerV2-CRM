import { ModuleDefinition, ModuleName, CompanyPlan } from '@/types/user-management';

// Modulkonfiguration - inspirerat av Fortnox modulsystem
export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  // BAS-moduler (ingår alltid)
  {
    id: 'leads',
    name: 'Lead-hantering',
    description: 'Hantera leads och kundkontakter',
    icon: 'Users',
    category: 'core',
    price_per_month: 0,
    is_base: true,
    min_plan: 'basic',
    features: ['Skapa leads', 'Redigera kontakter', 'Aktivitetshistorik', 'Grundläggande rapporter']
  },
  {
    id: 'tasks',
    name: 'Uppgifter',
    description: 'Skapa och hantera uppgifter',
    icon: 'CheckSquare',
    category: 'core',
    price_per_month: 0,
    is_base: true,
    min_plan: 'basic',
    features: ['Skapa uppgifter', 'Tilldela team', 'Deadlines', 'Status-uppföljning']
  },
  {
    id: 'notes',
    name: 'Anteckningar',
    description: 'Anteckningar och dokumentation',
    icon: 'FileText',
    category: 'core',
    price_per_month: 0,
    is_base: true,
    min_plan: 'basic',
    features: ['Skapa anteckningar', 'Koppla till leads', 'Sök i innehåll']
  },
  
  // PREMIUM-moduler
  {
    id: 'offers',
    name: 'Offerter & Försäljning',
    description: 'Skapa professionella offerter och propositioner',
    icon: 'FileCheck',
    category: 'premium',
    price_per_month: 99,
    is_base: false,
    min_plan: 'basic',
    features: ['Drag & drop offert-builder', 'PDF-export', 'E-signering', 'Offertmallar', 'Automatisk uppföljning']
  },
  {
    id: 'campaigns',
    name: 'E-postkampanjer',
    description: 'Automatiserade e-postkampanjer och nurturing',
    icon: 'Mail',
    category: 'premium',
    price_per_month: 149,
    is_base: false,
    min_plan: 'basic',
    features: ['E-postmallar', 'Automatisering', 'A/B-testning', 'Leveransstatistik', 'Segmentering']
  },
  {
    id: 'economy',
    name: 'Ekonomi & Fakturering',
    description: 'Komplett ekonomihantering och fakturering',
    icon: 'DollarSign',
    category: 'premium',
    price_per_month: 199,
    is_base: false,
    min_plan: 'premium',
    features: ['Skapa fakturor', 'Betalningshistorik', 'Momshantering', 'Ekonomiska rapporter', 'Integration med bokföring']
  },
  {
    id: 'analytics',
    name: 'Avancerad Analys',
    description: 'Detaljerade rapporter och business intelligence',
    icon: 'BarChart3',
    category: 'premium',
    price_per_month: 129,
    is_base: false,
    min_plan: 'basic',
    features: ['Dashboards', 'Anpassade rapporter', 'KPI-uppföljning', 'Prognoser', 'Export till Excel']
  },
  {
    id: 'calendar',
    name: 'Kalender & Schemaläggning',
    description: 'Avancerad kalenderhantering och mötesbokning',
    icon: 'Calendar',
    category: 'premium',
    price_per_month: 79,
    is_base: false,
    min_plan: 'basic',
    features: ['Mötesbokning', 'Kalendersynkronisering', 'Automatiska påminnelser', 'Team-kalendrar']
  },
  
  // ENTERPRISE-moduler
  {
    id: 'contacts',
    name: 'Avancerad Kontakthantering',
    description: 'Enterprise kontakt- och relationshantering',
    icon: 'Network',
    category: 'enterprise',
    price_per_month: 299,
    is_base: false,
    min_plan: 'enterprise',
    features: ['Kontakthierarki', 'Relationskartor', 'Duplicathantering', 'Massimport', 'API-integrationer']
  },
  {
    id: 'files',
    name: 'Dokumenthantering',
    description: 'Centraliserad fil- och dokumenthantering',
    icon: 'FolderOpen',
    category: 'enterprise',
    price_per_month: 99,
    is_base: false,
    min_plan: 'premium',
    features: ['Molnlagring', 'Versionering', 'Behörigheter', 'Avancerad sök', 'Automatisk backup']
  },
  {
    id: 'settings',
    name: 'Avancerade Inställningar',
    description: 'Företagsinställningar och anpassningar',
    icon: 'Settings',
    category: 'core',
    price_per_month: 0,
    is_base: true,
    min_plan: 'basic',
    features: ['Grundinställningar', 'Användarhantering', 'Säkerhet']
  }
];

export const PLAN_CONFIGS = {
  basic: {
    name: 'Basic',
    max_users: 5,
    included_modules: ['leads', 'tasks', 'notes', 'settings'],
    price_per_user: 49,
    features: ['Grundläggande CRM', 'Upp till 5 användare', 'E-postsupport']
  },
  premium: {
    name: 'Premium', 
    max_users: 25,
    included_modules: ['leads', 'tasks', 'notes', 'settings'],
    price_per_user: 99,
    features: ['Alla Basic-funktioner', 'Upp till 25 användare', 'Premium-moduler', 'Telefonsupport']
  },
  enterprise: {
    name: 'Enterprise',
    max_users: -1, // Unlimited
    included_modules: ['leads', 'tasks', 'notes', 'settings'],
    price_per_user: 199,
    features: ['Alla Premium-funktioner', 'Obegränsat antal användare', 'Enterprise-moduler', 'Dedikerad support', 'SLA']
  }
};

// Hjälpfunktioner
export function getModuleById(moduleId: ModuleName): ModuleDefinition | undefined {
  return MODULE_DEFINITIONS.find(m => m.id === moduleId);
}

export function getModulesByCategory(category: 'core' | 'premium' | 'enterprise'): ModuleDefinition[] {
  return MODULE_DEFINITIONS.filter(m => m.category === category);
}

export function getBaseModules(): ModuleDefinition[] {
  return MODULE_DEFINITIONS.filter(m => m.is_base);
}

export function getPremiumModules(): ModuleDefinition[] {
  return MODULE_DEFINITIONS.filter(m => !m.is_base && m.category !== 'enterprise');
}

export function getEnterpriseModules(): ModuleDefinition[] {
  return MODULE_DEFINITIONS.filter(m => m.category === 'enterprise');
}

export function calculateModuleCost(moduleIds: ModuleName[]): number {
  return moduleIds.reduce((total, moduleId) => {
    const moduleConfig = getModuleById(moduleId);
    return total + (moduleConfig?.price_per_month || 0);
  }, 0);
}

export function getAvailableModulesForPlan(plan: CompanyPlan): ModuleDefinition[] {
  return MODULE_DEFINITIONS.filter(moduleConfig => {
    if (moduleConfig.is_base) return true;
    
    switch (plan) {
      case 'basic':
        return moduleConfig.min_plan === 'basic';
      case 'premium':
        return moduleConfig.min_plan === 'basic' || moduleConfig.min_plan === 'premium';
      case 'enterprise':
        return true;
      default:
        return moduleConfig.is_base;
    }
  });
}
