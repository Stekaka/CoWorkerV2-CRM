import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Hämta alla användare från users tabellen
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      return NextResponse.json({ 
        error: 'Users error: ' + usersError.message,
        code: usersError.code 
      }, { status: 500 })
    }

    // Hämta alla företag
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')

    if (companiesError) {
      return NextResponse.json({ 
        error: 'Companies error: ' + companiesError.message,
        code: companiesError.code 
      }, { status: 500 })
    }

    return NextResponse.json({
      users: users || [],
      companies: companies || [],
      message: 'Database query successful'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error: ' + String(error) }, { status: 500 })
  }
}
