'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Block {
  id: string
  type: string
  content: string
  metadata?: Record<string, unknown>
}

interface TextBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function TextBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown,
  placeholder 
}: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus()
      // Set cursor to end
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value })
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown(e)
    
    // Handle markdown shortcuts
    if (e.key === ' ') {
      const value = e.currentTarget.value
      if (value.endsWith('#')) {
        e.preventDefault()
        onUpdate({ type: 'heading', content: '', metadata: { level: 1 } })
      } else if (value.endsWith('##')) {
        e.preventDefault()
        onUpdate({ type: 'heading', content: '', metadata: { level: 2 } })
      } else if (value.endsWith('###')) {
        e.preventDefault()
        onUpdate({ type: 'heading', content: '', metadata: { level: 3 } })
      } else if (value.endsWith('-') || value.endsWith('*')) {
        e.preventDefault()
        onUpdate({ type: 'list', content: '', metadata: { type: 'bullet' } })
      } else if (value.match(/^\d+\./)) {
        e.preventDefault()
        onUpdate({ type: 'list', content: '', metadata: { type: 'numbered' } })
      } else if (value.endsWith('[]')) {
        e.preventDefault()
        onUpdate({ type: 'todo', content: '' })
      } else if (value.endsWith('>')) {
        e.preventDefault()
        onUpdate({ type: 'quote', content: '' })
      } else if (value.endsWith('```')) {
        e.preventDefault()
        onUpdate({ type: 'code', content: '', metadata: { language: 'javascript' } })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative py-2 px-3 rounded-lg transition-all duration-200 ${
        isFocused 
          ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      onClick={onFocus}
    >
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={handleChange}
        onFocus={() => {
          setIsEditing(true)
          onFocus()
        }}
        onBlur={() => setIsEditing(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Skriv något..."}
        className="w-full bg-transparent border-none outline-none resize-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base leading-relaxed"
        style={{ 
          minHeight: '1.5rem',
          height: 'auto',
          overflow: 'hidden'
        }}
        rows={1}
      />
      
      {/* Markdown shortcuts hint */}
      {isEditing && block.content === '' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute top-full left-3 mt-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-lg border border-slate-200 dark:border-slate-700 z-10"
        >
          <div className="space-y-1">
            <div><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">#</code> för rubrik</div>
            <div><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">-</code> för lista</div>
            <div><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">[]</code> för todo</div>
            <div><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">/</code> för kommandon</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
