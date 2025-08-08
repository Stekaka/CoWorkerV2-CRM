'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase-client'
import MainLayout from '@/components/layout/MainLayout'
import PremiumDashboard from './components/PremiumDashboard'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Dashboard: Checking auth...')
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session?.user) {
          console.log('Dashboard: No valid session, redirecting to login')
          setTimeout(() => {
            window.location.href = '/login'
          }, 100)
          return
        }

        console.log('Dashboard: Valid session found')
      } catch (error) {
        console.error('Dashboard: Auth check error:', error)
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 mobile-padding ios-height-fix">
        <div className="text-base md:text-lg text-slate-300">Laddar dashboard...</div>
      </div>
    )
  }

  return (
    <MainLayout activeSection="dashboard">
      <PremiumDashboard />
    </MainLayout>
  )
}
