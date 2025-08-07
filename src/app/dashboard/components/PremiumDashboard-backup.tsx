'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Resizable } from 'react-resizable'
import NavigationSidebar from './NavigationSidebar'
import ModalSystem from './ModalSystem'
import DashboardStats from './dashboard-components/DashboardStats'
import LeadsOverviewCard from './dashboard-components/LeadsOverviewCard'
import CalendarTodoCard from './dashboard-components/CalendarTodoCard'
import EconomyOverviewCard from './dashboard-components/EconomyOverviewCard'
import MailCampaignsCard from './dashboard-components/MailCampaignsCard'
import RecentActivitiesCard from './dashboard-components/RecentActivitiesCard'
// import QuickActionsBar from './dashboard-components/QuickActionsBar'

// Snap system with predefined sizes
const GRID_SIZE = 20
const CONTAINER_PADDING = 40

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
  
  // Determine closest preset based on area
  if (area <= (smallArea + mediumArea) / 2) {
    return SIZE_PRESETS.SMALL
  } else if (area <= (mediumArea + SIZE_PRESETS.LARGE.width * SIZE_PRESETS.LARGE.height) / 2) {
    return SIZE_PRESETS.MEDIUM
  } else {
    return SIZE_PRESETS.LARGE
  }
}

/* Temporarily disabled collision detection functions
const getContainerBounds = (containerState?: { width: number; height: number }) => {
  // Use provided container state if available, otherwise calculate from viewport
  if (containerState) {
    return containerState
  }
  
  // Calculate container bounds dynamically
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1400
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000
  
  return {
    width: Math.max(1200, viewportWidth - 320), // Account for sidebar
    height: Math.max(800, viewportHeight - 160) // Account for header
  }
}

const checkCollision = (rect1: CardLayout, rect2: CardLayout): boolean => {
  return !(rect1.x >= rect2.x + rect2.width || 
           rect1.x + rect1.width <= rect2.x || 
           rect1.y >= rect2.y + rect2.height || 
           rect1.y + rect1.height <= rect2.y)
}

const ensureBounds = (layout: CardLayout, containerState?: { width: number; height: number }): CardLayout => {
  const container = getContainerBounds(containerState)
  
  // Ensure minimum bounds with extra padding
  const minX = CONTAINER_PADDING
  const minY = CONTAINER_PADDING
  const maxX = Math.max(container.width - layout.width - CONTAINER_PADDING, minX)
  const maxY = Math.max(container.height - layout.height - CONTAINER_PADDING, minY)
  
  return {
    ...layout,
    x: Math.max(minX, Math.min(layout.x, maxX)),
    y: Math.max(minY, Math.min(layout.y, maxY)),
    width: Math.max(layout.width, 200), // Minimum width
    height: Math.max(layout.height, 150) // Minimum height
  }
}

const findNonCollidingPosition = (
  targetLayout: CardLayout,
  existingLayouts: Record<string, CardLayout>,
  excludeId: string,
  containerState?: { width: number; height: number }
): CardLayout => {
  const container = getContainerBounds(containerState)
  const bestLayout = ensureBounds({ ...targetLayout }, containerState)
  
  // Check if current position is valid
  let hasCollision = false
  for (const [id, layout] of Object.entries(existingLayouts)) {
    if (id === excludeId) continue
    if (checkCollision(bestLayout, layout)) {
      hasCollision = true
      break
    }
  }
  
  if (!hasCollision) {
    return bestLayout
  }
  
  // Find a new position using a systematic grid search
  const stepSize = GRID_SIZE * 3
  
  for (let y = CONTAINER_PADDING; y <= container.height - targetLayout.height - CONTAINER_PADDING; y += stepSize) {
    for (let x = CONTAINER_PADDING; x <= container.width - targetLayout.width - CONTAINER_PADDING; x += stepSize) {
      const candidateLayout = {
        ...targetLayout,
        x: snapToGrid(x),
        y: snapToGrid(y)
      }
      
      let isValid = true
      for (const [id, layout] of Object.entries(existingLayouts)) {
        if (id === excludeId) continue
        if (checkCollision(candidateLayout, layout)) {
          isValid = false
          break
        }
      }
      
      if (isValid) {
        return candidateLayout
      }
    }
  }
  
  // If no position found, return bounds-corrected original
  return bestLayout
}

const resolveCollisions = (
  targetId: string,
  targetLayout: CardLayout,
  allLayouts: Record<string, CardLayout>,
  containerState?: { width: number; height: number }
): Record<string, CardLayout> => {
  const result = { ...allLayouts }
  
  // Ensure the target is within bounds and doesn't collide
  const validTarget = findNonCollidingPosition(targetLayout, allLayouts, targetId, containerState)
  result[targetId] = validTarget
  
  // Check if any existing components now collide and need repositioning
  const componentsToReposition: string[] = []
  for (const [id, layout] of Object.entries(result)) {
    if (id === targetId) continue
    if (checkCollision(validTarget, layout)) {
      componentsToReposition.push(id)
    }
  }
  
  // Reposition colliding components
  for (const id of componentsToReposition) {
    const currentLayout = result[id]
    const newPosition = findNonCollidingPosition(currentLayout, result, id, containerState)
    result[id] = newPosition
  }
  
  return result
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
  {
    id: 'calendar-todo',
    component: CalendarTodoCard,
    title: 'Kalender & Uppgifter',
    defaultSize: 'SMALL'
  },
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

// Grid Layout Card Component
interface GridCardProps {
  card: DashboardCardConfig
  layout: CardLayout
  isDragMode: boolean
  onLayoutChange: (id: string, newLayout: Partial<CardLayout>) => void
}

function GridCard({ card, layout, isDragMode, onLayoutChange }: GridCardProps) {
  const Component = card.component
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  // Safety check - if component is not valid, render placeholder
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

  const handleResize = (event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    // Snap to nearest preset size
    const snappedSize = snapToSizePreset(size.width, size.height)
    const sizePreset = Object.entries(SIZE_PRESETS).find(([, preset]) => 
      preset.width === snappedSize.width && preset.height === snappedSize.height
    )?.[0] as keyof typeof SIZE_PRESETS || 'MEDIUM'
    
    onLayoutChange(card.id, {
      width: snappedSize.width,
      height: snappedSize.height,
      sizePreset
    })
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
    <Resizable
      width={layout.width}
      height={layout.height}
      minConstraints={[SIZE_PRESETS.SMALL.width, SIZE_PRESETS.SMALL.height]}
      maxConstraints={[SIZE_PRESETS.LARGE.width, SIZE_PRESETS.LARGE.height]}
      onResize={handleResize}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={() => setIsResizing(false)}
      resizeHandles={['se', 'e', 's']}
    >
      <div 
        style={{
          position: 'absolute',
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
          cursor: isDragging ? 'grabbing' : 'move',
          zIndex: isDragging || isResizing ? 1000 : 1
        }}
        className={`rounded-xl bg-slate-900/50 backdrop-blur transition-all duration-200 ${
          isDragging || isResizing 
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
        {/* Drag Handle with size indicator */}
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
        
        {/* Snap indicators */}
        {isDragging && (
          <div className="absolute -inset-1 border-2 border-cyan-300 rounded-xl animate-pulse" />
        )}
      </div>
    </Resizable>
  )
}

// Temporary inline hook to avoid import issues
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
    recentOffers: [],
    todayTasks: [],
    todayMeetings: 0,
    upcomingReminders: [],
    meetings: [],
    todos: [],
    upcomingMeetings: [],
    completedTodos: 0,
    pendingTodos: 0,
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
  const [containerDimensions, setContainerDimensions] = useState({ width: 1200, height: 1000 })
  
  // Simple layout without complex collision detection
  const [cardLayouts, setCardLayouts] = useState<Record<string, CardLayout>>(() => {
    const defaultLayouts: Record<string, CardLayout> = {}
    let currentY = CONTAINER_PADDING
    let currentX = CONTAINER_PADDING

    dashboardCards.forEach((card, index) => {
      const size = SIZE_PRESETS.MEDIUM // Use MEDIUM for all cards initially
      
      defaultLayouts[card.id] = {
        id: card.id,
        x: currentX,
        y: currentY,
        width: size.width,
        height: size.height,
        sizePreset: 'MEDIUM'
      }

      // Simple grid layout - 2 cards per row
      if ((index + 1) % 2 === 0) {
        currentY += size.height + 40
        currentX = CONTAINER_PADDING
      } else {
        currentX += size.width + 40
      }
    })

    return defaultLayouts
  })

  // Update container dimensions dynamically
  useEffect(() => {
    const updateDimensions = () => {
      // Calculate required space based on current card positions
      let maxX = 0
      let maxY = 0
      
      Object.values(cardLayouts).forEach(layout => {
        maxX = Math.max(maxX, layout.x + layout.width)
        maxY = Math.max(maxY, layout.y + layout.height)
      })
      
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Ensure adequate margins and minimum sizes
      const minContainerWidth = 1200
      const minContainerHeight = 1000
      const calculatedWidth = Math.max(viewportWidth - 320, maxX + CONTAINER_PADDING * 3, minContainerWidth)
      const calculatedHeight = Math.max(viewportHeight - 200, maxY + CONTAINER_PADDING * 3, minContainerHeight)
      
      setContainerDimensions({
        width: calculatedWidth,
        height: calculatedHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [cardLayouts])

  const handleLayoutChange = (cardId: string, newLayout: Partial<CardLayout>) => {
    setCardLayouts(prev => {
      const currentLayout = prev[cardId]
      const updatedLayout = { ...currentLayout, ...newLayout }
      
      // Simple position snapping
      updatedLayout.x = Math.max(0, snapToGrid(updatedLayout.x || 0))
      updatedLayout.y = Math.max(0, snapToGrid(updatedLayout.y || 0))
      
      // If size changed, snap to preset
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

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  // Uppdatera klockan varje minut för att visa aktuell tid
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Stagger-animation för cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  // Visa loading state
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Laddar dashboard-data...</p>
        </div>
      </div>
    )
  }

  // Visa fel om något gick snett
  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{dashboardData.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Subtle background pattern för premium-känsla */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.02),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Top Navigation Bar - Minimalistisk och exklusiv */}
          <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Center - Search */}
                <div className="flex items-center flex-1 max-w-md">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
                    <input 
                      type="text"
                      placeholder="Sök leads, aktiviteter, ordrar..."
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Right - Actions och notifications */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    {currentTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <motion.button
                    className="relative p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🔔</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-slate-900 font-bold">3</span>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={toggleDragMode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDragMode 
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isDragMode ? 'Stäng arrangemang' : 'Arrangera komponenter'}
                  >
                    <span>{isDragMode ? '✅' : '⋮⋮'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveModal('settings')}
                    className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>⚙️</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </nav>

        {/* Main Dashboard Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Header - Personal och premium */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100 mb-2">
                  God {currentTime.getHours() < 12 ? 'morgon' : currentTime.getHours() < 18 ? 'dag' : 'kväll'} 👋
                </h2>
                <p className="text-slate-400">
                  Här är en översikt av dina aktiviteter för {currentTime.toLocaleDateString('sv-SE', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
              
              {/* Quick Filter Controls - Diskret men användbart */}
              <div className="flex items-center gap-2">
                <motion.button
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 text-slate-400 hover:text-slate-300 rounded-lg text-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="w-4 h-4">🔽</span>
                  Filter
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Row - Premium KPI cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DashboardStats stats={dashboardData} />
          </motion.div>

          {/* Quick Actions Bar - Strategiskt placerad för produktivitet */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <QuickActionsBar onOpenModal={handleOpenModal} />
          </motion.div> */}

          {/* Main Cards Grid - Dynamic size with collision-aware layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative bg-slate-900/20 rounded-xl border border-slate-800/50 mb-8"
            style={{ 
              minWidth: containerDimensions.width,
              minHeight: containerDimensions.height,
              background: isDragMode 
                ? 'radial-gradient(circle at center, rgba(6,182,212,0.05) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(148,163,184,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(148,163,184,0.1) 20px)'
                : undefined
            }}
          >
            {isDragMode && (
              <div className="absolute top-4 left-4 z-20 bg-slate-800/90 backdrop-blur text-slate-300 px-4 py-3 rounded-lg text-sm">
                <div className="font-medium mb-2">📐 Layout Mode</div>
                <div className="text-xs space-y-1">
                  <div>• Dra komponenter för att flytta</div>
                  <div>• Resize från kanterna eller klicka storleks-punkter</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Storlekar:</span>
                    <div className="flex gap-1">
                      {(['SMALL', 'MEDIUM', 'LARGE'] as const).map(size => (
                        <div
                          key={size}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs"
                        >
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {dashboardCards.map((card) => {
              const layout = cardLayouts[card.id]
              if (!layout) return null
              
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
          </motion.div>

          {/* Footer - Diskret men informativ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center py-8 border-t border-slate-800/50"
          >
            <p className="text-slate-500 text-sm">
              Senast uppdaterad {currentTime.toLocaleString('sv-SE')} • System status: 
            </p>
          </motion.div>
        </main>
        </div>
      </div>

      {/* Modal System */}
      <ModalSystem 
        activeModal={activeModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}
