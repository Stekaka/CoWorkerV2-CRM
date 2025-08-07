'use client'

import { Home, BarChart3, Plus, ShoppingCart, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOverlayContext } from '@/components/ui/OverlayContext'

export default function BottomNav() {
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
      icon: ShoppingCart,
      label: 'Orders',
      active: false,
      type: 'overlay' as const,
      overlayType: 'orders' as const
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
      icon: TrendingUp,
      label: 'Budget',
      active: false,
      type: 'overlay' as const,
      overlayType: 'budget' as const
    },
    {
      icon: BarChart3,
      label: 'Statistik',
      active: false,
      type: 'overlay' as const,
      overlayType: 'leads' as const
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Glassmorphism Navigation Bar */}
      <div className="mx-4 mb-6">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 py-4 shadow-2xl shadow-black/25">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              
              if (item.isAction) {
                return (
                  <button
                    key={item.label}
                    onClick={() => item.type === 'overlay' && item.overlayType && openOverlay(item.overlayType)}
                    className="group relative"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl opacity-40 blur-xl animate-pulse" />
                    </div>
                    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-black text-white bg-black/80 backdrop-blur-sm px-3 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/20">
                      {item.label}
                    </span>
                  </button>
                )
              }

              // Handle overlay items
              if (item.type === 'overlay') {
                return (
                  <button
                    key={item.label}
                    onClick={() => item.overlayType && openOverlay(item.overlayType)}
                    className={`
                      group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300
                      ${item.active 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    <div className={`
                      relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${item.active 
                        ? 'bg-white/15 backdrop-blur-sm border border-white/20 shadow-xl shadow-white/10' 
                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                      }
                    `}>
                      <Icon className="w-6 h-6" />
                      {item.active && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl" />
                      )}
                    </div>
                    <span className="text-xs font-bold mt-2 transition-colors">
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {item.active && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-lg shadow-cyan-500/50" />
                    )}
                  </button>
                )
              }

              // Handle link items
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`
                    group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300
                    ${item.active 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <div className={`
                    relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${item.active 
                      ? 'bg-white/15 backdrop-blur-sm border border-white/20 shadow-xl shadow-white/10' 
                      : 'hover:bg-white/10 hover:backdrop-blur-sm'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                    {item.active && (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl" />
                    )}
                  </div>
                  <span className="text-xs font-bold mt-2 transition-colors">
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-lg shadow-cyan-500/50" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
