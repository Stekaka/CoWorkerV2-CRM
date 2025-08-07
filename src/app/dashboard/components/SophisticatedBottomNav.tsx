'use client'

import { motion } from 'framer-motion'
import { Home, Calendar, Plus, Users, BarChart3 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useOverlayContext } from '@/components/ui/OverlayContext'
import Link from 'next/link'

export default function SophisticatedBottomNav() {
  const pathname = usePathname()
  const { openOverlay } = useOverlayContext()
  
  const navItems = [
    {
      icon: Home,
      label: 'Hem',
      href: '/dashboard',
      active: pathname === '/dashboard',
      type: 'link' as const
    },
    {
      icon: Calendar,
      label: 'Kalender',
      active: false,
      type: 'overlay' as const,
      overlayType: 'calendar-dashboard' as const
    },
    {
      icon: Plus,
      label: 'Skapa',
      active: false,
      isAction: true,
      type: 'overlay' as const,
      overlayType: 'new-event' as const
    },
    {
      icon: Users,
      label: 'Leads',
      active: false,
      type: 'overlay' as const,
      overlayType: 'leads' as const
    },
    {
      icon: BarChart3,
      label: 'Statistik',
      active: false,
      type: 'overlay' as const,
      overlayType: 'orders' as const
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Elegant Navigation Bar */}
      <motion.div 
        className="mx-6 mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon
              
              if (item.isAction) {
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => item.type === 'overlay' && item.overlayType && openOverlay(item.overlayType)}
                    className="group relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl opacity-0 blur-lg"
                        animate={{ opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.button>
                )
              }

              // Handle overlay items
              if (item.type === 'overlay') {
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => item.overlayType && openOverlay(item.overlayType)}
                    className="group relative flex flex-col items-center justify-center p-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                      ${item.active 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`
                      text-xs font-medium mt-1 transition-colors duration-200
                      ${item.active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}
                    `}>
                      {item.label}
                    </span>
                  </motion.button>
                )
              }

              // Handle link items
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    href={item.href!}
                    className="group relative flex flex-col items-center justify-center p-3"
                  >
                    <motion.div 
                      className={`
                        w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                        ${item.active 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className={`
                      text-xs font-medium mt-1 transition-colors duration-200
                      ${item.active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {item.active && (
                      <motion.div 
                        className="absolute -top-1 left-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{ transform: 'translateX(-50%)' }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
