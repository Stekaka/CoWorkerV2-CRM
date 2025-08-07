/**
 * Utility functions for normalizing and working with Note objects
 */

// Note interface (assuming this is defined elsewhere, but we define it here for type safety)
export interface Note {
  id: string;
  title: string;
  content: string;
  blocks: Array<{
    id: string;
    type: string;
    content: string;
    metadata?: any;
  }>;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  isArchived: boolean;
  linkedEntities: Array<{
    type: 'contact' | 'lead' | 'project';
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
  hasUrgentTodos: boolean;
  blocksCount: number;
}

// Type for partial Note objects that may come from backend (missing some fields)
export type PartialNote = Omit<Note, 'hasUrgentTodos' | 'blocksCount'> & {
  hasUrgentTodos?: boolean;
  blocksCount?: number;
  blocks?: Array<{
    id: string;
    type: string;
    content: string;
    metadata?: any;
  }>;
};

/**
 * Checks if a note has urgent todos based on its blocks
 * @param blocks - Array of note blocks to check
 * @returns true if any unchecked todo is marked as urgent or contains urgent indicators
 */
export const checkHasUrgentTodos = (
  blocks: Array<{ type: string; content: string; metadata?: any }> = []
): boolean => {
  return blocks.some(block => 
    block.type === 'todo' && 
    !block.metadata?.checked && 
    (
      block.metadata?.urgent === true || 
      block.metadata?.priority === 'high' ||
      block.content.includes('!') || 
      block.content.toLowerCase().includes('urgent') ||
      block.content.toLowerCase().includes('asap') ||
      block.content.toLowerCase().includes('immediately')
    )
  );
};

/**
 * Normalizes a single Note object, ensuring it has all required fields
 * @param note - Partial note object from backend
 * @returns Complete Note object with all fields
 */
export const normalizeNote = (note: PartialNote): Note => {
  const blocks = note.blocks || [];
  
  return {
    id: note.id || '',
    title: note.title || '',
    content: note.content || '',
    blocks,
    tags: note.tags || [],
    priority: note.priority || 'low',
    isPinned: note.isPinned || false,
    isArchived: note.isArchived || false,
    linkedEntities: note.linkedEntities || [],
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || new Date().toISOString(),
    hasUrgentTodos: note.hasUrgentTodos ?? checkHasUrgentTodos(blocks),
    blocksCount: note.blocksCount ?? blocks.length
  };
};

/**
 * Normalizes an array of Note objects, ensuring each has all required fields
 * @param notes - Array of partial note objects from backend
 * @returns Array of complete Note objects with all fields
 */
export const normalizeNotes = (notes: PartialNote[]): Note[] => {
  return notes.map(normalizeNote);
};

/**
 * Lightweight normalization for notes that only ensures hasUrgentTodos and blocksCount
 * @param notes - Array of notes that may be missing some fields
 * @returns Array of notes with hasUrgentTodos and blocksCount guaranteed
 */
export const ensureNoteFields = (notes: Array<Partial<Note>>): Note[] => {
  return notes.map(note => ({
    ...note,
    hasUrgentTodos: note.hasUrgentTodos ?? checkHasUrgentTodos(note.blocks || []),
    blocksCount: note.blocksCount ?? (note.blocks?.length || 0)
  })) as Note[];
};

/**
 * Filters notes to only return those with urgent todos
 * @param notes - Array of notes to filter
 * @returns Array of notes that have urgent todos
 */
export const getNotesWithUrgentTodos = (notes: Note[]): Note[] => {
  return notes.filter(note => note.hasUrgentTodos);
};

/**
 * Gets count of urgent todos across all notes
 * @param notes - Array of notes to count urgent todos from
 * @returns Total number of urgent todos
 */
export const getUrgentTodosCount = (notes: Note[]): number => {
  return notes.reduce((count, note) => {
    if (!note.hasUrgentTodos) return count;
    
    const urgentTodos = note.blocks.filter(block => 
      block.type === 'todo' && 
      !block.metadata?.checked && 
      (
        block.metadata?.urgent === true || 
        block.metadata?.priority === 'high' ||
        block.content.includes('!') || 
        block.content.toLowerCase().includes('urgent')
      )
    );
    
    return count + urgentTodos.length;
  }, 0);
};

/**
 * Type guard to check if a note has all required fields
 * @param note - Note object to check
 * @returns true if note has all required fields
 */
export const isCompleteNote = (note: any): note is Note => {
  return (
    typeof note === 'object' &&
    note !== null &&
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.hasUrgentTodos === 'boolean' &&
    typeof note.blocksCount === 'number' &&
    Array.isArray(note.blocks)
  );
};
