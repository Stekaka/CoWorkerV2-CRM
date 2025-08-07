'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface NavigationSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  currentTime?: Date
  isDragMode?: boolean
  onToggleDragMode?: () => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  submenu?: {
    id: string
    label: string
    href: string
  }[]
}

export default function NavigationSidebar({ 
  activeSection = 'dashboard', 
  onSectionChange, 
  currentTime, 
  isDragMode, 
  onToggleDragMode 
}: NavigationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      submenu: [
        { id: 'dashboard-overview', label: 'Översikt', href: '/dashboard' }
      ]
    },
    {
      id: 'leads',
      label: 'Leads & CRM',
      icon: Users,
      badge: 12,
      submenu: [
        { id: 'leads-overview', label: 'Alla Leads', href: '/leads' },
        { id: 'leads-new', label: 'Ny Lead', href: '/leads/new' },
        { id: 'leads-pipeline', label: 'Pipeline', href: '/leads/pipeline' },
        { id: 'leads-reports', label: 'Rapporter', href: '/leads/reports' }
      ]
    },
    {
      id: 'calendar',
      label: 'Kalender & Uppgifter',
      icon: Calendar,
      badge: 3,
      submenu: [
        { id: 'calendar-overview', label: 'Kalendervy', href: '/calendar' },
        { id: 'calendar-meeting', label: 'Boka Möte', href: '/calendar/new-meeting' },
        { id: 'calendar-tasks', label: 'Uppgifter', href: '/calendar/tasks' },
        { id: 'calendar-reminders', label: 'Påminnelser', href: '/calendar/reminders' }
      ]
    },
    {
      id: 'economy',
      label: 'Ekonomi & Budget',
      icon: DollarSign,
      submenu: [
        { id: 'economy-overview', label: 'Översikt', href: '/economy' },
        { id: 'economy-budget', label: 'Budget', href: '/dashboard/budget' },
        { id: 'economy-orders', label: 'Orders', href: '/dashboard/orders' },
        { id: 'economy-invoices', label: 'Fakturor', href: '/economy/invoices' }
      ]
    },
    {
      id: 'quotes',
      label: 'Offerter & Projekt',
      icon: FileText,
      badge: 5,
      submenu: [
        { id: 'quotes-overview', label: 'Alla Offerter', href: '/quotes' },
        { id: 'quotes-new', label: 'Ny Offert', href: '/quotes/new' },
        { id: 'quotes-templates', label: 'Mallar', href: '/quotes/templates' },
        { id: 'quotes-projects', label: 'Projekt', href: '/quotes/projects' }
      ]
    },
    {
      id: 'communication',
      label: 'Kommunikation',
      icon: Mail,
      submenu: [
        { id: 'communication-email', label: 'E-post', href: '/emails/compose' },
        { id: 'communication-calls', label: 'Samtal', href: '/calls/new' },
        { id: 'communication-campaigns', label: 'Kampanjer', href: '/communication/campaigns' },
        { id: 'communication-templates', label: 'E-postmallar', href: '/communication/templates' }
      ]
    },
    {
      id: 'reports',
      label: 'Rapporter & Analys',
      icon: BarChart3,
      submenu: [
        { id: 'reports-overview', label: 'Översikt', href: '/reports' },
        { id: 'reports-sales', label: 'Försäljning', href: '/reports/sales' },
        { id: 'reports-pipeline', label: 'Pipeline', href: '/reports/pipeline' },
        { id: 'reports-activities', label: 'Aktiviteter', href: '/reports/activities' }
      ]
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      submenu: [
        { id: 'automation-overview', label: 'Översikt', href: '/automation' },
        { id: 'automation-workflows', label: 'Arbetsflöden', href: '/automation/workflows' },
        { id: 'automation-triggers', label: 'Triggers', href: '/automation/triggers' },
        { id: 'automation-templates', label: 'Mallar', href: '/automation/templates' }
      ]
    },
    {
      id: 'notes',
      label: 'Anteckningar',
      icon: Target,
      submenu: [
        { id: 'notes-overview', label: 'Alla Anteckningar', href: '/notes' },
        { id: 'notes-new', label: 'Ny Anteckning', href: '/notes/new' },
        { id: 'notes-categories', label: 'Kategorier', href: '/notes/categories' },
        { id: 'notes-search', label: 'Sök', href: '/notes/search' }
      ]
    },
    {
      id: 'settings',
      label: 'Inställningar',
      icon: Settings,
      submenu: [
        { id: 'settings-profile', label: 'Profil', href: '/settings' },
        { id: 'settings-company', label: 'Företag', href: '/settings/company' },
        { id: 'settings-integrations', label: 'Integrationer', href: '/settings/integrations' },
        { id: 'settings-security', label: 'Säkerhet', href: '/settings/security' }
      ]
    }
  ]

  const handleMenuClick = (itemId: string) => {
    if (onSectionChange) {
      onSectionChange(itemId)
    }
    
    // Toggle submenu expansion
    if (expandedMenu === itemId) {
      setExpandedMenu(null)
    } else {
      setExpandedMenu(itemId)
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col h-screen sticky top-0"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">CoWorker</h1>
              <p className="text-slate-400 text-sm">Premium CRM</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.id}>
            <motion.button
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-200' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.id === 'dashboard' ? (
                <Link href="/dashboard" className="w-full flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ) : (
                <>
                  <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <motion.div
                          animate={{ rotate: expandedMenu === item.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </>
                  )}
                </>
              )}
            </motion.button>

            {/* Submenu */}
            {!isCollapsed && item.submenu && (
              <AnimatePresence>
                {expandedMenu === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8 mt-2 space-y-1 overflow-hidden"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className="block p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/30 rounded-lg transition-colors duration-200 text-sm"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-slate-700">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Dölj meny</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
