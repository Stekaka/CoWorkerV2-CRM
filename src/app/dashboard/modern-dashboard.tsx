'use client'

import OverlayManager from '@/components/ui/OverlayManager'
import SophisticatedDashboard from './sophisticated-dashboard-clean'
import SophisticatedBottomNav from './components/SophisticatedBottomNav'

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
  return (
    <OverlayManager>
      <SophisticatedDashboard user={user} stats={stats} />
      <SophisticatedBottomNav />
    </OverlayManager>
  )
}
