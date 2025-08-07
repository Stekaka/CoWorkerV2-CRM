'use client'

import { motion } from 'framer-motion'
import { X, Tag, User, Building, ShoppingCart, Briefcase, Star, AlertCircle } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  linkedTo?: {
    type: 'lead' | 'customer' | 'order' | 'case'
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  hasUrgentTodos: boolean
  blocksCount: number
}

interface NoteFiltersProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  notes: Note[]
}

export default function NoteFilters({ selectedTags, onTagsChange, notes }: NoteFiltersProps) {
  // Extract all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))
  
  // Extract all unique linked entities
  const linkedEntities = Array.from(
    new Map(
      notes
        .filter(note => note.linkedTo)
        .map(note => [note.linkedTo!.id, note.linkedTo!])
    ).values()
  )

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'lead': return <User className="w-4 h-4" />
      case 'customer': return <Building className="w-4 h-4" />
      case 'order': return <ShoppingCart className="w-4 h-4" />
      case 'case': return <Briefcase className="w-4 h-4" />
      default: return null
    }
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'lead': return 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
      case 'customer': return 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/30'
      case 'order': return 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-900/20 dark:hover:bg-purple-900/30'
      case 'case': return 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30'
      default: return 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700'
    }
  }

  const pinnedCount = notes.filter(note => note.isPinned).length
  const urgentCount = notes.filter(note => note.hasUrgentTodos).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6"
    >
      <div className="space-y-6">
        {/* Quick Filters */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
            Snabbfilter
          </h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-3 py-2 border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-lg text-sm font-medium transition-colors"
            >
              <Star className="w-4 h-4" />
              Viktiga ({pinnedCount})
            </motion.button>
            
            {urgentCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-3 py-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                Brådskande ({urgentCount})
              </motion.button>
            )}
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                Taggar ({allTags.length})
              </h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => onTagsChange([])}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Rensa alla
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                const tagCount = notes.filter(note => note.tags.includes(tag)).length
                
                return (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {tagCount}
                    </span>
                    {isSelected && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Linked Entities Filter */}
        {linkedEntities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
              Kopplad till ({linkedEntities.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {linkedEntities.map((entity) => {
                const entityCount = notes.filter(note => note.linkedTo?.id === entity.id).length
                
                return (
                  <motion.button
                    key={entity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${getEntityColor(entity.type)}`}
                  >
                    {getEntityIcon(entity.type)}
                    <span className="truncate">{entity.name}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded">
                      {entityCount}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{notes.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Totalt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pinnedCount}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Viktiga</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{allTags.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Taggar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{linkedEntities.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Kopplingar</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
