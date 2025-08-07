'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Share, MoreVertical, Star, Archive, Trash } from 'lucide-react'
import NoteEditor from '@/components/notes/NoteEditor-simple'
import { useNote } from '@/hooks/useAPI'
import { NoteBlock } from '@/lib/supabase'

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [title, setTitle] = useState('')

  // Use the new API hook
  const { note, loading, updateNote } = useNote(params.id)

  // Set title when note loads
  useEffect(() => {
    if (note && !title) {
      setTitle(note.title)
    }
  }, [note, title])

  const handleSave = async () => {
    if (!note) return
    
    setIsSaving(true)
    try {
      await updateNote({
        title: title || 'Untitled',
        content: note.content
      })
      console.log('Note saved successfully')
    } catch (error) {
      console.error('Failed to save note:', error)
      alert('Kunde inte spara anteckningen')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBlocksChange = async (blocks: NoteBlock[]) => {
    if (!note) return
    
    // Filter out unsupported block types and convert to NoteBlock format
    const supportedBlocks: NoteBlock[] = blocks
      .filter(block => ['text', 'heading', 'list', 'todo', 'quote', 'code'].includes(block.type))
      .map(block => ({
        id: block.id,
        type: block.type as 'text' | 'heading' | 'list' | 'todo' | 'quote' | 'code',
        content: typeof block.content === 'string' ? block.content : JSON.stringify(block.content),
        data: block.data
      }))
    
    try {
      await updateNote({
        content: supportedBlocks
      })
    } catch (error) {
      console.error('Failed to update blocks:', error)
    }
  }

  const handleTogglePinned = async () => {
    if (!note) return
    
    try {
      await updateNote({
        is_pinned: !note.is_pinned
      })
    } catch (error) {
      console.error('Failed to toggle pinned:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Laddar anteckning...</div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Anteckning hittades inte</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/notes')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel på anteckning..."
                  className="text-xl font-semibold bg-transparent text-white placeholder-slate-500 border-none outline-none focus:ring-0 p-0"
                  onBlur={handleSave}
                />
                {note.is_pinned && (
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Sparar...' : 'Spara'}
              </button>

              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <Share className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-20"
                  >
                    <button
                      onClick={handleTogglePinned}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                      <Star className="w-4 h-4" />
                      {note.is_pinned ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                      <Archive className="w-4 h-4" />
                      Arkivera
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700">
                      <Trash className="w-4 h-4" />
                      Ta bort
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NoteEditor
            initialBlocks={note.content.map(block => ({
              id: block.id,
              type: block.type as Block['type'],
              content: block.content,
              metadata: block.data
            }))}
            onChange={handleBlocksChange}
          />
        </motion.div>
      </div>
    </div>
  )
}
