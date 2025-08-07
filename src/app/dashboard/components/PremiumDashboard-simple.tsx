'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Resizable } from 'react-resizable'
import NavigationSidebar from './NavigationSidebar'
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
      className={`rounded-xl bg-slate-900/50 backdrop-blur transition-all duration-200 ${
        isDragging 
          ? 'border-2 border-cyan-400 shadow-lg shadow-cyan-400/20' 
          : 'border-2 border-cyan-400/50 hover:border-cyan-400/70'
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
      {/* Drag Handle */}
      <div className="drag-handle w-full h-8 bg-slate-700/90 rounded-t-xl cursor-move flex items-center px-3 select-none">
        <span className="text-slate-200 text-sm font-medium">{card.title}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {layout.sizePreset} ({layout.width}×{layout.height})
          </span>
          <div className="flex gap-1">
            {(['SMALL', 'MEDIUM', 'LARGE'] as const).map(size => (
              <div
                key={size}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  layout.sizePreset === size 
                    ? 'bg-cyan-400' 
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
      </div>
      
      {/* Content */}
      <div className="absolute top-8 left-0 right-0 bottom-0 overflow-hidden rounded-b-xl">
        <Component width={layout.width} height={layout.height - 32} />
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
  
  // Simple layout state
  const [cardLayouts, setCardLayouts] = useState<Record<string, CardLayout>>(() => {
    const defaultLayouts: Record<string, CardLayout> = {}
    let currentY = 40
    let currentX = 40

    dashboardCards.forEach((card, index) => {
      const size = SIZE_PRESETS[card.defaultSize]
      
      defaultLayouts[card.id] = {
        id: card.id,
        x: currentX,
        y: currentY,
        width: size.width,
        height: size.height,
        sizePreset: card.defaultSize
      }

      // Simple grid layout - 2 cards per row for medium/large, 3 for small
      const cardsPerRow = size.width <= 320 ? 3 : 2
      if ((index + 1) % cardsPerRow === 0) {
        currentY += size.height + 40
        currentX = 40
      } else {
        currentX += size.width + 40
      }
    })

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenModal={openModal}
        currentTime={currentTime}
        isDragMode={isDragMode}
        onToggleDragMode={toggleDragMode}
      />

      <div className="ml-80 min-h-screen">
        {/* Dashboard Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-slate-400">
                {currentTime.toLocaleDateString('sv-SE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Drag Mode Toggle */}
            <motion.button
              onClick={toggleDragMode}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                isDragMode
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDragMode ? 'Exit Edit Mode' : 'Edit Layout'}
            </motion.button>
          </div>

          {/* Grid Container */}
          <div className="relative" style={{ minHeight: '1000px' }}>
            {dashboardCards.map((card) => (
              <GridCard
                key={card.id}
                card={card}
                layout={cardLayouts[card.id]}
                isDragMode={isDragMode}
                onLayoutChange={handleLayoutChange}
              />
            ))}
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
