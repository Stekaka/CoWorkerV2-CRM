import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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
    }
  }
}
