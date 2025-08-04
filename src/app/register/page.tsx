'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase-client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Ett oväntat fel inträffade')
        return
      }

      // Registreringen lyckades, logga in användaren
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Kontot skapades men inloggning misslyckades. Försök logga in manuellt.')
        return
      }

      router.push('/dashboard')
      router.refresh()
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
          <CardTitle className="text-2xl font-bold">Skapa konto</CardTitle>
          <CardDescription>
            Kom igång med CoWorker CRM idag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Ditt namn</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
                placeholder="Anna Andersson"
              />
            </div>

            <div>
              <Label htmlFor="companyName">Företagsnamn</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="mt-1"
                placeholder="Mitt företag AB"
              />
            </div>
            
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
                minLength={6}
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
              {loading ? 'Skapar konto...' : 'Skapa konto'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Har du redan ett konto?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Logga in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
