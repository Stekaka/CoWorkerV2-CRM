'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase-client'

export default function SimpleDashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('SimpleDashboard: Starting auth check...')
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('SimpleDashboard: Session check complete')
        console.log('SimpleDashboard: Has session:', !!session)
        console.log('SimpleDashboard: Has user:', !!session?.user)
        console.log('SimpleDashboard: User email:', session?.user?.email)
        console.log('SimpleDashboard: Error:', error)
        
        if (error || !session?.user) {
          console.log('SimpleDashboard: No valid session, redirecting...')
          window.location.href = '/login'
          return
        }

        console.log('SimpleDashboard: Valid session found!')
        setUser({ id: session.user.id, email: session.user.email || '' })
      } catch (err) {
        console.error('SimpleDashboard: Exception:', err)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Laddar dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Ingen användare hittad</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Välkommen!</h2>
          <p className="text-gray-600">Du är inloggad som: {user.email}</p>
          <p className="text-gray-600">User ID: {user.id}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard funktioner</h2>
          <p className="text-gray-600">Här kommer CRM-funktionaliteten att visas.</p>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => {
              console.log('Logging out...')
              supabase.auth.signOut().then(() => {
                window.location.href = '/login'
              })
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logga ut
          </button>
        </div>
      </div>
    </div>
  )
}
