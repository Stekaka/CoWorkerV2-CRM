'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { ModuleName, FeatureAction, UserWithPermissions } from '@/types/permissions';

interface PermissionsContextType {
  hasModule: (module: ModuleName) => boolean;
  hasFeature: (module: ModuleName, action: FeatureAction) => boolean;
  isAdmin: () => boolean;
  userRole: string;
  enabledModules: ModuleName[];
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

interface PermissionsProviderProps {
  user: UserWithPermissions | null;
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  user,
  children,
}) => {
  const permissions = useMemo(() => {
    if (!user) {
      return {
        hasModule: () => false,
        hasFeature: () => false,
        isAdmin: () => false,
        userRole: 'viewer',
        enabledModules: [] as ModuleName[],
      };
    }

    // Kombinera company permissions med user permissions
    const companyModules = user.company?.enabled_modules || [];
    const userModules = user.permissions?.modules || [];
    
    // User permissions överrider company permissions
    const enabledModules = userModules.length > 0 ? userModules : companyModules;
    
    const hasModule = (module: ModuleName): boolean => {
      // Admin har alltid tillgång
      if (user.role === 'admin') return true;
      
      return enabledModules.includes(module);
    };

    const hasFeature = (module: ModuleName, action: FeatureAction): boolean => {
      // Först kolla om modulen är tillgänglig
      if (!hasModule(module)) return false;
      
      // Admin har alltid tillgång till alla features
      if (user.role === 'admin') return true;
      
      // Kolla user-specifika feature permissions
      const userFeatures = user.permissions?.features?.[module] || [];
      if (userFeatures.length > 0) {
        return userFeatures.includes(action);
      }
      
      // Default permissions baserat på roll
      if (user.role === 'user') {
        return ['view', 'create', 'edit'].includes(action);
      }
      
      if (user.role === 'viewer') {
        return action === 'view';
      }
      
      return false;
    };

    const isAdmin = (): boolean => {
      return user.role === 'admin';
    };

    return {
      hasModule,
      hasFeature,
      isAdmin,
      userRole: user.role,
      enabledModules,
    };
  }, [user]);

  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook för att använda permissions
export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Convenience hooks
export const useHasModule = (module: ModuleName): boolean => {
  const { hasModule } = usePermissions();
  return hasModule(module);
};

export const useHasFeature = (module: ModuleName, action: FeatureAction): boolean => {
  const { hasFeature } = usePermissions();
  return hasFeature(module, action);
};

export const useIsAdmin = (): boolean => {
  const { isAdmin } = usePermissions();
  return isAdmin();
};
