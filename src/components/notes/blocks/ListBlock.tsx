'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, ListOrdered, Plus, Grip, X } from 'lucide-react'

interface Block {
  id: string
  type: string
  content: string
  metadata?: {
    listType?: 'bullet' | 'numbered'
    items?: Array<{
      id: string
      content: string
      indent: number
    }>
  }
}

interface ListBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function ListBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown: _onKeyDown, // Not used in this component
  placeholder 
}: ListBlockProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  
  const listType = block.metadata?.listType || 'bullet'
  const items = block.metadata?.items || [{ id: '1', content: '', indent: 0 }]

  useEffect(() => {
    if (isFocused && activeItemIndex !== null && itemRefs.current[activeItemIndex]) {
      itemRefs.current[activeItemIndex]?.focus()
    }
  }, [isFocused, activeItemIndex])

  const addItem = (afterIndex: number = items.length - 1) => {
    const newItem = {
      id: Date.now().toString(),
      content: '',
      indent: items[afterIndex]?.indent || 0
    }
    
    const newItems = [...items]
    newItems.splice(afterIndex + 1, 0, newItem)
    
    onUpdate({
      metadata: {
        ...block.metadata,
        listType,
        items: newItems
      }
    })
    
    setTimeout(() => {
      setActiveItemIndex(afterIndex + 1)
    }, 50)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      // If it's the last item, keep it but clear content
      onUpdate({
        metadata: {
          ...block.metadata,
          listType,
          items: [{ id: '1', content: '', indent: 0 }]
        }
      })
      setActiveItemIndex(0)
    } else {
      const newItems = items.filter((_, i) => i !== index)
      onUpdate({
        metadata: {
          ...block.metadata,
          listType,
          items: newItems
        }
      })
      
      // Focus previous item or next if removing first
      const newActiveIndex = index > 0 ? index - 1 : 0
      setActiveItemIndex(Math.min(newActiveIndex, newItems.length - 1))
    }
  }

  const updateItem = (index: number, content: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], content }
    
    onUpdate({
      metadata: {
        ...block.metadata,
        listType,
        items: newItems
      }
    })
  }

  const indentItem = (index: number, direction: 'in' | 'out') => {
    const newItems = [...items]
    const currentIndent = newItems[index].indent
    
    if (direction === 'in' && currentIndent < 3) {
      newItems[index].indent = currentIndent + 1
    } else if (direction === 'out' && currentIndent > 0) {
      newItems[index].indent = currentIndent - 1
    }
    
    onUpdate({
      metadata: {
        ...block.metadata,
        listType,
        items: newItems
      }
    })
  }

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(index)
    } else if (e.key === 'Backspace' && items[index].content === '') {
      e.preventDefault()
      removeItem(index)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      indentItem(index, e.shiftKey ? 'out' : 'in')
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      setActiveItemIndex(index - 1)
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault()
      setActiveItemIndex(index + 1)
    }
  }

  const toggleListType = () => {
    const newType = listType === 'bullet' ? 'numbered' : 'bullet'
    onUpdate({
      metadata: {
        ...block.metadata,
        listType: newType,
        items
      }
    })
  }

  const getBulletSymbol = (indent: number) => {
    const symbols = ['•', '◦', '▪', '▫']
    return symbols[indent % symbols.length]
  }

  const getNumberSymbol = (index: number, indent: number) => {
    if (indent === 0) return `${index + 1}.`
    if (indent === 1) return `${String.fromCharCode(97 + (index % 26))}.` // a, b, c...
    if (indent === 2) return `${index + 1})`
    return `${String.fromCharCode(65 + (index % 26))}.` // A, B, C...
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
      {/* List Type Selector */}
      <div className="flex items-center gap-2 mb-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            toggleListType()
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
        >
          {listType === 'bullet' ? (
            <List className="w-4 h-4" />
          ) : (
            <ListOrdered className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {listType === 'bullet' ? 'Punktlista' : 'Numrerad lista'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            addItem()
          }}
          className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 group/item"
              style={{ paddingLeft: `${item.indent * 24}px` }}
            >
              {/* Drag Handle */}
              <div className="flex-shrink-0 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                <Grip className="w-3 h-3 text-slate-400" />
              </div>

              {/* Bullet/Number */}
              <div className="flex-shrink-0 w-6 pt-2 text-slate-600 dark:text-slate-400 font-medium">
                {listType === 'bullet' 
                  ? getBulletSymbol(item.indent)
                  : getNumberSymbol(index, item.indent)
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <textarea
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  value={item.content}
                  onChange={(e) => updateItem(index, e.target.value)}
                  onFocus={() => {
                    onFocus()
                    setActiveItemIndex(index)
                  }}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  placeholder={index === 0 && item.content === '' ? (placeholder || 'Lista objekt') : 'Lista objekt'}
                  className="w-full bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-300 placeholder-slate-400 leading-relaxed"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '1.5rem'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = target.scrollHeight + 'px'
                  }}
                />
              </div>

              {/* Remove Button */}
              {items.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeItem(index)
                  }}
                  className="flex-shrink-0 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Keyboard Shortcuts Help */}
      {isFocused && activeItemIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute top-full left-3 mt-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
        >
          <div className="space-y-1">
            <div><kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Enter</kbd> Nytt objekt</div>
            <div><kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Tab</kbd> Indrag in</div>
            <div><kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Shift+Tab</kbd> Indrag ut</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
