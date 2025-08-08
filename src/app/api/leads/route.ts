import { NextRequest, NextResponse } from 'next/server'
import { leadsAPI } from '@/lib/api'

export async function GET() {
  try {
    const leads = await leadsAPI.getAll()
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const lead = await leadsAPI.create(body)
    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
