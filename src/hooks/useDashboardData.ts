'use client'

import { useState } from 'react'

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

// Custom hook
export function useDashboardData() {
  const [data] = useState({
    // Leads
    totalLeads: 0,
    hotLeads: 0,
    recentLeads: [] as Lead[],
    conversionRate: 0,
    
    // Economy
    pipelineValue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingOffers: 0,
    recentOffers: [] as Offer[],
    
    // Calendar & Tasks
    todayTasks: [] as Todo[],
    todayMeetings: 0,
    upcomingReminders: [] as Todo[],
    meetings: [] as Meeting[],
    todos: [] as Todo[],
    upcomingMeetings: [] as Meeting[],
    completedTodos: 0,
    pendingTodos: 0,
    totalTodos: 0,
    
    // Activities
    recentActivities: [] as Activity[]
  })

  return data
}
