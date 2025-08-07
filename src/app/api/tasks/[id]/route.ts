import { NextRequest, NextResponse } from 'next/server'
import { tasksAPI } from '@/lib/api'

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const task = await tasksAPI.update(params.id, body)
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update task' },
      { status: 500 }
    )
  }
}
