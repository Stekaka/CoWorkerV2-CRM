'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import ModernDashboard from './modern-dashboard'

export default function DashboardPage() {
  const [user, setUser] = useState<{id: string, name: string, email: string, company_id: string} | null>(null)
  const [stats, setStats] = useState<{totalLeads: number, newLeads: number, upcomingReminders: number, recentLeads: unknown[]} | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Hämta användarprofil
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)

      // Hämta statistik
      const [
        { count: totalLeads },
        { count: newLeads },
        { count: upcomingReminders },
        { data: recentLeads }
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', userData.company_id),
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', userData.company_id)
          .eq('status', 'new'),
        supabase
          .from('reminders')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', userData.company_id)
          .eq('completed', false)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('leads')
          .select('*')
          .eq('company_id', userData.company_id)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      setStats({
        totalLeads: totalLeads || 0,
        newLeads: newLeads || 0,
        upcomingReminders: upcomingReminders || 0,
        recentLeads: recentLeads || []
      })

      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user || !stats) {
    return null
  }

  // @ts-expect-error Type compatibility issue
  return <ModernDashboard user={user} stats={stats} />
}
