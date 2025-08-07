import { createClient } from '@/lib/supabase-server'
import { Database, NoteBlock } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// Type definitions
type Tables = Database['public']['Tables']
type Note = Tables['notes']['Row']
type Task = Tables['tasks']['Row']
type Lead = Tables['leads']['Row']
type Reminder = Tables['reminders']['Row']

// Base API class for common functionality
class BaseAPI {
  protected async getAuthenticatedClient() {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized')
    
    const supabase = createClient()
    return { supabase, user }
  }
}

// Notes API
export class NotesAPI extends BaseAPI {
  async create(data: { title: string; content?: NoteBlock[]; tags?: string[]; leadId?: string }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        title: data.title,
        content: data.content || [],
        tags: data.tags || [],
        lead_id: data.leadId || null,
        company_id: user.company_id,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return note
  }

  async update(id: string, data: Partial<{ title: string; content: NoteBlock[]; tags: string[]; is_pinned: boolean }>) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: note, error } = await supabase
      .from('notes')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', user.company_id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return note
  }

  async delete(id: string) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('company_id', user.company_id)

    if (error) throw new Error(error.message)
  }

  async getById(id: string) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('company_id', user.company_id)
      .single()

    if (error) throw new Error(error.message)
    return note
  }

  async getAll(filters?: { tags?: string[]; leadId?: string; search?: string }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    let query = supabase
      .from('notes')
      .select('*')
      .eq('company_id', user.company_id)
      .order('updated_at', { ascending: false })

    if (filters?.leadId) {
      query = query.eq('lead_id', filters.leadId)
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    const { data: notes, error } = await query

    if (error) throw new Error(error.message)
    return notes
  }
}

// Tasks API
export class TasksAPI extends BaseAPI {
  async create(data: { 
    title: string; 
    description?: string; 
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    leadId?: string;
    noteId?: string;
    assignedTo?: string;
  }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'medium',
        due_date: data.due_date || null,
        lead_id: data.leadId || null,
        note_id: data.noteId || null,
        assigned_to: data.assignedTo || user.id,
        company_id: user.company_id,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return task
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
  }>) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: task, error } = await supabase
      .from('tasks')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', user.company_id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return task
  }

  async getAll(filters?: { status?: string; assignedTo?: string; leadId?: string }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    let query = supabase
      .from('tasks')
      .select('*, leads(name), users!assigned_to(name)')
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo)
    }

    if (filters?.leadId) {
      query = query.eq('lead_id', filters.leadId)
    }

    const { data: tasks, error } = await query

    if (error) throw new Error(error.message)
    return tasks
  }
}

// Leads API
export class LeadsAPI extends BaseAPI {
  async create(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    tags?: string[];
    notes?: string;
  }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        status: data.status || 'new',
        tags: data.tags || [],
        notes: data.notes || null,
        company_id: user.company_id,
        assigned_to: user.id
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return lead
  }

  async update(id: string, data: Partial<Lead>) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', user.company_id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return lead
  }

  async getAll(filters?: { status?: string; tags?: string[]; search?: string }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    let query = supabase
      .from('leads')
      .select('*')
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
    }

    const { data: leads, error } = await query

    if (error) throw new Error(error.message)
    return leads
  }

  async getById(id: string) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('company_id', user.company_id)
      .single()

    if (error) throw new Error(error.message)
    return lead
  }
}

// Analytics API
export class AnalyticsAPI extends BaseAPI {
  async track(eventType: string, eventData: Record<string, unknown>) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    const { error } = await supabase
      .from('analytics')
      .insert({
        event_type: eventType,
        event_data: {
          event_type: eventType,
          timestamp: new Date().toISOString(),
          ...eventData
        },
        user_id: user.id,
        company_id: user.company_id
      })

    if (error) throw new Error(error.message)
  }

  async getStats(dateRange?: { from: string; to: string }) {
    const { supabase, user } = await this.getAuthenticatedClient()
    
    let query = supabase
      .from('analytics')
      .select('*')
      .eq('company_id', user.company_id)

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
    }

    const { data: analytics, error } = await query

    if (error) throw new Error(error.message)
    return analytics
  }
}

// Export singleton instances
export const notesAPI = new NotesAPI()
export const tasksAPI = new TasksAPI()
export const leadsAPI = new LeadsAPI()
export const analyticsAPI = new AnalyticsAPI()
