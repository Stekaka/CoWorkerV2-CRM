import { NextRequest, NextResponse } from 'next/server'
import { analyticsAPI } from '@/lib/api'

// POST /api/analytics/track - Track an analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventData } = body

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 })
    }

    await analyticsAPI.track(eventType, eventData || {})
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track event' },
      { status: 500 }
    )
  }
}

// GET /api/analytics/stats - Get analytics stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const dateRange = from && to ? { from, to } : undefined
    const stats = await analyticsAPI.getStats(dateRange)
    
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
