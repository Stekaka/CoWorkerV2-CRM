import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Test endpoint - Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      urlValue: supabaseUrl?.substring(0, 30) + '...',
      serviceKeyLength: supabaseServiceKey?.length,
      serviceKeyStart: supabaseServiceKey?.substring(0, 20) + '...'
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      }, { status: 500 })
    }

    // Testa grundläggande Supabase-anslutning
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Testa enkel databas-query
    const { data, error } = await supabase
      .from('companies')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.error('Supabase test error:', error)
      return NextResponse.json({
        error: 'Supabase connection failed',
        details: error.message,
        code: error.code
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data,
      environment: {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        urlDomain: supabaseUrl.split('/')[2]
      }
    })

  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      error: 'Unexpected error',
      details: String(error)
    }, { status: 500 })
  }
}
