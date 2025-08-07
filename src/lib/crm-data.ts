// CRM Data Types and Mock Data

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'
export type Priority = 'low' | 'medium' | 'high'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  position: string
  isMainContact: boolean
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  date: string
  time: string
  contactPerson?: string
  completed: boolean
}

export interface Order {
  id: string
  orderNumber: string
  title: string
  amount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'completed'
  date: string
  description: string
}

export interface Lead {
  id: string
  companyName: string
  status: LeadStatus
  priority: Priority
  isImportant: boolean
  lastActivity: string
  nextFollowUp?: string
  estimatedValue: number
  source: string
  tags: string[]
  
  // Contact information
  contacts: Contact[]
  mainContact: Contact
  
  // Company details
  industry: string
  companySize: string
  website: string
  address: string
  
  // Notes and activities
  notes: string
  activities: Activity[]
  orders: Order[]
  
  // Metadata
  createdAt: string
  updatedAt: string
  assignedTo: string
}

// Mock Data
export const mockLeads: Lead[] = []
export const getStatusColor = (status: LeadStatus): string => {
  switch (status) {
    case 'new': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    case 'contacted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'qualified': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    case 'proposal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    case 'negotiation': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'won': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30'
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'low': return 'text-slate-400'
    case 'medium': return 'text-yellow-400'
    case 'high': return 'text-red-400'
    default: return 'text-slate-400'
  }
}

export const getActivityIcon = (type: ActivityType): string => {
  switch (type) {
    case 'call': return '📞'
    case 'email': return '📧'
    case 'meeting': return '🤝'
    case 'note': return '📝'
    case 'task': return '✓'
    default: return '📋'
  }
}
