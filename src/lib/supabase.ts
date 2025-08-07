import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Block types for notes
export interface NoteBlock {
  id: string
  type: 'text' | 'heading' | 'list' | 'todo' | 'quote' | 'code'
  content: string
  data?: Record<string, unknown>
}

export interface AnalyticsEvent {
  event_type: string
  timestamp: string
  user_agent?: string
  page?: string
  [key: string]: unknown
}

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'user'
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          tags: string[]
          notes: string | null
          company_id: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          tags?: string[]
          notes?: string | null
          company_id: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          tags?: string[]
          notes?: string | null
          company_id?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          completed: boolean
          lead_id: string
          company_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          completed?: boolean
          lead_id: string
          company_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          completed?: boolean
          lead_id?: string
          company_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_campaigns: {
        Row: {
          id: string
          subject: string
          content: string
          recipients: string[]
          sent_at: string | null
          company_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          content: string
          recipients: string[]
          sent_at?: string | null
          company_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          content?: string
          recipients?: string[]
          sent_at?: string | null
          company_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          filename: string
          url: string
          size: number
          mime_type: string
          lead_id: string
          company_id: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          url: string
          size: number
          mime_type: string
          lead_id: string
          company_id: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          url?: string
          size?: number
          mime_type?: string
          lead_id?: string
          company_id?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          title: string
          content: NoteBlock[] // JSON array of blocks
          tags: string[]
          is_pinned: boolean
          lead_id: string | null
          company_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: NoteBlock[]
          tags?: string[]
          is_pinned?: boolean
          lead_id?: string | null
          company_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: NoteBlock[]
          tags?: string[]
          is_pinned?: boolean
          lead_id?: string | null
          company_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          lead_id: string | null
          note_id: string | null
          company_id: string
          assigned_to: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          lead_id?: string | null
          note_id?: string | null
          company_id: string
          assigned_to: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          lead_id?: string | null
          note_id?: string | null
          company_id?: string
          assigned_to?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          event_type: string
          event_data: AnalyticsEvent
          user_id: string
          company_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_data: AnalyticsEvent
          user_id: string
          company_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          event_data?: AnalyticsEvent
          user_id?: string
          company_id?: string
          created_at?: string
        }
      }
    }
  }
}
