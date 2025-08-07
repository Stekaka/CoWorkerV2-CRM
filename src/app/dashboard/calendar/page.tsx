'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import StandaloneBottomNav from '../components/StandaloneBottomNav'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  time: string
  type: 'meeting' | 'call' | 'task' | 'reminder'
  status: 'upcoming' | 'completed' | 'cancelled'
  customer?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showNewEventModal, setShowNewEventModal] = useState(false)

  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Demo med Acme Corp',
      description: 'Produktdemonstration av CRM-systemet',
      date: '2024-08-15',
      time: '09:00',
      type: 'meeting',
      status: 'upcoming',
      customer: 'Acme Corp'
    },
    {
      id: '2',
      title: 'Ring tillbaka John Doe',
      description: 'Uppföljning av förfrågan om licenser',
      date: '2024-08-15',
      time: '11:30',
      type: 'call',
      status: 'upcoming',
      customer: 'TechStart AB'
    },
    {
      id: '3',
      title: 'Offert till Nordic Solutions',
      description: 'Skicka prisförslag för integration',
      date: '2024-08-16',
      time: '14:00',
      type: 'task',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Team-möte',
      description: 'Veckomöte med utvecklingsteam',
      date: '2024-08-16',
      time: '16:00',
      type: 'meeting',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Kunduppföljning',
      description: 'Kontrollera att implementation fungerar',
      date: '2024-08-20',
      time: '10:00',
      type: 'call',
      status: 'upcoming',
      customer: 'StartupXYZ'
    }
  ]

  const monthNames = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ]

  const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.date === dateStr)
  }

  const formatDateForComparison = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDateClick = (day: number) => {
    const dateStr = formatDateForComparison(day)
    setSelectedDate(dateStr)
    const dayEvents = getEventsForDate(dateStr)
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
      setShowEventModal(true)
    }
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500'
      case 'call': return 'bg-green-500'
      case 'task': return 'bg-amber-500'
      case 'reminder': return 'bg-purple-500'
      default: return 'bg-slate-500'
    }
  }

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return '👥'
      case 'call': return '📞'
      case 'task': return '📋'
      case 'reminder': return '⏰'
      default: return '📅'
    }
  }

  const renderCalendarGrid = () => {
    const firstDay = getFirstDayOfMonth(currentDate)
    const daysInMonth = getDaysInMonth(currentDate)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const cells = []

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
      const dateStr = isCurrentMonth ? formatDateForComparison(dayNumber) : ''
      const dayEvents = isCurrentMonth ? getEventsForDate(dateStr) : []
      const isToday = isCurrentMonth && 
        new Date().toISOString().split('T')[0] === dateStr
      const isSelected = selectedDate === dateStr

      cells.push(
        <div
          key={i}
          className={`
            min-h-[100px] border border-slate-700 p-2 cursor-pointer transition-colors
            ${isCurrentMonth ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-slate-900/20'}
            ${isToday ? 'ring-2 ring-blue-500' : ''}
            ${isSelected ? 'bg-slate-700/50' : ''}
          `}
          onClick={() => isCurrentMonth && handleDateClick(dayNumber)}
        >
          {isCurrentMonth && (
            <>
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-400' : 'text-white'}`}>
                {dayNumber}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`
                      text-xs px-2 py-1 rounded text-white truncate cursor-pointer
                      ${getEventTypeColor(event.type)}
                      ${event.status === 'completed' ? 'opacity-60 line-through' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                      setShowEventModal(true)
                    }}
                  >
                    {getEventTypeIcon(event.type)} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-400 px-2">
                    +{dayEvents.length - 3} fler
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )
    }

    return cells
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div className="pb-28 px-4 pt-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka till Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🗓️ Kalender (UPPDATERAD)</h1>
              <p className="text-slate-400 text-lg mt-2">Hantera möten, uppgifter och påminnelser - Outlook-stil</p>
            </div>
            
            <button
              onClick={() => setShowNewEventModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg py-3 px-6 text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ny Händelse
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-slate-800/50">
            {dayNames.map(day => (
              <div key={day} className="p-4 text-center font-medium text-slate-300 border-r border-slate-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {renderCalendarGrid()}
          </div>
        </div>

        {/* Today's Events */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Dagens händelser</h3>
          <div className="space-y-3">
            {events.filter(event => event.date === new Date().toISOString().split('T')[0]).map(event => (
              <div
                key={event.id}
                className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => {
                  setSelectedEvent(event)
                  setShowEventModal(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                    <div>
                      <div className="font-medium text-white">{event.title}</div>
                      <div className="text-sm text-slate-400">{event.time} {event.customer && `• ${event.customer}`}</div>
                    </div>
                  </div>
                  <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${getEventTypeColor(selectedEvent.type)}`} />
                <h2 className="text-xl font-bold text-white">{selectedEvent.title}</h2>
              </div>
              <div className="text-slate-400">
                {selectedEvent.date} • {selectedEvent.time}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedEvent.customer && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Kund</label>
                  <div className="text-white">{selectedEvent.customer}</div>
                </div>
              )}
              
              {selectedEvent.description && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Beskrivning</label>
                  <div className="text-white">{selectedEvent.description}</div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Typ</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getEventTypeIcon(selectedEvent.type)}</span>
                  <span className="text-white capitalize">{selectedEvent.type}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedEvent.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  selectedEvent.status === 'cancelled' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {selectedEvent.status === 'upcoming' ? 'Kommande' :
                   selectedEvent.status === 'completed' ? 'Slutförd' : 'Avbruten'}
                </span>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Stäng
              </button>
              <button
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Redigera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Ny Händelse</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Titel *</label>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Möte med kund..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Datum *</label>
                <input
                  type="date"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tid *</label>
                <input
                  type="time"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Typ</label>
                <select className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="meeting">👥 Möte</option>
                  <option value="call">📞 Samtal</option>
                  <option value="task">📋 Uppgift</option>
                  <option value="reminder">⏰ Påminnelse</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kund (valfri)</label>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Kundnamn..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Beskrivning (valfri)</label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Beskrivning av händelsen..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowNewEventModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Skapa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <StandaloneBottomNav />
    </div>
  )
}
