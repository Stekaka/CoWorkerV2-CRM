'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Calculator, 
  BarChart3, 
  CheckSquare,
  Mail,
  Settings,
  Folder
} from 'lucide-react';
import { PermissionGate } from '@/components/access/PermissionGate';
import { useHasModule } from '@/providers/PermissionsProvider';

// Exempel på hur du uppdaterar din befintliga navigation
const NavigationWithPermissions = () => {
  // Du kan också använda hooks för mer komplex logik
  const hasEconomy = useHasModule('economy');
  
  return (
    <nav className="bg-white shadow-sm border-r border-gray-200">
      <div className="p-4 space-y-2">
        
        {/* Leads - endast om användaren har tillgång */}
        <PermissionGate module="leads">
          <NavItem 
            href="/leads" 
            icon={Users} 
            label="Leads" 
          />
        </PermissionGate>

        {/* Notes - endast om användaren har tillgång */}
        <PermissionGate module="notes">
          <NavItem 
            href="/notes" 
            icon={FileText} 
            label="Anteckningar" 
          />
        </PermissionGate>

        {/* Offers - endast om användaren har tillgång */}
        <PermissionGate module="offers">
          <NavItem 
            href="/offers" 
            icon={Calculator} 
            label="Offerter" 
          />
        </PermissionGate>

        {/* Tasks - endast om användaren har tillgång */}
        <PermissionGate module="tasks">
          <NavItem 
            href="/tasks" 
            icon={CheckSquare} 
            label="Uppgifter" 
          />
        </PermissionGate>

        {/* Analytics - endast om användaren har tillgång */}
        <PermissionGate module="analytics">
          <NavItem 
            href="/analytics" 
            icon={BarChart3} 
            label="Analys" 
          />
        </PermissionGate>

        {/* Economy - använd hook för mer komplex logik */}
        {hasEconomy && (
          <NavItem 
            href="/economy" 
            icon={Calculator} 
            label="Ekonomi" 
          />
        )}

        {/* Campaigns - endast för vissa features */}
        <PermissionGate module="campaigns" feature="view">
          <NavItem 
            href="/campaigns" 
            icon={Mail} 
            label="Kampanjer" 
          />
        </PermissionGate>

        {/* Files - endast om användaren har tillgång */}
        <PermissionGate module="files">
          <NavItem 
            href="/files" 
            icon={Folder} 
            label="Filer" 
          />
        </PermissionGate>

        {/* Settings - endast för admin */}
        <PermissionGate module="settings" feature="view">
          <NavItem 
            href="/settings" 
            icon={Settings} 
            label="Inställningar" 
          />
        </PermissionGate>

      </div>
    </nav>
  );
};

// Din befintliga NavItem komponent behöver inga ändringar
interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => (
  <Link 
    href={href}
    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export default NavigationWithPermissions;
