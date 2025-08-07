'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, AlertTriangle, Calendar, User } from 'lucide-react'

interface TodoContent {
  text: string
  checked: boolean
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date
  assignedTo?: string
}

interface Block {
  id: string
  type: 'text' | 'heading' | 'todo' | 'list' | 'quote' | 'code' | 'image' | 'divider'
  content: TodoContent
  metadata?: Record<string, unknown>
}

interface TodoBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function TodoBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown,
  placeholder 
}: TodoBlockProps) {
  const [showOptions, setShowOptions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const content = block.content as TodoContent

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const handleToggleCheck = () => {
    onUpdate({
      content: {
        ...content,
        checked: !content.checked
      }
    })
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      content: {
        ...content,
        text: e.target.value
      }
    })
  }

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    onUpdate({
      content: {
        ...content,
        priority
      }
    })
    setShowOptions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Convert to calendar todo
      e.preventDefault()
      // Here you would integrate with your calendar system
      console.log('Convert to calendar todo:', content)
    } else {
      onKeyDown(e)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30'
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/30'
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-700'
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-3 h-3" />
      case 'medium': return <Clock className="w-3 h-3" />
      case 'low': return <Check className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative py-3 px-3 rounded-lg transition-all duration-200 ${
        isFocused 
          ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      onClick={onFocus}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleCheck}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            content.checked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500'
          }`}
        >
          <AnimatePresence>
            {content.checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <input
              ref={inputRef}
              type="text"
              value={content.text}
              onChange={handleTextChange}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Vad behöver göras?"}
              className={`flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 ${
                content.checked ? 'line-through text-slate-500 dark:text-slate-400' : ''
              }`}
            />
            
            {/* Priority Badge */}
            {content.priority && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(content.priority)}`}
              >
                {getPriorityIcon(content.priority)}
                {content.priority}
              </motion.div>
            )}
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Quick Options */}
              <AnimatePresence>
                {(isFocused || showOptions) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1"
                  >
                    {/* Priority Buttons */}
                    <button
                      onClick={() => handlePriorityChange('low')}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 dark:text-green-400 transition-colors"
                      title="Låg prioritet"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handlePriorityChange('medium')}
                      className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded text-amber-600 dark:text-amber-400 transition-colors"
                      title="Medium prioritet"
                    >
                      <Clock className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handlePriorityChange('high')}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                      title="Hög prioritet"
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </button>
                    
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    
                    {/* Calendar Integration */}
                    <button
                      onClick={() => console.log('Add to calendar')}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                      title="Lägg till i kalender"
                    >
                      <Calendar className="w-3 h-3" />
                    </button>
                    
                    {/* Assign */}
                    <button
                      onClick={() => console.log('Assign todo')}
                      className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400 transition-colors"
                      title="Tilldela"
                    >
                      <User className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Keyboard Hint */}
            <AnimatePresence>
              {isFocused && content.text && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-slate-400"
                >
                  <kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">Shift + Enter</kbd> för kalender
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Due Date Display */}
          {content.dueDate && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1 text-xs text-slate-500"
            >
              <Calendar className="w-3 h-3" />
              <span>Förfaller {content.dueDate.toLocaleDateString('sv-SE')}</span>
            </motion.div>
          )}

          {/* Assigned To Display */}
          {content.assignedTo && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 flex items-center gap-1 text-xs text-slate-500"
            >
              <User className="w-3 h-3" />
              <span>Tilldelad: {content.assignedTo}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
