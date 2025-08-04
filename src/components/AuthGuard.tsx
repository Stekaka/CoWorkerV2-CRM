'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Behöver vara inloggad men är inte det
        router.replace('/login')
      } else if (!requireAuth && user) {
        // Är inloggad men ska inte vara det (på login-sida)
        router.replace('/dashboard')
      }
    }
  }, [user, loading, requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Laddar...</div>
      </div>
    )
  }

  // Om vi behöver auth men inte har det, visa ingenting (redirect pågår)
  if (requireAuth && !user) {
    return null
  }

  // Om vi inte ska ha auth men har det, visa ingenting (redirect pågår)
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}
