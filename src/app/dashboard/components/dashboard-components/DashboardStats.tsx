'use client'

import { motion } from 'framer-motion'

interface DashboardStatsProps {
  stats: {
    totalLeads: number
    hotLeads: number
    pipelineValue: number
    monthlyRevenue: number
    completedTodos: number
    totalTodos: number
    todayTasks: Array<{ name: string; company: string; priority: string }>
    todayMeetings: number
    pendingOffers: number
  }
  width?: number
  height?: number
}

export default function DashboardStats({ stats, width = 600, height = 400 }: DashboardStatsProps) {
  // Enhanced responsive breakpoints with better scaling
  const isMinimal = width < 350 || height < 200
  const isCompact = width < 500 || height < 250
  const isSmall = width <= 320
  const isMedium = width <= 480 && width > 320
  const isLarge = width >= 700 && height >= 350
  
  // Dynamic grid calculation based on dimensions
  const getGridLayout = () => {
    if (isMinimal) return { cols: 1, rows: 2, maxItems: 2 }
    if (isCompact) return { cols: 2, rows: 2, maxItems: 4 }
    if (isMedium) return { cols: 2, rows: 2, maxItems: 4 }
    return { cols: 4, rows: 1, maxItems: 4 }
  }
  
  const gridLayout = getGridLayout()
  
  // Scale font and spacing based on actual dimensions
  const getScaleFactor = () => {
    const baseArea = 600 * 400 // Default area
    const currentArea = width * height
    return Math.max(0.6, Math.min(1.4, Math.sqrt(currentArea / baseArea)))
  }
  
  const scaleFactor = getScaleFactor()
  const baseFontSize = scaleFactor * 16
  
  const formatCurrency = (amount: number) => {
    if (isMinimal && amount > 99999) {
      return `${Math.round(amount / 1000)}k`
    }
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const quickStats = [
    {
      title: isMinimal ? 'Leads' : 'Aktiva Leads',
      value: stats.totalLeads,
      subtitle: isMinimal ? `${stats.hotLeads}🔥` : `${stats.hotLeads} heta`,
      icon: '👥',
      color: 'from-cyan-500 to-cyan-600',
      change: '+12%',
      positive: true
    },
    {
      title: isMinimal ? 'Uppgifter' : 'Dagens Uppgifter',
      value: stats.todayTasks.length,
      subtitle: isMinimal ? `${stats.todayMeetings}📞` : `${stats.todayMeetings} möten`,
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
      change: '3 kvar',
      positive: true
    },
    {
      title: isMinimal ? 'Pipeline' : 'Pipeline Värde',
      value: formatCurrency(stats.pipelineValue),
      subtitle: isMinimal ? `${stats.pendingOffers}📝` : `${stats.pendingOffers} offerter`,
      icon: '📈',
      color: 'from-violet-500 to-violet-600',
      change: '+18%',
      positive: true
    },
    {
      title: isMinimal ? 'Intäkt' : 'Månadens Intäkt',
      value: formatCurrency(stats.monthlyRevenue),
      subtitle: isMinimal ? 'YTD' : 'YTD måluppfyllnad',
      icon: '💰',
      color: 'from-amber-500 to-amber-600',
      change: '+8.2%',
      positive: true
    }
  ]

  // Show correct number of stats based on available space
  const displayStats = quickStats.slice(0, gridLayout.maxItems)

  return (
    <div 
      className={`grid gap-${Math.max(1, Math.floor(scaleFactor * 4))} w-full h-full overflow-hidden p-${Math.max(2, Math.floor(scaleFactor * 4))}`}
      style={{
        gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`
      }}
    >
      {displayStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="group w-full h-full"
        >
          <motion.div 
            className={`relative overflow-hidden bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl hover:bg-slate-800/50 transition-all duration-300 w-full h-full flex flex-col`}
            style={{
              padding: `${Math.max(8, scaleFactor * 16)}px`,
              fontSize: `${baseFontSize}px`
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
          >
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start justify-between flex-1">
              <div className="flex-1 flex flex-col justify-center">
                <div className={`flex items-center gap-${Math.max(1, Math.floor(scaleFactor * 2))} mb-${Math.max(1, Math.floor(scaleFactor * 2))}`}>
                  <div 
                    className={`rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    style={{
                      width: `${Math.max(24, scaleFactor * 32)}px`,
                      height: `${Math.max(24, scaleFactor * 32)}px`
                    }}
                  >
                    <span style={{ fontSize: `${Math.max(12, scaleFactor * 16)}px` }}>{stat.icon}</span>
                  </div>
                  {stat.positive && !isMinimal && (
                    <span 
                      className="text-emerald-400 font-medium"
                      style={{ fontSize: `${Math.max(10, scaleFactor * 12)}px` }}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 flex-1 flex flex-col justify-center">
                  <h3 
                    className="text-slate-400 font-medium"
                    style={{ fontSize: `${Math.max(10, scaleFactor * 12)}px` }}
                  >
                    {stat.title}
                  </h3>
                  <div 
                    className="font-bold text-slate-100"
                    style={{ fontSize: `${Math.max(16, scaleFactor * 24)}px` }}
                  >
                    {typeof stat.value === 'number' && stat.value > 999999 ? 
                      formatCurrency(stat.value) : stat.value
                    }
                  </div>
                  <p 
                    className="text-slate-500"
                    style={{ fontSize: `${Math.max(8, scaleFactor * 10)}px` }}
                  >
                    {stat.subtitle}
                  </p>
                </div>
              </div>
              
              {!isMinimal && (
                <div 
                  className="flex-shrink-0"
                  style={{ 
                    width: `${Math.max(24, scaleFactor * 48)}px`,
                    height: `${Math.max(12, scaleFactor * 24)}px`
                  }}
                >
                  <div className="w-full h-full relative">
                    <div className="absolute bottom-0 left-0 w-0.5 h-1/2 bg-gradient-to-t from-slate-600 to-slate-500 rounded-full" />
                    <div className="absolute bottom-0 left-1/6 w-0.5 h-2/3 bg-gradient-to-t from-slate-600 to-slate-400 rounded-full" />
                    <div className="absolute bottom-0 left-1/3 w-0.5 h-1/3 bg-gradient-to-t from-slate-600 to-slate-500 rounded-full" />
                    <div className="absolute bottom-0 right-1/6 w-0.5 h-5/6 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full shadow-sm" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
