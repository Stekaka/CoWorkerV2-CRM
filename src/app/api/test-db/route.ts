import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Testa en enkel fråga mot companies tabellen
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Companies table accessible',
      data: data || []
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
