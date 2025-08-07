'use client'

import { useState, useCallback } from 'react'
import { NoteBlock } from '@/lib/supabase'

interface NoteEditorProps {
  initialBlocks?: NoteBlock[]
  onChange?: (blocks: NoteBlock[]) => void
  placeholder?: string
}

export default function NoteEditor({ 
  initialBlocks = [], 
  onChange,
  placeholder = "Börja skriva..."
}: NoteEditorProps) {
  const [blocks, setBlocks] = useState<NoteBlock[]>(
    initialBlocks.length > 0 ? initialBlocks : [
      {
        id: 'initial',
        type: 'text',
        content: ''
      }
    ]
  )

  const updateBlocks = useCallback((newBlocks: NoteBlock[]) => {
    setBlocks(newBlocks)
    onChange?.(newBlocks)
  }, [onChange])

  const updateBlock = (blockId: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    )
    updateBlocks(newBlocks)
  }

  return (
    <div className="min-h-[200px] p-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="mb-4">
          <textarea
            value={typeof block.content === 'string' ? block.content : ''}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder={index === 0 ? placeholder : "Fortsätt skriva..."}
            className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ))}
    </div>
  )
}
