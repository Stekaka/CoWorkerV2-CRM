'use client'

import { useState } from 'react'
import { Search, Plus, Calendar as CalendarIcon, Target, Users, TrendingUp, ShoppingCart, BarChart3 } from 'lucide-react'
import { useOverlayContext } from '@/components/ui/OverlayContext'
import DaySelector from './components/DaySelector'
import ProjectCard from './components/ProjectCard'
import TimelineView from './components/TimelineView'
import CalendarWidget from './components/CalendarWidget'
import BottomNav from './components/BottomNav'

interface User {
  id: string
  name: string
  email: string
}

interface Lead {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

interface Stats {
  totalLeads: number
  newLeads: number
  upcomingReminders: number
  recentLeads: Lead[]
}

interface ModernDashboardClientProps {
  user: User
  stats: Stats
}

export default function ModernDashboardClient({ user, stats }: ModernDashboardClientProps) {
  const { openOverlay } = useOverlayContext()
  const [selectedDay, setSelectedDay] = useState('Mån')
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: Hämta från API
  const mockProjects = [
    {
      id: '1',
      title: 'Lead Uppföljning',
      progress: 75,
      totalTasks: 12,
      completedTasks: 9,
      tags: ['Försäljning', 'Uppföljning'],
      color: 'from-blue-500 to-purple-600',
      participants: [
        { name: 'Du', avatar: user.name.charAt(0) },
        { name: 'Team', avatar: 'T' }
      ]
    },
    {
      id: '2',
      title: 'Nya Kunder',
      progress: 45,
      totalTasks: 8,
      completedTasks: 4,
      tags: ['Akquisition', 'Demo'],
      color: 'from-green-500 to-teal-600',
      participants: [
        { name: 'Du', avatar: user.name.charAt(0) }
      ]
    },
    {
      id: '3',
      title: 'E-postkampanj',
      progress: 90,
      totalTasks: 5,
      completedTasks: 5,
      tags: ['Marketing', 'Automation'],
      color: 'from-orange-500 to-red-600',
      participants: [
        { name: 'Du', avatar: user.name.charAt(0) },
        { name: 'Marketing', avatar: 'M' }
      ]
    }
  ]

  // TODO: Hämta från API
  const mockTimelineEvents = [
    {
      id: '1',
      time: '09:00',
      title: 'Demo med Acme Corp',
      type: 'meeting' as const,
      status: 'upcoming' as const,
      color: 'bg-blue-500/20 border-blue-500'
    },
    {
      id: '2',
      time: '11:30',
      title: 'Ring tillbaka John Doe',
      type: 'call' as const,
      status: 'upcoming' as const,
      color: 'bg-green-500/20 border-green-500'
    },
    {
      id: '3',
      time: '14:00',
      title: 'Offert till TechStart AB',
      type: 'task' as const,
      status: 'in-progress' as const,
      color: 'bg-orange-500/20 border-orange-500'
    },
    {
      id: '4',
      time: '16:00',
      title: 'Team-möte',
      type: 'meeting' as const,
      status: 'completed' as const,
      color: 'bg-gray-500/20 border-gray-500'
    }
  ]

  const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white relative overflow-x-hidden">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.08),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,120,255,0.06),transparent_40%)] pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 pb-28 px-4 sm:px-6 lg:px-8 pt-8 max-w-sm sm:max-w-md lg:max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-2xl font-black shadow-2xl shadow-blue-500/25">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-xl animate-pulse" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                Hej, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-400 text-lg font-medium mt-1">Låt oss få saker gjorda idag</p>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Sök leads, projekt, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all shadow-2xl shadow-black/10 hover:bg-white/10"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 shadow-2xl shadow-black/10 hover:shadow-cyan-500/20 hover:shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white">{stats.totalLeads}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Totala leads</p>
            </div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 shadow-2xl shadow-black/10 hover:shadow-green-500/20 hover:shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white">{stats.newLeads}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Nya leads</p>
            </div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 shadow-2xl shadow-black/10 hover:shadow-orange-500/20 hover:shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white">{stats.upcomingReminders}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Påminnelser</p>
            </div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 shadow-2xl shadow-black/10 hover:shadow-purple-500/20 hover:shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white">89%</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Mål uppnått</p>
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="mb-10">
          <CalendarWidget />
        </div>

        {/* Quick Access */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Snabbåtkomst</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => openOverlay('orders')}
              className="group relative bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 text-left"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Orderhantering</h3>
                <p className="text-slate-400 text-sm">Hantera och följ upp kundorders</p>
              </div>
            </button>
            
            <button 
              onClick={() => openOverlay('budget')}
              className="group relative bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 text-left"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Budget & Analytics</h3>
                <p className="text-slate-400 text-sm">Följ upp budget och ekonomi</p>
              </div>
            </button>
          </div>
        </div>

        {/* Project Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">Aktiva projekt</h2>
            <button 
              onClick={() => openOverlay('new-event')}
              className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
            >
              <Plus className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl opacity-40 blur-xl group-hover:animate-pulse" />
            </button>
          </div>
          
          <div className="space-y-6">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Day Selector */}
        <DaySelector 
          days={days} 
          selectedDay={selectedDay} 
          onDaySelect={setSelectedDay} 
        />

        {/* Progress Section */}
        <div className="mb-10">
          <h3 className="text-xl font-black text-white mb-6">Daglig progress</h3>
          <div className="grid grid-cols-5 gap-3">
            {days.map((day) => (
              <div key={day} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl hover:bg-white/10 transition-all group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300
                    ${day === selectedDay 
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white/10 text-gray-300 group-hover:bg-white/20'
                    }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {day === selectedDay && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl opacity-20 blur-lg animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-bold text-gray-400 mb-1">{day}</p>
                <p className="text-sm font-black text-gradient-neon">{Math.floor(Math.random() * 8) + 2}/10</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        <TimelineView events={mockTimelineEvents} selectedDay={selectedDay} />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
