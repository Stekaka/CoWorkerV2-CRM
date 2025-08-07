'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Calendar,
  User,
  Tag,
  FileText,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react'
import NoteCard from '@/components/notes/NoteCard-new'
import NoteFilters from '@/components/notes/NoteFilters'
import { useNotes } from '@/hooks/useAPI'
import { useRouter } from 'next/navigation'

export default function NotesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated')
  const [showFilters, setShowFilters] = useState(false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')
  const router = useRouter()
  const quickCreateRef = useRef<HTMLDivElement>(null)

  // Use the new API hook
  const { notes, loading, createNote, refetch } = useNotes({
    search: searchQuery,
    tags: selectedTags.length > 0 ? selectedTags : undefined
  })

  const quickSuggestions = [
    '💼 Mötesanteckningar',
    '📋 TODO-lista för veckan',
    '💡 Projektidéer',
    '📞 Samtal med kund',
    '🎯 Mål för månaden',
    '📝 Dagliga reflektioner'
  ]

  // Click outside to close quick create
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
        setShowQuickCreate(false)
        setQuickTitle('')
      }
    }

    if (showQuickCreate) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQuickCreate])

  const createQuickNote = async () => {
    if (!quickTitle.trim()) return
    
    try {
      const newNote = await createNote({
        title: quickTitle.trim(),
        content: [],
        tags: []
      })
      
      setQuickTitle('')
      setShowQuickCreate(false)
      
      // Navigate to the new note for editing
      router.push(`/notes/${newNote.id}`)
    } catch (error) {
      console.error('Error creating note:', error)
      alert('Kunde inte skapa anteckningen. Försök igen.')
    }
  }

  const filteredNotes = notes.filter(note => {
    // Search functionality is handled by the API hook
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags.includes(tag))
    return matchesTags
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'created':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    }
  })

  // Separate pinned notes
  const pinnedNotes = sortedNotes.filter(note => note.is_pinned)
  const regularNotes = sortedNotes.filter(note => !note.is_pinned)

  return (
        <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Anteckningar
              </h1>
              <p className="text-slate-400">
                Organisera dina tankar och idéer med block-baserad redigering
              </p>
            </div>
            
            
            {/* Modern Quick Create */}
            <div className="relative" ref={quickCreateRef}>
              {!showQuickCreate ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQuickCreate(true)}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  Skapa snabbt
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-0 z-50"
                >
                  {/* Input fält */}
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-xl p-2 min-w-80 mb-2 shadow-xl">
                    <input
                      type="text"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && quickTitle.trim()) {
                          createQuickNote()
                        }
                        if (e.key === 'Escape') {
                          setShowQuickCreate(false)
                          setQuickTitle('')
                        }
                      }}
                      placeholder="💡 Vad tänker du på?"
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400 px-3 py-2"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={createQuickNote}
                      disabled={!quickTitle.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowQuickCreate(false)
                        setQuickTitle('')
                      }}
                      className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      ✕
                    </motion.button>
                  </div>
                  
                  {/* Förslag */}
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-800 border border-slate-600 rounded-xl p-3 max-w-80 shadow-xl"
                  >
                    <p className="text-xs text-slate-400 mb-2">✨ Snabba förslag:</p>
                    <div className="grid grid-cols-1 gap-1">
                      {quickSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgb(51, 65, 85)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setQuickTitle(suggestion)
                            // Kort delay för visual feedback, sen skapa anteckning
                            setTimeout(() => {
                              createQuickNote()
                            }, 100)
                          }}
                          className="text-left p-2 text-slate-300 hover:text-white rounded-lg text-sm transition-all duration-200"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök i anteckningar, taggar eller kopplingar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  view === 'grid' 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  view === 'list' 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all duration-200 ${
                showFilters ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300">Filter</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'title')}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-300"
            >
              <option value="updated">Senast uppdaterad</option>
              <option value="created">Senast skapad</option>
              <option value="title">Alfabetisk</option>
            </select>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <NoteFilters
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  notes={notes}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Notes Grid/List */}
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-lg font-semibold text-white">
                  Viktiga anteckningar
                </h2>
              </div>
              <div className={`grid gap-6 ${
                view === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {pinnedNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NoteCard note={note} view={view} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Regular Notes */}
          {regularNotes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {pinnedNotes.length > 0 && (
                <h2 className="text-lg font-semibold text-white mb-4">
                  Alla anteckningar
                </h2>
              )}
              <div className={`grid gap-6 ${
                view === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {regularNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NoteCard note={note} view={view} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty State */}
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Inga anteckningar ännu
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Klicka på &quot;Skapa snabbt&quot; ovan för att komma igång med din första anteckning!
              </p>
              
              {/* Uppmuntra att använda quick create istället */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 text-blue-400 text-sm"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Tryck på blå knappen ovan för att börja</span>
              </motion.div>
            </motion.div>
          )}

          {/* No Results */}
          {notes.length > 0 && filteredNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Inga resultat hittades
              </h3>
              <p className="text-slate-400 mb-6">
                Prova att justera dina sökfilter eller skapa en ny anteckning.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTags([])
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Rensa filter
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
