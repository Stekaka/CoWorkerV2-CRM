import { useState, useEffect, useCallback } from 'react'
import { NoteBlock } from '@/lib/supabase'

// Types
interface Note {
  id: string
  title: string
  content: NoteBlock[]
  tags: string[]
  is_pinned: boolean
  lead_id: string | null
  company_id: string
  created_by: string
  created_at: string
  updated_at: string
}

interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  lead_id: string | null
  note_id: string | null
  company_id: string
  assigned_to: string
  created_by: string
  created_at: string
  updated_at: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  tags: string[]
  notes: string | null
  company_id: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

// Generic API hook
function useAPI<T>(endpoint: string, params?: Record<string, string | undefined>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = new URL(endpoint, window.location.origin)
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value)
        })
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [endpoint, params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Notes hooks
export function useNotes(filters?: { tags?: string[]; leadId?: string; search?: string }) {
  const params = {
    ...(filters?.tags && { tags: filters.tags.join(',') }),
    ...(filters?.leadId && { leadId: filters.leadId }),
    ...(filters?.search && { search: filters.search })
  }

  const { data, loading, error, refetch } = useAPI<Note>('/api/notes', params)

  const createNote = async (noteData: { title: string; content?: NoteBlock[]; tags?: string[]; leadId?: string }) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    })

    if (!response.ok) {
      throw new Error('Failed to create note')
    }

    const newNote = await response.json()
    refetch()
    return newNote
  }

  const updateNote = async (id: string, updates: Partial<{ title: string; content: NoteBlock[]; tags: string[]; is_pinned: boolean }>) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update note')
    }

    const updatedNote = await response.json()
    refetch()
    return updatedNote
  }

  const deleteNote = async (id: string) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete note')
    }

    refetch()
  }

  return {
    notes: data,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch
  }
}

// Note by ID hook
export function useNote(id: string) {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNote = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/notes/${id}`)
      if (!response.ok) {
        throw new Error('Note not found')
      }
      
      const noteData = await response.json()
      setNote(noteData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchNote()
    }
  }, [id, fetchNote])

  const updateNote = async (updates: Partial<{ title: string; content: NoteBlock[]; tags: string[]; is_pinned: boolean }>) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update note')
    }

    const updatedNote = await response.json()
    setNote(updatedNote)
    return updatedNote
  }

  return {
    note,
    loading,
    error,
    updateNote,
    refetch: fetchNote
  }
}

// Tasks hooks
export function useTasks(filters?: { status?: string; assignedTo?: string; leadId?: string }) {
  const { data, loading, error, refetch } = useAPI<Task>('/api/tasks', filters)

  const createTask = async (taskData: { 
    title: string; 
    description?: string; 
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    leadId?: string;
    noteId?: string;
    assignedTo?: string;
  }) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    const newTask = await response.json()
    refetch()
    return newTask
  }

  const updateTask = async (id: string, updates: Partial<{
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
  }>) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update task')
    }

    const updatedTask = await response.json()
    refetch()
    return updatedTask
  }

  return {
    tasks: data,
    loading,
    error,
    createTask,
    updateTask,
    refetch
  }
}

// Leads hooks
export function useLeads(filters?: { status?: string; tags?: string[]; search?: string }) {
  const params = {
    ...(filters?.status && { status: filters.status }),
    ...(filters?.tags && { tags: filters.tags.join(',') }),
    ...(filters?.search && { search: filters.search })
  }

  const { data, loading, error, refetch } = useAPI<Lead>('/api/leads', params)

  const createLead = async (leadData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    tags?: string[];
    notes?: string;
  }) => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })

    if (!response.ok) {
      throw new Error('Failed to create lead')
    }

    const newLead = await response.json()
    refetch()
    return newLead
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update lead')
    }

    const updatedLead = await response.json()
    refetch()
    return updatedLead
  }

  return {
    leads: data,
    loading,
    error,
    createLead,
    updateLead,
    refetch
  }
}

// Analytics hook
export function useAnalytics(dateRange?: { from: string; to: string }) {
  const params: Record<string, string | undefined> = dateRange ? { from: dateRange.from, to: dateRange.to } : {}
  const { data, loading, error, refetch } = useAPI<Record<string, unknown>>('/api/analytics', params)

  const trackEvent = async (eventType: string, eventData?: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventData })
      })
    } catch (err) {
      console.error('Failed to track event:', err)
    }
  }

  return {
    analytics: data,
    loading,
    error,
    trackEvent,
    refetch
  }
}
