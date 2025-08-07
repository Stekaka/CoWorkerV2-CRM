'use client'

import { motion } from 'framer-motion'
import { TrendingUp, CreditCard, Target, DollarSign } from 'lucide-react'

// Temporary inline data until import issues are resolved
const useDashboardData = () => ({
  monthlyRevenue: 0,
  yearlyRevenue: 0,
  pipelineValue: 0,
  pendingOffers: 0
})

export default function EconomyOverviewCard() {
  const { monthlyRevenue, yearlyRevenue, pipelineValue, pendingOffers } = useDashboardData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Mock data för targets och growth - kan senare hämtas från database
  const monthlyTarget = 1800000
  const yearlyTarget = 20000000
  const monthlyGrowth = 12.5

  // Empty state for new user
  const recentOffers: any[] = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-emerald-400 bg-emerald-400/10'
      case 'pending': return 'text-amber-400 bg-amber-400/10'
      case 'sent': return 'text-cyan-400 bg-cyan-400/10'
      case 'draft': return 'text-slate-400 bg-slate-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepterad'
      case 'pending': return 'Väntar'
      case 'sent': return 'Skickad'
      case 'draft': return 'Utkast'
      default: return 'Okänd'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-1">Ekonomi & Budget</h3>
          <p className="text-slate-400 text-sm">Månads- och årsöversikt</p>
        </div>
        <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Månadsintäkter */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              +{monthlyGrowth}%
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-100 mb-1">
            {formatCurrency(monthlyRevenue)}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Månadsintäkter</div>
        </motion.div>

        {/* Pipeline Value */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-100 mb-1">
            {formatCurrency(pipelineValue)}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Pipeline värde</div>
        </motion.div>

        {/* Pending Offers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg sm:text-lg font-bold text-slate-100">{pendingOffers}</div>
            <div className="text-lg sm:text-lg font-bold text-emerald-400">{recentOffers.filter(o => o.status === 'accepted').length}</div>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-2">
            <span>Väntande</span>
            <span>Accepterade</span>
          </div>
          <div className="text-xs text-slate-500">
            {pendingOffers > 0 && (((recentOffers.filter(o => o.status === 'accepted').length / (recentOffers.filter(o => o.status === 'accepted').length + pendingOffers)) * 100).toFixed(0))}% framgång
          </div>
        </motion.div>
      </div>

      {/* Recent Offers */}
      <div className="space-y-4">
        <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-4">Senaste Offerter</h4>
        
        {recentOffers.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="p-3 sm:p-4 bg-slate-800/30 rounded-xl border border-slate-700/20">
              <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-base sm:text-lg mb-2">Inga offerter än</p>
              <p className="text-slate-500 text-sm">Dina offerter kommer att visas här när du skapar dem</p>
            </div>
          </div>
        ) : (
          recentOffers.slice(0, 3).map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/20 hover:bg-slate-800/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
                  <CreditCard className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <div className="font-medium text-slate-200">{offer.customerName}</div>
                  <div className="text-sm text-slate-400">{offer.description}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-slate-200">{formatCurrency(offer.amount)}</div>
                  <div className="text-xs text-slate-500">{offer.createdAt}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                  {getStatusText(offer.status)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Månadsmål */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Månadsmål</span>
            <span className="text-sm font-medium text-slate-300">
              {formatCurrency(monthlyRevenue)} / {formatCurrency(monthlyTarget)}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((monthlyRevenue / monthlyTarget) * 100, 100)}%`
              }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>

        {/* Årsmål */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Årsmål</span>
            <span className="text-sm font-medium text-slate-300">
              {((yearlyRevenue / yearlyTarget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((yearlyRevenue / yearlyTarget) * 100, 100)}%`
              }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
