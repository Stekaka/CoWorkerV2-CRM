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
