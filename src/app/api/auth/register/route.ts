import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Skapa en Supabase-klient med service role för att kringgå RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json()

    // Validera input
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Alla fält måste fyllas i' },
        { status: 400 }
      )
    }

    // 1. Skapa användaren först med Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        company_name: companyName
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Kunde inte skapa användare' },
        { status: 500 }
      )
    }

    // 2. Skapa företaget
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert([{ name: companyName }])
      .select()
      .single()

    if (companyError) {
      console.error('Company error:', companyError)
      // Rensa upp användaren om företaget inte kunde skapas
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Kunde inte skapa företag' },
        { status: 500 }
      )
    }

    // 3. Skapa användarprofilen
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role: 'admin',
        company_id: company.id
      }])

    if (userError) {
      console.error('User profile error:', userError)
      // Rensa upp om användarprofilen inte kunde skapas
      await supabase.auth.admin.deleteUser(authData.user.id)
      await supabase.from('companies').delete().eq('id', company.id)
      return NextResponse.json(
        { error: 'Kunde inte skapa användarprofil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Kontot har skapats framgångsrikt',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        company_id: company.id
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Ett oväntat fel inträffade' },
      { status: 500 }
    )
  }
}
