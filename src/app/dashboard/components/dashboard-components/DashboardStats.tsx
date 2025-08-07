'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, CheckSquare, DollarSign } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalLeads: number
    hotLeads: number
    pipelineValue: number
    monthlyRevenue: number
    completedTodos: number
    totalTodos: number
    todayTasks: any[]
    todayMeetings: number
    pendingOffers: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const quickStats = [
    {
      title: 'Aktiva Leads',
      value: stats.totalLeads,
      subtitle: `${stats.hotLeads} heta`,
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      change: '+12%',
      positive: true
    },
    {
      title: 'Dagens Uppgifter',
      value: stats.todayTasks.length,
      subtitle: `${stats.todayMeetings} möten`,
      icon: CheckSquare,
      color: 'from-emerald-500 to-emerald-600',
      change: '3 kvar',
      positive: true
    },
    {
      title: 'Pipeline Värde',
      value: formatCurrency(stats.pipelineValue),
      subtitle: `${stats.pendingOffers} offerter`,
      icon: TrendingUp,
      color: 'from-violet-500 to-violet-600',
      change: '+18%',
      positive: true
    },
    {
      title: 'Månadens Intäkt',
      value: formatCurrency(stats.monthlyRevenue),
      subtitle: 'YTD måluppfyllnad',
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      change: '+8.2%',
      positive: true
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 sm:mb-8">
      {quickStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="group"
        >
          <motion.div 
            className="relative overflow-hidden bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-4 sm:p-6 hover:bg-slate-800/50 transition-all duration-300"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.positive && (
                    <span className="text-emerald-400 text-sm font-medium">
                      {stat.change}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-slate-400 text-xs sm:text-sm font-medium">{stat.title}</h3>
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">
                    {typeof stat.value === 'number' && stat.value > 999999 ? 
                      formatCurrency(stat.value) : stat.value
                    }
                  </div>
                  <p className="text-slate-500 text-xs">{stat.subtitle}</p>
                </div>
              </div>
              
              {/* Micro sparkline effect */}
              <div className="absolute top-4 right-4 w-12 h-6">
                <div className="w-full h-full relative">
                  <div className="absolute bottom-0 left-0 w-1 h-3 bg-gradient-to-t from-slate-600 to-slate-500 rounded-full" />
                  <div className="absolute bottom-0 left-2 w-1 h-4 bg-gradient-to-t from-slate-600 to-slate-400 rounded-full" />
                  <div className="absolute bottom-0 left-4 w-1 h-2 bg-gradient-to-t from-slate-600 to-slate-500 rounded-full" />
                  <div className="absolute bottom-0 right-2 w-1 h-5 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1 h-6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
