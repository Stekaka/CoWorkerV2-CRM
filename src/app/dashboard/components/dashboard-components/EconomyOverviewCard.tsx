'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, DollarSign } from 'lucide-react'
import { useEconomyData } from '@/hooks/useEconomyData'

export default function EconomyOverviewCard() {
  const { data: economyData, loading } = useEconomyData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // TODO: Targets kan senare hämtas från database
  const monthlyTarget = 1800000
  const yearlyTarget = 20000000
  const monthlyGrowth = 12.5

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                <div className="h-8 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="col-span-12 lg:col-span-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-1">Ekonomi & Budget</h3>
          <p className="text-slate-400 text-sm">Månads- och årsöversikt</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Månadsintäkter */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              +{monthlyGrowth}% vs förra månaden
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {formatCurrency(economyData.monthlyRevenue)}
          </div>
          <div className="text-sm text-slate-400">Månadsintäkter</div>
        </motion.div>

        {/* Pipeline Value */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {formatCurrency(economyData.pipelineValue)}
          </div>
          <div className="text-sm text-slate-400">Pipeline värde</div>
        </motion.div>

        {/* Pending Offers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-slate-100">{economyData.pendingOffers}</div>
            <div className="text-lg font-bold text-emerald-400">{economyData.acceptedOffers}</div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Väntande</span>
            <span>Accepterade</span>
          </div>
          <div className="text-xs text-slate-500">
            {economyData.pendingOffers > 0 && 
              (((economyData.acceptedOffers / (economyData.acceptedOffers + economyData.pendingOffers)) * 100).toFixed(0))}% framgång
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-slate-200 mb-4">Senaste Offerter</h4>
        
        <div className="text-center py-12">
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/20">
            <DollarSign className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Inga offerter än</p>
            <p className="text-slate-500 text-sm">Dina offerter kommer att visas här när du skapar dem</p>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Månadsmål */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Månadsmål</span>
            <span className="text-sm font-medium text-slate-300">
              {formatCurrency(economyData.monthlyRevenue)} / {formatCurrency(monthlyTarget)}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((economyData.monthlyRevenue / monthlyTarget) * 100, 100)}%`
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
              {((economyData.bookedRevenue / yearlyTarget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((economyData.bookedRevenue / yearlyTarget) * 100, 100)}%`
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
