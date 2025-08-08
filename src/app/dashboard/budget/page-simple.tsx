'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  actual: number
  color: string
}

interface BudgetData {
  month: string
  budgeted: number
  actual: number
  orders: number
}

export default function BudgetPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [budgetData, setBudgetData] = useState<BudgetData[]>([])

  useEffect(() => {
    fetchBudgetData()
  }, [])

  async function fetchBudgetData() {
    try {
      setLoading(true)
      
      // TODO: Implementera Supabase-anrop för budget-data
      // const { data: budgetsData, error } = await supabase.from('budgets').select('*')
      // if (error) throw error
      
      // Tillfällig tom data
      setCategories([])
      setBudgetData([])
      
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0)
  const budgetProgress = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Laddar budget...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Budget</h1>
              <p className="text-slate-400">Översikt av budget och resultat</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-white">
                  {totalBudgeted.toLocaleString('sv-SE')} kr
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Faktisk omsättning</p>
                <p className="text-2xl font-bold text-white">
                  {totalActual.toLocaleString('sv-SE')} kr
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Budget Progress</p>
                <p className="text-2xl font-bold text-white">
                  {budgetProgress.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
          <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Ingen budget-data tillgänglig</h3>
          <p className="text-slate-400 mb-6">
            Budget-funktionalitet kommer att integreras med riktiga Supabase-data snart.
          </p>
        </div>
      </div>
    </div>
  )
}
