'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  Plus, 
  GripVertical, 
  Type, 
  CheckSquare, 
  Image, 
  FileText,
  Hash,
  List,
  Link,
  Bold,
  Italic,
  Quote,
  Code,
  Palette,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { NoteBlock } from '@/lib/supabase'
import TextBlock from '@/components/notes/blocks/TextBlock'
import TodoBlock from '@/components/notes/blocks/TodoBlock'
import HeadingBlock from '@/components/notes/blocks/HeadingBlock'
import ListBlock from '@/components/notes/blocks/ListBlock'
import QuoteBlock from '@/components/notes/blocks/QuoteBlock'
import CodeBlock from '@/components/notes/blocks/CodeBlock'

interface NoteEditorProps {
  initialBlocks?: NoteBlock[]
  onChange?: (blocks: NoteBlock[]) => void
  placeholder?: string
}

export default function NoteEditor({ 
  initialBlocks = [], 
  onChange,
  placeholder = "Börja skriva eller tryck '/' för kommandon..."
}: NoteEditorProps) {
  const [blocks, setBlocks] = useState<NoteBlock[]>(initialBlocks.length > 0 ? initialBlocks : [
    {
      id: 'initial',
      type: 'text',
      content: '',
      data: {}
    }
  ])
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>('initial')
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null)
  const [commandMenuPosition, setCommandMenuPosition] = useState<{ x: number; y: number } | null>(null)
  
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const updateBlocks = useCallback((newBlocks: NoteBlock[]) => {
    setBlocks(newBlocks)
    onChange?.(newBlocks)
  }, [onChange])

  const addBlock = (afterId: string, type: NoteBlock['type'] = 'text') => {
    const newBlock: NoteBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: type === 'todo' ? { text: '', checked: false } : '',
      metadata: type === 'heading' ? { level: 2 } : {}
    }

    const currentIndex = blocks.findIndex(block => block.id === afterId)
    const newBlocks = [
      ...blocks.slice(0, currentIndex + 1),
      newBlock,
      ...blocks.slice(currentIndex + 1)
    ]
    
    updateBlocks(newBlocks)
    setFocusedBlockId(newBlock.id)
    setShowBlockMenu(null)
    setCommandMenuPosition(null)
  }

  const deleteBlock = (blockId: string) => {
    if (blocks.length === 1) return // Keep at least one block
    
    const blockIndex = blocks.findIndex(block => block.id === blockId)
    const newBlocks = blocks.filter(block => block.id !== blockId)
    updateBlocks(newBlocks)
    
    // Focus previous or next block
    if (blockIndex > 0) {
      setFocusedBlockId(newBlocks[blockIndex - 1]?.id || null)
    } else if (newBlocks.length > 0) {
      setFocusedBlockId(newBlocks[0]?.id || null)
    }
  }

  const updateBlock = (blockId: string, updates: Partial<NoteBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    )
    updateBlocks(newBlocks)
  }

  const handleKeyDown = (blockId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const block = blocks.find(b => b.id === blockId)
      if (block?.type === 'text' && block.content === '') {
        // Convert empty text block to different type based on content
        return
      }
      addBlock(blockId, 'text')
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId)
      if (block?.content === '' || (typeof block?.content === 'object' && block.content.text === '')) {
        e.preventDefault()
        deleteBlock(blockId)
      }
    } else if (e.key === '/' && blocks.find(b => b.id === blockId)?.content === '') {
      e.preventDefault()
      // Show command menu
      const rect = blockRefs.current[blockId]?.getBoundingClientRect()
      if (rect) {
        setCommandMenuPosition({ x: rect.left, y: rect.bottom + 5 })
        setShowBlockMenu(blockId)
      }
    }
  }

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Text', description: 'Vanlig textparagraf' },
    { type: 'heading', icon: Hash, label: 'Rubrik', description: 'Sektion med rubrik' },
    { type: 'todo', icon: CheckSquare, label: 'Att göra', description: 'Uppgift med checkbox' },
    { type: 'list', icon: List, label: 'Lista', description: 'Punktlista eller numrerad' },
    { type: 'quote', icon: Quote, label: 'Citat', description: 'Framhäv viktig text' },
    { type: 'code', icon: Code, label: 'Kod', description: 'Kodblock med syntax highlighting' },
  ]

  const renderBlock = (block: Block) => {
    const commonProps = {
      key: block.id,
      ref: (el: HTMLDivElement) => blockRefs.current[block.id] = el,
      block,
      isFocused: focusedBlockId === block.id,
      onFocus: () => setFocusedBlockId(block.id),
      onUpdate: (updates: Partial<Block>) => updateBlock(block.id, updates),
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(block.id, e),
      placeholder: blocks.length === 1 && block.content === '' ? placeholder : undefined
    }

    switch (block.type) {
      case 'heading':
        return <HeadingBlock {...commonProps} />
      case 'todo':
        return <TodoBlock {...commonProps} />
      case 'list':
        return <ListBlock {...commonProps} />
      case 'quote':
        return <QuoteBlock {...commonProps} />
      case 'code':
        return <CodeBlock {...commonProps} />
      default:
        return <TextBlock {...commonProps} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        {/* Editor Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {blocks.length} block{blocks.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Link className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-8">
          <Reorder.Group 
            axis="y" 
            values={blocks} 
            onReorder={updateBlocks}
            className="space-y-1"
          >
            {blocks.map((block) => (
              <Reorder.Item
                key={block.id}
                value={block}
                className="group relative"
                dragListener={false}
              >
                <div className="flex items-start gap-2">
                  {/* Drag Handle */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-3">
                    <Reorder.Item
                      value={block}
                      dragListener={true}
                      className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                    </Reorder.Item>
                  </div>

                  {/* Block Content */}
                  <div className="flex-1 min-w-0">
                    {renderBlock(block)}
                  </div>

                  {/* Block Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addBlock(block.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {blocks.length > 1 && (
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Block Type Menu */}
                <AnimatePresence>
                  {showBlockMenu === block.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 min-w-64"
                    >
                      {blockTypes.map((blockType) => (
                        <button
                          key={blockType.type}
                          onClick={() => {
                            updateBlock(block.id, { type: blockType.type as NoteBlock['type'] })
                            setShowBlockMenu(null)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <blockType.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {blockType.label}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {blockType.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Add Block Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addBlock(blocks[blocks.length - 1]?.id)}
            className="w-full mt-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Lägg till block</span>
          </motion.button>
        </div>
      </div>

      {/* Command Menu */}
      <AnimatePresence>
        {commandMenuPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              left: commandMenuPosition.x, 
              top: commandMenuPosition.y,
              zIndex: 1000 
            }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 min-w-64"
          >
            {blockTypes.map((blockType) => (
              <button
                key={blockType.type}
                onClick={() => {
                  if (showBlockMenu) {
                    updateBlock(showBlockMenu, { type: blockType.type as NoteBlock['type'] })
                  }
                  setCommandMenuPosition(null)
                  setShowBlockMenu(null)
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <blockType.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {blockType.label}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {blockType.description}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
