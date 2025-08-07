'use client';

import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Plus, Trash2, Edit, Save, X, Package, ToggleLeft, ToggleRight } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
  created_at: string;
}

interface Module {
  name: string;
  display_name: string;
  description: string;
  price: number;
  is_enabled: boolean;
}

export default function CompanySettingsSimple() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'user'>('user');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [showModules, setShowModules] = useState(false);

  const isAdmin = userProfile?.role === 'admin';

  // Define available modules (in a real app, this would come from the database)
  const defaultModules: Module[] = [
    { name: 'leads', display_name: 'Leads', description: 'Hantera potentiella kunder', price: 99, is_enabled: true },
    { name: 'offers', display_name: 'Offerter', description: 'Skapa och hantera offerter', price: 149, is_enabled: true },
    { name: 'notes', display_name: 'Anteckningar', description: 'Hantera anteckningar och kommentarer', price: 49, is_enabled: true },
    { name: 'calendar', display_name: 'Kalender', description: 'Schemaläggning och möten', price: 79, is_enabled: true },
    { name: 'analytics', display_name: 'Analys', description: 'Rapporter och statistik', price: 199, is_enabled: false },
    { name: 'automation', display_name: 'Automatisering', description: 'Automatiska arbetsflöden', price: 299, is_enabled: false },
    { name: 'integrations', display_name: 'Integrationer', description: 'Kopplingar till externa system', price: 399, is_enabled: false },
  ];

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

      if (session.user.email) {
        setUser({ id: session.user.id, email: session.user.email });
        await loadData({ id: session.user.id, email: session.user.email });
      } else {
        console.log('No email found, redirecting to login');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
    }
  };

  const loadData = async (currentUser: { id: string; email: string }) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);

      // Get user profile
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
            // First create or get company
            const { data: org, error: orgError } = await supabase
              .from('companies')
              .select('*')
              .eq('name', 'Drönarkompaniet')
              .single();

            let company = org;
            if (orgError || !org) {
              const { data: newOrg, error: createOrgError } = await supabase
                .from('companies')
                .insert({
                  name: 'Drönarkompaniet'
                })
                .select()
                .single();

              if (createOrgError) throw createOrgError;
              company = newOrg;
            }

            // Create user profile
            const { data: newProfile, error: createProfileError } = await supabase
              .from('users')
              .insert({
                id: currentUser.id,
                email: currentUser.email,
                company_id: company.id,
                role: 'admin',
                name: 'Oliver Eriksson'
              })
              .select()
              .single();

            if (createProfileError) throw createProfileError;
            setUserProfile(newProfile);
            setCompany(company);
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

        // Get company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single();

        if (companyError) {
          console.error('Error loading company:', companyError);
        } else {
          setCompany(companyData);
        }
      }

      // Get all users in the company
      if (profile?.company_id) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('created_at');

        if (usersError) {
          console.error('Error loading users:', usersError);
        } else {
          setCompanyUsers(users || []);
        }
      }

      // Initialize modules (in a real app, this would be loaded from database)
      setAvailableModules(defaultModules);

    } catch (error) {
      console.error('Error loading company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (moduleName: string, enable: boolean) => {
    if (!isAdmin) return;

    try {
      // Update local state (in a real app, this would update the database)
      setAvailableModules(prev => 
        prev.map(module => 
          module.name === moduleName 
            ? { ...module, is_enabled: enable }
            : module
        )
      );

      alert(`Modul "${availableModules.find(m => m.name === moduleName)?.display_name}" ${enable ? 'aktiverad' : 'deaktiverad'}!`);
    } catch (error) {
      console.error('Error toggling module:', error);
      alert('Kunde inte uppdatera modul');
    }
  };

  const handleUpdateCompany = async (newName: string) => {
    if (!company || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update({ name: newName })
        .eq('id', company.id);

      if (error) throw error;
      
      setCompany({ ...company, name: newName });
      setEditingCompany(false);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Kunde inte uppdatera företagsnamn');
    }
  };

  const handleInviteUser = async () => {
    if (!userProfile || !isAdmin || !inviteEmail.trim()) return;

    try {
      // For now, we'll create a mock user entry since we don't have real auth integration
      // In a real app, this would send an invitation email and the user would sign up
      const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('users')
        .insert({
          id: mockUserId,
          email: inviteEmail.trim(),
          company_id: userProfile.company_id,
          role: inviteRole,
          name: inviteEmail.split('@')[0].charAt(0).toUpperCase() + inviteEmail.split('@')[0].slice(1)
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Reload data
      if (user?.email) {
        await loadData({ id: user.id, email: user.email });
      }
      
      setInviteEmail('');
      setInviteRole('user');
      setShowInviteForm(false);
      alert(`Användare ${inviteEmail} har lagts till!\n\nOBS: Detta är en demo-version. I en riktig app skulle en inbjudan skickas via e-post.`);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert(`Kunde inte lägga till användare: ${(error as any)?.message || 'Okänt fel'}`);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!isAdmin || userId === user?.id) return;

    if (!confirm('Är du säker på att du vill ta bort denna användare?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Reload data
      if (user?.email) {
        await loadData({ id: user.id, email: user.email });
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Kunde inte ta bort användare');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!isAdmin || userId === user?.id) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Reload data
      if (user?.email) {
        await loadData({ id: user.id, email: user.email });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Kunde inte uppdatera användarroll');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Laddar företagsinställningar...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingen användarsession</h2>
        <p className="text-gray-600 mb-4">Du måste vara inloggad för att se denna sida.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Logga in
        </button>
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
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start md:items-center gap-3">
        <Building className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mt-1 md:mt-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold">Företagsinställningar</h1>
          <p className="text-sm md:text-base text-gray-600">Hantera användare för ditt företag</p>
        </div>
      </div>

      {/* Admin Warning for non-admins */}
      {!isAdmin && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-orange-700">
              <Building className="h-4 w-4" />
              <span className="text-sm">
                Endast administratörer kan redigera företagsinformation och hantera användare. 
                Kontakta din administratör för ändringar.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Företagsinformation
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingCompany(!editingCompany)}
              >
                {editingCompany ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Företagsnamn:</span>
              {editingCompany ? (
                <div className="flex gap-2">
                  <Input
                    defaultValue={company?.name || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCompany((e.target as HTMLInputElement).value);
                      }
                    }}
                    className="w-48"
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) handleUpdateCompany(input.value);
                    }}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                company?.name || 'Ej angivet'
              )}
            </div>
            <div>
              <span className="font-medium">Skapat:</span> {company?.created_at ? new Date(company.created_at).toLocaleDateString('sv-SE') : 'Okänt'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Din profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Namn:</span> {userProfile.name || 'Ej angivet'}
            </div>
            <div>
              <span className="font-medium">E-post:</span> {userProfile.email}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Roll:</span>
              <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                {userProfile.role === 'admin' ? 'Administratör' : 'Användare'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Moduler
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModules(!showModules)}
              >
                {showModules ? 'Dölj' : 'Visa'} moduler
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdmin ? (
            <p className="text-gray-600">Endast administratörer kan hantera moduler.</p>
          ) : !showModules ? (
            <p className="text-gray-600">Klicka &quot;Visa moduler&quot; för att hantera tillgängliga funktioner.</p>
          ) : (
            <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Hantera vilka moduler som är aktiva för ditt företag. Aktiva moduler kostar{' '}
                  <span className="font-medium">
                    {availableModules.filter(m => m.is_enabled).reduce((sum, m) => sum + m.price, 0)} kr/månad
                  </span>
                </p>              {availableModules.map(module => (
                <div key={module.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{module.display_name}</h4>
                      <Badge variant={module.is_enabled ? 'default' : 'outline'}>
                        {module.is_enabled ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <span className="text-sm text-gray-500">{module.price} kr/mån</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleModule(module.name, !module.is_enabled)}
                      className="p-2"
                    >
                      {module.is_enabled ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Kostnadsammanfattning</h4>
                <div className="text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Aktiva moduler:</span>
                    <span>{availableModules.filter(m => m.is_enabled).length} st</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total kostnad per månad:</span>
                    <span>{availableModules.filter(m => m.is_enabled).reduce((sum, m) => sum + m.price, 0)} kr</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Användare ({companyUsers.length})
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowInviteForm(!showInviteForm)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Lägg till användare
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Invite Form */}
          {showInviteForm && isAdmin && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h4 className="font-medium mb-3">Lägg till ny användare</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="E-postadress"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'user')}
                >
                  <option value="user">Användare</option>
                  <option value="admin">Administratör</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={handleInviteUser} disabled={!inviteEmail.trim()}>
                    Lägg till
                  </Button>
                  <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                    Avbryt
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {companyUsers.map(companyUser => (
              <div key={companyUser.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {companyUser.name || companyUser.email}
                      </h3>
                      {editingUser === companyUser.id ? (
                        <select
                          className="px-2 py-1 border rounded text-sm"
                          defaultValue={companyUser.role}
                          onChange={(e) => {
                            handleUpdateUserRole(companyUser.id, e.target.value as 'admin' | 'user');
                            setEditingUser(null);
                          }}
                        >
                          <option value="user">Användare</option>
                          <option value="admin">Administratör</option>
                        </select>
                      ) : (
                        <Badge 
                          variant={companyUser.role === 'admin' ? 'default' : 'secondary'}
                        >
                          {companyUser.role === 'admin' ? 'Admin' : 'Användare'}
                        </Badge>
                      )}
                      {companyUser.id === user?.id && (
                        <Badge variant="outline">Du</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{companyUser.email}</p>
                  </div>
                  
                  {isAdmin && companyUser.id !== user?.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(editingUser === companyUser.id ? null : companyUser.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(companyUser.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="pt-4">
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Tillbaka till Dashboard
        </Button>
      </div>
    </div>
  );
}
