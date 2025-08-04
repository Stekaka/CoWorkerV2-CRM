import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth'
import ModernDashboard from './modern-dashboard'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()

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
      .eq('company_id', user.company_id),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', user.company_id)
      .eq('status', 'new'),
    supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', user.company_id)
      .eq('completed', false)
      .gte('due_date', new Date().toISOString())
      .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('leads')
      .select('*')
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const stats = {
    totalLeads: totalLeads || 0,
    newLeads: newLeads || 0,
    upcomingReminders: upcomingReminders || 0,
    recentLeads: recentLeads || []
  }

  return <ModernDashboard user={user} stats={stats} />
}