import { NextRequest, NextResponse } from 'next/server'
import { notesAPI } from '@/lib/api'

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await notesAPI.getById(params.id)
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Note not found' },
      { status: 404 }
    )
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const note = await notesAPI.update(params.id, body)
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await notesAPI.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete note' },
      { status: 500 }
    )
  }
}
