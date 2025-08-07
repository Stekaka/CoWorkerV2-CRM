'use client'

import { motion } from 'framer-motion'

// Temporary inline data until import issues are resolved  
const useDashboardData = () => ({
  totalLeads: 127,
  hotLeads: 23,
  recentLeads: [
    { name: 'Anna Svensson', company: 'TechCorp AB', priority: 'hot' },
    { name: 'Erik Nilsson', company: 'Design Studio', priority: 'warm' },
    { name: 'Lisa Andersson', company: 'Marketing Plus', priority: 'cold' }
  ] as Array<{ name: string; company: string; priority: string }>,
  conversionRate: 34
})

interface LeadsOverviewCardProps {
  width?: number
  height?: number
}

export default function LeadsOverviewCard({ width = 480, height = 360 }: LeadsOverviewCardProps) {
  const { totalLeads, hotLeads, recentLeads, conversionRate } = useDashboardData()
  
  // Responsive based on preset sizes
  const isSmall = width <= 320
  const isMedium = width <= 480 && width > 320
  const isLarge = width > 480
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex-1">
          <h3 className={`font-bold text-slate-100 mb-1 ${isSmall ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'}`}>
            {isSmall ? 'Leads' : 'Leads Översikt'}
          </h3>
          {!isSmall && (
            <p className={`text-slate-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              Din försäljningspipeline
            </p>
          )}
        </div>
        <div className={`bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 ${isSmall ? 'p-2' : 'p-3'}`}>
          <span className={isSmall ? 'text-sm' : 'text-lg'}>👥</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid ${isSmall ? 'grid-cols-1' : 'grid-cols-2'} gap-3 mb-4 flex-shrink-0`}>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className={isSmall ? 'text-sm' : 'text-base'}>👥</span>
            <span className={`text-slate-300 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {isSmall ? 'Totala' : 'Totala Leads'}
            </span>
          </div>
          <div className={`font-bold text-slate-100 ${isSmall ? 'text-lg' : isMedium ? 'text-xl' : 'text-2xl'}`}>
            {totalLeads}
          </div>
          {!isSmall && <div className="text-xs text-slate-500 mt-1">Denna månad</div>}
        </div>

        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className={isSmall ? 'text-sm' : 'text-base'}>📈</span>
            <span className={`text-slate-300 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {isSmall ? 'Heta' : 'Heta Leads'}
            </span>
          </div>
          <div className={`font-bold text-slate-100 ${isSmall ? 'text-lg' : isMedium ? 'text-xl' : 'text-2xl'}`}>
            {hotLeads}
          </div>
          {!isSmall && <div className="text-xs text-slate-500 mt-1">Hög prioritet</div>}
        </div>
      </div>

      {/* Recent Leads Section - Only show if there's space */}
      {(isMedium || isLarge) && height > 300 && (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h4 className={`font-semibold text-slate-300 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {isMedium ? 'Senaste' : 'Senaste Leads'}
            </h4>
            <button className={`text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              Alla <span>→</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {recentLeads.slice(0, isLarge ? 3 : 2).map((lead, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/20 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 ${isSmall ? 'w-6 h-6' : 'w-8 h-8'}`}>
                    <span className={isSmall ? 'text-xs' : 'text-sm'}>👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-slate-100 truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>
                      {lead.name}
                    </div>
                    {isLarge && (
                      <div className="text-xs text-slate-400 truncate">
                        {lead.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.priority === 'hot' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : lead.priority === 'warm'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {lead.priority === 'hot' ? '🔥' : lead.priority === 'warm' ? '⚡' : '❄️'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Rate - Only show in large size */}
      {isLarge && height > 400 && (
        <div className="bg-slate-800/30 rounded-lg border border-slate-700/20 p-3 mt-auto flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 mb-1">Konverteringsgrad</div>
              <div className="text-lg font-bold text-slate-100">{conversionRate}%</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30 flex items-center justify-center">
              <span className="text-sm">📈</span>
            </div>
          </div>
          <div className="mt-2 bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700"
              style={{ width: `${conversionRate}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
