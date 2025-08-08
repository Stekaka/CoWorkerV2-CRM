'use client'

import { useState, useEffect } from 'react'
import { fetchTasks } from '@/lib/api'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  created_at: string
}

export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await fetchTasks()
        
        if (error) throw error
        
        setTasks(data || [])
      } catch (err) {
        console.error('Error loading tasks:', err)
        setError(err instanceof Error ? err.message : 'Ett fel uppstod')
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Dagens tasks
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(task => 
    task.due_date && task.due_date.startsWith(today) && task.status !== 'completed'
  )

  const completedTodos = tasks.filter(task => task.status === 'completed').length
  const pendingTodos = tasks.filter(task => task.status === 'pending' || task.status === 'in_progress').length
  const totalTodos = tasks.length

  return { 
    tasks, 
    todayTasks,
    completedTodos,
    pendingTodos,
    totalTodos,
    loading, 
    error,
    refetch: () => setLoading(true)
  }
}
