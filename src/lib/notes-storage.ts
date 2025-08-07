// Local storage utilities for notes
interface BlockMetadata {
  level?: number
  language?: string
  priority?: 'low' | 'medium' | 'high'
  completed?: boolean
  [key: string]: unknown
}

interface NoteBlock {
  id: string
  type: string
  content: string
  metadata?: BlockMetadata
}

interface Note {
  id: string
  title: string
  content: string
  blocks: NoteBlock[]
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

const STORAGE_KEY = 'coworker_notes'

export class NotesStorage {
  static getAllNotes(): Note[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading notes:', error)
      return []
    }
  }

  static saveNote(note: Note): void {
    if (typeof window === 'undefined') return
    
    try {
      const notes = this.getAllNotes()
      const existingIndex = notes.findIndex(n => n.id === note.id)
      
      if (existingIndex >= 0) {
        notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() }
      } else {
        notes.unshift(note)
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch (error) {
      console.error('Error saving note:', error)
      throw new Error('Kunde inte spara anteckningen')
    }
  }

  static getNoteById(id: string): Note | null {
    const notes = this.getAllNotes()
    return notes.find(note => note.id === id) || null
  }

  static deleteNote(id: string): void {
    if (typeof window === 'undefined') return
    
    try {
      const notes = this.getAllNotes()
      const filteredNotes = notes.filter(note => note.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes))
    } catch (error) {
      console.error('Error deleting note:', error)
      throw new Error('Kunde inte radera anteckningen')
    }
  }

  static createNote(title: string = '', content: string = ''): Note {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title || 'Namnlös anteckning',
      content,
      blocks: [
        {
          id: '1',
          type: 'text',
          content: content || '',
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
  }

  static updateNoteBlocks(id: string, blocks: NoteBlock[]): void {
    const note = this.getNoteById(id)
    if (note) {
      note.blocks = blocks
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static togglePin(id: string): void {
    const note = this.getNoteById(id)
    if (note) {
      note.isPinned = !note.isPinned
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static toggleArchive(id: string): void {
    const note = this.getNoteById(id)
    if (note) {
      note.isArchived = !note.isArchived
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static updateNoteTitle(id: string, title: string): void {
    const note = this.getNoteById(id)
    if (note) {
      note.title = title || 'Namnlös anteckning'
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static addTag(id: string, tag: string): void {
    const note = this.getNoteById(id)
    if (note && !note.tags.includes(tag)) {
      note.tags.push(tag)
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static removeTag(id: string, tag: string): void {
    const note = this.getNoteById(id)
    if (note) {
      note.tags = note.tags.filter(t => t !== tag)
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }

  static setPriority(id: string, priority: 'low' | 'medium' | 'high'): void {
    const note = this.getNoteById(id)
    if (note) {
      note.priority = priority
      note.updatedAt = new Date().toISOString()
      this.saveNote(note)
    }
  }
}

export type { Note }
