import { NextRequest, NextResponse } from 'next/server'
import { leadsAPI } from '@/lib/api'

// GET /api/leads/[id] - Get a specific lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await leadsAPI.getById(params.id)
    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lead not found' },
      { status: 404 }
    )
  }
}

// PUT /api/leads/[id] - Update a specific lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const lead = await leadsAPI.update(params.id, body)
    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    )
  }
}
