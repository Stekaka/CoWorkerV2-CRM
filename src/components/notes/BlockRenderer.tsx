// Safe block renderer with proper type handling

import React from 'react';
import { TodoContent } from '@/types/blocks';
import { stringToTodoContent } from '@/utils/blockUtils';

// Import your block components
import TextBlock from '@/components/notes/blocks/TextBlock';
import TodoBlock from '@/components/notes/blocks/TodoBlock';
import HeadingBlock from '@/components/notes/blocks/HeadingBlock';
import ListBlock from '@/components/notes/blocks/ListBlock';
import QuoteBlock from '@/components/notes/blocks/QuoteBlock';
import CodeBlock from '@/components/notes/blocks/CodeBlock';

interface BlockRendererProps {
  block: NoteBlock;
  isFocused: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<NoteBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

/**
 * Safe block renderer that ensures proper content types
 * This prevents the TodoContent type error by normalizing blocks before rendering
 */
export function BlockRenderer({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown, 
  placeholder 
}: BlockRendererProps) {
  // Normalize the block to ensure correct content type
  const normalizedBlock = normalizeBlockContent(block);
  
  // Common props for all block types
  const commonProps = {
    key: normalizedBlock.id,
    isFocused,
    onFocus,
    onKeyDown,
    placeholder
  };
  
  // Type-safe rendering with proper content types
  switch (normalizedBlock.type) {
    case 'todo': {
      // TypeScript now knows this is a TodoBlock with TodoContent
      const todoBlock = normalizedBlock as TodoBlock;
      return (
        <TodoBlock
          {...commonProps}
          block={todoBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
    
    case 'heading': {
      const headingBlock = normalizedBlock as any; // Your HeadingBlock type
      return (
        <HeadingBlock
          {...commonProps}
          block={headingBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
    
    case 'list': {
      const listBlock = normalizedBlock as any; // Your ListBlock type
      return (
        <ListBlock
          {...commonProps}
          block={listBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
    
    case 'quote': {
      const quoteBlock = normalizedBlock as any; // Your QuoteBlock type
      return (
        <QuoteBlock
          {...commonProps}
          block={quoteBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
    
    case 'code': {
      const codeBlock = normalizedBlock as any; // Your CodeBlock type
      return (
        <CodeBlock
          {...commonProps}
          block={codeBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
    
    case 'text':
    default: {
      // Fallback to text block
      const textBlock = normalizedBlock as TextBlock;
      return (
        <TextBlock
          {...commonProps}
          block={textBlock}
          onUpdate={(updates) => onUpdate(updates)}
        />
      );
    }
  }
}

/**
 * Example usage in NoteEditor component
 */
export function ExampleNoteEditor() {
  const [blocks, setBlocks] = React.useState<NoteBlock[]>([]);
  
  const updateBlock = (blockId: string, updates: Partial<NoteBlock>) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? normalizeBlockContent({ ...block, ...updates })  // Always normalize
          : block
      )
    );
  };
  
  const addBlock = (afterId: string, type: NoteBlock['type'] = 'text') => {
    // Create new block with proper content type
    const newBlock = createBlock(type);
    
    const currentIndex = blocks.findIndex(block => block.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    
    setBlocks(newBlocks);
  };
  
  return (
    <div className="note-editor">
      {blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isFocused={false} // Your focus logic here
          onFocus={() => {/* Your focus handler */}}
          onUpdate={(updates) => updateBlock(block.id, updates)}
          onKeyDown={(e) => {/* Your keyboard handler */}}
        />
      ))}
    </div>
  );
}
