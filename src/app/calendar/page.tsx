'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  type: 'meeting' | 'call' | 'demo' | 'follow-up' | 'internal'
  attendees: string[]
  location?: string
  isVideoCall?: boolean
  priority: 'low' | 'medium' | 'high'
}

const mockEvents: Event[] = []

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'meeting': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'call': return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'demo': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case 'follow-up': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    case 'internal': return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
  }
}

const getEventTypeText = (type: Event['type']) => {
  switch (type) {
    case 'meeting': return 'Möte'
    case 'call': return 'Samtal'
    case 'demo': return 'Demo'
    case 'follow-up': return 'Uppföljning'
    case 'internal': return 'Internt'
  }
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('sv-SE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function CalendarPage() {
  const [currentDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  const [events] = useState<Event[]>(mockEvents)

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    const today = new Date()
    return eventDate > today
  }).slice(0, 5)

  const getWeekDays = () => {
    const start = new Date(currentDate)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    start.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      days.push(date)
    }
    return days
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 mobile-padding ios-height-fix">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 safe-area-top">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-2">Kalender & Schemaläggning</h1>
            <p className="text-sm md:text-base text-slate-400">Hantera dina möten och uppföljningar</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="flex bg-slate-800/50 rounded-xl overflow-hidden">
              {['day', 'week', 'month'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as 'day' | 'week' | 'month')}
                  className={`mobile-button flex-1 md:flex-none px-3 md:px-4 py-2 text-sm transition-colors ${
                    view === v 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v === 'day' ? 'Dag' : v === 'week' ? 'Vecka' : 'Månad'}
                </button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mobile-button-large px-4 md:px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300 text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
              Nytt Möte
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <span className="text-lg md:text-2xl font-bold text-white">{todaysEvents.length}</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Idag</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              <span className="text-lg md:text-2xl font-bold text-white">{upcomingEvents.length}</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Kommande</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Video className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <span className="text-lg md:text-2xl font-bold text-white">
                {events.filter(e => e.isVideoCall).length}
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Video Calls</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              <span className="text-lg md:text-2xl font-bold text-white">
                {events.filter(e => e.type === 'demo').length}
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Demos</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="mobile-card bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 md:p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {currentDate.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="mobile-button p-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button className="mobile-button p-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              {/* Week View */}
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-4">
                  {getWeekDays().map((day, index) => {
                    const dayEvents = events.filter(event => {
                      const eventDate = new Date(event.start)
                      return eventDate.toDateString() === day.toDateString()
                    })

                    const isToday = day.toDateString() === new Date().toDateString()

                    return (
                      <div key={index} className="min-h-[120px]">
                        <div className={`p-2 rounded-lg border-2 transition-colors ${
                          isToday 
                            ? 'bg-cyan-600/10 border-cyan-600/30' 
                            : 'bg-slate-800/30 border-slate-700/30'
                        }`}>
                          <div className={`text-sm font-medium mb-2 ${
                            isToday ? 'text-cyan-400' : 'text-slate-300'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)}`}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="opacity-80">{formatTime(event.start)}</div>
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-slate-500 p-1">
                                +{dayEvents.length - 3} fler
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Idag</h3>
              <div className="space-y-3">
                {todaysEvents.length > 0 ? (
                  todaysEvents.map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{event.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getEventTypeColor(event.type)}`}>
                          {getEventTypeText(event.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        {event.isVideoCall && <Video className="w-3 h-3" />}
                        {event.location && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </>
                        )}
                        <Users className="w-3 h-3" />
                        <span>{event.attendees.length} deltagare</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Inga möten idag</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Kommande</h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{event.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(event.start)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getEventTypeColor(event.type)}`}>
                        {getEventTypeText(event.type)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
