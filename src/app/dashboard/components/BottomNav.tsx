'use client'

import { Home, BarChart3, Plus, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    {
      icon: Home,
      label: 'Hem',
      href: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      icon: BarChart3,
      label: 'Statistik',
      href: '/dashboard/leads',
      active: pathname === '/dashboard/leads'
    },
    {
      icon: Plus,
      label: 'Skapa',
      href: '/dashboard/leads/new',
      active: false,
      isAction: true
    },
    {
      icon: Calendar,
      label: 'Kalender',
      href: '/dashboard/calendar',
      active: pathname === '/dashboard/calendar'
    },
    {
      icon: User,
      label: 'Påminn.',
      href: '/dashboard/reminders',
      active: pathname === '/dashboard/reminders'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-black/40 backdrop-blur-xl border-t border-white/20 px-4 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            
            if (item.isAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                  ${item.active 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${item.active 
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
                    : 'hover:bg-white/10'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium mt-1 transition-colors">
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {item.active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
