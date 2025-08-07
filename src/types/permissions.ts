export type ModuleName = 
  | 'leads' 
  | 'notes' 
  | 'offers' 
  | 'analytics' 
  | 'tasks' 
  | 'economy' 
  | 'campaigns'
  | 'files'
  | 'settings';

export type FeatureAction = 
  | 'view' 
  | 'create' 
  | 'edit' 
  | 'delete' 
  | 'export' 
  | 'send' 
  | 'approve';

export type UserRole = 'admin' | 'user' | 'viewer';

export interface ModulePermissions {
  [key: string]: FeatureAction[];
}

export interface UserPermissions {
  modules: ModuleName[];
  features: ModulePermissions;
  role: UserRole;
}

export interface CompanyPermissions {
  enabled_modules: ModuleName[];
  plan: 'basic' | 'premium' | 'enterprise';
}

// Utökad User interface (lägg till i din befintliga user type)
export interface UserWithPermissions {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  permissions?: UserPermissions; // Individuella permissions
  company?: {
    id: string;
    name: string;
    enabled_modules: ModuleName[];
    plan: string;
  };
}
