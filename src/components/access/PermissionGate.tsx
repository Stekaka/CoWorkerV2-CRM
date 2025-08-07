'use client';

import React from 'react';
import { useHasModule, useHasFeature } from '@/providers/PermissionsProvider';
import { ModuleName, FeatureAction } from '@/types/permissions';
import { Lock } from 'lucide-react';

interface WithModuleAccessProps {
  module: ModuleName;
  feature?: FeatureAction;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// HOC för att wrappa komponenter med permissions
export function withModuleAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: WithModuleAccessProps
) {
  const ComponentWithAccess = (props: P) => {
    const hasModule = useHasModule(config.module);
    const hasFeatureCheck = useHasFeature(config.module, config.feature || 'view');
    
    const hasAccess = hasModule && (config.feature ? hasFeatureCheck : true);
    
    if (!hasAccess) {
      if (config.fallback) {
        return <>{config.fallback}</>;
      }
      
      return <AccessDenied module={config.module} feature={config.feature} />;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  ComponentWithAccess.displayName = `withModuleAccess(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ComponentWithAccess;
}

// Default Access Denied Component
const AccessDenied: React.FC<{ module: ModuleName; feature?: FeatureAction }> = ({ 
  module, 
  feature 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Åtkomst nekad
      </h2>
      <p className="text-gray-600 mb-4">
        Du har inte tillgång till modulen &ldquo;{module}&rdquo;
        {feature && ` med behörighet "${feature}"`}.
      </p>
      <p className="text-sm text-gray-500">
        Kontakta din administratör för att få tillgång.
      </p>
    </div>
  </div>
);

// Component för att visa/dölja innehåll baserat på permissions
interface PermissionGateProps {
  module: ModuleName;
  feature?: FeatureAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  feature,
  children,
  fallback = null,
}) => {
  const hasModule = useHasModule(module);
  const hasFeatureCheck = useHasFeature(module, feature || 'view');
  
  const hasAccess = hasModule && (feature ? hasFeatureCheck : true);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Hook för conditional rendering
export const useConditionalRender = (module: ModuleName, feature?: FeatureAction) => {
  const hasModule = useHasModule(module);
  const hasFeatureCheck = useHasFeature(module, feature || 'view');
  
  return hasModule && (feature ? hasFeatureCheck : true);
};
