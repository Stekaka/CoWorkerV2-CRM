'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Dashboard: Checking auth...')
      console.log('Dashboard: Current URL:', window.location.href)
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Dashboard: Raw session data:', session)
        console.log('Dashboard: Session error:', error)
        console.log('Dashboard: Session exists:', !!session)
        console.log('Dashboard: User exists:', !!session?.user)
        console.log('Dashboard: User ID:', session?.user?.id)
        console.log('Dashboard: User email:', session?.user?.email)
        
        if (error) {
          console.error('Dashboard: Session error details:', error)
        }
        
        if (error || !session?.user) {
          console.log('Dashboard: No valid session, redirecting to login')
          console.log('Dashboard: Redirect reason - Error:', !!error, 'No session:', !session, 'No user:', !session?.user)
          // Ge lite tid innan redirect
          setTimeout(() => {
            console.log('Dashboard: Executing redirect to login')
            window.location.href = '/login'
          }, 100)
          return
        }

        console.log('Dashboard: Valid session found, setting up user')
        
        // Sätt användaren
        setUser({
          id: session.user.id,
          name: session.user.email?.split('@')[0] || 'Användare',
          email: session.user.email || ''
        })

        // Hämta statistik
        await fetchStats()
      } catch (error) {
        console.error('Dashboard: Auth check error:', error)
        setTimeout(() => {
          console.log('Dashboard: Exception caught, redirecting to login')
          window.location.href = '/login'
        }, 100)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchStats = async () => {
    console.log('Dashboard: Fetching stats...')
    try {
      // Hämta leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsError) {
        console.error('Error fetching leads:', leadsError)
        console.log('Dashboard: Using default stats due to leads error')
        // Använd dummy-data om tabellerna inte finns
        setStats({
          totalLeads: 0,
          newLeads: 0,
          upcomingReminders: 0,
          recentLeads: []
        })
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
        console.log('Dashboard: Using partial stats due to reminders error')
        // Använd data från leads men 0 reminders
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        const newLeads = leads?.filter(lead => 
          new Date(lead.created_at) > weekAgo
        ).length || 0

        setStats({
          totalLeads: leads?.length || 0,
          newLeads,
          upcomingReminders: 0,
          recentLeads: leads?.slice(0, 5) || []
        })
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
      
      console.log('Dashboard: Stats loaded successfully', {
        totalLeads: leads?.length || 0,
        newLeads,
        upcomingReminders: reminders?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      console.log('Dashboard: Using default stats due to exception')
      // Fallback till dummy-data
      setStats({
        totalLeads: 0,
        newLeads: 0,
        upcomingReminders: 0,
        recentLeads: []
      })
    }
  }

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
