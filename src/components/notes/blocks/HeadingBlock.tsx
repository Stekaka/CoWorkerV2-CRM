'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hash } from 'lucide-react'

interface Block {
  id: string
  type: string
  content: string
  metadata?: {
    level?: number
  }
}

interface HeadingBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function HeadingBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown,
  placeholder 
}: HeadingBlockProps) {
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const level = block.metadata?.level || 2

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
      // Set cursor to end
      const length = inputRef.current.value.length
      inputRef.current.setSelectionRange(length, length)
    }
  }, [isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ content: e.target.value })
  }

  const handleLevelChange = (newLevel: number) => {
    onUpdate({ 
      metadata: { 
        ...block.metadata, 
        level: newLevel 
      } 
    })
    setShowLevelSelector(false)
  }

  const getHeadingStyle = (level: number) => {
    switch (level) {
      case 1: return 'text-4xl font-bold text-slate-900 dark:text-white'
      case 2: return 'text-3xl font-bold text-slate-900 dark:text-white'
      case 3: return 'text-2xl font-semibold text-slate-800 dark:text-slate-100'
      case 4: return 'text-xl font-semibold text-slate-800 dark:text-slate-100'
      case 5: return 'text-lg font-medium text-slate-700 dark:text-slate-200'
      case 6: return 'text-base font-medium text-slate-700 dark:text-slate-200'
      default: return 'text-2xl font-semibold text-slate-800 dark:text-slate-100'
    }
  }

  const getPlaceholder = (level: number) => {
    switch (level) {
      case 1: return 'Titel'
      case 2: return 'Rubrik'
      case 3: return 'Underrubrik'
      default: return `Rubrik ${level}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative py-4 px-3 rounded-lg transition-all duration-200 ${
        isFocused 
          ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      onClick={onFocus}
    >
      <div className="flex items-center gap-2 mb-2">
        {/* Level Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setShowLevelSelector(!showLevelSelector)
            }}
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Hash className="w-4 h-4" />
            <span className="text-sm font-medium">H{level}</span>
          </motion.button>

          {/* Level Dropdown */}
          {showLevelSelector && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50"
            >
              {[1, 2, 3, 4, 5, 6].map((levelOption) => (
                <button
                  key={levelOption}
                  onClick={() => handleLevelChange(levelOption)}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    level === levelOption ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span className={getHeadingStyle(levelOption).split(' ')[0]}>
                      Rubrik {levelOption}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Heading Level Indicator */}
        <div className="text-sm text-slate-400">
          {'#'.repeat(level)}
        </div>
      </div>

      {/* Heading Input */}
      <input
        ref={inputRef}
        type="text"
        value={block.content}
        onChange={handleChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder || getPlaceholder(level)}
        className={`w-full bg-transparent border-none outline-none placeholder-slate-400 ${getHeadingStyle(level)}`}
      />

      {/* Underline for H1 and H2 */}
      {(level === 1 || level === 2) && block.content && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`mt-2 h-px origin-left ${
            level === 1 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
              : 'bg-slate-300 dark:bg-slate-600'
          }`}
        />
      )}

      {/* Level Hint */}
      {isFocused && block.content === '' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute top-full left-3 mt-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-lg border border-slate-200 dark:border-slate-700 z-10"
        >
          <div className="space-y-1">
            <div>Klicka på H{level} för att ändra nivå</div>
            <div><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">##</code> för H2, <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">###</code> för H3</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
