'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Bell, Shield, Workflow } from 'lucide-react'

interface Automation {
  id: number
  name: string
  enabled: boolean
}

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>([])

  const toggleAutomation = (id: number) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mobile-padding ios-height-fix">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-card bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 safe-area-top">
            <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100">Automatisering</h1>
              <p className="text-sm md:text-base text-slate-400">Hantera automatiska processer och arbetsflöden</p>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6">
            {/* Aktiva Automatiseringar */}
            <div className="mobile-card bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-slate-100 mb-3 md:mb-4 flex items-center gap-2">
                <Workflow className="h-4 w-4 md:h-5 md:w-5" />
                Aktiva Automatiseringar
              </h2>
              <div className="space-y-3 md:space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="mobile-card flex items-center justify-between p-3 md:p-4 bg-slate-700/30 rounded-lg">
                    <span className="text-sm md:text-base text-slate-200">{automation.name}</span>
                    <button
                      onClick={() => toggleAutomation(automation.id)}
                      className={`mobile-button relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        automation.enabled ? 'bg-purple-500' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          automation.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tillgängliga Automatiseringar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifikationer
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="text-slate-200 font-medium">Nya leads</h4>
                    <p className="text-sm text-slate-400">Få meddelanden när nya leads registreras</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="text-slate-200 font-medium">Uppföljningspåminnelser</h4>
                    <p className="text-sm text-slate-400">Automatiska påminnelser för kundkontakt</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Säkerhet
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="text-slate-200 font-medium">Automatisk backup</h4>
                    <p className="text-sm text-slate-400">Dagliga säkerhetskopior av data</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="text-slate-200 font-medium">Säkerhetsskanning</h4>
                    <p className="text-sm text-slate-400">Regelbunden kontroll av systemsäkerhet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Snabbåtgärder */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Snabbåtgärder</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg text-left hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200">
                  <h4 className="text-purple-200 font-medium">Skapa regel</h4>
                  <p className="text-sm text-slate-400 mt-1">Ny automatiseringsregel</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg text-left hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200">
                  <h4 className="text-blue-200 font-medium">Import/Export</h4>
                  <p className="text-sm text-slate-400 mt-1">Hantera automatiseringar</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg text-left hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200">
                  <h4 className="text-green-200 font-medium">Test kör</h4>
                  <p className="text-sm text-slate-400 mt-1">Testa automatiseringar</p>
                </button>
              </div>
            </div>

            {/* Statistik */}
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Automatiseringsstatistik</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-200">23</div>
                  <div className="text-sm text-slate-400">Körda denna vecka</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-200">156</div>
                  <div className="text-sm text-slate-400">Sparade timmar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-200">98.5%</div>
                  <div className="text-sm text-slate-400">Framgångsrate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-200">3</div>
                  <div className="text-sm text-slate-400">Aktiva regler</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => alert('Ny automatisering! (Detta är en demo)')}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                Skapa Ny Automatisering
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium rounded-lg transition-colors duration-200"
              >
                Tillbaka
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
