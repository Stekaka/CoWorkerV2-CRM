// Utökade typer för användar- och modulhantering
export type ModuleName = 
  | 'leads' 
  | 'notes' 
  | 'offers' 
  | 'analytics' 
  | 'tasks' 
  | 'economy' 
  | 'campaigns'
  | 'files'
  | 'calendar'
  | 'contacts'
  | 'settings';

export type CompanyPlan = 'basic' | 'premium' | 'enterprise';
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface ModuleDefinition {
  id: ModuleName;
  name: string;
  description: string;
  icon: string;
  category: 'core' | 'premium' | 'enterprise';
  price_per_month: number;
  is_base: boolean; // Ingår i bas-paket
  min_plan: CompanyPlan;
  features: string[];
}

export interface CompanySettings {
  id: string;
  name: string;
  enabled_modules: ModuleName[];
  plan: CompanyPlan;
  max_users: number;
  current_users: number;
  billing_email: string;
  subscription_status: 'active' | 'trial' | 'expired' | 'cancelled';
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  company_id: string;
  allowed_modules: ModuleName[]; // Individuella moduler för denna användare
  permissions: {
    modules: ModuleName[];
    features: {
      [key: string]: string[]; // Vilka actions användaren kan göra per modul
    };
    role: UserRole;
  };
  invited_by?: string;
  invited_at?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  allowed_modules: ModuleName[];
  company_id: string;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export interface ModuleUsage {
  module_id: ModuleName;
  user_count: number;
  is_active: boolean;
  activated_at?: string;
  monthly_cost: number;
}

// För UI-komponenter
export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  allowed_modules: ModuleName[];
}

export interface ModuleActivationRequest {
  module_id: ModuleName;
  action: 'activate' | 'deactivate';
  confirm_cost?: boolean;
}

export interface BulkUserAction {
  user_ids: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'update_modules';
  data?: Partial<UserProfile>;
}

// API Response types
export interface UserManagementResponse {
  users: UserProfile[];
  total: number;
  company: CompanySettings;
  available_modules: ModuleDefinition[];
  pending_invitations: UserInvitation[];
}

export interface ModuleManagementResponse {
  company: CompanySettings;
  available_modules: ModuleDefinition[];
  active_modules: ModuleUsage[];
  total_monthly_cost: number;
  recommendations: ModuleDefinition[];
}
