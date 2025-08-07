'use client'

import { Calendar, Clock } from 'lucide-react'
import { useOverlayContext } from '@/components/ui/OverlayContext'

// Exempel-events för demonstration
const events = [
  {
    id: 1,
    title: 'Kundmöte - Nordea',
    time: '09:00',
    date: '2025-08-08',
    type: 'meeting',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Uppföljning - Volvo',
    time: '14:30',
    date: '2025-08-08',
    type: 'call',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Presentation - IKEA',
    time: '10:00',
    date: '2025-08-09',
    type: 'presentation',
    color: 'bg-purple-500'
  }
]

export default function CalendarWidget() {
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Kalender</h3>
            <p className="text-sm text-slate-400">Dagens schema</p>
          </div>
        </div>
        <button 
          onClick={() => openOverlay('calendar-dashboard')}
          className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-200 border border-slate-600/50"
        >
          Visa alla
        </button>
      </div>

      {/* Dagens events */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Idag ({todaysEvents.length})
          </h4>
          
          {todaysEvents.length > 0 ? (
            <div className="space-y-2">
              {todaysEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Inga möten idag</p>
            </div>
          )}
        </div>

        {/* Kommande events */}
        {upcomingEvents.length > 0 && (
          <div className="border-t border-slate-700/50 pt-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">
              Kommande
            </h4>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 2).map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(event.date)} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
