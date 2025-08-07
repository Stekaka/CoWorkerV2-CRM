'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  ArrowRight, Users, Mail, Calendar, BarChart3, 
  Globe, Shield, Zap, Sparkles,
  CheckCircle, Award, TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const pricingRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })
  const pricingInView = useInView(pricingRef, { once: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden ios-height-fix">
      {/* Navigation */}
      <nav className="relative z-50 safe-area-top mobile-padding py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CoWorker
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 md:space-x-4"
          >
            <Link 
              href="/login" 
              className="mobile-button px-3 md:px-6 py-2 text-slate-300 hover:text-white transition-colors text-sm md:text-base"
            >
              Logga in
            </Link>
            <Link 
              href="/login" 
              className="mobile-button px-4 md:px-6 py-2 md:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-600/25 transition-all duration-300 relative overflow-hidden group text-sm md:text-base"
            >
              <span className="relative z-10">Kom igång</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-8 md:pt-20 pb-16 md:pb-32 mobile-padding">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
              CRM som{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  växer
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 blur-lg -z-10" />
              </span>
              {' '}med dig
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed mobile-padding">
              Från enmannaföretag till stora organisationer. CoWorker anpassar sig efter dina behov 
              och växer med ditt företag - utan kompromisser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mobile-padding">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="/login" 
                  className="group mobile-button-large w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-base md:text-lg hover:shadow-2xl hover:shadow-cyan-600/25 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Starta gratis idag
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 animate-pulse" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <button className="mobile-button-large w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-slate-600 rounded-xl font-semibold text-base md:text-lg hover:border-cyan-500 transition-all duration-300 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                  Se demo
                  <Zap className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements - Hidden on mobile for performance */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="hidden md:block absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="py-16 md:py-32 relative mobile-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Allt du behöver på{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ett ställe
              </span>
            </h2>
            <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto">
              Kraftfulla funktioner som passar både småföretag och storföretag
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: Users,
                title: 'Smart Lead-hantering',
                description: 'AI-driven prioritering och automatisk uppföljning av alla dina potentiella kunder',
                color: 'from-cyan-500 to-blue-600',
                neon: 'cyan'
              },
              {
                icon: Mail,
                title: 'Automatiserad Email',
                description: 'Personliga kampanjer som skickas vid rätt tidpunkt för maximal konvertering',
                color: 'from-blue-500 to-purple-600',
                neon: 'blue'
              },
              {
                icon: BarChart3,
                title: 'Avancerad Analytics',
                description: 'Djupa insikter i din försäljningspipeline och kundresan',
                color: 'from-purple-500 to-pink-600',
                neon: 'purple'
              },
              {
                icon: Calendar,
                title: 'Intelligent Schemaläggning',
                description: 'Automatisk bokning och påminnelser som aldrig missar ett möte',
                color: 'from-green-500 to-teal-600',
                neon: 'green'
              },
              {
                icon: Shield,
                title: 'Enterprise Säkerhet',
                description: 'Bank-nivå kryptering och GDPR-compliance som standard',
                color: 'from-orange-500 to-red-600',
                neon: 'orange'
              },
              {
                icon: Globe,
                title: 'Multi-platform',
                description: 'Fungerar perfekt på alla enheter, online och offline',
                color: 'from-teal-500 to-cyan-600',
                neon: 'teal'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="mobile-card h-full p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all duration-300 relative overflow-hidden">
                  {/* Neon accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 md:py-32 relative mobile-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { number: '50k+', label: 'Aktiva användare', icon: Users },
              { number: '99.9%', label: 'Upptid', icon: Shield },
              { number: '200%', label: 'Snabbare försäljning', icon: TrendingUp },
              { number: '24/7', label: 'Support', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center group mobile-card">
                <div className="relative mb-3 md:mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
                </div>
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 md:mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-16 md:py-32 mobile-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Priser som{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                växer med dig
              </span>
            </h2>
            <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto">
              Från solopreneur till enterprise - vi har en plan för alla
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '0',
                description: 'Perfekt för solopreneurs',
                features: ['Upp till 100 leads', 'Grundläggande email', 'Mobilapp', 'Community support'],
                color: 'from-slate-600 to-slate-700',
                neon: false
              },
              {
                name: 'Professional',
                price: '299',
                description: 'För växande företag',
                features: ['Obegränsade leads', 'Avancerad automation', 'Analytics dashboard', 'Prioriterad support', 'API-access'],
                color: 'from-cyan-600 to-blue-600',
                neon: true,
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Kontakta oss',
                description: 'För stora organisationer',
                features: ['Allt i Professional', 'Anpassade integrationer', 'Dedikerad success manager', 'SSO & avancerad säkerhet', 'SLA-garanti'],
                color: 'from-purple-600 to-pink-600',
                neon: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`mobile-card relative p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-cyan-500 md:scale-105 shadow-2xl shadow-cyan-600/20' 
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-xs md:text-sm font-semibold">
                      Mest populär
                    </div>
                  </div>
                )}
                
                {plan.neon && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400" />
                )}

                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {typeof plan.price === 'string' && plan.price !== 'Kontakta oss' ? (
                      <>
                        <span className="text-2xl md:text-3xl text-slate-400">kr</span>
                        {plan.price}
                        <span className="text-sm md:text-lg text-slate-400">/månad</span>
                      </>
                    ) : (
                      <span className="text-lg md:text-2xl">{plan.price}</span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href="/login" 
                    className={`mobile-button-large block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-600/25'
                        : 'border border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
                    }`}
                  >
                    {plan.price === 'Kontakta oss' ? 'Kontakta försäljning' : 'Kom igång'}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 relative mobile-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mobile-card relative p-8 md:p-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden"
          >
            {/* Neon border effect - simplified for mobile */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Redo att{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  revolutionera
                </span>
                {' '}din försäljning?
              </h2>
              
              <p className="text-base md:text-xl text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Gå med i tusentals företag som redan använder CoWorker för att öka sin försäljning
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    href="/login" 
                    className="mobile-button-large group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-base md:text-lg hover:shadow-2xl hover:shadow-cyan-600/25 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Starta din 30-dagars testperiod
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              </div>
              
              <p className="text-xs md:text-sm text-slate-400 mt-4 md:mt-6">
                Ingen bindningstid • Avbryt när som helst • Inget kreditkort krävs
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-slate-800 mobile-padding safe-area-bottom">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-3 md:mb-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CoWorker
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-400">
            © 2025 CoWorker. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  )
}
