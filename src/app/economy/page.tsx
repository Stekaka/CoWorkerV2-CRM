'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart, Calendar, Target, AlertTriangle, Plus, Download } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  client?: string
}

interface BudgetItem {
  id: string
  category: string
  budgeted: number
  spent: number
  remaining: number
  percentage: number
}

const mockTransactions: Transaction[] = []

const mockBudget: BudgetItem[] = []

export default function EconomyPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [budget] = useState<BudgetItem[]>(mockBudget)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netProfit = totalIncome - totalExpenses

  const totalBudgeted = budget.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budget.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(Math.abs(amount))
  }

  const getBudgetColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500'
    if (percentage <= 75) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBudgetTextColor = (percentage: number) => {
    if (percentage <= 50) return 'text-green-400'
    if (percentage <= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Ekonomi & Budget</h1>
            <p className="text-slate-400">Överblick över din finansiella situation</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="week">Denna vecka</option>
              <option value="month">Denna månad</option>
              <option value="quarter">Detta kvartal</option>
              <option value="year">Detta år</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Ny Transaktion
            </motion.button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</span>
            </div>
            <p className="text-slate-400 text-sm">Total Intäkt</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-xs">+12.5%</span>
              <span className="text-slate-500 text-xs ml-2">vs förra månaden</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</span>
            </div>
            <p className="text-slate-400 text-sm">Total Kostnad</p>
            <div className="flex items-center mt-2">
              <span className="text-red-400 text-xs">+5.2%</span>
              <span className="text-slate-500 text-xs ml-2">vs förra månaden</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className={`w-8 h-8 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-2xl font-bold text-white">{formatCurrency(netProfit)}</span>
            </div>
            <p className="text-slate-400 text-sm">Nettoresultat</p>
            <div className="flex items-center mt-2">
              <span className={`text-xs ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : ''}{((netProfit / totalIncome) * 100).toFixed(1)}%
              </span>
              <span className="text-slate-500 text-xs ml-2">marginal</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{formatCurrency(totalRemaining)}</span>
            </div>
            <p className="text-slate-400 text-sm">Budget Kvar</p>
            <div className="flex items-center mt-2">
              <span className="text-purple-400 text-xs">{((totalRemaining / totalBudgeted) * 100).toFixed(0)}%</span>
              <span className="text-slate-500 text-xs ml-2">av budget</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Overview */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Budget Översikt</h2>
              <PieChart className="w-6 h-6 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {budget.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{item.category}</h3>
                    <span className={`text-sm ${getBudgetTextColor(item.percentage)}`}>
                      {item.percentage}% använt
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span>Spenderat: {formatCurrency(item.spent)}</span>
                      <span>Budget: {formatCurrency(item.budgeted)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getBudgetColor(item.percentage)}`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Kvar: {formatCurrency(item.remaining)}</span>
                    {item.percentage > 90 && (
                      <span className="text-red-400 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Nära budget!
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Senaste Transaktioner</h2>
              <div className="flex items-center space-x-2">
                <BarChart className="w-6 h-6 text-slate-400" />
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {transactions.slice(0, 8).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString('sv-SE')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    {transaction.client && (
                      <p className="text-xs text-slate-400">{transaction.client}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Goals */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Finansiella Mål</h2>
            <Target className="w-6 h-6 text-slate-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">Månatlig Omsättning</h3>
                <span className="text-green-400 text-sm">78%</span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="w-3/4 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>430k SEK</span>
                <span>Mål: 550k SEK</span>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">Kvartalsmål</h3>
                <span className="text-yellow-400 text-sm">45%</span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="w-5/12 h-2 bg-yellow-500 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>720k SEK</span>
                <span>Mål: 1.6M SEK</span>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">Årsmål</h3>
                <span className="text-cyan-400 text-sm">12%</span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="w-1/8 h-2 bg-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>720k SEK</span>
                <span>Mål: 6M SEK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
