'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react'
import BottomNav from '../components/BottomNav'

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: 'meeting' | 'call' | 'task' | 'reminder'
  color: string
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // TODO: Hämta events från API baserat på vald månad
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Demo med Acme Corp',
      date: '2025-08-05',
      time: '09:00',
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Ring John Doe',
      date: '2025-08-05',
      time: '11:30',
      type: 'call',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Skicka offert',
      date: '2025-08-06',
      time: '14:00',
      type: 'task',
      color: 'bg-orange-500'
    },
    {
      id: '4',
      title: 'Uppföljning lead',
      date: '2025-08-07',
      time: '10:00',
      type: 'reminder',
      color: 'bg-purple-500'
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Lägg till tomma celler för dagar innan månaden börjar
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Lägg till alla dagar i månaden
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockEvents.filter(event => event.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ]

  const weekdays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']
  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="pb-20 px-4 pt-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Kalender</h1>
            </div>
            <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Calendar Header */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekdays.map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />
                }

                const isToday = isCurrentMonth && day === today.getDate()
                const events = getEventsForDate(day)

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square p-2 rounded-xl border transition-all cursor-pointer hover:bg-white/10
                      ${isToday 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-sm font-medium ${isToday ? 'text-white' : 'text-gray-300'}`}>
                        {day}
                      </span>
                      
                      {/* Events indicators */}
                      <div className="flex-1 mt-1 space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`
                              w-full h-1 rounded-full ${event.color}
                            `}
                            title={`${event.time} - ${event.title}`}
                          />
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-400 text-center">
                            +{events.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Kommande händelser</h3>
            <div className="space-y-3">
              {mockEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">{event.date} kl {event.time}</p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${event.type === 'meeting' ? 'bg-blue-500/20 text-blue-300' :
                      event.type === 'call' ? 'bg-green-500/20 text-green-300' :
                      event.type === 'task' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-purple-500/20 text-purple-300'}
                  `}>
                    {event.type === 'meeting' ? 'Möte' :
                     event.type === 'call' ? 'Samtal' :
                     event.type === 'task' ? 'Uppgift' : 'Påminnelse'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
