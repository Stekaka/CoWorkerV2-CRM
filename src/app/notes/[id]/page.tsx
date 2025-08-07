'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Share, MoreVertical, Star, Archive, Trash } from 'lucide-react'
import NoteEditor from '@/components/notes/NoteEditor'

interface Note {
  id: string
  title: string
  content: string
  blocks: Array<{
    id: string
    type: string
    content: string
    metadata?: any
  }>
  tags: string[]
  priority: 'low' | 'medium' | 'high'
  isPinned: boolean
  isArchived: boolean
  linkedEntities: Array<{
    type: 'contact' | 'lead' | 'project'
    id: string
    name: string
  }>
  createdAt: string
  updatedAt: string
}

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [title, setTitle] = useState('')

  const isNewNote = params.id === 'new'

  useEffect(() => {
    if (isNewNote) {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: '',
        content: '',
        blocks: [
          {
            id: '1',
            type: 'text',
            content: '',
            metadata: {}
          }
        ],
        tags: [],
        priority: 'medium',
        isPinned: false,
        isArchived: false,
        linkedEntities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNote(newNote)
      setTitle('')
      setIsLoading(false)
    } else {
      // Load existing note (in real app, fetch from API)
      // For now, create a mock note
      const mockNote: Note = {
        id: params.id,
        title: 'Exempelanteckning',
        content: 'Detta är innehållet i anteckningen',
        blocks: [
          {
            id: '1',
            type: 'text',
            content: 'Detta är en textblock med innehåll',
            metadata: {}
          },
          {
            id: '2',
            type: 'heading',
            content: 'En rubrik',
            metadata: { level: 2 }
          }
        ],
        tags: ['exempel', 'test'],
        priority: 'high',
        isPinned: true,
        isArchived: false,
        linkedEntities: [
          {
            type: 'contact',
            id: '1',
            name: 'Anna Andersson'
          }
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      }
      setNote(mockNote)
      setTitle(mockNote.title)
      setIsLoading(false)
    }
  }, [params.id, isNewNote])

  const handleSave = async () => {
    if (!note) return

    setIsSaving(true)
    
    try {
      // In real app, save to API
      const updatedNote = {
        ...note,
        title: title || 'Namnlös anteckning',
        updatedAt: new Date().toISOString()
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setNote(updatedNote)
      
      // If it's a new note, redirect to the actual note page
      if (isNewNote) {
        router.push(`/notes/${updatedNote.id}`)
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBlocksUpdate = (newBlocks: any[]) => {
    if (!note) return
    
    setNote({
      ...note,
      blocks: newBlocks,
      updatedAt: new Date().toISOString()
    })
  }

  const togglePin = () => {
    if (!note) return
    setNote({ ...note, isPinned: !note.isPinned })
  }

  const toggleArchive = () => {
    if (!note) return
    setNote({ ...note, isArchived: !note.isArchived })
  }

  const handleDelete = () => {
    if (confirm('Är du säker på att du vill radera denna anteckning?')) {
      // In real app, delete from API
      router.push('/notes')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Laddar anteckning...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Anteckningen kunde inte laddas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-2">
                {note.isPinned && (
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                )}
                {note.isArchived && (
                  <Archive className="w-4 h-4 text-slate-400" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.priority === 'high' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    : note.priority === 'medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {note.priority === 'high' ? 'Hög' : note.priority === 'medium' ? 'Medium' : 'Låg'} prioritet
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Sparar...' : 'Spara'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Share className="w-4 h-4" />
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 min-w-48"
                  >
                    <button
                      onClick={togglePin}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg flex items-center gap-2"
                    >
                      <Star className={`w-4 h-4 ${note.isPinned ? 'text-amber-500 fill-current' : 'text-slate-400'}`} />
                      <span className="text-slate-700 dark:text-slate-300">
                        {note.isPinned ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
                      </span>
                    </button>

                    <button
                      onClick={toggleArchive}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {note.isArchived ? 'Återställ från arkiv' : 'Arkivera'}
                      </span>
                    </button>

                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors last:rounded-b-lg flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Radera anteckning</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Namnlös anteckning"
              className="w-full text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder-slate-400"
            />
          </div>

          {/* Tags and Metadata */}
          {(note.tags.length > 0 || note.linkedEntities.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
              
              {note.linkedEntities.map((entity) => (
                <span
                  key={`${entity.type}-${entity.id}`}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm"
                >
                  {entity.name}
                </span>
              ))}
            </div>
          )}

          {/* Note Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <NoteEditor
              blocks={note.blocks}
              onBlocksUpdate={handleBlocksUpdate}
            />
          </div>

          {/* Footer Info */}
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {isNewNote ? (
              <p>Ny anteckning • Kommer att sparas automatiskt</p>
            ) : (
              <p>
                Skapad {new Date(note.createdAt).toLocaleDateString('sv-SE')} • 
                Senast uppdaterad {new Date(note.updatedAt).toLocaleDateString('sv-SE')}
              </p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
