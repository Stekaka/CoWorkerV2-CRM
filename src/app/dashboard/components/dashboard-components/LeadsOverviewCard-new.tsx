'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Phone, Mail, ArrowRight, Plus } from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useRouter } from 'next/navigation'

export default function LeadsOverviewCard() {
  const { totalLeads, hotLeads, recentLeads, conversionRate } = useDashboardData()
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="col-span-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-1">Leads Översikt</h3>
          <p className="text-slate-400 text-sm">Din försäljningspipeline</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
          <Users className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300 text-sm font-medium">Totala Leads</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalLeads}</div>
          <div className="text-xs text-slate-500 mt-1">Denna månad</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300 text-sm font-medium">Heta Leads</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{hotLeads}</div>
          <div className="text-xs text-slate-500 mt-1">Hög prioritet</div>
        </div>
      </div>

      {/* Recent Leads Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-300">Senaste Leads</h4>
          <button 
            onClick={() => router.push('/leads')}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            Visa alla <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-4">
              <Users className="h-8 w-8 text-slate-600" />
            </div>
            <h5 className="text-slate-300 font-medium mb-2">Inga leads än</h5>
            <p className="text-slate-500 text-sm mb-4">Börja genom att lägga till ditt första lead</p>
            <button
              onClick={() => router.push('/leads/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              <Plus className="h-4 w-4" />
              Lägg till lead
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/20 hover:bg-slate-700/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-100">{lead.name}</div>
                    <div className="text-xs text-slate-400">{lead.company}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.priority === 'hot' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : lead.priority === 'warm'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {lead.priority === 'hot' ? 'Het' : lead.priority === 'warm' ? 'Varm' : 'Kall'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-slate-600/50 rounded">
                      <Phone className="h-3 w-3 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-600/50 rounded">
                      <Mail className="h-3 w-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Conversion Rate */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300 mb-1">Konverteringsgrad</div>
            <div className="text-lg font-bold text-slate-100">{conversionRate}%</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-4 border-emerald-500/30 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700"
            style={{ width: `${conversionRate}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
