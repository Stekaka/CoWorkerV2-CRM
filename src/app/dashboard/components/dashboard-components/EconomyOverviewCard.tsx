'use client'

import { motion } from 'framer-motion'

interface EconomyOverviewCardProps {
  width?: number
  height?: number
}

export default function EconomyOverviewCard({ width = 640, height = 480 }: EconomyOverviewCardProps) {
  // Responsive based on preset sizes
  const isSmall = width <= 320
  const isMedium = width <= 480 && width > 320
  const isLarge = width > 480
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex-1">
          <h3 className={`font-bold text-slate-100 mb-1 ${isSmall ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'}`}>
            {isSmall ? 'Ekonomi' : 'Ekonomi & Budget'}
          </h3>
          {!isSmall && (
            <p className={`text-slate-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              Månads- och årsöversikt
            </p>
          )}
        </div>
        <div className={`bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 ${isSmall ? 'p-2' : 'p-3'}`}>
          <span className={isSmall ? 'text-sm' : 'text-lg'}>💰</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid gap-3 mb-4 flex-shrink-0 ${
        isSmall ? 'grid-cols-1' : isMedium ? 'grid-cols-2' : 'grid-cols-3'
      }`}>
        {/* Månadsintäkter */}
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className={`bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center ${isSmall ? 'p-1 w-6 h-6' : 'p-2 w-8 h-8'}`}>
              <span className={isSmall ? 'text-xs' : 'text-sm'}>📈</span>
            </div>
            {!isSmall && (
              <span className={`text-emerald-400 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
                +12.5%
              </span>
            )}
          </div>
          <div className={`font-bold text-slate-100 mb-1 ${isSmall ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'}`}>
            1.245.000 SEK
          </div>
          <div className={`text-slate-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
            {isSmall ? 'Månad' : 'Månadsintäkter'}
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className={`bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center ${isSmall ? 'p-1 w-6 h-6' : 'p-2 w-8 h-8'}`}>
              <span className={isSmall ? 'text-xs' : 'text-sm'}>🏭</span>
            </div>
            {!isSmall && (
              <span className={`text-cyan-400 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
                8 st
              </span>
            )}
          </div>
          <div className={`font-bold text-slate-100 mb-1 ${isSmall ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'}`}>
            3.200.000 SEK
          </div>
          <div className={`text-slate-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
            {isSmall ? 'Pipeline' : 'Pipeline värde'}
          </div>
        </div>

        {/* Årsintäkter - Only show if not small */}
        {!isSmall && (
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <div className={`bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg flex items-center justify-center ${isSmall ? 'p-1 w-6 h-6' : 'p-2 w-8 h-8'}`}>
                <span className={isSmall ? 'text-xs' : 'text-sm'}>🎯</span>
              </div>
              <span className={`text-violet-400 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
                44%
              </span>
            </div>
            <div className={`font-bold text-slate-100 mb-1 ${isSmall ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'}`}>
              8.750.000 SEK
            </div>
            <div className={`text-slate-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              Årsintäkter
            </div>
          </div>
        )}
      </div>

      {/* Progress bars - Only in large size */}
      {isLarge && height > 350 && (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium text-sm">Månadsmål</span>
              <span className="text-slate-400 text-xs">1.800.000 SEK</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700 w-3/4" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium text-sm">Årsmål</span>
              <span className="text-slate-400 text-xs">20.000.000 SEK</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-700 w-1/2" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
