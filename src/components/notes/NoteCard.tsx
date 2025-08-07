'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Star, 
  User, 
  Tag, 
  Clock,
  AlertCircle,
  MoreHorizontal,
  FileText,
  Building,
  ShoppingCart,
  Briefcase
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { type Note } from '@/utils/noteUtils'

interface NoteCardProps {
  note: Note
  view: 'grid' | 'list'
}

export default function NoteCard({ note, view }: NoteCardProps) {
  const getLinkedIcon = (type: string) => {
    switch (type) {
      case 'lead': return <User className="w-4 h-4" />
      case 'customer': return <Building className="w-4 h-4" />
      case 'order': return <ShoppingCart className="w-4 h-4" />
      case 'case': return <Briefcase className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getLinkedColor = (type: string) => {
    switch (type) {
      case 'lead': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'customer': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'order': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'case': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
      default: return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30'
    }
  }

  // Extract preview text (first 150 chars without formatting)
  const previewText = note.content.replace(/[#*_`]/g, '').substring(0, 150)

  if (view === 'list') {
    return (
      <Link href={`/notes/${note.id}`}>
        <motion.div
          whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
          className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer"
        >
        <div className="flex items-start gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {note.title || 'Untitled'}
                </h3>
                {note.isPinned && (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
                {note.hasUrgentTodos && (
                  <div className="flex items-center gap-1 text-red-500 flex-shrink-0">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Brådskande</span>
                  </div>
                )}
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200">
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {previewText && (
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {previewText}
                {note.content.length > 150 && '...'}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{note.tags.length - 3} fler
                      </span>
                    )}
                  </div>
                )}

                {/* Linked Entities */}
                {note.linkedEntities.length > 0 && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${getLinkedColor(note.linkedEntities[0].type)}`}>
                    {getLinkedIcon(note.linkedEntities[0].type)}
                    {note.linkedEntities[0].name}
                    {note.linkedEntities.length > 1 && (
                      <span className="text-xs opacity-75">
                        +{note.linkedEntities.length - 1} fler
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {note.blocksCount} block{note.blocksCount !== 1 ? '' : ''}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: sv })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/notes/${note.id}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {note.title || 'Untitled'}
          </h3>
          {note.isPinned && (
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200">
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Urgent Badge */}
      {note.hasUrgentTodos && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Innehåller brådskande uppgifter
          </div>
        </div>
      )}

      {/* Preview */}
      {previewText && (
        <div className="flex-1 mb-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-4 leading-relaxed">
            {previewText}
            {note.content.length > 150 && '...'}
          </p>
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.slice(0, 4).map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </motion.span>
          ))}
          {note.tags.length > 4 && (
            <span className="text-xs text-slate-500 self-center">
              +{note.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Linked To */}
      {/* Linked Entities */}
      {note.linkedEntities.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${getLinkedColor(note.linkedEntities[0].type)}`}>
            {getLinkedIcon(note.linkedEntities[0].type)}
            <span>Kopplad till {note.linkedEntities[0].name}</span>
            {note.linkedEntities.length > 1 && (
              <span className="text-xs opacity-75">
                (+{note.linkedEntities.length - 1} fler)
              </span>
            )}
          </div>
        </div>
      )}      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <FileText className="w-3 h-3" />
          <span>{note.blocksCount} block{note.blocksCount !== 1 ? '' : ''}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: sv })}</span>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}
