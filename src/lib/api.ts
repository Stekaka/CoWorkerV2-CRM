// Data Access Layer för Supabase
import { supabase } from '@/lib/supabase'

export async function getCompanyId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // TODO: Implementera user profile när det finns i databasen
  // Fallback till hårdkodad company_id för utveckling
  return 'company-dronar'
}

export async function fetchOffers(limit = 50) {
  const company_id = await getCompanyId()
  return supabase
    .from('offers')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function fetchOrders(limit = 50) {
  const company_id = await getCompanyId()
  return supabase
    .from('orders')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function fetchQuotes(limit = 50) {
  const company_id = await getCompanyId()
  return supabase
    .from('quotes')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function fetchBudgets({ year, month }: { year?: number; month?: number } = {}) {
  const company_id = await getCompanyId()
  let query = supabase
    .from('budgets')
    .select('*')
    .eq('company_id', company_id)
  
  if (year != null) query = query.eq('year', year)
  if (month != null) query = query.eq('month', month)
  
  return query
}

export async function fetchLeads(limit = 50) {
  const company_id = await getCompanyId()
  return supabase
    .from('leads')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function fetchTasks(limit = 50) {
  const company_id = await getCompanyId()
  return supabase
    .from('tasks')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(limit)
}

// Aggregeringar för ekonomi/budget
export async function fetchEconomyOverview({ from, to }: { from?: string; to?: string } = {}) {
  const company_id = await getCompanyId()

  const rangeFilter = (query: any, field: string) => {
    if (from) query = query.gte(field, from)
    if (to) query = query.lte(field, to)
    return query
  }

  // Offers
  let offersQuery = supabase
    .from('offers')
    .select('status,total_amount,created_at')
    .eq('company_id', company_id)
  offersQuery = rangeFilter(offersQuery, 'created_at')
  const offersRes = await offersQuery

  // Orders
  let ordersQuery = supabase
    .from('orders')
    .select('status,total_amount,created_at')
    .eq('company_id', company_id)
  ordersQuery = rangeFilter(ordersQuery, 'created_at')
  const ordersRes = await ordersQuery

  // Quotes
  let quotesQuery = supabase
    .from('quotes')
    .select('status,total_amount,created_at')
    .eq('company_id', company_id)
  quotesQuery = rangeFilter(quotesQuery, 'created_at')
  const quotesRes = await quotesQuery

  // Budgets
  const budgetsRes = await fetchBudgets({})

  return { offersRes, ordersRes, quotesRes, budgetsRes }
}

// Beräkningar för ekonomi
export function calculateEconomyMetrics(data: {
  offers?: any[]
  orders?: any[]
  quotes?: any[]
  budgets?: any[]
}) {
  const { offers = [], orders = [], quotes = [], budgets = [] } = data

  // Pipeline value från offers med status 'sent'
  const pipelineValue = offers
    .filter(offer => offer.status === 'sent')
    .reduce((sum, offer) => sum + (offer.total_amount || 0), 0)

  // Forecast value från offers med status 'accepted'
  const forecastValue = offers
    .filter(offer => offer.status === 'accepted')
    .reduce((sum, offer) => sum + (offer.total_amount || 0), 0)

  // Booked revenue från orders med status 'completed'
  const bookedRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)

  // Quote value från alla quotes
  const quoteValue = quotes
    .reduce((sum, quote) => sum + (quote.total_amount || 0), 0)

  // TODO: Budget gap kräver revenue_target kolumn i budgets tabellen
  const budgetTarget = budgets.reduce((sum, budget) => sum + (budget.revenue_target || 0), 0)
  const budgetGap = budgetTarget - bookedRevenue

  // Månadsvis revenue (current month)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear &&
             order.status === 'completed'
    })
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)

  return {
    pipelineValue,
    forecastValue,
    bookedRevenue,
    quoteValue,
    budgetTarget,
    budgetGap,
    monthlyRevenue,
    totalOffers: offers.length,
    totalOrders: orders.length,
    totalQuotes: quotes.length,
    pendingOffers: offers.filter(o => o.status === 'sent').length,
    acceptedOffers: offers.filter(o => o.status === 'accepted').length
  }
}

// Placeholder API functions for existing routes
export const analyticsAPI = {
  track: (eventType: string, eventData: any) => Promise.resolve({ success: true }),
  getStats: async (dateRange?: { from: Date; to: Date }) => {
    return {
      totalLeads: 0,
      totalRevenue: 0,
      conversionRate: 0,
      topSources: []
    };
  }
}

export const leadsAPI = {
  getAll: () => fetchLeads(),
  getById: (id: string) => supabase.from('leads').select('*').eq('id', id).single(),
  create: (data: any) => supabase.from('leads').insert(data),
  update: (id: string, data: any) => supabase.from('leads').update(data).eq('id', id),
  delete: (id: string) => supabase.from('leads').delete().eq('id', id)
}

export const notesAPI = {
  getAll: () => supabase.from('notes').select('*'),
  getById: (id: string) => supabase.from('notes').select('*').eq('id', id).single(),
  create: (data: any) => supabase.from('notes').insert(data),
  update: (id: string, data: any) => supabase.from('notes').update(data).eq('id', id),
  delete: (id: string) => supabase.from('notes').delete().eq('id', id)
}

export const tasksAPI = {
  getAll: () => fetchTasks(),
  getById: (id: string) => supabase.from('tasks').select('*').eq('id', id).single(),
  create: (data: any) => supabase.from('tasks').insert(data),
  update: (id: string, data: any) => supabase.from('tasks').update(data).eq('id', id),
  delete: (id: string) => supabase.from('tasks').delete().eq('id', id)
}
