'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import supabase from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Kolla om användaren redan är inloggad
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data?.user) {
        // Använd router.replace istället för window.location
        router.replace('/dashboard')
      }
    } catch {
      setError('Ett oväntat fel inträffade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Logga in</CardTitle>
          <CardDescription>
            Ange dina uppgifter för att komma åt ditt konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-postadress</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="din@epost.se"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Har du inget konto?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Registrera dig
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
