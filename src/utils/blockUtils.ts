// Simple utilities for block content normalization
import { TodoContent } from '@/types/blocks';

/**
 * Safely converts any content to TodoContent format
 */
export function stringToTodoContent(content: unknown): TodoContent {
  // If already TodoContent, return as-is
  if (typeof content === 'object' && content !== null) {
    const obj = content as Record<string, unknown>;
    if ('text' in obj && typeof obj.text === 'string') {
      return {
        text: obj.text,
        completed: Boolean(obj.completed || obj.checked || false)
      };
    }
  }
  
  // Convert string to TodoContent
  return {
    text: String(content || ''),
    completed: false
  };
}
