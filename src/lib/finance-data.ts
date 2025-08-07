export interface Order {
  id: string
  orderNumber: string
  title: string
  description: string
  amount: number
  currency: 'SEK' | 'EUR' | 'USD'
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  type: 'order' | 'quote' | 'invoice'
  leadId?: string
  leadCompany?: string
  contactPerson?: string
  createdAt: string
  sentAt?: string
  acceptedAt?: string
  dueDate?: string
  paidAt?: string
  items: OrderItem[]
  tags: string[]
  notes?: string
  probability?: number // För offerter - sannolikhet att bli accepterad (0-100%)
}

export interface OrderItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  category: string
}

export interface BudgetCategory {
  id: string
  name: string
  budgetAmount: number
  actualAmount: number
  color: string
  description?: string
  subCategories?: BudgetCategory[]
}

export interface Revenue {
  id: string
  title: string
  amount: number
  currency: 'SEK' | 'EUR' | 'USD'
  date: string
  category: string
  orderId?: string
  leadCompany?: string
  type: 'recurring' | 'one-time' | 'subscription'
  status: 'confirmed' | 'pending' | 'forecasted'
}

export interface Pipeline {
  id: string
  leadCompany: string
  leadId?: string
  estimatedValue: number
  probability: number // 0-100%
  expectedCloseDate: string
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  lastActivity: string
  contactPerson?: string
  notes?: string
  products: string[]
}

export interface FinancialSummary {
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
  pipelineValue: number
  weightedPipelineValue: number
  pendingInvoices: number
  outstandingPayments: number
  budgetUtilization: number
  profitMargin: number
}

// Helper functions
export const getOrderStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'draft':
      return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    case 'sent':
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    case 'accepted':
      return 'text-green-400 bg-green-500/20 border-green-500/30'
    case 'rejected':
      return 'text-red-400 bg-red-500/20 border-red-500/30'
    case 'completed':
      return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    case 'cancelled':
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    default:
      return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
  }
}

export const getOrderTypeIcon = (type: Order['type']) => {
  switch (type) {
    case 'order':
      return '📦'
    case 'quote':
      return '📋'
    case 'invoice':
      return '🧾'
    default:
      return '📄'
  }
}

export const getPipelineStageColor = (stage: Pipeline['stage']) => {
  switch (stage) {
    case 'prospecting':
      return 'text-slate-400 bg-slate-500/20'
    case 'qualification':
      return 'text-blue-400 bg-blue-500/20'
    case 'proposal':
      return 'text-yellow-400 bg-yellow-500/20'
    case 'negotiation':
      return 'text-orange-400 bg-orange-500/20'
    case 'closed-won':
      return 'text-green-400 bg-green-500/20'
    case 'closed-lost':
      return 'text-red-400 bg-red-500/20'
    default:
      return 'text-slate-400 bg-slate-500/20'
  }
}

export const formatCurrency = (amount: number, currency: string = 'SEK'): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`
}

export const calculateWeightedValue = (pipeline: Pipeline[]): number => {
  return pipeline.reduce((total, item) => {
    return total + (item.estimatedValue * (item.probability / 100))
  }, 0)
}

// Mock data
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2025-001',
    title: 'Cloud Infrastructure Implementation',
    description: 'Komplett molnimplementering för TechCorp AB',
    amount: 250000,
    currency: 'SEK',
    status: 'accepted',
    type: 'order',
    leadId: 'lead-1',
    leadCompany: 'TechCorp AB',
    contactPerson: 'Anna Svensson',
    createdAt: '2025-07-15',
    sentAt: '2025-07-16',
    acceptedAt: '2025-07-20',
    dueDate: '2025-09-15',
    items: [
      {
        id: 'item-1',
        name: 'AWS Infrastructure Setup',
        description: 'Komplett molninfrastruktur',
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000,
        category: 'Implementation'
      },
      {
        id: 'item-2',
        name: 'Migration Services',
        description: '6 månaders migreringshjälp',
        quantity: 6,
        unitPrice: 15000,
        totalPrice: 90000,
        category: 'Services'
      },
      {
        id: 'item-3',
        name: 'Training & Support',
        description: 'Utbildning för 10 användare',
        quantity: 10,
        unitPrice: 1000,
        totalPrice: 10000,
        category: 'Training'
      }
    ],
    tags: ['cloud', 'enterprise', 'migration'],
    probability: 95,
    notes: 'Strategisk kund med potential för utbyggnad'
  },
  {
    id: 'order-2',
    orderNumber: 'QUO-2025-007',
    title: 'Retail Analytics Platform',
    description: 'Avancerad analysplattform för retail',
    amount: 95000,
    currency: 'SEK',
    status: 'sent',
    type: 'quote',
    leadId: 'lead-2',
    leadCompany: 'Retail Solutions Group',
    contactPerson: 'Erik Johansson',
    createdAt: '2025-08-01',
    sentAt: '2025-08-02',
    dueDate: '2025-08-30',
    items: [
      {
        id: 'item-4',
        name: 'Analytics Dashboard',
        description: 'Anpassad dashboard med KPI:er',
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 45000,
        category: 'Software'
      },
      {
        id: 'item-5',
        name: 'Data Integration',
        description: 'Integration med befintliga system',
        quantity: 1,
        unitPrice: 35000,
        totalPrice: 35000,
        category: 'Integration'
      },
      {
        id: 'item-6',
        name: 'Monthly Support',
        description: '12 månaders support',
        quantity: 12,
        unitPrice: 1250,
        totalPrice: 15000,
        category: 'Support'
      }
    ],
    tags: ['analytics', 'retail', 'dashboard'],
    probability: 70,
    notes: 'Väntar på beslut från styrelsen'
  },
  {
    id: 'order-3',
    orderNumber: 'QUO-2025-008',
    title: 'Manufacturing Automation Suite',
    description: 'Automatiseringslösning för Nordic Manufacturing',
    amount: 450000,
    currency: 'SEK',
    status: 'draft',
    type: 'quote',
    leadId: 'lead-3',
    leadCompany: 'Nordic Manufacturing',
    contactPerson: 'Lars Andersson',
    createdAt: '2025-08-05',
    dueDate: '2025-09-01',
    items: [
      {
        id: 'item-7',
        name: 'Automation Software',
        description: 'Komplett automationssystem',
        quantity: 1,
        unitPrice: 300000,
        totalPrice: 300000,
        category: 'Software'
      },
      {
        id: 'item-8',
        name: 'Hardware Integration',
        description: 'Installation och konfiguration',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        category: 'Hardware'
      },
      {
        id: 'item-9',
        name: 'Training Program',
        description: 'Utbildning för 20 operatörer',
        quantity: 20,
        unitPrice: 2500,
        totalPrice: 50000,
        category: 'Training'
      }
    ],
    tags: ['automation', 'manufacturing', 'industry4.0'],
    probability: 50,
    notes: 'Kräver teknisk genomgång med deras team'
  },
  {
    id: 'invoice-1',
    orderNumber: 'INV-2025-045',
    title: 'Consulting Services - July',
    description: 'Rådgivningstjänster för månad juli',
    amount: 75000,
    currency: 'SEK',
    status: 'sent',
    type: 'invoice',
    leadCompany: 'Consulting Client AB',
    createdAt: '2025-08-01',
    sentAt: '2025-08-01',
    dueDate: '2025-08-31',
    items: [
      {
        id: 'item-10',
        name: 'Senior Consultant Hours',
        description: '50 timmar @ 1200 kr/h',
        quantity: 50,
        unitPrice: 1200,
        totalPrice: 60000,
        category: 'Consulting'
      },
      {
        id: 'item-11',
        name: 'Project Management',
        description: 'Projektledning',
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
        category: 'Management'
      }
    ],
    tags: ['consulting', 'recurring'],
    notes: 'Månadsvis fakturering enligt avtal'
  }
]

export const mockPipeline: Pipeline[] = [
  {
    id: 'pipe-1',
    leadCompany: 'Global Logistics AB',
    estimatedValue: 180000,
    probability: 80,
    expectedCloseDate: '2025-08-15',
    stage: 'negotiation',
    lastActivity: '2025-08-05',
    contactPerson: 'Maria Lindberg',
    products: ['Logistics Platform', 'API Integration'],
    notes: 'Diskuterar slutliga villkor'
  },
  {
    id: 'pipe-2',
    leadCompany: 'FinTech Innovations',
    estimatedValue: 320000,
    probability: 60,
    expectedCloseDate: '2025-09-01',
    stage: 'proposal',
    lastActivity: '2025-08-03',
    contactPerson: 'Johan Karlsson',
    products: ['Payment Gateway', 'Fraud Detection'],
    notes: 'Väntar på teknisk utvärdering'
  },
  {
    id: 'pipe-3',
    leadCompany: 'Healthcare Solutions',
    estimatedValue: 125000,
    probability: 40,
    expectedCloseDate: '2025-09-30',
    stage: 'qualification',
    lastActivity: '2025-08-01',
    contactPerson: 'Dr. Lisa Svensson',
    products: ['Patient Management System'],
    notes: 'Behöver godkännande från IT-avdelningen'
  },
  {
    id: 'pipe-4',
    leadCompany: 'E-commerce Giant',
    estimatedValue: 650000,
    probability: 25,
    expectedCloseDate: '2025-10-15',
    stage: 'prospecting',
    lastActivity: '2025-07-28',
    contactPerson: 'Anders Pettersson',
    products: ['Full E-commerce Platform', 'Mobile App'],
    notes: 'Initial diskussioner pågår'
  }
]

export const mockBudgetCategories: BudgetCategory[] = [
  {
    id: 'cat-1',
    name: 'Försäljning',
    budgetAmount: 2000000,
    actualAmount: 1650000,
    color: '#06b6d4', // cyan
    description: 'Totala försäljningsintäkter',
    subCategories: [
      {
        id: 'sub-1',
        name: 'Software Licenses',
        budgetAmount: 800000,
        actualAmount: 720000,
        color: '#0891b2'
      },
      {
        id: 'sub-2',
        name: 'Implementation Services',
        budgetAmount: 700000,
        actualAmount: 580000,
        color: '#0e7490'
      },
      {
        id: 'sub-3',
        name: 'Support & Maintenance',
        budgetAmount: 500000,
        actualAmount: 350000,
        color: '#155e75'
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Kostnader',
    budgetAmount: 1200000,
    actualAmount: 950000,
    color: '#ef4444', // red
    description: 'Totala rörelsekostnader',
    subCategories: [
      {
        id: 'sub-4',
        name: 'Personal',
        budgetAmount: 600000,
        actualAmount: 520000,
        color: '#dc2626'
      },
      {
        id: 'sub-5',
        name: 'Marknadsföring',
        budgetAmount: 300000,
        actualAmount: 230000,
        color: '#b91c1c'
      },
      {
        id: 'sub-6',
        name: 'Infrastruktur',
        budgetAmount: 200000,
        actualAmount: 150000,
        color: '#991b1b'
      },
      {
        id: 'sub-7',
        name: 'Övrigt',
        budgetAmount: 100000,
        actualAmount: 50000,
        color: '#7f1d1d'
      }
    ]
  }
]

export const mockRevenue: Revenue[] = [
  {
    id: 'rev-1',
    title: 'TechCorp AB - Cloud Implementation',
    amount: 250000,
    currency: 'SEK',
    date: '2025-07-20',
    category: 'Implementation',
    orderId: 'order-1',
    leadCompany: 'TechCorp AB',
    type: 'one-time',
    status: 'confirmed'
  },
  {
    id: 'rev-2',
    title: 'Consulting Services - Monthly',
    amount: 75000,
    currency: 'SEK',
    date: '2025-08-01',
    category: 'Consulting',
    leadCompany: 'Various Clients',
    type: 'recurring',
    status: 'confirmed'
  },
  {
    id: 'rev-3',
    title: 'Retail Solutions - Analytics Platform',
    amount: 95000,
    currency: 'SEK',
    date: '2025-08-30',
    category: 'Software',
    leadCompany: 'Retail Solutions Group',
    type: 'one-time',
    status: 'pending'
  },
  {
    id: 'rev-4',
    title: 'Nordic Manufacturing - Automation',
    amount: 450000,
    currency: 'SEK',
    date: '2025-09-15',
    category: 'Automation',
    leadCompany: 'Nordic Manufacturing',
    type: 'one-time',
    status: 'forecasted'
  }
]

export const mockFinancialSummary: FinancialSummary = {
  totalRevenue: 1875000,
  monthlyRevenue: 420000,
  quarterlyRevenue: 1250000,
  yearlyRevenue: 1875000,
  pipelineValue: 1275000,
  weightedPipelineValue: 743750,
  pendingInvoices: 170000,
  outstandingPayments: 95000,
  budgetUtilization: 82.5,
  profitMargin: 35.2
}

// Utility functions
export const getCurrentQuarter = (): string => {
  const now = new Date()
  const quarter = Math.floor((now.getMonth() + 3) / 3)
  return `Q${quarter} ${now.getFullYear()}`
}

export const getCurrentMonth = (): string => {
  const now = new Date()
  return now.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })
}

export const calculateBudgetProgress = (actual: number, budget: number): number => {
  return budget > 0 ? (actual / budget) * 100 : 0
}

export const getProgressColor = (progress: number): string => {
  if (progress >= 90) return 'text-green-400 bg-green-500/20'
  if (progress >= 70) return 'text-yellow-400 bg-yellow-500/20'
  if (progress >= 50) return 'text-orange-400 bg-orange-500/20'
  return 'text-red-400 bg-red-500/20'
}

export const sortOrdersByDate = (orders: Order[]): Order[] => {
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const filterOrdersByStatus = (orders: Order[], status: Order['status'][]): Order[] => {
  return orders.filter(order => status.includes(order.status))
}

export const groupOrdersByMonth = (orders: Order[]): Record<string, Order[]> => {
  return orders.reduce((groups, order) => {
    const month = new Date(order.createdAt).toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long' 
    })
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(order)
    return groups
  }, {} as Record<string, Order[]>)
}
