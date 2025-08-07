'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  TrendingUp,
  Crown,
  Star,
  DollarSign,
  Users,
  Check
} from 'lucide-react';
import { useModuleManagement } from '@/hooks/useModuleManagement';
import { ModuleDefinition, ModuleName } from '@/types/user-management';
import { MODULE_DEFINITIONS, PLAN_CONFIGS } from '@/config/modules';

export function ModuleManagement() {
  const {
    company,
    loading,
    error,
    toggleModule,
    getTotalMonthlyCost,
    getActiveModuleUsages,
    getInactiveAvailableModules,
    refreshData
  } = useModuleManagement();

  const [activatingModule, setActivatingModule] = useState<string | null>(null);

  const handleToggleModule = async (moduleId: string, action: 'activate' | 'deactivate') => {
    setActivatingModule(moduleId);
    try {
      await toggleModule({ module_id: moduleId as ModuleDefinition['id'], action });
    } finally {
      setActivatingModule(null);
    }
  };

  const getCategoryIcon = (category: ModuleDefinition['category']) => {
    switch (category) {
      case 'core': return <Package className="w-5 h-5 text-blue-500" />;
      case 'premium': return <Star className="w-5 h-5 text-purple-500" />;
      case 'enterprise': return <Crown className="w-5 h-5 text-yellow-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: ModuleDefinition['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'premium': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'enterprise': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Fel: {error}</p>
          <Button onClick={refreshData} className="mt-2" variant="outline">
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  const activeModules = getActiveModuleUsages();
  const inactiveModules = getInactiveAvailableModules();
  const totalMonthlyCost = getTotalMonthlyCost();
  const currentPlan = company?.plan || 'basic';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modulhantering</h1>
          <p className="text-gray-600 mt-1">
            Hantera aktiva moduler och abonnemang för {company?.name}
          </p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktiva moduler</p>
                <p className="text-2xl font-bold text-blue-600">{activeModules.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Månadsaktnad</p>
                <p className="text-2xl font-bold text-green-600">{totalMonthlyCost} kr</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuvarande plan</p>
                <p className="text-2xl font-bold text-purple-600 capitalize">{currentPlan}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Användare</p>
                <p className="text-2xl font-bold text-orange-600">
                  {company?.current_users}/{company?.max_users === -1 ? '∞' : company?.max_users}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan upgrade section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Abonnemangsplan
          </CardTitle>
          <CardDescription>
            Uppgradera din plan för att få tillgång till fler moduler och funktioner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PLAN_CONFIGS).map(([planKey, plan]) => {
              const isCurrentPlan = planKey === currentPlan;
              const canUpgrade = ['basic', 'premium', 'enterprise'].indexOf(planKey) > 
                                ['basic', 'premium', 'enterprise'].indexOf(currentPlan);
              
              return (
                <div
                  key={planKey}
                  className={`p-4 rounded-lg border-2 ${
                    isCurrentPlan 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {plan.price_per_user} kr
                      <span className="text-sm text-gray-600 font-normal">/användare/mån</span>
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      {isCurrentPlan ? (
                        <Badge className="bg-blue-100 text-blue-800">Nuvarande plan</Badge>
                      ) : canUpgrade ? (
                        <Button className="w-full" variant="outline">
                          Uppgradera till {plan.name}
                        </Button>
                      ) : (
                        <Button className="w-full" variant="ghost" disabled>
                          Lägre plan
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active modules */}
      <Card>
        <CardHeader>
          <CardTitle>Aktiva moduler ({activeModules.length})</CardTitle>
          <CardDescription>
            Moduler som är aktiverade för ditt företag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeModules.map((usage) => {
              const moduleConfig = MODULE_DEFINITIONS.find(m => m.id === usage.module_id);
              if (!moduleConfig) return null;

              return (
                <div
                  key={usage.module_id}
                  className="p-4 border rounded-lg bg-green-50 border-green-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(moduleConfig.category)}
                        <h3 className="font-semibold">{moduleConfig.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {moduleConfig.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(moduleConfig.category)}>
                          {moduleConfig.category}
                        </Badge>
                        {moduleConfig.price_per_month > 0 && (
                          <span className="text-sm font-medium text-green-600">
                            {moduleConfig.price_per_month} kr/mån
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {usage.user_count} användare
                      </span>
                      
                      {!moduleConfig.is_base && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleModule(usage.module_id, 'deactivate')}
                          disabled={activatingModule === usage.module_id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {activatingModule === usage.module_id ? '...' : 'Deaktivera'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available modules */}
      {inactiveModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tillgängliga moduler ({inactiveModules.length})</CardTitle>
            <CardDescription>
              Moduler du kan aktivera för ditt {currentPlan}-abonnemang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveModules.map((moduleConfig) => (
                <div
                  key={moduleConfig.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(moduleConfig.category)}
                        <h3 className="font-semibold">{moduleConfig.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {moduleConfig.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getCategoryColor(moduleConfig.category)}>
                          {moduleConfig.category}
                        </Badge>
                        {moduleConfig.price_per_month > 0 && (
                          <span className="text-sm font-medium text-blue-600">
                            {moduleConfig.price_per_month} kr/mån
                          </span>
                        )}
                      </div>

                      {/* Features list */}
                      <div className="space-y-1 mb-4">
                        {moduleConfig.features.slice(0, 3).map((feature) => (
                          <div key={feature} className="flex items-center text-xs text-gray-600">
                            <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                        {moduleConfig.features.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{moduleConfig.features.length - 3} fler funktioner
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleToggleModule(moduleConfig.id, 'activate')}
                    disabled={activatingModule === moduleConfig.id}
                  >
                    {activatingModule === moduleConfig.id ? (
                      'Aktiverar...'
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Aktivera modul
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
