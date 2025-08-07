'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import { CompanySettings, ModuleUsage, ModuleActivationRequest } from '@/types/user-management';
import { ModuleName } from '@/types/user-management';
import { MODULE_DEFINITIONS, calculateModuleCost, getAvailableModulesForPlan } from '@/config/modules';

export function useModuleManagement() {
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [activeModules, setActiveModules] = useState<ModuleUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Hämta företagets modulstatus
  const fetchModuleData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Hämta current user för att få company_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Inte inloggad');

      const { data: currentUser } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!currentUser) throw new Error('Användare ej funnen');

      // Hämta företagsinformation
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          enabled_modules,
          plan,
          created_at,
          updated_at
        `)
        .eq('id', currentUser.company_id)
        .single();

      if (companyError) throw companyError;

      // Räkna aktiva användare
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', currentUser.company_id);

      // Formatera företag
      const formattedCompany: CompanySettings = {
        id: companyData.id,
        name: companyData.name,
        enabled_modules: companyData.enabled_modules || [],
        plan: companyData.plan || 'basic',
        max_users: companyData.plan === 'enterprise' ? -1 : (companyData.plan === 'premium' ? 25 : 5),
        current_users: userCount || 0,
        billing_email: '', // TODO: Lägg till i databas
        subscription_status: 'active' as const,
        created_at: companyData.created_at,
        updated_at: companyData.updated_at
      };

      // Skapa modulanvändningsstatistik
      const moduleUsages: ModuleUsage[] = MODULE_DEFINITIONS.map(moduleConfig => {
        const isActive = formattedCompany.enabled_modules.includes(moduleConfig.id);
        return {
          module_id: moduleConfig.id,
          user_count: isActive ? userCount || 0 : 0,
          is_active: isActive,
          activated_at: isActive ? companyData.updated_at : undefined,
          monthly_cost: isActive ? moduleConfig.price_per_month : 0
        };
      });

      setCompany(formattedCompany);
      setActiveModules(moduleUsages);
      
    } catch (err) {
      console.error('Error fetching module data:', err);
      setError(err instanceof Error ? err.message : 'Fel vid hämtning av moduldata');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Aktivera/Deaktivera modul
  const toggleModule = async (request: ModuleActivationRequest): Promise<boolean> => {
    try {
      if (!company) throw new Error('Företagsinformation saknas');

      const moduleConfig = MODULE_DEFINITIONS.find(m => m.id === request.module_id);
      if (!moduleConfig) throw new Error('Modul ej funnen');

      // Kontrollera plan-behörighet
      const availableModules = getAvailableModulesForPlan(company.plan);
      if (!availableModules.find(m => m.id === request.module_id)) {
        throw new Error(`Modulen "${moduleConfig.name}" kräver ${moduleConfig.min_plan}-plan eller högre`);
      }

      let newEnabledModules: ModuleName[];

      if (request.action === 'activate') {
        // Lägg till modul
        newEnabledModules = [...company.enabled_modules, request.module_id];
      } else {
        // Ta bort modul (kontrollera att det inte är en bas-modul)
        if (moduleConfig.is_base) {
          throw new Error('Bas-moduler kan inte deaktiveras');
        }
        newEnabledModules = company.enabled_modules.filter(m => m !== request.module_id);
      }

      // Uppdatera i databas
      const { error } = await supabase
        .from('companies')
        .update({ enabled_modules: newEnabledModules })
        .eq('id', company.id);

      if (error) throw error;

      // Uppdatera lokal state
      setCompany(prev => prev ? { ...prev, enabled_modules: newEnabledModules } : null);
      
      // Uppdatera modulanvändning
      setActiveModules(prev => prev.map(usage => 
        usage.module_id === request.module_id
          ? {
              ...usage,
              is_active: request.action === 'activate',
              monthly_cost: request.action === 'activate' ? moduleConfig.price_per_month : 0,
              activated_at: request.action === 'activate' ? new Date().toISOString() : undefined
            }
          : usage
      ));

      return true;
    } catch (err) {
      console.error('Error toggling module:', err);
      setError(err instanceof Error ? err.message : 'Fel vid ändring av modul');
      return false;
    }
  };

  // Beräkna total månadsikostnad
  const getTotalMonthlyCost = (): number => {
    if (!company) return 0;
    return calculateModuleCost(company.enabled_modules);
  };

  // Hämta tillgängliga moduler för aktuell plan
  const getAvailableModules = () => {
    if (!company) return [];
    return getAvailableModulesForPlan(company.plan);
  };

  // Hämta aktiva moduler
  const getActiveModuleUsages = () => {
    return activeModules.filter(usage => usage.is_active);
  };

  // Hämta inaktiva men tillgängliga moduler
  const getInactiveAvailableModules = () => {
    if (!company) return [];
    const availableModules = getAvailableModulesForPlan(company.plan);
    const activeModuleIds = company.enabled_modules;
    
    return availableModules.filter(moduleConfig => 
      !activeModuleIds.includes(moduleConfig.id) && !moduleConfig.is_base
    );
  };

  // Uppgradera plan
  const upgradePlan = async (newPlan: CompanySettings['plan']): Promise<boolean> => {
    try {
      if (!company) throw new Error('Företagsinformation saknas');

      const { error } = await supabase
        .from('companies')
        .update({ plan: newPlan })
        .eq('id', company.id);

      if (error) throw error;

      // Uppdatera lokal state
      setCompany(prev => prev ? { ...prev, plan: newPlan } : null);
      
      return true;
    } catch (err) {
      console.error('Error upgrading plan:', err);
      setError(err instanceof Error ? err.message : 'Fel vid uppgradering av plan');
      return false;
    }
  };

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  return {
    company,
    activeModules,
    loading,
    error,
    toggleModule,
    getTotalMonthlyCost,
    getAvailableModules,
    getActiveModuleUsages,
    getInactiveAvailableModules,
    upgradePlan,
    refreshData: fetchModuleData
  };
}
