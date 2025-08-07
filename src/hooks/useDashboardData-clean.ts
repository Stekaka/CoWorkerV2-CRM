'use client'

import { useState } from 'react'

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
}

export function useDashboardData() {
  const [data] = useState({
    totalLeads: 0,
    hotLeads: 0,
    recentLeads: [] as Lead[],
    conversionRate: 0,
    pipelineValue: 0,
    monthlyRevenue: 0,
    recentOffers: [] as Offer[],
    meetings: [] as Meeting[],
    todos: [] as Todo[],
    upcomingMeetings: [] as Meeting[],
    completedTodos: 0,
    pendingTodos: 0,
    totalTodos: 0
  })

  return data
}
