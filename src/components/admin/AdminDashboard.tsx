'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  Settings, 
  Crown,
  TrendingUp,
  Shield,
  BarChart3,
  Bell
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { ModuleManagement } from './ModuleManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useModuleManagement } from '@/hooks/useModuleManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    users,
    company: userCompany,
    loading: usersLoading
  } = useUserManagement();

  const {
    company: moduleCompany,
    getTotalMonthlyCost,
    getActiveModuleUsages,
    loading: modulesLoading
  } = useModuleManagement();

  const company = userCompany || moduleCompany;
  const loading = usersLoading || modulesLoading;

  const totalMonthlyCost = getTotalMonthlyCost();
  const activeModules = getActiveModuleUsages();
  const adminUsers = users.filter(u => u.role === 'admin');

  const getQuickStats = () => {
    return [
      {
        title: 'Totalt användare',
        value: users.length,
        max: company?.max_users === -1 ? '∞' : company?.max_users,
        icon: Users,
        color: 'blue',
        description: `${users.filter(u => u.status === 'active').length} aktiva`
      },
      {
        title: 'Aktiva moduler',
        value: activeModules.length,
        icon: Package,
        color: 'purple',
        description: `${activeModules.filter(m => m.monthly_cost > 0).length} premium`
      },
      {
        title: 'Månadsaktnad',
        value: `${totalMonthlyCost} kr`,
        icon: TrendingUp,
        color: 'green',
        description: 'Exklusive användaravgift'
      },
      {
        title: 'Administratörer',
        value: adminUsers.length,
        icon: Shield,
        color: 'orange',
        description: 'Med fullständig access'
      }
    ];
  };

  const getRecentActivity = () => {
    return [
      { 
        title: 'Ny användare tillagd', 
        description: 'Anna Andersson bjöds in som användare',
        time: '2 tim sedan',
        type: 'user'
      },
      { 
        title: 'Modul aktiverad', 
        description: 'Offert-modulen aktiverades för företaget',
        time: '1 dag sedan',
        type: 'module'
      },
      { 
        title: 'Användarroll ändrad', 
        description: 'Erik Eriksson blev administratör',
        time: '3 dagar sedan',
        type: 'role'
      }
    ];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administratörspanel</h1>
          <p className="text-gray-600 mt-1">
            Hantera användare, moduler och inställningar för {company?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifieringar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Inställningar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="users">Användarhantering</TabsTrigger>
          <TabsTrigger value="modules">Modulhantering</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickStats().map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-600`}>
                        {stat.value}
                        {stat.max && <span className="text-sm text-gray-500">/{stat.max}</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Company overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Företagsinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Företagsnamn:</span>
                  <span className="font-medium">{company?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abonnemangsplan:</span>
                  <span className="font-medium capitalize">{company?.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abonnemangsstatus:</span>
                  <span className={`font-medium ${
                    company?.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company?.subscription_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medlem sedan:</span>
                  <span className="font-medium">
                    {company?.created_at ? new Date(company.created_at).toLocaleDateString('sv-SE') : '-'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Senaste aktivitet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentActivity().map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'module' ? 'bg-purple-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabbåtgärder</CardTitle>
              <CardDescription>
                Vanliga administrativa uppgifter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="w-6 h-6" />
                  <span>Bjud in användare</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('modules')}
                >
                  <Package className="w-6 h-6" />
                  <span>Aktivera modul</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Uppgradera plan</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Settings className="w-6 h-6" />
                  <span>Företagsinställningar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="modules">
          <ModuleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
