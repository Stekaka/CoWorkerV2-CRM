'use client'

import { useState } from 'react'
import { Search, Plus, Calendar as CalendarIcon, Target, Users, TrendingUp } from 'lucide-react'
import DaySelector from './components/DaySelector'
import ProjectCard from './components/ProjectCard'
import TimelineView from './components/TimelineView'
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

interface ModernDashboardProps {
  user: User
  stats: Stats
}

export default function ModernDashboard({ user, stats }: ModernDashboardProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Main Content */}
      <div className="pb-20 px-4 pt-8">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Hej, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-400">Låt oss få saker gjorda idag</p>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Sök leads, projekt, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold">{stats.totalLeads}</span>
            </div>
            <p className="text-gray-400 text-sm">Totala leads</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold">{stats.newLeads}</span>
            </div>
            <p className="text-gray-400 text-sm">Nya leads</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="w-6 h-6 text-orange-400" />
              <span className="text-2xl font-bold">{stats.upcomingReminders}</span>
            </div>
            <p className="text-gray-400 text-sm">Påminnelser</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-purple-400" />
              <span className="text-2xl font-bold">89%</span>
            </div>
            <p className="text-gray-400 text-sm">Mål uppnått</p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Aktiva projekt</h2>
            <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
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
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Daglig progress</h3>
          <div className="grid grid-cols-5 gap-2">
            {days.map((day) => (
              <div key={day} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${day === selectedDay ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/20 text-gray-300'}`}>
                    {user.name.charAt(0)}
                  </div>
                </div>
                <p className="text-xs text-gray-400">{day}</p>
                <p className="text-xs font-semibold text-green-400">{Math.floor(Math.random() * 8) + 2}/10</p>
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
