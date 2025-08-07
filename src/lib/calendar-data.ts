export interface Task {
  id: string
  title: string
  description?: string
  type: 'task' | 'follow-up' | 'reminder'
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  dueDate: string
  dueTime?: string
  leadId?: string // Koppling till CRM-lead
  leadCompany?: string
  assignedTo?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: 'meeting' | 'call' | 'reminder' | 'deadline'
  startDate: string
  startTime: string
  endDate?: string
  endTime?: string
  location?: string
  attendees?: string[]
  leadId?: string // Koppling till CRM-lead
  leadCompany?: string
  priority: 'low' | 'medium' | 'high'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  reminder?: {
    minutes: number
    notified: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'task-due' | 'meeting-soon' | 'follow-up' | 'reminder'
  priority: 'low' | 'medium' | 'high'
  timestamp: string
  read: boolean
  actionRequired: boolean
  relatedId?: string // ID för task eller event
  leadCompany?: string
}

// Helper functions
export const getTaskPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-400 bg-red-500/20 border-red-500/30'
    case 'medium':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    case 'low':
      return 'text-green-400 bg-green-500/20 border-green-500/30'
    default:
      return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
  }
}

export const getTaskTypeIcon = (type: Task['type']) => {
  switch (type) {
    case 'task':
      return '📋'
    case 'follow-up':
      return '🔄'
    case 'reminder':
      return '⏰'
    default:
      return '📝'
  }
}

export const getEventTypeIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return '👥'
    case 'call':
      return '📞'
    case 'reminder':
      return '⏰'
    case 'deadline':
      return '🎯'
    default:
      return '📅'
  }
}

export const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'task-due':
      return 'border-l-red-500 bg-red-500/10'
    case 'meeting-soon':
      return 'border-l-blue-500 bg-blue-500/10'
    case 'follow-up':
      return 'border-l-cyan-500 bg-cyan-500/10'
    case 'reminder':
      return 'border-l-yellow-500 bg-yellow-500/10'
    default:
      return 'border-l-slate-500 bg-slate-500/10'
  }
}

// Mock data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Följ upp offert med TechCorp',
    description: 'Ring och diskutera tekniska detaljer för cloud-lösningen',
    type: 'follow-up',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-08-06',
    dueTime: '14:00',
    leadId: 'lead-1',
    leadCompany: 'TechCorp AB',
    assignedTo: 'Du',
    tags: ['sales', 'teknisk', 'uppföljning'],
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05'
  },
  {
    id: 'task-2',
    title: 'Förbered presentation för Nordic Manufacturing',
    description: 'Skapa anpassad presentation för automatiseringslösningar',
    type: 'task',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-08-07',
    dueTime: '09:00',
    leadId: 'lead-3',
    leadCompany: 'Nordic Manufacturing',
    assignedTo: 'Du',
    tags: ['presentation', 'sales', 'automatisering'],
    createdAt: '2025-08-04',
    updatedAt: '2025-08-06'
  },
  {
    id: 'task-3',
    title: 'Skicka kontraktsutkast',
    description: 'Färdigställ och skicka kontrakt för Retail Solutions-projektet',
    type: 'task',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-08-08',
    dueTime: '12:00',
    leadId: 'lead-2',
    leadCompany: 'Retail Solutions Group',
    assignedTo: 'Du',
    tags: ['kontrakt', 'juridik', 'avslut'],
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05'
  },
  {
    id: 'task-4',
    title: 'Marknadsanalys Q3',
    description: 'Sammanställ rapport över marknadstrender och konkurrenter',
    type: 'task',
    priority: 'low',
    status: 'pending',
    dueDate: '2025-08-10',
    assignedTo: 'Du',
    tags: ['analys', 'marknad', 'rapport'],
    createdAt: '2025-08-03',
    updatedAt: '2025-08-03'
  }
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Kundmöte med TechCorp',
    description: 'Diskussion om implementering av cloud-infrastruktur',
    type: 'meeting',
    startDate: '2025-08-06',
    startTime: '15:30',
    endDate: '2025-08-06',
    endTime: '16:30',
    location: 'Konferensrum A / Teams',
    attendees: ['Anna Svensson', 'Erik Johansson'],
    leadId: 'lead-1',
    leadCompany: 'TechCorp AB',
    priority: 'high',
    status: 'scheduled',
    reminder: {
      minutes: 15,
      notified: false
    },
    createdAt: '2025-08-04',
    updatedAt: '2025-08-04'
  },
  {
    id: 'event-2',
    title: 'Säljsamtal - Nordic Manufacturing',
    description: 'Telefonmöte för att diskutera automatiseringsbehov',
    type: 'call',
    startDate: '2025-08-07',
    startTime: '10:00',
    endDate: '2025-08-07',
    endTime: '11:00',
    attendees: ['Lars Andersson'],
    leadId: 'lead-3',
    leadCompany: 'Nordic Manufacturing',
    priority: 'medium',
    status: 'scheduled',
    reminder: {
      minutes: 30,
      notified: false
    },
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05'
  },
  {
    id: 'event-3',
    title: 'Påminnelse: Kontraktsdeadline',
    description: 'Sista dag för att skicka kontrakt till Retail Solutions',
    type: 'deadline',
    startDate: '2025-08-08',
    startTime: '17:00',
    leadId: 'lead-2',
    leadCompany: 'Retail Solutions Group',
    priority: 'high',
    status: 'scheduled',
    reminder: {
      minutes: 60,
      notified: false
    },
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05'
  },
  {
    id: 'event-4',
    title: 'Veckomöte - Säljteamet',
    description: 'Genomgång av pågående leads och pipeline',
    type: 'meeting',
    startDate: '2025-08-09',
    startTime: '09:00',
    endDate: '2025-08-09',
    endTime: '10:00',
    location: 'Huvudkontoret',
    attendees: ['Maria Larsson', 'Johan Berg', 'Sofia Nilsson'],
    priority: 'medium',
    status: 'scheduled',
    reminder: {
      minutes: 15,
      notified: false
    },
    createdAt: '2025-08-02',
    updatedAt: '2025-08-02'
  }
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Uppföljning förfaller snart',
    message: 'Uppföljning med TechCorp förfaller om 2 timmar',
    type: 'task-due',
    priority: 'high',
    timestamp: '2025-08-06T12:00:00',
    read: false,
    actionRequired: true,
    relatedId: 'task-1',
    leadCompany: 'TechCorp AB'
  },
  {
    id: 'notif-2',
    title: 'Möte börjar snart',
    message: 'Kundmöte med TechCorp börjar om 15 minuter',
    type: 'meeting-soon',
    priority: 'high',
    timestamp: '2025-08-06T15:15:00',
    read: false,
    actionRequired: true,
    relatedId: 'event-1',
    leadCompany: 'TechCorp AB'
  },
  {
    id: 'notif-3',
    title: 'Säljsamtal imorgon',
    message: 'Glöm inte förbereda för Nordic Manufacturing-samtalet',
    type: 'reminder',
    priority: 'medium',
    timestamp: '2025-08-06T18:00:00',
    read: false,
    actionRequired: false,
    relatedId: 'event-2',
    leadCompany: 'Nordic Manufacturing'
  }
]

// Utility functions
export const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
  
  return date >= startOfWeek && date <= endOfWeek
}

export const formatTime = (timeString: string): string => {
  return timeString.substring(0, 5)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  })
}

export const sortByDateTime = <T extends Task | CalendarEvent>(items: T[]): T[] => {
  return items.sort((a, b) => {
    const isTaskA = 'dueDate' in a
    const isTaskB = 'dueDate' in b
    
    const aDate = isTaskA ? a.dueDate : (a as CalendarEvent).startDate
    const aTime = isTaskA ? (a as Task).dueTime : (a as CalendarEvent).startTime
    const bDate = isTaskB ? b.dueDate : (b as CalendarEvent).startDate
    const bTime = isTaskB ? (b as Task).dueTime : (b as CalendarEvent).startTime
    
    const aDateTime = new Date(`${aDate} ${aTime || '00:00'}`)
    const bDateTime = new Date(`${bDate} ${bTime || '00:00'}`)
    
    return aDateTime.getTime() - bDateTime.getTime()
  })
}
