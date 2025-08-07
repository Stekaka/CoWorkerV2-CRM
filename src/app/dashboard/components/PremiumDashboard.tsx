'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Settings, Search, Filter } from 'lucide-react'
import ModalSystem from './ModalSystem'
import DashboardStats from './dashboard-components/DashboardStats'
import LeadsOverviewCard from './dashboard-components/LeadsOverviewCard'
import EconomyOverviewCard from './dashboard-components/EconomyOverviewCard'
import MailCampaignsCard from './dashboard-components/MailCampaignsCard'
import RecentActivitiesCard from './dashboard-components/RecentActivitiesCard'

// Simple Calendar Todo Card for now
const CalendarTodoCard = () => (
  <div className="text-white p-4 bg-slate-800 rounded-lg">Calendar Todo</div>
)

// Temporary inline hook to avoid import issues
function useDashboardData() {
  const [data, setData] = useState({
    totalLeads: 156,
    hotLeads: 23,
    recentLeads: [],
    conversionRate: 12.5,
    pipelineValue: 2400000,
    monthlyRevenue: 850000,
    yearlyRevenue: 9750000,
    pendingOffers: 8,
    recentOffers: [],
    todayTasks: [],
    todayMeetings: 3,
    upcomingReminders: [],
    meetings: [],
    todos: [],
    upcomingMeetings: [],
    completedTodos: 12,
    pendingTodos: 7,
    totalTodos: 19,
    recentActivities: [],
    loading: false,
    error: null
  })
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }))
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  
  return data
}

export default function PremiumDashboard() {
  const dashboardData = useDashboardData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleOpenModal = (modalType: string) => {
    setActiveModal(modalType)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  // Uppdatera klockan varje minut för att visa aktuell tid
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Stagger-animation för cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Visa loading state
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Laddar dashboard-data...</p>
        </div>
      </div>
    )
  }

  // Visa fel om något gick snett
  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{dashboardData.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background pattern för premium-känsla */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.02),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Top Navigation Bar - Minimalistisk och exklusiv */}
        <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Center - Search */}
              <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Sök leads, aktiviteter, ordrar..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Right - Actions och notifications */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {currentTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <motion.button
                  className="relative p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-slate-900 font-bold">3</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setActiveModal('settings')}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header - Personal och premium */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                God {currentTime.getHours() < 12 ? 'morgon' : currentTime.getHours() < 18 ? 'dag' : 'kväll'} 👋
              </h2>
              <p className="text-slate-400">
                Här är en översikt av dina aktiviteter för {currentTime.toLocaleDateString('sv-SE', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            
            {/* Quick Filter Controls - Diskret men användbart */}
            <div className="flex items-center gap-2">
              <motion.button
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 text-slate-400 hover:text-slate-300 rounded-lg text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                Filter
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row - Premium KPI cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <DashboardStats stats={dashboardData} />
        </motion.div>

        {/* Main Cards Grid - Harmonisk layout med optimal informationshierarki */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"
        >
          {/* CRM/Leads Overview - Stor prioritet, tar 2/3 på desktop */}
          <motion.div variants={cardVariants} className="lg:col-span-8">
            <LeadsOverviewCard />
          </motion.div>

          {/* Calendar & Todo - Kompakt men informativ, 1/3 på desktop */}
          <motion.div variants={cardVariants} className="lg:col-span-4">
            <CalendarTodoCard />
          </motion.div>

          {/* Economy Overview - Full bredd för att visa pipeline och siffror */}
          <motion.div variants={cardVariants} className="lg:col-span-12">
            <EconomyOverviewCard />
          </motion.div>

          {/* Mail Campaigns - Halvbredd, jämn vikt med Recent Activities */}
          <motion.div variants={cardVariants} className="lg:col-span-6">
            <MailCampaignsCard />
          </motion.div>

          {/* Recent Activities - Halvbredd, kompletterar Mail Campaigns */}
          <motion.div variants={cardVariants} className="lg:col-span-6">
            <RecentActivitiesCard />
          </motion.div>
        </motion.div>

        {/* Footer - Diskret men informativ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center py-8 border-t border-slate-800/50"
        >
          <p className="text-slate-500 text-sm">
            Senast uppdaterad {currentTime.toLocaleString('sv-SE')} • System status: ✅ Online
          </p>
        </motion.div>
      </main>
      </div>

      {/* Modal System */}
      <ModalSystem 
        activeModal={activeModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}
