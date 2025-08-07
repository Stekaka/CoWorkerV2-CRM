'use client'

import { createContext, useContext } from 'react'
import { OverlayType } from './OverlayManager'

interface OverlayContextType {
  openOverlay: (type: OverlayType, data?: Record<string, unknown>) => void
  closeOverlay: () => void
}

const OverlayContext = createContext<OverlayContextType | null>(null)

interface OverlayProviderProps {
  children: React.ReactNode
  openOverlay: (type: OverlayType, data?: Record<string, unknown>) => void
  closeOverlay: () => void
}

export function OverlayProvider({ children, openOverlay, closeOverlay }: OverlayProviderProps) {
  return (
    <OverlayContext.Provider value={{ openOverlay, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  )
}

export function useOverlayContext() {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error('useOverlayContext must be used within an OverlayProvider')
  }
  return context
}
