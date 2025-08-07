'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHasModule, useIsAdmin } from '@/providers/PermissionsProvider';
import { PermissionGate } from '@/components/access/PermissionGate';
import { Crown, Package, Users, TrendingUp } from 'lucide-react';

/**
 * Exempel på hur man använder det nya användar- och modulhanteringssystemet
 * i befintliga komponenter
 */

export function DashboardWithPermissions() {
  const hasOffers = useHasModule('offers');
  const hasCampaigns = useHasModule('campaigns');
  const hasAnalytics = useHasModule('analytics');
  const isAdmin = useIsAdmin();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Admin-länk visas bara för administratörer */}
        {isAdmin && (
          <Button variant="outline">
            <Crown className="w-4 h-4 mr-2" />
            Administratörspanel
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bas-moduler (alla har tillgång) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Hantera dina kundkontakter</p>
            <Button className="w-full mt-4">Gå till Leads</Button>
          </CardContent>
        </Card>

        {/* Premium-modul: Offerter */}
        {hasOffers && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Offerter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Skapa professionella offerter</p>
              <Button className="w-full mt-4">Skapa offert</Button>
            </CardContent>
          </Card>
        )}

        {/* Premium-modul: Kampanjer */}
        {hasCampaigns && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Kampanjer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>E-postkampanjer och automation</p>
              <Button className="w-full mt-4">Ny kampanj</Button>
            </CardContent>
          </Card>
        )}

        {/* Premium-modul: Analytics */}
        {hasAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detaljerade rapporter och insights</p>
              <Button className="w-full mt-4">Visa rapporter</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Erbjudande att uppgradera om vissa moduler saknas */}
      {!hasOffers && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Uppgradera till Offerter</h3>
                <p className="text-blue-700 text-sm">
                  Skapa professionella offerter och öka din försäljning
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Aktivera för 99 kr/mån
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin-specifika funktioner */}
      {isAdmin && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <Crown className="w-5 h-5" />
              Administratörsfunktioner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Hantera användare
              </Button>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Hantera moduler
              </Button>
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Företagsinställningar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function NavigationWithPermissions() {
  const hasOffers = useHasModule('offers');
  const hasCampaigns = useHasModule('campaigns');
  const hasEconomy = useHasModule('economy');
  const isAdmin = useIsAdmin();

  const navigationItems = [
    // Bas-moduler (alltid synliga)
    { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
    { name: 'Leads', href: '/leads', icon: Users },
    
    // Konitionella moduler
    ...(hasOffers ? [{ name: 'Offerter', href: '/offers', icon: Package }] : []),
    ...(hasCampaigns ? [{ name: 'Kampanjer', href: '/campaigns', icon: TrendingUp }] : []),
    ...(hasEconomy ? [{ name: 'Ekonomi', href: '/economy', icon: TrendingUp }] : []),
    
    // Admin-funktioner
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: Crown }] : [])
  ];

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
        >
          <item.icon className="w-4 h-4" />
          {item.name}
        </a>
      ))}
    </nav>
  );
}

export function OfferBuilderWithPermissions() {
  return (
    <PermissionGate 
      module="offers"
      fallback={
        <Card className="p-6 text-center">
          <h3 className="font-semibold mb-2">Offerter-modulen krävs</h3>
          <p className="text-gray-600 mb-4">
            Aktivera Offerter-modulen för att skapa professionella offerter
          </p>
          <Button>Aktivera för 99 kr/mån</Button>
        </Card>
      }
    >
      <div>
        {/* Din befintliga OfferBuilder-komponent */}
        <h2>Skapa ny offert</h2>
        {/* ... resten av komponenten */}
      </div>
    </PermissionGate>
  );
}
