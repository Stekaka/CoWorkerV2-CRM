'use client'

import { useState, useEffect } from 'react'
import { fetchEconomyOverview, calculateEconomyMetrics } from '@/lib/api'

interface EconomyData {
  pipelineValue: number
  forecastValue: number
  bookedRevenue: number
  quoteValue: number
  budgetTarget: number
  budgetGap: number
  monthlyRevenue: number
  totalOffers: number
  totalOrders: number
  totalQuotes: number
  pendingOffers: number
  acceptedOffers: number
}

export function useEconomyData({ from, to }: { from?: string; to?: string } = {}) {
  const [data, setData] = useState<EconomyData>({
    pipelineValue: 0,
    forecastValue: 0,
    bookedRevenue: 0,
    quoteValue: 0,
    budgetTarget: 0,
    budgetGap: 0,
    monthlyRevenue: 0,
    totalOffers: 0,
    totalOrders: 0,
    totalQuotes: 0,
    pendingOffers: 0,
    acceptedOffers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEconomyData() {
      try {
        setLoading(true)
        setError(null)
        
        const result = await fetchEconomyOverview({ from, to })
        
        const offers = result.offersRes.data || []
        const orders = result.ordersRes.data || []
        const quotes = result.quotesRes.data || []
        const budgets = result.budgetsRes.data || []

        const metrics = calculateEconomyMetrics({
          offers,
          orders,
          quotes,
          budgets
        })

        setData(metrics)
      } catch (err) {
        console.error('Error loading economy data:', err)
        setError(err instanceof Error ? err.message : 'Ett fel uppstod')
      } finally {
        setLoading(false)
      }
    }

    loadEconomyData()
  }, [from, to])

  return { data, loading, error, refetch: () => setLoading(true) }
}
