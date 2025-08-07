// Shared data store for orders across the application
export interface Order {
  id: string
  customer_name: string
  order_number: string
  amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  description?: string
  category?: string
}

// Mock orders data - this would normally come from Supabase
export const mockOrders: Order[] = [
  { 
    id: '1', 
    customer_name: 'Acme Corp', 
    order_number: 'ORD-001', 
    amount: 150000, 
    status: 'confirmed', 
    created_at: '2024-08-01', 
    description: 'CRM Implementation Package',
    category: 'implementation' 
  },
  { 
    id: '2', 
    customer_name: 'TechStart AB', 
    order_number: 'ORD-002', 
    amount: 75000, 
    status: 'pending', 
    created_at: '2024-08-03', 
    description: 'CRM License Renewal',
    category: 'license' 
  },
  { 
    id: '3', 
    customer_name: 'Nordic Solutions', 
    order_number: 'ORD-003', 
    amount: 200000, 
    status: 'completed', 
    created_at: '2024-07-28', 
    description: 'Custom Integration Service',
    category: 'integration' 
  },
  { 
    id: '4', 
    customer_name: 'StartupXYZ', 
    order_number: 'ORD-004', 
    amount: 50000, 
    status: 'cancelled', 
    created_at: '2024-08-05', 
    description: 'Support & Maintenance Package',
    category: 'support' 
  },
]

// Helper functions for data consistency
export const getOrdersByMonth = (orders: Order[], month: string, year: string = '2024') => {
  const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1
  return orders.filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate.getMonth() + 1 === monthNumber && orderDate.getFullYear() === parseInt(year)
  })
}

export const getOrdersByStatus = (orders: Order[], status: Order['status']) => {
  return orders.filter(order => order.status === status)
}

export const getOrderStats = (orders: Order[]) => {
  const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
  return {
    total: orders.reduce((sum, order) => sum + order.amount, 0),
    confirmed: confirmed.reduce((sum, order) => sum + order.amount, 0),
    count: orders.length,
    confirmedCount: confirmed.length
  }
}

export const getMonthlyData = (orders: Order[], year: string = '2024') => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
  
  return months.map((month, index) => {
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === index && orderDate.getFullYear() === parseInt(year)
    })
    
    const confirmedOrders = monthOrders.filter(o => o.status === 'confirmed' || o.status === 'completed')
    
    return {
      month,
      actual: confirmedOrders.reduce((sum, order) => sum + order.amount, 0),
      orders: monthOrders.length,
      confirmedOrders: confirmedOrders.length
    }
  })
}
