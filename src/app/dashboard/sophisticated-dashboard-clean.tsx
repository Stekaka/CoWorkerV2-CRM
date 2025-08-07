'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, TrendingUp, Target, Plus, ArrowRight } from 'lucide-react'
import { useOverlayContext } from '@/components/ui/OverlayContext'
import SophisticatedCalendarWidget from './components/SophisticatedCalendarWidget'

interface User {
  id: string
  name: string
  email: string
}

interface Lead {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

interface Stats {
  totalLeads: number
  newLeads: number
  upcomingReminders: number
  recentLeads: Lead[]
}

interface SophisticatedDashboardProps {
  user: User
  stats: Stats
}

export default function SophisticatedDashboard({ user, stats }: SophisticatedDashboardProps) {
  const { openOverlay } = useOverlayContext()

  const statCards = [
    {
      title: 'Totala Leads',
      value: stats.totalLeads.toString(),
      icon: Users,
      change: '+12%',
      color: 'from-slate-600 to-slate-700'
    },
    {
      title: 'Nya Leads',
      value: stats.newLeads.toString(),
      icon: TrendingUp,
      change: '+5%',
      color: 'from-cyan-600 to-cyan-700'
    },
    {
      title: 'Påminnelser',
      value: stats.upcomingReminders.toString(),
      icon: Calendar,
      change: '3 idag',
      color: 'from-slate-600 to-slate-700'
    },
    {
      title: 'Konvertering',
      value: '68%',
      icon: Target,
      change: '+2.1%',
      color: 'from-cyan-600 to-cyan-700'
    }
  ]

  const quickActions = [
    {
      title: 'Kalender & Uppgifter',
      description: 'Hantera dina aktiviteter och möten',
      icon: Calendar,
      action: () => openOverlay('calendar-dashboard'),
      primary: true
    },
    {
      title: 'CRM System',
      description: 'Hantera leads och kunder',
      icon: Users,
      action: () => openOverlay('crm'),
      primary: false
    },
    {
      title: 'Ekonomi & Budget',
      description: 'Pipeline, intäkter och budget',
      icon: TrendingUp,
      action: () => openOverlay('finance'),
      primary: false
    },
    {
      title: 'Ny Lead',
      description: 'Lägg till ny potentiell kund',
      icon: Plus,
      action: () => openOverlay('new-event'),
      primary: false
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <motion.header 
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-50 mb-3">
                Välkommen tillbaka, {user.name.split(' ')[0]}
              </h1>
              <p className="text-lg text-slate-400">
                Här är en översikt av din verksamhet idag
              </p>
            </div>
            
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold text-slate-200">
                {user.name.charAt(0)}
              </span>
            </motion.div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8">Översikt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-slate-100" />
                  </div>
                  <span className="text-sm text-cyan-400 font-medium">
                    {card.change}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-slate-50 mb-1">
                    {card.value}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {card.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-200">Snabbåtkomst</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className={`
                  text-left p-8 rounded-xl border backdrop-blur-sm group transition-all duration-200
                  ${action.primary 
                    ? 'bg-cyan-600/10 border-cyan-500/20 hover:border-cyan-500/40' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/60'
                  }
                `}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center
                    ${action.primary 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-slate-700/50 text-slate-300'
                    }
                  `}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <ArrowRight className={`
                    w-5 h-5 transition-transform duration-200 group-hover:translate-x-1
                    ${action.primary ? 'text-cyan-400' : 'text-slate-400'}
                  `} />
                </div>
                
                <div>
                  <h3 className={`
                    text-xl font-semibold mb-2
                    ${action.primary ? 'text-cyan-100' : 'text-slate-200'}
                  `}>
                    {action.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Calendar Widget */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <SophisticatedCalendarWidget />
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8">Senaste aktivitet</h2>
          
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
            {stats.recentLeads.length > 0 ? (
              <div className="space-y-4">
                {stats.recentLeads.slice(0, 4).map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                    }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-200">
                          {lead.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{lead.name}</p>
                        <p className="text-sm text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`
                        inline-block px-3 py-1 text-xs font-medium rounded-full
                        ${lead.status === 'qualified' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                        }
                      `}>
                        {lead.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Inga leads än</p>
                <p className="text-slate-500 text-sm">Lägg till din första lead för att komma igång</p>
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}
