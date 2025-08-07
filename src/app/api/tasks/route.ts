import { NextRequest, NextResponse } from 'next/server'
import { tasksAPI } from '@/lib/api'

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')
    const leadId = searchParams.get('leadId')

    const filters = {
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
      ...(leadId && { leadId })
    }

    const tasks = await tasksAPI.getAll(filters)
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, due_date, leadId, noteId, assignedTo } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const task = await tasksAPI.create({
      title,
      description,
      priority,
      due_date,
      leadId,
      noteId,
      assignedTo
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create task' },
      { status: 500 }
    )
  }
}
