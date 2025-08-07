'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import { UserProfile, CompanySettings, UserInvitation, UserFormData } from '@/types/user-management';
import { ModuleName, UserRole } from '@/types/user-management';

export function useUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [pendingInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Hämta alla användare för företaget
  const fetchUsers = useCallback(async () => {
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

      // Hämta alla användare i företaget
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          role,
          permissions,
          created_at,
          updated_at
        `)
        .eq('company_id', currentUser.company_id);

      if (usersError) throw usersError;

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

      // Formatera användare
      const formattedUsers: UserProfile[] = usersData?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        status: 'active' as const,
        company_id: currentUser.company_id,
        allowed_modules: user.permissions?.modules || [],
        permissions: user.permissions || { modules: [], features: {}, role: 'user' },
        created_at: user.created_at,
        updated_at: user.updated_at
      })) || [];

      // Formatera företag
      const formattedCompany: CompanySettings = {
        id: companyData.id,
        name: companyData.name,
        enabled_modules: companyData.enabled_modules || [],
        plan: companyData.plan || 'basic',
        max_users: companyData.plan === 'enterprise' ? -1 : (companyData.plan === 'premium' ? 25 : 5),
        current_users: formattedUsers.length,
        billing_email: '', // TODO: Lägg till i databas
        subscription_status: 'active' as const,
        created_at: companyData.created_at,
        updated_at: companyData.updated_at
      };

      setUsers(formattedUsers);
      setCompany(formattedCompany);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Fel vid hämtning av användare');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Bjud in ny användare
  const inviteUser = async (userData: UserFormData): Promise<boolean> => {
    try {
      if (!company) throw new Error('Företagsinformation saknas');

      // Kontrollera att företaget inte överskrider användarmax
      if (company.max_users > 0 && users.length >= company.max_users) {
        throw new Error(`Ditt ${company.plan}-abonnemang tillåter max ${company.max_users} användare`);
      }

      // För nu: skapa användaren direkt (i produktion: skicka e-post med invitation)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          company_id: company.id,
          permissions: {
            modules: userData.allowed_modules,
            features: {},
            role: userData.role
          }
        });

      if (insertError) throw insertError;

      // Uppdatera lokal state
      await fetchUsers();
      
      return true;
    } catch (err) {
      console.error('Error inviting user:', err);
      setError(err instanceof Error ? err.message : 'Fel vid inbjudan av användare');
      return false;
    }
  };

  // Uppdatera användarens moduler
  const updateUserModules = async (userId: string, modules: ModuleName[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          permissions: {
            modules: modules,
            features: {},
            role: users.find(u => u.id === userId)?.role || 'user'
          }
        })
        .eq('id', userId);

      if (error) throw error;

      // Uppdatera lokal state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, allowed_modules: modules, permissions: { ...user.permissions, modules } }
          : user
      ));

      return true;
    } catch (err) {
      console.error('Error updating user modules:', err);
      setError(err instanceof Error ? err.message : 'Fel vid uppdatering av moduler');
      return false;
    }
  };

  // Uppdatera användarens roll
  const updateUserRole = async (userId: string, role: UserProfile['role']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      // Uppdatera lokal state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));

      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Fel vid uppdatering av roll');
      return false;
    }
  };

  // Ta bort användare
  const removeUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Uppdatera lokal state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      return true;
    } catch (err) {
      console.error('Error removing user:', err);
      setError(err instanceof Error ? err.message : 'Fel vid borttagning av användare');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    company,
    pendingInvitations,
    loading,
    error,
    inviteUser,
    updateUserModules,
    updateUserRole,
    removeUser,
    refreshData: fetchUsers
  };
}
