'use client'

import { createBrowserClient } from '@supabase/ssr'
import { type Database } from './supabase'

// OBS! Skapa ENDAST EN instans av klienten!
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Export both default and createClient for backward compatibility
export default supabase
export const createClient = () => supabase
