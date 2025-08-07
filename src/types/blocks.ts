// Safe content types for backward compatibility
export interface TodoContent {
  text: string;
  completed: boolean;
}

// Type guards and utilities for content normalization
export type SafeBlockContent = string | TodoContent | Record<string, unknown>;
