import { NextRequest, NextResponse } from 'next/server'
import { notesAPI } from '@/lib/api'

// GET /api/notes - Get all notes
export async function GET() {
  try {
    const notes = await notesAPI.getAll()
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const note = await notesAPI.create(body)
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
