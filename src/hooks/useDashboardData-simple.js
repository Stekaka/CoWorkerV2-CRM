// Simple working version of useDashboardData hook
export const useDashboardData = () => {
  return {
    totalLeads: 0,
    hotLeads: 0,
    recentLeads: [],
    conversionRate: 0,
    pipelineValue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingOffers: 0,
    recentOffers: [],
    todayTasks: [],
    todayMeetings: 0,
    upcomingReminders: [],
    meetings: [],
    todos: [],
    upcomingMeetings: [],
    completedTodos: 0,
    pendingTodos: 0,
    totalTodos: 0,
    recentActivities: []
  }
}

// TypeScript interfaces
export interface Lead {
  id: string
  name: string
  company: string
  priority: 'hot' | 'warm' | 'cold'
  status: string
  email: string
  phone: string
  createdAt: string
}

export interface Offer {
  id: string
  title: string
  client: string
  amount: number
  status: 'pending' | 'accepted' | 'declined'
  date: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  attendees: string[]
  type: 'call' | 'meeting' | 'demo'
}

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  leadCompany?: string
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task'
  title: string
  description: string
  timestamp: string
  leadName?: string
}
