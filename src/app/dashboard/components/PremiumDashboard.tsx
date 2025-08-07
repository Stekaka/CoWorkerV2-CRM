'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Resizable } from 'react-resizable'
import ModalSystem from './ModalSystem'
import DashboardStats from './dashboard-components/DashboardStats'
import LeadsOverviewCard from './dashboard-components/LeadsOverviewCard'
// import CalendarTodoCard from './dashboard-components/CalendarTodoCard'
import EconomyOverviewCard from './dashboard-components/EconomyOverviewCard'
import MailCampaignsCard from './dashboard-components/MailCampaignsCard'
import RecentActivitiesCard from './dashboard-components/RecentActivitiesCard'

// Simple snap system with predefined sizes
const GRID_SIZE = 20

// Predefined size presets - Small, Medium, Large
const SIZE_PRESETS = {
  SMALL: { width: 320, height: 240 },
  MEDIUM: { width: 480, height: 360 },
  LARGE: { width: 640, height: 480 }
} as const

const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

const snapToSizePreset = (width: number, height: number): { width: number; height: number } => {
  const area = width * height
  const smallArea = SIZE_PRESETS.SMALL.width * SIZE_PRESETS.SMALL.height
  const mediumArea = SIZE_PRESETS.MEDIUM.width * SIZE_PRESETS.MEDIUM.height
  
  if (area <= (smallArea + mediumArea) / 2) {
    return SIZE_PRESETS.SMALL
  } else if (area <= (mediumArea + SIZE_PRESETS.LARGE.width * SIZE_PRESETS.LARGE.height) / 2) {
    return SIZE_PRESETS.MEDIUM
  } else {
    return SIZE_PRESETS.LARGE
  }
}

interface DashboardCardConfig {
  id: string
  component: React.ComponentType<{ width?: number; height?: number }>
  title: string
  defaultSize: keyof typeof SIZE_PRESETS
}

interface CardLayout {
  id: string
  x: number
  y: number
  width: number
  height: number
  sizePreset: keyof typeof SIZE_PRESETS
}

const dashboardCards: DashboardCardConfig[] = [
  {
    id: 'leads-overview',
    component: LeadsOverviewCard,
    title: 'Leads Overview',
    defaultSize: 'MEDIUM'
  },
  // {
  //   id: 'calendar-todo',
  //   component: CalendarTodoCard,
  //   title: 'Kalender & Uppgifter',
  //   defaultSize: 'SMALL'
  // },
  {
    id: 'economy-overview',
    component: EconomyOverviewCard,
    title: 'Ekonomi Översikt',
    defaultSize: 'LARGE'
  },
  {
    id: 'mail-campaigns',
    component: MailCampaignsCard,
    title: 'Mail Kampanjer',
    defaultSize: 'MEDIUM'
  },
  {
    id: 'recent-activities',
    component: RecentActivitiesCard,
    title: 'Senaste Aktiviteter',
    defaultSize: 'MEDIUM'
  }
]

// Simple Grid Layout Card Component
interface GridCardProps {
  card: DashboardCardConfig
  layout: CardLayout
  isDragMode: boolean
  onLayoutChange: (id: string, newLayout: Partial<CardLayout>) => void
}

function GridCard({ card, layout, isDragMode, onLayoutChange }: GridCardProps) {
  const Component = card.component
  const [isDragging, setIsDragging] = useState(false)

  // Safety check
  if (!Component || typeof Component !== 'function') {
    return (
      <div
        style={{
          position: 'absolute',
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
        }}
        className="bg-red-500/20 border-2 border-red-500 rounded-xl flex items-center justify-center"
      >
        <span className="text-red-300 text-sm">Error: {card.title}</span>
      </div>
    )
  }

  if (!isDragMode) {
    return (
      <div
        style={{
          position: 'absolute',
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
        }}
        className="transition-all duration-200"
      >
        <Component width={layout.width} height={layout.height} />
      </div>
    )
  }

  return (
    <div 
      style={{
        position: 'absolute',
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
        cursor: isDragging ? 'grabbing' : 'move',
        zIndex: isDragging ? 1000 : 1
      }}
      className={`rounded-2xl transition-all duration-300 ${
        isDragging 
          ? 'border-2 border-cyan-400/60 shadow-xl shadow-cyan-400/10 bg-slate-800/60' 
          : isDragMode
            ? 'border border-slate-600/40 hover:border-slate-500/60 bg-slate-900/30'
            : 'border border-slate-700/30 bg-slate-900/20 hover:bg-slate-900/30'
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
          setIsDragging(true)
          const startX = e.clientX - layout.x
          const startY = e.clientY - layout.y
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const newX = Math.max(0, moveEvent.clientX - startX)
            const newY = Math.max(0, moveEvent.clientY - startY)
            
            onLayoutChange(card.id, { x: newX, y: newY })
          }
          
          const handleMouseUp = () => {
            setIsDragging(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }
          
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }
      }}
    >
      {/* Clean Drag Handle */}
      <div className={`w-full h-10 rounded-t-2xl cursor-move flex items-center px-4 select-none transition-all duration-300 ${
        isDragMode 
          ? 'bg-slate-700/60 border-b border-slate-600/30' 
          : 'bg-slate-800/40 border-b border-slate-700/20'
      }`}>
        <span className="text-slate-200 text-sm font-medium truncate">{card.title}</span>
        
        {isDragMode && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">
              {layout.sizePreset}
            </span>
            <div className="flex gap-1.5">
              {(['SMALL', 'MEDIUM', 'LARGE'] as const).map(size => (
                <button
                  key={size}
                  className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
                    layout.sizePreset === size 
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-400/30' 
                      : 'bg-slate-500 hover:bg-slate-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    const preset = SIZE_PRESETS[size]
                    onLayoutChange(card.id, {
                      width: preset.width,
                      height: preset.height,
                      sizePreset: size
                    })
                  }}
                  title={`${size}: ${SIZE_PRESETS[size].width}×${SIZE_PRESETS[size].height}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="absolute top-10 left-0 right-0 bottom-0 overflow-hidden rounded-b-2xl">
        <Component width={layout.width} height={layout.height - 40} />
      </div>
    </div>
  )
}

// Temporary inline hook
function useDashboardData() {
  const [data] = useState({
    totalLeads: 0,
    hotLeads: 0,
    recentLeads: [],
    conversionRate: 0,
    pipelineValue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingOffers: 0,
    totalTodos: 0,
    recentActivities: [],
    loading: false,
    error: null
  })
  return data
}

export default function PremiumDashboard() {
  const dashboardData = useDashboardData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isDragMode, setIsDragMode] = useState(false)
  
  // Clean layout state with organized positioning
  const [cardLayouts, setCardLayouts] = useState<Record<string, CardLayout>>(() => {
    const defaultLayouts: Record<string, CardLayout> = {}
    
    // Clean, organized layout with plenty of space
    const startX = 30
    const startY = 30
    const gapX = 30
    const gapY = 30
    
    // Row 1: Key metrics (top priority)
    defaultLayouts['leads-overview'] = {
      id: 'leads-overview',
      x: startX,
      y: startY,
      width: SIZE_PRESETS.MEDIUM.width,
      height: SIZE_PRESETS.MEDIUM.height,
      sizePreset: 'MEDIUM'
    }
    
    defaultLayouts['economy-overview'] = {
      id: 'economy-overview',
      x: startX + SIZE_PRESETS.MEDIUM.width + gapX,
      y: startY,
      width: SIZE_PRESETS.MEDIUM.width,
      height: SIZE_PRESETS.MEDIUM.height,
      sizePreset: 'MEDIUM'
    }
    
    // Row 2: Planning & Activities 
    const row2Y = startY + SIZE_PRESETS.MEDIUM.height + gapY
    
    defaultLayouts['calendar-todo'] = {
      id: 'calendar-todo',
      x: startX,
      y: row2Y,
      width: SIZE_PRESETS.MEDIUM.width,
      height: SIZE_PRESETS.MEDIUM.height,
      sizePreset: 'MEDIUM'
    }
    
    defaultLayouts['recent-activities'] = {
      id: 'recent-activities',
      x: startX + SIZE_PRESETS.MEDIUM.width + gapX,
      y: row2Y,
      width: SIZE_PRESETS.MEDIUM.width,
      height: SIZE_PRESETS.MEDIUM.height,
      sizePreset: 'MEDIUM'
    }
    
    // Row 3: Marketing
    const row3Y = row2Y + SIZE_PRESETS.MEDIUM.height + gapY
    
    defaultLayouts['mail-campaigns'] = {
      id: 'mail-campaigns',
      x: startX,
      y: row3Y,
      width: SIZE_PRESETS.MEDIUM.width,
      height: SIZE_PRESETS.SMALL.height,
      sizePreset: 'SMALL'
    }

    return defaultLayouts
  })

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleLayoutChange = (cardId: string, newLayout: Partial<CardLayout>) => {
    setCardLayouts(prev => {
      const currentLayout = prev[cardId]
      const updatedLayout = { ...currentLayout, ...newLayout }
      
      // Simple position snapping
      if (newLayout.x !== undefined) updatedLayout.x = Math.max(0, snapToGrid(newLayout.x))
      if (newLayout.y !== undefined) updatedLayout.y = Math.max(0, snapToGrid(newLayout.y))
      
      // Size snapping
      if (newLayout.width || newLayout.height) {
        const snappedSize = snapToSizePreset(updatedLayout.width, updatedLayout.height)
        updatedLayout.width = snappedSize.width
        updatedLayout.height = snappedSize.height
        
        const sizePreset = Object.entries(SIZE_PRESETS).find(([, preset]) => 
          preset.width === snappedSize.width && preset.height === snappedSize.height
        )?.[0] as keyof typeof SIZE_PRESETS || 'MEDIUM'
        updatedLayout.sizePreset = sizePreset
      }
      
      return {
        ...prev,
        [cardId]: updatedLayout
      }
    })
  }

  const toggleDragMode = () => {
    setIsDragMode(!isDragMode)
  }

  const openModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 ios-height-fix">
      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Dashboard Content */}
        <div className="mobile-padding safe-area-top">
          {/* Clean Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 mobile-card bg-slate-900/30 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-slate-700/20">
            <div>
              <h1 className="text-xl md:text-3xl font-light text-white mb-1 tracking-wide">
                Dashboard
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-light">
                {currentTime.toLocaleDateString('sv-SE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Refined Edit Button - Hidden on mobile */}
            <motion.button
              onClick={toggleDragMode}
              className={`hidden md:flex px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isDragMode
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-600/25'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-600/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDragMode ? '✓ Klar' : 'Anpassa Layout'}
            </motion.button>
          </div>

          {/* Grid Container - Responsive Layout */}
          <div className="space-y-4 md:space-y-0">
            {/* Mobile: Vertical Stack */}
            <div className="md:hidden space-y-4">
              {dashboardCards.map((card) => {
                const Component = card.component
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mobile-card"
                  >
                    <Component />
                  </motion.div>
                )
              })}
            </div>

            {/* Desktop: Grid Layout */}
            <div 
              className="hidden md:block relative bg-gradient-to-br from-slate-900/10 to-slate-800/10 rounded-3xl p-8 border border-slate-700/20 backdrop-blur-sm"
              style={{ 
                minHeight: '900px',
                width: '100%'
              }}
            >
              {dashboardCards.map((card) => {
                const layout = cardLayouts[card.id]
                
                if (!layout) {
                  return (
                    <div key={card.id} className="text-red-400/60 p-4 text-sm">
                      Missing layout: {card.title}
                    </div>
                  )
                }
                
                return (
                  <GridCard
                    key={card.id}
                    card={card}
                    layout={layout}
                    isDragMode={isDragMode}
                    onLayoutChange={handleLayoutChange}
                  />
                )
              })}
              
              {/* Subtle background grid when in drag mode */}
              {isDragMode && (
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #64748b 1px, transparent 1px),
                      linear-gradient(to bottom, #64748b 1px, transparent 1px)
                    `,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalSystem
        activeModal={activeModal}
        onClose={closeModal}
      />
    </div>
  )
}
