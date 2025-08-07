'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Palette, Database } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john@coworker.se',
    phone: '+46 70 123 45 67',
    company: 'CoWorker AB',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    theme: 'dark',
    language: 'sv'
  })

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifikationer', icon: Bell },
    { id: 'security', label: 'Säkerhet', icon: Shield },
    { id: 'appearance', label: 'Utseende', icon: Palette },
    { id: 'data', label: 'Data', icon: Database }
  ]

  const handleSave = () => {
    console.log('Settings saved:', settings)
    alert('Inställningar sparade! (Detta är en demo)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mobile-padding ios-height-fix">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-card bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-8 border-b border-slate-700/50 safe-area-top">
            <div className="p-2 md:p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
              <Settings className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100">Inställningar</h1>
              <p className="text-sm md:text-base text-slate-400">Hantera dina kontoinställningar och preferenser</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar - Mobile: Horizontal scroll, Desktop: Vertical */}
            <div className="w-full md:w-64 bg-slate-800/50 p-3 md:p-6">
              <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`mobile-button whitespace-nowrap md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-left rounded-lg transition-all duration-200 text-sm md:text-base ${
                      activeTab === tab.id
                        ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden md:inline">{tab.label}</span>
                    <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-8">
              {activeTab === 'profile' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100">Profilinformation</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Namn
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({...settings, name: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        E-post
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Företag
                      </label>
                      <input
                        type="text"
                        value={settings.company}
                        onChange={(e) => setSettings({...settings, company: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100">Notifikationsinställningar</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="mobile-card flex items-center justify-between p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <h3 className="text-slate-200 font-medium text-sm md:text-base">E-postnotifikationer</h3>
                        <p className="text-xs md:text-sm text-slate-400">Få meddelanden via e-post</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: !settings.notifications.email
                          }
                        })}
                        className={`mobile-button relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-indigo-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mobile-card flex items-center justify-between p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <h3 className="text-slate-200 font-medium text-sm md:text-base">Push-notifikationer</h3>
                        <p className="text-xs md:text-sm text-slate-400">Webbläsarnotifikationer</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            push: !settings.notifications.push
                          }
                        })}
                        className={`mobile-button relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-indigo-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mobile-card flex items-center justify-between p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <h3 className="text-slate-200 font-medium text-sm md:text-base">SMS-notifikationer</h3>
                        <p className="text-xs md:text-sm text-slate-400">Viktiga meddelanden via SMS</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            sms: !settings.notifications.sms
                          }
                        })}
                        className={`mobile-button relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.sms ? 'bg-indigo-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100">Utseende</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tema
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => setSettings({...settings, theme: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="dark">Mörkt</option>
                        <option value="light">Ljust</option>
                        <option value="system">Systemstandard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Språk
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="mobile-input w-full px-3 md:px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="sv">Svenska</option>
                        <option value="en">English</option>
                        <option value="no">Norsk</option>
                        <option value="da">Dansk</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100">Säkerhet</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="mobile-card p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-slate-200 font-medium mb-2 text-sm md:text-base">Lösenord</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">Ändra ditt lösenord</p>
                      <button className="mobile-button bg-indigo-500 hover:bg-indigo-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Ändra lösenord
                      </button>
                    </div>

                    <div className="mobile-card p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-slate-200 font-medium mb-2 text-sm md:text-base">Tvåfaktorsautentisering</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">Extra säkerhet för ditt konto</p>
                      <button className="mobile-button bg-green-500 hover:bg-green-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Aktivera 2FA
                      </button>
                    </div>

                    <div className="mobile-card p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-slate-200 font-medium mb-2 text-sm md:text-base">Aktiva sessioner</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">Hantera inloggade enheter</p>
                      <button className="mobile-button bg-red-500 hover:bg-red-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Logga ut från alla enheter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100">Data & Export</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="mobile-card p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-slate-200 font-medium mb-2 text-sm md:text-base">Exportera data</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">Ladda ner alla dina data</p>
                      <button className="mobile-button bg-blue-500 hover:bg-blue-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Exportera data
                      </button>
                    </div>

                    <div className="mobile-card p-3 md:p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-slate-200 font-medium mb-2 text-sm md:text-base">Backup</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">Skapa säkerhetskopia av dina data</p>
                      <button className="mobile-button bg-purple-500 hover:bg-purple-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Skapa backup
                      </button>
                    </div>

                    <div className="mobile-card p-3 md:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <h3 className="text-red-200 font-medium mb-2 text-sm md:text-base">Radera konto</h3>
                      <p className="text-xs md:text-sm text-red-300/80 mb-3">Permanent radering av ditt konto och all data</p>
                      <button className="mobile-button bg-red-500 hover:bg-red-400 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Radera konto
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-6 md:pt-8 border-t border-slate-700/50 mt-6 md:mt-8 safe-area-bottom">
                <button
                  onClick={handleSave}
                  className="mobile-button bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-medium py-3 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 text-sm md:text-base"
                >
                  Spara ändringar
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="mobile-button px-4 md:px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium rounded-lg transition-colors duration-200 text-sm md:text-base"
                >
                  Tillbaka
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
