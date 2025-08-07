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
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-white">Dagens schema - {selectedDay}</h3>
        <span className="text-sm font-bold text-gray-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">{events.length} events</span>
      </div>

      <div className="space-y-6">
        {events.length > 0 ? (
          events.map((event, index) => {
            const Icon = getIcon(event.type)
            return (
              <div
                key={event.id}
                className={`
                  group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 
                  hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl shadow-black/10
                  hover:shadow-3xl border-l-4
                  ${event.color.includes('blue') ? 'border-l-blue-500 hover:shadow-blue-500/20' : 
                    event.color.includes('green') ? 'border-l-green-500 hover:shadow-green-500/20' :
                    event.color.includes('orange') ? 'border-l-orange-500 hover:shadow-orange-500/20' :
                    'border-l-gray-500 hover:shadow-gray-500/20'}
                  ${event.status === 'completed' ? 'opacity-75' : ''}
                `}
              >
                {/* Floating glow effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl
                  ${event.color.includes('blue') ? 'bg-blue-500/30' : 
                    event.color.includes('green') ? 'bg-green-500/30' :
                    event.color.includes('orange') ? 'bg-orange-500/30' :
                    'bg-gray-500/30'}
                `} />
                
                <div className="relative z-10 flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl
                      ${event.color.includes('blue') ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/25' : 
                        event.color.includes('green') ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/25' :
                        event.color.includes('orange') ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/25' :
                        'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/25'}
                    `}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-black text-white">{event.title}</h4>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getStatusIcon(event.status)}</span>
                        <span className="text-lg font-black text-cyan-400 bg-white/10 px-3 py-1 rounded-2xl border border-white/20">{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`
                        inline-flex items-center px-4 py-2 rounded-2xl text-sm font-black border shadow-lg
                        ${event.type === 'meeting' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-blue-500/25' : 
                          event.type === 'call' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-green-500/25' :
                          'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-orange-500/25'}
                      `}>
                        {event.type === 'meeting' ? '👥 Möte' : 
                         event.type === 'call' ? '📞 Samtal' : '✅ Uppgift'}
                      </span>
                      
                      <span className={`
                        text-sm px-4 py-2 rounded-2xl font-black border shadow-lg
                        ${event.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          event.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}
                      `}>
                        {event.status === 'completed' ? '✅ Slutförd' :
                         event.status === 'in-progress' ? '⚡ Pågår' : '🚀 Kommande'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection line to next event */}
                {index < events.length - 1 && (
                  <div className="absolute left-8 -bottom-3 w-1 h-6 bg-gradient-to-b from-cyan-500/50 to-purple-500/50 rounded-full shadow-lg shadow-cyan-500/25" />
                )}
              </div>
            )
          })
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl shadow-black/10">
            <div className="relative">
              <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl opacity-50" />
            </div>
            <h4 className="text-2xl font-black text-white mb-4">Ingen planerad aktivitet</h4>
            <p className="text-gray-400 text-lg font-medium">Perfekt tid att fokusera på leads och påminnelser! 🚀</p>
          </div>
        )}
      </div>
    </div>
  )
}
