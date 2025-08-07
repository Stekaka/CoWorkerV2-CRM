// Exempel på hur du skyddar dina befintliga pages/routes

'use client';

import React from 'react';
import { withModuleAccess } from '@/components/access/PermissionGate';
import { OfferBuilder } from '@/components/offers/OfferBuilder'; // Din befintliga komponent

// Metod 1: Använda HOC för att skydda hela sidan
const ProtectedOffersPage = withModuleAccess(
  function OffersPage() {
    // Din befintliga kod behöver inga ändringar!
    return <OfferBuilder />;
  },
  { module: 'offers' }
);

export default ProtectedOffersPage;

// --------------------------------------------

// Metod 2: Manuell kontroll i page component (om du vill ha mer kontroll)
import { useHasModule } from '@/providers/PermissionsProvider';

export function ManualOffersPage() {
  const hasOffers = useHasModule('offers');
  
  if (!hasOffers) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Åtkomst nekad</h2>
        <p>Du har inte tillgång till offerter.</p>
      </div>
    );
  }
  
  // Din befintliga kod körs som vanligt
  return <OfferBuilder />;
}

// --------------------------------------------

// Metod 3: Använda PermissionGate direkt i layout
import { PermissionGate } from '@/components/access/PermissionGate';

export function ConditionalOffersPage() {
  return (
    <PermissionGate module="offers">
      {/* Din befintliga komponent körs oförändrad */}
      <OfferBuilder />
    </PermissionGate>
  );
}
