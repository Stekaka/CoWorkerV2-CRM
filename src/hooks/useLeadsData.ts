'use client'

import { useState, useEffect } from 'react'
import { fetchLeads } from '@/lib/api'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: string
  priority: string
  created_at: string
}

export function useLeadsData() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLeads() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await fetchLeads()
        
        if (error) throw error
        
        const formattedLeads = data?.map(lead => ({
          id: lead.id,
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          status: lead.status || 'new',
          priority: 'medium', // TODO: Add priority to leads table
          created_at: lead.created_at
        })) || []

        setLeads(formattedLeads)
      } catch (err) {
        console.error('Error loading leads:', err)
        setError(err instanceof Error ? err.message : 'Ett fel uppstod')
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [])

  const totalLeads = leads.length
  const hotLeads = leads.filter(lead => lead.priority === 'high').length
  const recentLeads = leads.slice(0, 5)

  return { 
    leads, 
    totalLeads, 
    hotLeads, 
    recentLeads, 
    loading, 
    error,
    refetch: () => setLoading(true)
  }
}
