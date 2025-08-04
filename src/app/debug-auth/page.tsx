'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  sessionError?: string
  userError?: string
  error?: string
  timestamp: string
}

export default function AuthDebugPage() {
  const [authState, setAuthState] = useState<AuthState | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginTest, setLoginTest] = useState('')
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('testpass123')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    const checkAuth = async () => {
      try {
        console.log('Checking auth state...')
        
        // Hämta session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('Session:', session)
        console.log('Session error:', sessionError)
        
        // Hämta användare
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('User:', user)
        console.log('User error:', userError)
        
        setAuthState({
          session,
          user,
          sessionError: sessionError?.message,
          userError: userError?.message,
          timestamp: new Date().toISOString()
        })
      } catch (err) {
        console.error('Auth check error:', err)
        setAuthState({
          session: null,
          user: null,
          error: String(err),
          timestamp: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Lyssna på auth-ändringar
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      checkAuth()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const testLogin = async () => {
    setLoginTest('Testing login...')
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })
      
      if (error) {
        setLoginTest(`Login error: ${error.message}`)
      } else {
        setLoginTest('Login successful! Checking redirect...')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      setLoginTest(`Login exception: ${String(err)}`)
    }
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return <div className="p-8">Loading auth state...</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Auth State</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="din@email.se"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lösenord:</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="dittlösenord"
              />
            </div>
          </div>
          
          <div className="space-x-4">
            <button 
              onClick={testLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Login
            </button>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reload Page
            </button>
          </div>
          {loginTest && (
            <div className="mt-4 p-2 bg-yellow-100 rounded">
              {loginTest}
            </div>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Environment Check</h2>
          <ul className="space-y-1 text-sm">
            <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
            <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
            <li>Key starts with: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
