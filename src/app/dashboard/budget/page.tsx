'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import StandaloneBottomNav from '../components/StandaloneBottomNav'
import { Order } from '../../../lib/shared-data'

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  color: string
  orderKeywords: string[] // Keywords to match orders to this category
}

interface BudgetData {
  month: string
  budgeted: number
  actual: number
  orders: number
}

export default function BudgetPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [budgetData, setBudgetData] = useState<BudgetData[]>([])
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    budgeted: '',
    color: 'slate',
    orderKeywords: '' // Comma-separated keywords
  })

  // Calculate actual values from orders based on keywords
  const calculateActualFromOrders = (category: BudgetCategory) => {
    return orders
      .filter(order => 
        (order.status === 'confirmed' || order.status === 'completed') &&
        category.orderKeywords.some(keyword => 
          order.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          order.customer_name?.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .reduce((sum, order) => sum + order.amount, 0)
  }

  useEffect(() => {
    // Initialize with empty data - connect to your database here
    const emptyBudgetData: BudgetData[] = [
      { month: 'Jan', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Feb', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Mar', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Apr', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Maj', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Jun', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Jul', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Aug', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Sep', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Okt', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Nov', budgeted: 0, actual: 0, orders: 0 },
      { month: 'Dec', budgeted: 0, actual: 0, orders: 0 },
    ]

    const emptyCategories: BudgetCategory[] = []

    setTimeout(() => {
      setOrders([])
      setBudgetData(emptyBudgetData)
      setCategories(emptyCategories)
      setLoading(false)
    }, 500)
  }, [selectedPeriod])

  // Calculate enriched categories with actual values from orders
  const enrichedCategories = categories.map(category => ({
    ...category,
    actual: calculateActualFromOrders(category)
  }))

  const totalBudgeted = enrichedCategories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalActual = enrichedCategories.reduce((sum, cat) => sum + cat.actual, 0)
  const variance = totalActual - totalBudgeted
  const variancePercentage = totalBudgeted > 0 ? (variance / totalBudgeted) * 100 : 0

  const currentMonthData = budgetData[budgetData.length - 1] || { month: 'Aug', budgeted: 0, actual: 0, orders: 0 }
  const monthVariance = currentMonthData.actual - currentMonthData.budgeted
  const monthVariancePercentage = currentMonthData.budgeted > 0 ? (monthVariance / currentMonthData.budgeted) * 100 : 0

  const handleSaveCategory = () => {
    if (!formData.name || !formData.budgeted) return

    const categoryData: BudgetCategory = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      name: formData.name,
      budgeted: parseInt(formData.budgeted),
      color: formData.color,
      orderKeywords: formData.orderKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    }

    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? categoryData : cat))
    } else {
      setCategories([...categories, categoryData])
    }

    resetForm()
  }

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      budgeted: category.budgeted.toString(),
      color: category.color,
      orderKeywords: category.orderKeywords.join(', ')
    })
    setShowModal(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Är du säker på att du vill ta bort denna kategori?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      budgeted: '',
      color: 'slate',
      orderKeywords: ''
    })
    setEditingCategory(null)
    setShowModal(false)
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'purple': return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'amber': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-2xl font-semibold text-slate-300 animate-pulse">Laddar budget...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div className="pb-28 px-4 pt-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka till Dashboard
          </Link>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Budget & Analytics</h1>
              <p className="text-slate-400 text-lg mt-2">Följ upp finansiella mål baserat på orders</p>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <option value="all">Alla månader</option>
                <option value="jan">Januari</option>
                <option value="feb">Februari</option>
                <option value="mar">Mars</option>
                <option value="apr">April</option>
                <option value="maj">Maj</option>
                <option value="jun">Juni</option>
                <option value="jul">Juli</option>
                <option value="aug">Augusti</option>
                <option value="sep">September</option>
                <option value="okt">Oktober</option>
                <option value="nov">November</option>
                <option value="dec">December</option>
              </select>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-6 text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg py-3 px-6 text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ny Kategori
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <Target className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-2xl font-bold text-white">{totalBudgeted.toLocaleString('sv-SE')} kr</span>
            </div>
            <p className="text-slate-400 text-sm">Total budget</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-2xl font-bold text-white">{totalActual.toLocaleString('sv-SE')} kr</span>
            </div>
            <p className="text-slate-400 text-sm">Faktiskt från orders</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${variance >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {variance >= 0 ? 
                  <TrendingUp className="w-6 h-6 text-emerald-400" /> : 
                  <TrendingDown className="w-6 h-6 text-red-400" />
                }
              </div>
              <span className={`text-2xl font-bold ${variance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {variance >= 0 ? '+' : ''}{variance.toLocaleString('sv-SE')} kr
              </span>
            </div>
            <p className="text-slate-400 text-sm">Avvikelse från budget</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-slate-300" />
              </div>
              <span className={`text-2xl font-bold ${variancePercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {variancePercentage >= 0 ? '+' : ''}{variancePercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-slate-400 text-sm">Procent avvikelse</p>
          </div>
        </div>

        {/* Monthly Performance Chart */}
        <div className="mb-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Månadsvis utveckling</h2>
            
            <div className="space-y-6">
              {budgetData.map((month) => {
                const monthVariance = month.actual - month.budgeted
                const monthVariancePercent = month.budgeted > 0 ? (monthVariance / month.budgeted) * 100 : 0
                const maxValue = Math.max(...budgetData.map(d => Math.max(d.budgeted, d.actual)))
                
                return (
                  <div key={month.month} className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-white w-12">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-400">{month.orders} orders</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {month.actual.toLocaleString('sv-SE')} kr
                        </div>
                        <div className={`text-sm font-medium ${monthVariancePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {monthVariancePercent >= 0 ? '+' : ''}{monthVariancePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      {/* Budget bar (background) */}
                      <div className="w-full h-3 bg-slate-800 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-slate-600 rounded-lg transition-all duration-1000"
                          style={{ width: `${(month.budgeted / maxValue) * 100}%` }}
                        />
                      </div>
                      
                      {/* Actual bar (overlay) */}
                      <div className="absolute top-0 w-full h-3 rounded-lg overflow-hidden">
                        <div 
                          className={`h-full rounded-lg transition-all duration-1000 ${monthVariancePercent >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${(month.actual / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>Budget: {month.budgeted.toLocaleString('sv-SE')} kr</span>
                      <span>Faktiskt: {month.actual.toLocaleString('sv-SE')} kr</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Kategorier (Automatiskt beräknat från orders)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Faktiskt (från orders)</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Avvikelse</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Nyckelord</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {enrichedCategories.map((category) => {
                  const variance = category.actual - category.budgeted
                  const variancePercent = category.budgeted > 0 ? (variance / category.budgeted) * 100 : 0
                  const progressPercent = category.budgeted > 0 ? Math.min((category.actual / category.budgeted) * 100, 100) : 0
                  
                  return (
                    <tr key={category.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getColorClasses(category.color).split(' ')[0].replace('text-', 'bg-')}`} />
                          <span className="font-medium text-white">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{category.budgeted.toLocaleString('sv-SE')} kr</td>
                      <td className="px-6 py-4 font-medium text-white">{category.actual.toLocaleString('sv-SE')} kr</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${variancePercent >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                          {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getColorClasses(category.color).split(' ')[0].replace('text-', 'bg-')}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {category.orderKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Month Highlight */}
        <div className="mt-8 bg-slate-800/30 border border-slate-600 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentMonthData.month} - Aktuell månad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {currentMonthData.actual.toLocaleString('sv-SE')} kr
                </div>
                <div className="text-slate-400">Faktisk omsättning</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${monthVariancePercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {monthVariancePercentage >= 0 ? '+' : ''}{monthVariancePercentage.toFixed(1)}%
                </div>
                <div className="text-slate-400">Vs budget</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {currentMonthData.orders}
                </div>
                <div className="text-slate-400">Orders denna månad</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Redigera Kategori' : 'Ny Kategori'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Namn <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="CRM Licenser"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Budget (kr) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.budgeted}
                  onChange={(e) => setFormData({...formData, budgeted: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="500000"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Målbelopp för denna kategori</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ordernyckelord <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.orderKeywords}
                  onChange={(e) => setFormData({...formData, orderKeywords: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="license, licens, crm"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Kommaseparerade ord som matchar orders till denna kategori</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Färg
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="slate">Grå</option>
                  <option value="blue">Blå</option>
                  <option value="emerald">Grön</option>
                  <option value="purple">Lila</option>
                  <option value="amber">Gul</option>
                  <option value="red">Röd</option>
                </select>
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
                onClick={handleSaveCategory}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {editingCategory ? 'Uppdatera' : 'Skapa'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <StandaloneBottomNav />
    </div>
  )
}
