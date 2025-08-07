'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showCloseButton?: boolean
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md',
  showCloseButton = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300" />
      
      {/* Modal Content */}
      <div className={`
        relative w-full ${maxWidthClasses[maxWidth]} 
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/50
        transform animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300
        max-h-[90vh] overflow-hidden
      `}>
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 hover:scale-105"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative max-h-[calc(90vh-140px)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}
