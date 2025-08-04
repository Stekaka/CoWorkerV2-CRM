'use client'

import { useState, useEffect } from 'react'
import ModernDashboard from './modern-dashboard'

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Temporärt: Visa dashboard även utan session för att testa
    const mockUser = {
      id: 'test',
      name: 'Test User',
      email: 'test@example.com'
    }
    
    const mockStats = {
      totalLeads: 0,
      newLeads: 0,
      upcomingReminders: 0,
      recentLeads: []
    }
    
    setUser(mockUser)
    setStats(mockStats)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laddar dashboard...</div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Kunde inte ladda data</div>
      </div>
    )
  }

  return <ModernDashboard user={user} stats={stats} />
}
