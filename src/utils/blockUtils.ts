// Block conversion utilities for safe type handling

import { TodoContent, NoteBlock, TodoBlock, TextBlock } from '@/types/blocks';

/**
 * Safely converts string content to TodoContent format
 * Used for backward compatibility when migrating old todo blocks
 */
export function stringToTodoContent(content: string | TodoContent): TodoContent {
  // If already TodoContent, return as-is
  if (typeof content === 'object' && content !== null && 'text' in content && 'checked' in content) {
    return content;
  }
  
  // Convert string to TodoContent
  if (typeof content === 'string') {
    return {
      text: content,
      checked: false
    };
  }
  
  // Fallback for unexpected types
  return {
    text: '',
    checked: false
  };
}

/**
 * Ensures a block has the correct content type for its block type
 * This is the main safety function to prevent type errors
 */
export function normalizeBlockContent(block: any): NoteBlock {
  switch (block.type) {
    case 'todo':
      return {
        ...block,
        content: stringToTodoContent(block.content),
        type: 'todo' as const
      } as TodoBlock;
      
    case 'text':
    case 'heading':
    case 'quote':
    case 'code':
      return {
        ...block,
        content: typeof block.content === 'string' ? block.content : '',
        type: block.type
      } as TextBlock;
      
    case 'list':
      return {
        ...block,
        content: Array.isArray(block.content) ? block.content : [],
        type: 'list' as const
      };
      
    default:
      // Fallback to text block for unknown types
      return {
        ...block,
        type: 'text' as const,
        content: typeof block.content === 'string' ? block.content : ''
      } as TextBlock;
  }
}

/**
 * Creates a new block with proper content type
 */
export function createBlock(type: NoteBlock['type'], content?: string): NoteBlock {
  const baseBlock = {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  switch (type) {
    case 'todo':
      return {
        ...baseBlock,
        type: 'todo' as const,
        content: stringToTodoContent(content || '')
      } as TodoBlock;
      
    case 'heading':
      return {
        ...baseBlock,
        type: 'heading' as const,
        content: content || '',
        data: { level: 2 }
      } as any; // HeadingBlock
      
    case 'list':
      return {
        ...baseBlock,
        type: 'list' as const,
        content: []
      } as any; // ListBlock
      
    default:
      return {
        ...baseBlock,
        type: type as any,
        content: content || ''
      } as TextBlock;
  }
}

/**
 * Type guard to check if a block is a TodoBlock
 */
export function isTodoBlock(block: NoteBlock): block is TodoBlock {
  return block.type === 'todo';
}

/**
 * Type guard to check if content is TodoContent
 */
export function isTodoContent(content: any): content is TodoContent {
  return typeof content === 'object' && 
         content !== null && 
         'text' in content && 
         'checked' in content &&
         typeof content.text === 'string' &&
         typeof content.checked === 'boolean';
}
