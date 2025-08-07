'use client'

import { useState, useEffect } from 'react'

// Simplified dashboard data interface
export interface DashboardData {
  totalLeads: number
  hotLeads: number
  pipelineValue: number
  recentLeads: any[]
  todayTasks: any[]
  todayMeetings: number
  upcomingReminders: any[]
  monthlyRevenue: number
  yearlyRevenue: number
  pendingOffers: number
  recentActivities: any[]
  isLoading: boolean
  error: string | null
}

// Simple test version of the hook
export const useDashboardData = (): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    totalLeads: 25,
    hotLeads: 8,
    pipelineValue: 1450000,
    recentLeads: [],
    todayTasks: [],
    todayMeetings: 3,
    upcomingReminders: [],
    monthlyRevenue: 650000,
    yearlyRevenue: 5200000,
    pendingOffers: 12,
    recentActivities: [],
    isLoading: false,
    error: null
  })

  useEffect(() => {
    // Simple mock data fetch
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, isLoading: false }))
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return data
}
