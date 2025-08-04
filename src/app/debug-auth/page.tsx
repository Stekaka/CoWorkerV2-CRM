'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  company_id: string
}

export default function DebugAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const supabase = createClient()
    
    const checkAuth = async () => {
      try {
        // Hämta session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        setSession(session)
        
        if (sessionError) {
          setError('Session error: ' + sessionError.message)
          return
        }

        // Hämta användare
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        setUser(user)
        
        if (userError) {
          setError('User error: ' + userError.message)
          return
        }

        if (user) {
          // Hämta användarprofil från database - utan .single() först
          const { data: profiles, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
          
          if (profileError) {
            setError('Profile error: ' + profileError.message)
          } else {
            // Visa hur många profiler som hittades
            console.log('Found profiles:', profiles)
            if (profiles && profiles.length > 0) {
              setProfile(profiles[0]) // Ta första profilen
            } else {
              setError('No profile found for user ID: ' + user.id)
            }
          }
        }
      } catch (err) {
        setError('Unexpected error: ' + String(err))
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Session</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">User</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        {error && (
          <div>
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <pre className="bg-red-100 p-4 rounded overflow-auto text-red-800">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
