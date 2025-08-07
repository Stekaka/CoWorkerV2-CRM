'use client';

import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  Plus, 
  Trash2, 
  Check, 
  X,
  Shield,
  Star,
  Building
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_per_month: number;
  is_core: boolean;
}

interface OrganizationModule {
  id: string;
  company_id: string;
  module_name: string;
  is_enabled: boolean;
  purchased_at: string;
  expires_at?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
  company_id: string;
  created_at: string;
}

interface UserModuleAccess {
  id: string;
  user_id: string;
  module_name: string;
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
}

export default function CompanySettings() {
  // State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [organizationModules, setOrganizationModules] = useState<OrganizationModule[]>([]);
  const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
  const [userModuleAccess, setUserModuleAccess] = useState<Record<string, UserModuleAccess[]>>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user');
  const [selectedModulesForInvite, setSelectedModulesForInvite] = useState<string[]>([]);

  // Check if current user is admin
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'owner';

  // Load current user
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        console.log('No session found, redirecting to login');
        window.location.href = '/login';
        return;
      }

      setUser(session.user);
      await loadData(session.user);
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
    }
  };

  const loadData = async (currentUser: any) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);

      // Get user profile with organization
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError || !profile) {
        console.error('Error loading user profile:', profileError);
        // Create a default profile for oliver@dronarkompaniet.se if it doesn't exist
        if (currentUser.email === 'oliver@dronarkompaniet.se') {
          try {
            // First create or get organization
            const { data: org, error: orgError } = await supabase
              .from('companies')
              .select('*')
              .eq('name', 'Drönarkompaniet')
              .single();

            let companyId;
            if (orgError || !org) {
              const { data: newOrg, error: createOrgError } = await supabase
                .from('companies')
                .insert({
                  name: 'Drönarkompaniet',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .single();

              if (createOrgError) throw createOrgError;
              companyId = newOrg.id;
            } else {
              companyId = org.id;
            }

            // Create user profile
            const { data: newProfile, error: createProfileError } = await supabase
              .from('users')
              .insert({
                id: currentUser.id,
                email: currentUser.email,
                company_id: companyId,
                role: 'admin',
                name: 'Oliver Eriksson',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (createProfileError) throw createProfileError;
            setUserProfile(newProfile);
          } catch (createError) {
            console.error('Error creating profile for Oliver:', createError);
            setLoading(false);
            return;
          }
        } else {
          setLoading(false);
          return;
        }
      } else {
        setUserProfile(profile);
      }

      // If this is Oliver and no modules exist, create default ones
      const currentProfile = profile || userProfile;
      // Skip module creation for now since module tables don't exist yet
      // This can be implemented when migration 003 is run

      setUserProfile(profile);

      // Get all available modules
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('name');

      if (modulesError) {
        console.error('Error loading modules:', modulesError);
      } else {
        setAvailableModules(modules || []);
      }

      // Get organization's active modules
      const { data: orgModules, error: orgModulesError } = await supabase
        .from('organization_modules')
        .select('*')
        .eq('organization_id', profile.company_id);

      if (orgModulesError) {
        console.error('Error loading organization modules:', orgModulesError);
      } else {
        setOrganizationModules(orgModules || []);
      }

      // Get all users in the organization
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('organization_id', profile.company_id)
        .order('created_at');

      if (usersError) {
        console.error('Error loading users:', usersError);
      } else {
        setCompanyUsers(users || []);
      }

      // Get user module access for all users
      const { data: moduleAccess, error: moduleAccessError } = await supabase
        .from('user_module_access')
        .select('*')
        .eq('organization_id', profile.company_id);

      if (moduleAccessError) {
        console.error('Error loading module access:', moduleAccessError);
      } else {
        // Group by user_id
        const accessByUser: Record<string, UserModuleAccess[]> = {};
        (moduleAccess || []).forEach((access: UserModuleAccess) => {
          if (!accessByUser[access.user_id]) {
            accessByUser[access.user_id] = [];
          }
          accessByUser[access.user_id].push(access);
        });

        setUserModuleAccess(accessByUser);
      }

    } catch (error) {
      console.error('Error loading company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (moduleName: string, enable: boolean) => {
    if (!userProfile || !isAdmin) return;

    try {
      if (enable) {
        // Add module to organization
        await supabase
          .from('organization_modules')
          .insert({
            organization_id: userProfile.company_id,
            module_name: moduleName,
            is_enabled: true
          });
      } else {
        // Remove module from organization
        await supabase
          .from('organization_modules')
          .delete()
          .eq('organization_id', userProfile.company_id)
          .eq('module_name', moduleName);

        // Also remove user access to this module
        await supabase
          .from('user_module_access')
          .delete()
          .eq('organization_id', userProfile.company_id)
          .eq('module_name', moduleName);
      }

      // Reload data
      await loadData(user);
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  const handleToggleUserModuleAccess = async (userId: string, moduleName: string, grant: boolean) => {
    if (!userProfile || !isAdmin) return;

    try {
      if (grant) {
        // Grant access
        await supabase
          .from('user_module_access')
          .insert({
            user_id: userId,
            organization_id: userProfile.company_id,
            module_name: moduleName,
            granted_by: user?.id,
            is_active: true
          });
      } else {
        // Revoke access
        await supabase
          .from('user_module_access')
          .delete()
          .eq('user_id', userId)
          .eq('organization_id', userProfile.company_id)
          .eq('module_name', moduleName);
      }

      // Reload data
      await loadData(user);
    } catch (error) {
      console.error('Error toggling user module access:', error);
    }
  };

  const handleInviteUser = async () => {
    if (!userProfile || !isAdmin || !inviteEmail.trim()) return;

    try {
      // Use the invite function from our migration
      const { error } = await supabase.rpc('invite_user_to_organization', {
        p_email: inviteEmail.trim(),
        p_organization_id: userProfile.company_id,
        p_role: inviteRole,
        p_modules: selectedModulesForInvite
      });

      if (error) throw error;

      // Reset form
      setInviteEmail('');
      setInviteRole('user');
      setSelectedModulesForInvite([]);

      // TODO: Send actual email invitation
      alert(`Inbjudan skickad till ${inviteEmail}`);

    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Kunde inte skicka inbjudan');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!userProfile || !isAdmin || userId === user?.id) return;

    if (confirm('Är du säker på att du vill ta bort denna användare?')) {
      try {
        // Remove user profile
        await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', userId)
          .eq('organization_id', userProfile.company_id);

        // Reload data
        await loadData(user);
      } catch (error) {
        console.error('Error removing user:', error);
      }
    }
  };

  // Helper functions
  const isModuleActive = (moduleName: string) => {
    return organizationModules.some(om => om.module_name === moduleName && om.is_enabled);
  };

  const hasUserModuleAccess = (userId: string, moduleName: string) => {
    return userModuleAccess[userId]?.some(access => 
      access.module_name === moduleName && access.is_active
    ) || false;
  };

  const formatPrice = (priceInOre: number) => {
    return `${(priceInOre / 100).toFixed(0)} kr/mån`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Laddar företagsinställningar...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Användarprofil saknas</h2>
          <p className="text-gray-600 mb-4">
            {user?.email === 'oliver@dronarkompaniet.se' 
              ? 'Skapar profil för Oliver...' 
              : `Ingen användarprofil hittades för ${user?.email || 'denna användare'}`
            }
          </p>
          {user?.email !== 'oliver@dronarkompaniet.se' && (
            <p className="text-sm text-gray-500 mb-4">
              Kontakta din administratör för att skapa en användarprofil.
            </p>
          )}
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tillbaka till Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Företagsinställningar</h1>
          <p className="text-gray-600">Hantera moduler och användare för ditt företag</p>
        </div>
      </div>

      {/* Admin Warning */}
      {!isAdmin && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-orange-700">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                Endast administratörer kan ändra moduler och användare. 
                Kontakta din administratör för ändringar.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Moduler
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Användare
          </TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktiva moduler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {availableModules.map(module => {
                  const isActive = isModuleActive(module.name);
                  
                  return (
                    <div 
                      key={module.id}
                      className={`p-4 border rounded-lg ${
                        isActive 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{module.display_name}</h3>
                            {module.is_core && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Bas
                              </Badge>
                            )}
                            {isActive && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Aktiv
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {module.description}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            {formatPrice(module.price_per_month)}
                          </p>
                        </div>
                        
                        {isAdmin && (
                          <Button
                            variant={isActive ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleModule(module.name, !isActive)}
                          >
                            {isActive ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Inaktivera
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Aktivera
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Invite User (Admin only) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Bjud in ny användare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="E-postadress"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'user' | 'admin')}
                  >
                    <option value="user">Användare</option>
                    <option value="admin">Administratör</option>
                  </select>
                  <Button onClick={handleInviteUser} disabled={!inviteEmail.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Skicka inbjudan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Användare ({companyUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyUsers.map(companyUser => (
                  <div key={companyUser.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {companyUser.name || companyUser.email}
                          </h3>
                          <Badge 
                            variant={companyUser.role === 'admin' ? 'default' : 'secondary'}
                          >
                            {companyUser.role === 'admin' ? 'Admin' : 'Användare'}
                          </Badge>
                          {companyUser.user_id === user?.id && (
                            <Badge variant="outline">Du</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{companyUser.email}</p>
                      </div>
                      
                      {isAdmin && companyUser.user_id !== user?.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(companyUser.user_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Module Access */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Modulaccess:</h4>
                      <div className="flex flex-wrap gap-2">
                        {organizationModules
                          .filter(om => om.is_enabled)
                          .map(orgModule => {
                            const hasAccess = hasUserModuleAccess(companyUser.user_id, orgModule.module_name);
                            const moduleInfo = availableModules.find(m => m.name === orgModule.module_name);
                            
                            return (
                              <div key={orgModule.module_name} className="flex items-center gap-1">
                                <Badge 
                                  variant={hasAccess ? 'default' : 'outline'}
                                  className="text-xs"
                                >
                                  {moduleInfo?.display_name || orgModule.module_name}
                                </Badge>
                                {isAdmin && companyUser.user_id !== user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleToggleUserModuleAccess(
                                      companyUser.user_id, 
                                      orgModule.module_name, 
                                      !hasAccess
                                    )}
                                  >
                                    {hasAccess ? (
                                      <X className="h-3 w-3" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
