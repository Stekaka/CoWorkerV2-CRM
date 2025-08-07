'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, FileText, Users, Plus, Zap, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuickActionsBar() {
  const router = useRouter()

  const quickActions = [
    {
      id: 'new-lead',
      title: 'Ny Lead',
      description: 'Lägg till ny kund eller prospekt',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      shortcut: 'Cmd+N',
      action: () => router.push('/leads/new')
    },
    {
      id: 'make-call',
      title: 'Ring Kund',
      description: 'Starta ett samtal med kund',
      icon: Phone,
      color: 'from-emerald-500 to-emerald-600',
      shortcut: 'Cmd+C',
      action: () => router.push('/calls/new')
    },
    {
      id: 'send-email',
      title: 'Skicka Mail',
      description: 'Komponera nytt e-postmeddelande',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      shortcut: 'Cmd+M',
      action: () => router.push('/emails/compose')
    },
    {
      id: 'schedule-meeting',
      title: 'Boka Möte',
      description: 'Schemalägg ett nytt möte',
      icon: Calendar,
      color: 'from-violet-500 to-violet-600',
      shortcut: 'Cmd+B',
      action: () => router.push('/calendar/new-meeting')
    },
    {
      id: 'create-quote',
      title: 'Skapa Offert',
      description: 'Generera ny offert eller faktura',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      shortcut: 'Cmd+Q',
      action: () => router.push('/quotes/new')
    },
    {
      id: 'quick-note',
      title: 'Snabb Anteckning',
      description: 'Lägg till viktig information',
      icon: Plus,
      color: 'from-pink-500 to-pink-600',
      shortcut: 'Cmd+/',
      action: () => router.push('/notes/new')
    }
  ]

  const systemActions = [
    {
      id: 'automation',
      title: 'Automatisering',
      description: 'Hantera workflows och automationer',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      shortcut: 'Cmd+A',
      action: () => router.push('/automation')
    },
    {
      id: 'settings',
      title: 'Inställningar',
      description: 'Konfigurera ditt konto',
      icon: Settings,
      color: 'from-slate-500 to-slate-600',
      shortcut: 'Cmd+,',
      action: () => router.push('/settings')
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="col-span-12 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-1">Snabbåtgärder</h3>
          <p className="text-slate-400 text-sm">Utför vanliga uppgifter direkt från dashboard</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
          <Zap className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 rounded-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg group-hover:shadow-lg transition-shadow duration-200`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-100 text-sm">{action.title}</div>
                  <div className="text-xs text-slate-500">{action.shortcut}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
            </motion.button>
          )
        })}
      </div>

      {/* System Actions */}
      <div className="border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">System</h4>
        <div className="grid grid-cols-2 gap-4">
          {systemActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="p-3 bg-slate-800/30 hover:bg-slate-700/40 border border-slate-700/20 hover:border-slate-600/40 rounded-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg group-hover:shadow-lg transition-shadow duration-200`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-100 text-sm">{action.title}</div>
                    <div className="text-xs text-slate-500">{action.shortcut}</div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
