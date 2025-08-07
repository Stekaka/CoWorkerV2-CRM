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
export const mockLeads: Lead[] = [
  {
    id: '1',
    companyName: 'TechCorp AB',
    status: 'qualified',
    priority: 'high',
    isImportant: true,
    lastActivity: '2025-08-05',
    nextFollowUp: '2025-08-08',
    estimatedValue: 250000,
    source: 'Website',
    tags: ['Enterprise', 'SaaS'],
    
    contacts: [
      {
        id: '1-1',
        name: 'Anna Andersson',
        email: 'anna@techcorp.se',
        phone: '08-123 45 67',
        position: 'IT-Chef',
        isMainContact: true
      },
      {
        id: '1-2',
        name: 'Erik Eriksson',
        email: 'erik@techcorp.se',
        phone: '08-123 45 68',
        position: 'Utvecklingschef',
        isMainContact: false
      }
    ],
    mainContact: {
      id: '1-1',
      name: 'Anna Andersson',
      email: 'anna@techcorp.se',
      phone: '08-123 45 67',
      position: 'IT-Chef',
      isMainContact: true
    },
    
    industry: 'IT & Tech',
    companySize: '50-200',
    website: 'www.techcorp.se',
    address: 'Storgatan 12, 111 22 Stockholm',
    
    notes: 'Mycket intresserade av vår enterprise-lösning. Har budgeterat för Q3. Anna är beslutsfattare.',
    
    activities: [
      {
        id: '1-act-1',
        type: 'meeting',
        title: 'Inledande demo',
        description: 'Visade grundfunktioner, mycket positivt mottagande',
        date: '2025-08-05',
        time: '14:00',
        contactPerson: 'Anna Andersson',
        completed: true
      },
      {
        id: '1-act-2',
        type: 'email',
        title: 'Skickade fördjupad info',
        description: 'Mailade teknisk specifikation och prisuppgifter',
        date: '2025-08-05',
        time: '16:30',
        contactPerson: 'Anna Andersson',
        completed: true
      },
      {
        id: '1-act-3',
        type: 'call',
        title: 'Uppföljningssamtal',
        description: 'Diskutera implementation och nästa steg',
        date: '2025-08-08',
        time: '10:00',
        contactPerson: 'Anna Andersson',
        completed: false
      }
    ],
    
    orders: [
      {
        id: '1-ord-1',
        orderNumber: 'OFF-2025-001',
        title: 'Enterprise CRM License',
        amount: 250000,
        status: 'sent',
        date: '2025-08-06',
        description: 'Årslicens för 50 användare med support'
      }
    ],
    
    createdAt: '2025-07-15',
    updatedAt: '2025-08-05',
    assignedTo: 'Du'
  },
  
  {
    id: '2',
    companyName: 'Retail Solutions Group',
    status: 'contacted',
    priority: 'medium',
    isImportant: false,
    lastActivity: '2025-08-03',
    nextFollowUp: '2025-08-07',
    estimatedValue: 95000,
    source: 'Referral',
    tags: ['Retail', 'SMB'],
    
    contacts: [
      {
        id: '2-1',
        name: 'Maria Karlsson',
        email: 'maria@retailsolutions.se',
        phone: '08-987 65 43',
        position: 'VD',
        isMainContact: true
      }
    ],
    mainContact: {
      id: '2-1',
      name: 'Maria Karlsson',
      email: 'maria@retailsolutions.se',
      phone: '08-987 65 43',
      position: 'VD',
      isMainContact: true
    },
    
    industry: 'Retail',
    companySize: '10-50',
    website: 'www.retailsolutions.se',
    address: 'Handelsvägen 5, 412 55 Göteborg',
    
    notes: 'Behöver enkel CRM-lösning för små team. Priskänsliga men kvalitetsmedvetna.',
    
    activities: [
      {
        id: '2-act-1',
        type: 'call',
        title: 'Första kontakt',
        description: 'Introducerade våra lösningar, behöver mer info',
        date: '2025-08-03',
        time: '11:00',
        contactPerson: 'Maria Karlsson',
        completed: true
      },
      {
        id: '2-act-2',
        type: 'email',
        title: 'Uppföljningsmail',
        description: 'Skicka produktbroschyr och prislista',
        date: '2025-08-07',
        time: '09:00',
        contactPerson: 'Maria Karlsson',
        completed: false
      }
    ],
    
    orders: [],
    
    createdAt: '2025-08-01',
    updatedAt: '2025-08-03',
    assignedTo: 'Du'
  },
  
  {
    id: '3',
    companyName: 'Nordic Manufacturing',
    status: 'new',
    priority: 'low',
    isImportant: false,
    lastActivity: '2025-08-02',
    estimatedValue: 45000,
    source: 'Cold Email',
    tags: ['Manufacturing'],
    
    contacts: [
      {
        id: '3-1',
        name: 'Lars Larsson',
        email: 'lars@nordicmfg.se',
        phone: '031-555 44 33',
        position: 'Produktionschef',
        isMainContact: true
      }
    ],
    mainContact: {
      id: '3-1',
      name: 'Lars Larsson',
      email: 'lars@nordicmfg.se',
      phone: '031-555 44 33',
      position: 'Produktionschef',
      isMainContact: true
    },
    
    industry: 'Tillverkning',
    companySize: '20-100',
    website: 'www.nordicmfg.se',
    address: 'Industrigatan 15, 415 20 Göteborg',
    
    notes: 'Inledande intresse för projekthantering. Behöver mer kvalificering.',
    
    activities: [
      {
        id: '3-act-1',
        type: 'email',
        title: 'Första kontakt',
        description: 'Svarade på förfrågan från hemsidan',
        date: '2025-08-02',
        time: '15:30',
        contactPerson: 'Lars Larsson',
        completed: true
      }
    ],
    
    orders: [],
    
    createdAt: '2025-08-02',
    updatedAt: '2025-08-02',
    assignedTo: 'Du'
  }
]

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
