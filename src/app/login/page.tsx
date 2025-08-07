'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import supabase from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Verifiera sessionen
        const { data: sessionCheck } = await supabase.auth.getSession()
        console.log('Session verification:', sessionCheck)
        
        // Redirect till dashboard
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError('Ett oväntat fel inträffade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center mobile-padding ios-height-fix">
      {/* Background effects - hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Branding - Simplified for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:block mb-8 lg:mb-0"
        >
          <div className="space-y-6 lg:space-y-8">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CoWorker
              </span>
            </div>
            
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                Välkommen tillbaka till{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  framtiden
                </span>
              </h1>
              
              <p className="text-sm lg:text-xl text-slate-300 mb-6 lg:mb-8 leading-relaxed">
                Logga in och fortsätt bygga fantastiska kundrelationer med världens mest anpassningsbara CRM.
              </p>
            </div>

            <div className="hidden lg:block space-y-4">
              {[
                'Tillgång till alla dina leads och kunder',
                'Realtids analytics och rapporter',
                'Automatiserade arbetsflöden',
                'Mobile-first design'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="relative">
            {/* Neon border effect - simplified for mobile */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-t-3xl" />
            
            <div className="mobile-card relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 lg:p-8 xl:p-12">
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Logga in på ditt konto
                </h2>
                <p className="text-sm lg:text-base text-slate-400">
                  Ange dina uppgifter för att komma åt CoWorker
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    E-postadress
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mobile-input w-full pl-9 lg:pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-base"
                      placeholder="din@epost.se"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mobile-input w-full pl-9 lg:pl-10 pr-10 lg:pr-12 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mobile-button touch-target absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 lg:p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Login button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mobile-button-large group w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-600/25 transition-all duration-300 flex items-center justify-center relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? 'Loggar in...' : 'Logga in'}
                    {!loading && <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Forgot password link */}
                <div className="text-center">
                  <Link href="#" className="mobile-button text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Glömt lösenord?
                  </Link>
                </div>
              </form>

              {/* Register link */}
              <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                <p className="text-slate-400">
                  Har du inget konto?{' '}
                  <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Registrera dig här
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:hidden text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CoWorker
            </span>
          </div>
          <p className="text-slate-300">
            Det anpassningsbara CRM:et för moderna företag
          </p>
        </motion.div>
      </div>
    </div>
  )
}
