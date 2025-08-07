'use client'

import { motion } from 'framer-motion'
// import { Activity, Phone, Mail, Calendar, FileText, User, Clock } from 'lucide-react'

// Temporary inline data until import issues are resolved
const useDashboardData = () => ({
  recentActivities: [] as any[]
})

interface RecentActivitiesCardProps {
  width?: number
  height?: number
}

export default function RecentActivitiesCard({ width = 470, height = 300 }: RecentActivitiesCardProps) {
  const { recentActivities } = useDashboardData()
  
  // Responsive based on preset sizes
  const isSmall = width <= 320
  const isMedium = width <= 480 && width > 320
  const isLarge = width > 480
  
  const activities = recentActivities || []

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞'
      case 'email': return '✉️'
      case 'meeting': return '📅'
      case 'task': return '📄'
      default: return '⚡'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'from-emerald-500 to-emerald-600'
      case 'email': return 'from-cyan-500 to-cyan-600'
      case 'meeting': return 'from-violet-500 to-violet-600'
      case 'task': return 'from-amber-500 to-amber-600'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10'
      case 'sent': return 'text-cyan-400 bg-cyan-400/10'
      case 'follow_up': return 'text-amber-400 bg-amber-400/10'
      case 'scheduled': return 'text-violet-400 bg-violet-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Slutförd'
      case 'sent': return 'Skickad'
      case 'follow_up': return 'Uppföljning'
      case 'scheduled': return 'Schemalagd'
      default: return 'Okänd'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m sedan`
    } else if (diffInHours < 24) {
      return `${diffInHours}h sedan`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d sedan`
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return ''
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Senaste Aktiviteter</h2>
            <p className="text-slate-400 text-sm">Samtal, möten och uppföljningar</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-sm">🕐</span>
          Live feed
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-slate-800/30 rounded-lg">
          <div className="text-lg font-bold text-slate-100">12</div>
          <div className="text-xs text-slate-400">Idag</div>
        </div>
        <div className="text-center p-3 bg-slate-800/30 rounded-lg">
          <div className="text-lg font-bold text-emerald-400">8</div>
          <div className="text-xs text-slate-400">Samtal</div>
        </div>
        <div className="text-center p-3 bg-slate-800/30 rounded-lg">
          <div className="text-lg font-bold text-cyan-400">15</div>
          <div className="text-xs text-slate-400">E-post</div>
        </div>
        <div className="text-center p-3 bg-slate-800/30 rounded-lg">
          <div className="text-lg font-bold text-violet-400">3</div>
          <div className="text-xs text-slate-400">Möten</div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Aktivitetsflöde</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type)
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg hover:bg-slate-700/40 transition-colors cursor-pointer group"
              >
                {/* Activity Icon */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-sm">{IconComponent}</span>
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-slate-100 text-sm truncate">{activity.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-xs">👤</span>
                      <span className="text-slate-500">{activity.contact}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs">
                      {activity.value > 0 && (
                        <span className="text-slate-300 font-medium">
                          {formatCurrency(activity.value)}
                        </span>
                      )}
                      <span className="text-slate-500">{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800/50">
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 text-sm flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <span className="text-sm">📞</span>
            Nytt samtal
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 text-sm flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <span className="text-sm">⚡</span>
            Visa alla
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(51 65 85) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(51 65 85);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  )
}
