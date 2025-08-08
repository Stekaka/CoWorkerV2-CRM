'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import NavigationSidebar from '@/components/NavigationSidebar'

interface MainLayoutProps {
  children: React.ReactNode
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export default function MainLayout({ 
  children, 
  activeSection,
  onSectionChange 
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleOpenSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-white font-bold">CoWorker</h1>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar - Always visible on desktop, mobile overlay */}
      <NavigationSidebar 
        activeSection={activeSection}
        setActiveSection={onSectionChange}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content */}
      <main className="ml-20 lg:ml-[280px] pt-16 lg:pt-0 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
