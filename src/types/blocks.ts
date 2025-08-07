// Safe block type definitions with proper content typing

export interface TodoContent {
  text: string;
  checked: boolean;
}

export interface ListItem {
  text: string;
  completed?: boolean;
}

export interface HeadingContent {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// Base block interface
export interface BaseBlock {
  id: string;
  type: 'text' | 'heading' | 'list' | 'todo' | 'quote' | 'code';
  data?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// Specific block types with proper content typing
export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;
  data: { level: number };
}

export interface TodoBlock extends BaseBlock {
  type: 'todo';
  content: TodoContent; // Always TodoContent, never string
  data?: Record<string, unknown>;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  content: ListItem[];
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  content: string;
  data?: { language?: string };
}

// Union type for all blocks
export type NoteBlock = 
  | TextBlock 
  | HeadingBlock 
  | TodoBlock 
  | ListBlock 
  | QuoteBlock 
  | CodeBlock;

// Props for components
export interface TodoBlockProps {
  block: TodoBlock;
  isFocused: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<TodoBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

export interface TextBlockProps {
  block: TextBlock;
  isFocused: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<TextBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

// Generic block props for other types
export interface BlockProps<T extends NoteBlock = NoteBlock> {
  block: T;
  isFocused: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<T>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}
