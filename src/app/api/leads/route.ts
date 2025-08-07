import { NextRequest, NextResponse } from 'next/server'
import { leadsAPI } from '@/lib/api'

// GET /api/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const search = searchParams.get('search')

    const filters = {
      ...(status && { status }),
      ...(tags && { tags }),
      ...(search && { search })
    }

    const leads = await leadsAPI.getAll(filters)
    return NextResponse.json(leads)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, status, tags, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const lead = await leadsAPI.create({
      name,
      email,
      phone,
      company,
      status,
      tags,
      notes
    })
    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create lead' },
      { status: 500 }
    )
  }
}
