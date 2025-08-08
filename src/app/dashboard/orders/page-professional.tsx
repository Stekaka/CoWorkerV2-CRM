'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, DollarSign, Package, CheckCircle } from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  order_number: string
  amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  description?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    order_number: '',
    amount: '',
    status: 'pending' as Order['status'],
    description: ''
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      // TODO: Implementera Supabase-anrop när orders-tabellen är klar
      // const { data, error } = await supabase.from('orders').select('*')
      // if (error) throw error
      // setOrders(data || [])
      
      // Tillfällig tom data
      setOrders([])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.reduce((sum, order) => sum + order.amount, 0),
    confirmed: orders.filter(o => o.status === 'confirmed').reduce((sum, order) => sum + order.amount, 0),
    count: orders.length
  }

  const handleSaveOrder = () => {
    if (!formData.customer_name || !formData.order_number || !formData.amount) return

    const orderData: Order = {
      id: editingOrder ? editingOrder.id : Date.now().toString(),
      customer_name: formData.customer_name,
      order_number: formData.order_number,
      amount: parseInt(formData.amount),
      status: formData.status,
      created_at: editingOrder ? editingOrder.created_at : new Date().toISOString().split('T')[0],
      description: formData.description
    }

    if (editingOrder) {
      setOrders(orders.map(order => order.id === editingOrder.id ? orderData : order))
    } else {
      setOrders([...orders, orderData])
    }

    resetForm()
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setFormData({
      customer_name: order.customer_name,
      order_number: order.order_number,
      amount: order.amount.toString(),
      status: order.status,
      description: order.description || ''
    })
    setShowModal(true)
  }

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Är du säker på att du vill ta bort denna order?')) {
      setOrders(orders.filter(order => order.id !== orderId))
    }
  }

  const resetForm = () => {
    setFormData({
      customer_name: '',
      order_number: '',
      amount: '',
      status: 'pending',
      description: ''
    })
    setEditingOrder(null)
    setShowModal(false)
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'completed': return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Väntar'
      case 'confirmed': return 'Bekräftad'
      case 'completed': return 'Klar'
      case 'cancelled': return 'Avbruten'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-2xl font-semibold text-slate-300 animate-pulse">Laddar orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div className="pb-28 px-4 pt-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Orderhantering</h1>
              <p className="text-slate-400 text-lg mt-2">Hantera kundorders och följ upp status</p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg py-3 px-6 text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ny Order
            </button>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök orders eller kund..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-12 pr-6 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-6 text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              <option value="all">Alla statusar</option>
              <option value="pending">Väntar</option>
              <option value="confirmed">Bekräftad</option>
              <option value="completed">Klar</option>
              <option value="cancelled">Avbruten</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.total.toLocaleString('sv-SE')} kr</span>
            </div>
            <p className="text-slate-400 text-sm">Totalt ordervärde</p>
          </div>
          
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">{stats.confirmed.toLocaleString('sv-SE')} kr</span>
            </div>
            <p className="text-slate-400 text-sm">Bekräftat värde</p>
          </div>
          
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.count}</span>
            </div>
            <p className="text-slate-400 text-sm">Antal orders</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Kund</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Belopp</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Datum</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{order.order_number}</div>
                        {order.description && (
                          <div className="text-sm text-slate-400">{order.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{order.customer_name}</td>
                    <td className="px-6 py-4 font-medium text-white">{order.amount.toLocaleString('sv-SE')} kr</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{order.created_at}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit Order */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingOrder ? 'Redigera Order' : 'Ny Order'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kund
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Kundnamn"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ordernummer
                </label>
                <input
                  type="text"
                  value={formData.order_number}
                  onChange={(e) => setFormData({...formData, order_number: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="ORD-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Belopp (kr)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="150000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Order['status']})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="pending">Väntar</option>
                  <option value="confirmed">Bekräftad</option>
                  <option value="completed">Klar</option>
                  <option value="cancelled">Avbruten</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Beskrivning (valfri)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Beskrivning av ordern..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveOrder}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {editingOrder ? 'Uppdatera' : 'Skapa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
