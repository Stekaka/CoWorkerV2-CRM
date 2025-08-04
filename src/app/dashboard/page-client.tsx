'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase-client'
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
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          router.replace('/login')
          return
        }

        if (!session?.user) {
          router.replace('/login')
          return
        }

        // Sätt användaren
        setUser({
          id: session.user.id,
          name: session.user.email?.split('@')[0] || 'Användare',
          email: session.user.email || ''
        })

        // Hämta statistik
        await fetchStats()
        setAuthChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    if (!authChecked) {
      checkUser()
    }
  }, [router, authChecked])

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
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laddar...</div>
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
