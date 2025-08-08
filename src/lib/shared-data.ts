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
