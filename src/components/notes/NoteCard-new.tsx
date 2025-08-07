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
  FileText
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { NoteBlock } from '@/lib/supabase'

interface Note {
  id: string
  title: string
  content: NoteBlock[]
  tags: string[]
  is_pinned: boolean
  lead_id: string | null
  company_id: string
  created_by: string
  created_at: string
  updated_at: string
}

interface NoteCardProps {
  note: Note
  view: 'grid' | 'list'
}

export default function NoteCard({ note, view }: NoteCardProps) {
  // Extract preview text from content blocks
  const previewText = note.content
    .map(block => block.content)
    .join(' ')
    .substring(0, 150)

  // Check for urgent todos
  const hasUrgentTodos = note.content.some(block => 
    block.type === 'todo' && 
    block.data?.priority === 'high' && 
    !block.data?.completed
  )

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
                  {note.is_pinned && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                  {hasUrgentTodos && (
                    <div className="flex items-center gap-1 text-red-500 flex-shrink-0">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Urgent</span>
                    </div>
                  )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Preview */}
              {previewText && (
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {previewText}...
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{note.tags.length - 3} fler
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Lead connection */}
                {note.lead_id && (
                  <div className="flex items-center gap-1 text-blue-500">
                    <User className="w-3 h-3" />
                    <span className="text-xs">Kopplad till lead</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {note.content.length} block{note.content.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: sv })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link href={`/notes/${note.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-200 cursor-pointer h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {note.title || 'Untitled'}
            </h3>
            {note.is_pinned && (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Urgent indicator */}
        {hasUrgentTodos && (
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Innehåller urgenta uppgifter</span>
          </div>
        )}

        {/* Preview Content */}
        <div className="flex-1 mb-4">
          {previewText ? (
            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-4 leading-relaxed">
              {previewText}...
            </p>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-sm italic">
              Tom anteckning
            </p>
          )}
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-slate-500 px-2 py-1">
                +{note.tags.length - 3} fler
              </span>
            )}
          </div>
        )}

        {/* Lead connection */}
        {note.lead_id && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30">
              <User className="w-4 h-4" />
              <span>Kopplad till lead</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {note.content.length} block{note.content.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: sv })}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
