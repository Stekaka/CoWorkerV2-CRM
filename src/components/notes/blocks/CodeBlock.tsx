'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code, Copy, Eye, EyeOff, Check, Terminal } from 'lucide-react'

interface Block {
  id: string
  type: 'text' | 'heading' | 'todo' | 'list' | 'quote' | 'code' | 'image' | 'divider'
  content: string
  metadata?: {
    language?: string
    [key: string]: unknown
  }
}

interface CodeBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function CodeBlock({ 
  block, 
  isFocused, 
  onFocus, 
  onUpdate, 
  onKeyDown,
  placeholder 
}: CodeBlockProps) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const filenameRef = useRef<HTMLInputElement>(null)
  
  const language = block.metadata?.language || 'text'
  const filename = typeof block.metadata?.filename === 'string' ? block.metadata.filename : ''
  const showLineNumbers = block.metadata?.showLineNumbers || false

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isFocused])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value })
    
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleLanguageChange = (newLanguage: string) => {
    onUpdate({
      metadata: {
        ...block.metadata,
        language: newLanguage
      }
    })
    setShowLanguageSelector(false)
  }

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      metadata: {
        ...block.metadata,
        filename: e.target.value
      }
    })
  }

  const toggleLineNumbers = () => {
    onUpdate({
      metadata: {
        ...block.metadata,
        showLineNumbers: !showLineNumbers
      }
    })
  }

  const copyToClipboard = async () => {
    if (block.content) {
      try {
        await navigator.clipboard.writeText(block.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const content = target.value
      
      if (e.shiftKey) {
        // Remove indentation
        const lineStart = content.lastIndexOf('\n', start - 1) + 1
        const lineContent = content.substring(lineStart, start)
        if (lineContent.startsWith('  ')) {
          const newContent = content.substring(0, lineStart) + lineContent.substring(2) + content.substring(start)
          onUpdate({ content: newContent })
          setTimeout(() => {
            target.setSelectionRange(start - 2, end - 2)
          }, 0)
        }
      } else {
        // Add indentation
        const newContent = content.substring(0, start) + '  ' + content.substring(end)
        onUpdate({ content: newContent })
        setTimeout(() => {
          target.setSelectionRange(start + 2, end + 2)
        }, 0)
      }
    } else {
      onKeyDown(e)
    }
  }

  const getLanguageLabel = (lang: string) => {
    const languages: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'csharp': 'C#',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'ruby': 'Ruby',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sql': 'SQL',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'bash': 'Bash',
      'powershell': 'PowerShell',
      'dockerfile': 'Dockerfile',
      'text': 'Text'
    }
    return languages[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
  }

  const getLineNumbers = () => {
    if (!showLineNumbers || !block.content) return null
    
    const lines = block.content.split('\n').length
    return Array.from({ length: lines }, (_, i) => i + 1)
  }

  const commonLanguages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp',
    'html', 'css', 'sql', 'json', 'bash', 'text'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-lg overflow-hidden transition-all duration-200 ${
        isFocused 
          ? 'ring-2 ring-blue-200 dark:ring-blue-800' 
          : ''
      }`}
      onClick={onFocus}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowLanguageSelector(!showLanguageSelector)
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">{getLanguageLabel(language)}</span>
            </motion.button>

            {/* Language Dropdown */}
            {showLanguageSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
              >
                {commonLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      language === lang ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {getLanguageLabel(lang)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Filename Input */}
          <input
            ref={filenameRef}
            type="text"
            value={filename}
            onChange={handleFilenameChange}
            placeholder="filename.ext"
            className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-400 placeholder-slate-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Line Numbers Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleLineNumbers()
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              showLineNumbers 
                ? 'bg-blue-200 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Växla radnummer"
          >
            {showLineNumbers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard()
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Kopiera kod"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative bg-slate-50 dark:bg-slate-900">
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="flex-shrink-0 p-4 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400 font-mono leading-6 select-none">
                {getLineNumbers()?.map((num) => (
                  <div key={num} className="text-right">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={block.content}
              onChange={handleContentChange}
              onFocus={onFocus}
              onKeyDown={handleCodeKeyDown}
              placeholder={placeholder || 'Skriv din kod här...'}
              className="w-full p-4 bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-300 placeholder-slate-400 font-mono text-sm leading-6 overflow-hidden"
              rows={8}
              style={{
                minHeight: '12rem',
                tabSize: 2
              }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Terminal Icon for Shell Scripts */}
      {(language === 'bash' || language === 'powershell') && (
        <div className="absolute top-3 right-16">
          <Terminal className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {/* Help Text */}
      {isFocused && block.content === '' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute top-full left-3 mt-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
        >
          <div className="space-y-1">
            <div><kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Tab</kbd> Indrag</div>
            <div><kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Shift+Tab</kbd> Ta bort indrag</div>
            <div>Välj språk för syntax highlighting</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
