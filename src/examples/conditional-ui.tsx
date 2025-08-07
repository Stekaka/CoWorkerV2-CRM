// Exempel på hur du lägger till permissions i befintliga komponenter

'use client';

import React from 'react';
import { Plus, Edit, Trash2, Send } from 'lucide-react';
import { PermissionGate } from '@/components/access/PermissionGate';
import { useHasFeature } from '@/providers/PermissionsProvider';

// Exempel på att uppdatera din befintliga toolbar/header
const LeadsToolbar = () => {
  // Hook för mer komplex logik
  const canDelete = useHasFeature('leads', 'delete');
  
  return (
    <div className="flex items-center space-x-3 p-4 bg-white border-b">
      
      {/* Visa "Skapa" endast om användaren kan skapa leads */}
      <PermissionGate module="leads" feature="create">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Skapa Lead
        </button>
      </PermissionGate>

      {/* Visa "Redigera" endast om användaren kan redigera */}
      <PermissionGate module="leads" feature="edit">
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg">
          <Edit className="w-4 h-4 mr-2" />
          Redigera
        </button>
      </PermissionGate>

      {/* Använd hook för conditional rendering */}
      {canDelete && (
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
          <Trash2 className="w-4 h-4 mr-2" />
          Ta bort
        </button>
      )}

      {/* Export endast för vissa roller */}
      <PermissionGate module="leads" feature="export">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Exportera
        </button>
      </PermissionGate>

    </div>
  );
};

// --------------------------------------------

// Exempel på att uppdatera din befintliga offerkomponent
const OfferActions = () => {
  return (
    <div className="flex items-center space-x-2">
      
      {/* Spara - alla kan spara sina egna offerter */}
      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded">
        Spara
      </button>

      {/* Skicka - endast om användaren kan skicka offerter */}
      <PermissionGate module="offers" feature="send">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          <Send className="w-4 h-4 mr-1" />
          Skicka
        </button>
      </PermissionGate>

      {/* Ta bort - endast om användaren kan ta bort */}
      <PermissionGate module="offers" feature="delete">
        <button className="px-3 py-1 bg-red-600 text-white rounded">
          Ta bort
        </button>
      </PermissionGate>

    </div>
  );
};

// --------------------------------------------

// Exempel på conditional content i en dashboard
const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Leads widget - endast om användaren har tillgång */}
      <PermissionGate module="leads">
        <DashboardWidget title="Leads" count={42} />
      </PermissionGate>

      {/* Offers widget - endast om användaren har tillgång */}
      <PermissionGate module="offers">
        <DashboardWidget title="Offerter" count={18} />
      </PermissionGate>

      {/* Analytics widget - endast om användaren har tillgång */}
      <PermissionGate module="analytics">
        <DashboardWidget title="Försäljning" count="1.2M kr" />
      </PermissionGate>

    </div>
  );
};

// Din befintliga widget komponent behöver inga ändringar
const DashboardWidget = ({ title, count }: { title: string; count: string | number }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-600">{count}</p>
  </div>
);

export { LeadsToolbar, OfferActions, Dashboard };
