import { useState, useEffect } from 'react'

interface Quote {
  id: string
  number: string
  client: string
  title: string
  amount: number
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  createdDate: string
  expiryDate: string
  items: QuoteItem[]
  notes?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  taxRate?: number
  discount?: number
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all quotes
  const fetchQuotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/quotes')
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch quotes')
      }
      
      setQuotes(result.data)
    } catch (err) {
      console.error('Error fetching quotes:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes')
    } finally {
      setLoading(false)
    }
  }

  // Create new quote
  const createQuote = async (quoteData: Partial<Quote>) => {
    try {
      setError(null)
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create quote')
      }
      
      // Add the new quote to local state
      setQuotes(prev => [result.data, ...prev])
      return result.data
    } catch (err) {
      console.error('Error creating quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to create quote')
      throw err
    }
  }

  // Update existing quote
  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    try {
      setError(null)
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update quote')
      }
      
      // Update the quote in local state
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? result.data : quote
      ))
      return result.data
    } catch (err) {
      console.error('Error updating quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to update quote')
      throw err
    }
  }

  // Delete quote
  const deleteQuote = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete quote')
      }
      
      // Remove the quote from local state
      setQuotes(prev => prev.filter(quote => quote.id !== id))
      return result.data
    } catch (err) {
      console.error('Error deleting quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete quote')
      throw err
    }
  }

  // Load quotes on mount
  useEffect(() => {
    fetchQuotes()
  }, [])

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
  }
}
