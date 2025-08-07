'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Plus } from 'lucide-react'
import { useOverlayContext } from '@/components/ui/OverlayContext'

// Exempel-events för demonstration
const events = [
  {
    id: 1,
    title: 'Kundmöte - Nordea',
    time: '09:00',
    date: '2025-08-08',
    type: 'meeting',
    color: 'bg-cyan-500'
  },
  {
    id: 2,
    title: 'Uppföljning - Volvo',
    time: '14:30',
    date: '2025-08-08',
    type: 'call',
    color: 'bg-slate-500'
  },
  {
    id: 3,
    title: 'Presentation - IKEA',
    time: '10:00',
    date: '2025-08-09',
    type: 'presentation',
    color: 'bg-cyan-500'
  }
]

export default function SophisticatedCalendarWidget() {
  const { openOverlay } = useOverlayContext()
  
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  // Hämta dagens events
  const todaysEvents = events.filter(event => event.date === todayStr)
  
  // Hämta kommande events (nästa 3 dagar)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)
    return eventDate > today && eventDate <= threeDaysFromNow
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <motion.div 
      className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">Kalender</h3>
            <p className="text-slate-400">Dagens schema</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={() => openOverlay('new-event')}
            className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          <motion.button 
            onClick={() => openOverlay('calendar-dashboard')}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Visa alla
          </motion.button>
        </div>
      </div>

      {/* Dagens events */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            Idag ({todaysEvents.length})
          </h4>
          
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`w-4 h-4 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-100 truncate">{event.title}</p>
                    <p className="text-sm text-slate-400">{event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Inga möten idag</p>
              <p className="text-sm text-slate-500 mb-6">Perfekt dag att fokusera på viktiga uppgifter</p>
              <motion.button
                onClick={() => openOverlay('new-event')}
                className="px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 hover:text-cyan-300 rounded-xl transition-all duration-200 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Lägg till möte
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Kommande events */}
        {upcomingEvents.length > 0 && (
          <motion.div 
            className="border-t border-slate-700/50 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-slate-200 mb-4">
              Kommande
            </h4>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.7 }}
                >
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(event.date)} • {event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
