import { NextRequest, NextResponse } from 'next/server'
import { notesAPI } from '@/lib/api'

// GET /api/notes - Get all notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const leadId = searchParams.get('leadId')
    const search = searchParams.get('search')

    const filters = {
      ...(tags && { tags }),
      ...(leadId && { leadId }),
      ...(search && { search })
    }

    const notes = await notesAPI.getAll(filters)
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, tags, leadId } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const note = await notesAPI.create({ title, content, tags, leadId })
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create note' },
      { status: 500 }
    )
  }
}
