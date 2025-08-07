'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  hideTitle?: boolean
  children: React.ReactNode
}

export default function SophisticatedModal({
  isOpen,
  onClose,
  title,
  maxWidth = 'md',
  hideTitle = false,
  children
}: ModalProps) {
  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`
              relative w-full ${maxWidthClasses[maxWidth]} ${maxWidth === 'full' ? '' : 'max-h-[90vh]'}
              bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 
              rounded-2xl shadow-2xl overflow-hidden
            `}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Header */}
            {!hideTitle && (
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-slate-100">
                  {title}
                </h2>
                
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className={`${hideTitle ? 'h-full' : 'max-h-[calc(90vh-140px)]'} ${maxWidth === 'full' && hideTitle ? 'h-[95vh]' : ''} overflow-y-auto elegant-scrollbar`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
