'use client'

import { useState, useEffect } from 'react'

interface ResponsiveWrapperProps {
  children: React.ReactNode
  width: number
  height: number
}

export default function ResponsiveWrapper({ children, width, height }: ResponsiveWrapperProps) {
  const [scale, setScale] = useState(1)
  const [isCompact, setIsCompact] = useState(false)
  const [isMinimal, setIsMinimal] = useState(false)
  
  useEffect(() => {
    // Define breakpoints
    const COMPACT_WIDTH = 400
    const COMPACT_HEIGHT = 300
    const MINIMAL_WIDTH = 300
    const MINIMAL_HEIGHT = 250
    
    // Determine size category
    const widthRatio = width / COMPACT_WIDTH
    const heightRatio = height / COMPACT_HEIGHT
    const overallRatio = Math.min(widthRatio, heightRatio)
    
    if (width < MINIMAL_WIDTH || height < MINIMAL_HEIGHT) {
      setIsMinimal(true)
      setIsCompact(false)
      setScale(Math.min(width / MINIMAL_WIDTH, height / MINIMAL_HEIGHT) * 0.8)
    } else if (width < COMPACT_WIDTH || height < COMPACT_HEIGHT) {
      setIsMinimal(false)
      setIsCompact(true)
      setScale(overallRatio * 0.9)
    } else {
      setIsMinimal(false)
      setIsCompact(false)
      setScale(1)
    }
  }, [width, height])
  
  return (
    <div 
      className="w-full h-full overflow-hidden relative"
      data-responsive-size={isMinimal ? 'minimal' : isCompact ? 'compact' : 'full'}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {children}
    </div>
  )
}
