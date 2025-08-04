'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import supabase from '@/lib/supabase-client'
import ModernDashboard from './modern-dashboard'
import AuthGuard from '@/components/AuthGuard'

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

function DashboardContent() {
  const { user: authUser } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authUser) {
      fetchStats()
    }
  }, [authUser])

  const fetchStats = async () => {
    try {
      // Hämta leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsError) {
        console.error('Error fetching leads:', leadsError)
        return
      }

      // Hämta reminders
      const { data: reminders, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .gte('reminder_date', new Date().toISOString())
        .order('reminder_date', { ascending: true })

      if (remindersError) {
        console.error('Error fetching reminders:', remindersError)
        return
      }

      // Beräkna statistik
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const newLeads = leads?.filter(lead => 
        new Date(lead.created_at) > weekAgo
      ).length || 0

      setStats({
        totalLeads: leads?.length || 0,
        newLeads,
        upcomingReminders: reminders?.length || 0,
        recentLeads: leads?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laddar dashboard...</div>
      </div>
    )
  }

  if (!stats || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Kunde inte ladda data</div>
      </div>
    )
  }

  const user: User = {
    id: authUser.id,
    name: authUser.email?.split('@')[0] || 'Användare',
    email: authUser.email || ''
  }

  return <ModernDashboard user={user} stats={stats} />
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}
