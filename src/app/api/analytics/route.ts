import { NextRequest, NextResponse } from 'next/server'
import { analyticsAPI } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    
    const dateRange = from && to ? { 
      from: new Date(from), 
      to: new Date(to) 
    } : undefined
    
    const stats = await analyticsAPI.getStats(dateRange)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventData } = body
    
    const result = await analyticsAPI.track(eventType, eventData)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
