'use client'

import { Phone, Users, CheckCircle, Calendar } from 'lucide-react'

interface TimelineEvent {
  id: string
  time: string
  title: string
  type: 'meeting' | 'call' | 'task'
  status: 'upcoming' | 'in-progress' | 'completed'
  color: string
}

interface TimelineViewProps {
  events: TimelineEvent[]
  selectedDay: string
}

export default function TimelineView({ events, selectedDay }: TimelineViewProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Users
      case 'call':
        return Phone
      case 'task':
        return CheckCircle
      default:
        return Calendar
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '⚡'
      default:
        return '○'
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Dagens schema - {selectedDay}</h3>
        <span className="text-sm text-gray-400">{events.length} events</span>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event, index) => {
            const Icon = getIcon(event.type)
            return (
              <div
                key={event.id}
                className={`
                  relative bg-white/10 backdrop-blur-sm border rounded-2xl p-4 
                  hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]
                  ${event.color} border-l-4
                  ${event.status === 'completed' ? 'opacity-70' : ''}
                `}
              >
                {/* Time indicator */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getStatusIcon(event.status)}</span>
                        <span className="text-sm text-gray-300 font-mono">{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${event.type === 'meeting' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                          event.type === 'call' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          'bg-orange-500/20 text-orange-300 border border-orange-500/30'}
                      `}>
                        {event.type === 'meeting' ? 'Möte' : 
                         event.type === 'call' ? 'Samtal' : 'Uppgift'}
                      </span>
                      
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${event.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          event.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'}
                      `}>
                        {event.status === 'completed' ? 'Slutförd' :
                         event.status === 'in-progress' ? 'Pågår' : 'Kommande'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection line to next event */}
                {index < events.length - 1 && (
                  <div className="absolute left-6 top-16 w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">Ingen planerad aktivitet</h4>
            <p className="text-gray-400 text-sm">Perfekt tid att fokusera på leads och påminnelser!</p>
          </div>
        )}
      </div>
    </div>
  )
}
