'use client'

import { useEconomyData } from './useEconomyData'
import { useLeadsData } from './useLeadsData'
import { useTasksData } from './useTasksData'

export function useDashboardData() {
  const economy = useEconomyData()
  const leads = useLeadsData()
  const tasks = useTasksData()

  const loading = economy.loading || leads.loading || tasks.loading
  const error = economy.error || leads.error || tasks.error

  // Kombinera all data
  const combinedData = {
    // Leads
    totalLeads: leads.totalLeads,
    hotLeads: leads.hotLeads,
    recentLeads: leads.recentLeads,
    conversionRate: leads.totalLeads > 0 ? Math.round((leads.hotLeads / leads.totalLeads) * 100) : 0,
    
    // Economy
    pipelineValue: economy.data.pipelineValue,
    monthlyRevenue: economy.data.monthlyRevenue,
    yearlyRevenue: economy.data.bookedRevenue,
    pendingOffers: economy.data.pendingOffers,
    recentOffers: [], // TODO: Implementera recent offers från API
    
    // Calendar & Tasks
    todayTasks: tasks.todayTasks,
    todayMeetings: 0, // TODO: Implementera när calendar finns
    upcomingReminders: tasks.todayTasks,
    meetings: [], // TODO: Implementera när calendar finns
    todos: tasks.tasks,
    upcomingMeetings: [], // TODO: Implementera när calendar finns
    completedTodos: tasks.completedTodos,
    pendingTodos: tasks.pendingTodos,
    totalTodos: tasks.totalTodos,
    
    // Activities
    recentActivities: [], // TODO: Implementera activities från API
    
    loading,
    error
  }

  return combinedData
}
