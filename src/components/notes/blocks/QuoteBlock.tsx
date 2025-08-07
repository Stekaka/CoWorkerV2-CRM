'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote, User } from 'lucide-react'

interface Block {
  id: string
  type: 'text' | 'heading' | 'todo' | 'list' | 'quote' | 'code' | 'image' | 'divider'
  content: string
  metadata?: Record<string, unknown>
}

interface QuoteBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function QuoteBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown,
  placeholder 
}: QuoteBlockProps) {
  const [showStyleSelector, setShowStyleSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  
  const style = typeof block.metadata?.style === 'string' ? block.metadata.style : 'default'
  const author = typeof block.metadata?.author === 'string' ? block.metadata.author : ''
  const source = typeof block.metadata?.source === 'string' ? block.metadata.source : ''

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isFocused])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value })
    
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      metadata: {
        ...block.metadata,
        author: e.target.value
      }
    })
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      metadata: {
        ...block.metadata,
        source: e.target.value
      }
    })
  }

  const handleStyleChange = (newStyle: string) => {
    onUpdate({
      metadata: {
        ...block.metadata,
        style: newStyle as 'default' | 'callout' | 'warning' | 'info'
      }
    })
    setShowStyleSelector(false)
  }

  const getStyleConfig = (style: string) => {
    switch (style) {
      case 'callout':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-l-4 border-blue-400',
          text: 'text-blue-900 dark:text-blue-100',
          icon: 'text-blue-500',
          label: 'Callout'
        }
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-l-4 border-amber-400',
          text: 'text-amber-900 dark:text-amber-100',
          icon: 'text-amber-500',
          label: 'Varning'
        }
      case 'info':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-l-4 border-green-400',
          text: 'text-green-900 dark:text-green-100',
          icon: 'text-green-500',
          label: 'Info'
        }
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800/50',
          border: 'border-l-4 border-slate-300 dark:border-slate-600',
          text: 'text-slate-700 dark:text-slate-300',
          icon: 'text-slate-500',
          label: 'Citat'
        }
    }
  }

  const styleConfig = getStyleConfig(style)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-lg transition-all duration-200 ${
        isFocused 
          ? 'ring-2 ring-blue-200 dark:ring-blue-800' 
          : ''
      }`}
      onClick={onFocus}
    >
      {/* Style Selector */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setShowStyleSelector(!showStyleSelector)
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Quote className={`w-4 h-4 ${styleConfig.icon}`} />
            <span className="text-sm font-medium">{styleConfig.label}</span>
          </motion.button>

          {/* Style Dropdown */}
          {showStyleSelector && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 min-w-40"
            >
              {[
                { value: 'default', label: 'Citat' },
                { value: 'callout', label: 'Callout' },
                { value: 'warning', label: 'Varning' },
                { value: 'info', label: 'Info' }
              ].map((option) => {
                const optionConfig = getStyleConfig(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStyleChange(option.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      style === option.value ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Quote className={`w-4 h-4 ${optionConfig.icon}`} />
                      <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Quote Content */}
      <div className={`p-6 rounded-lg ${styleConfig.bg} ${styleConfig.border}`}>
        {/* Quote Icon */}
        <div className="flex items-start gap-4">
          <Quote className={`w-6 h-6 mt-1 flex-shrink-0 ${styleConfig.icon}`} />
          
          <div className="flex-1 min-w-0">
            {/* Main Quote Text */}
            <textarea
              ref={textareaRef}
              value={block.content}
              onChange={handleContentChange}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              placeholder={placeholder || 'Skriv ditt citat här...'}
              className={`w-full bg-transparent border-none outline-none resize-none placeholder-slate-400 ${styleConfig.text} text-lg leading-relaxed font-medium italic`}
              rows={3}
              style={{
                minHeight: '4rem'
              }}
            />

            {/* Author and Source */}
            {(author || source || isFocused) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className={`w-4 h-4 ${styleConfig.icon}`} />
                  <input
                    ref={authorRef}
                    type="text"
                    value={author}
                    onChange={handleAuthorChange}
                    placeholder="Författare"
                    className={`bg-transparent border-none outline-none placeholder-slate-400 ${styleConfig.text} font-medium`}
                  />
                </div>
                
                {(source || isFocused) && (
                  <input
                    type="text"
                    value={source}
                    onChange={handleSourceChange}
                    placeholder="Källa (valfritt)"
                    className={`w-full bg-transparent border-none outline-none placeholder-slate-400 ${styleConfig.text} text-sm opacity-75`}
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      {isFocused && block.content === '' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute top-full left-3 mt-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
        >
          <div className="space-y-1">
            <div>Skriv ditt citat i textrutan</div>
            <div>Lägg till författare och källa för komplett referens</div>
            <div>Välj stil för olika typer av innehåll</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
