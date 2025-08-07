/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

// Tillfällig in-memory storage - i produktion skulle detta vara en databas
// Vi använder global state för att dela mellan olika API routes
const getQuotes = () => {
  try {
    // @ts-expect-error - Temporary hack to share state
    return global.quotes || []
  } catch {
    return []
  }
}

const setQuotes = (newQuotes: any[]) => {
  try {
    // @ts-expect-error - Temporary hack to share state
    global.quotes = newQuotes
  } catch {
    // Fallback - this won't persist between requests
    console.warn('Could not set global quotes')
  }
}

export async function GET() {
  try {
    const quotes = getQuotes()
    return NextResponse.json({ 
      success: true, 
      data: quotes 
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validera required fields
    if (!body.client || !body.title || !body.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: client, title, and items' },
        { status: 400 }
      )
    }

    const quotes = getQuotes()

    // Generera ID och quote number
    const id = Date.now().toString()
    const year = new Date().getFullYear()
    const nextNumber = quotes.length + 1
    const number = `OFF-${year}-${nextNumber.toString().padStart(3, '0')}`

    // Beräkna totaler för items
    const items = body.items.map((item: any) => ({
      ...item,
      total: item.quantity * item.unitPrice
    }))

    // Beräkna total amount
    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
    const discountAmount = subtotal * ((body.discount || 0) / 100)
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * ((body.taxRate || 25) / 100)
    const amount = afterDiscount + taxAmount

    const newQuote = {
      id,
      number,
      client: body.client,
      title: body.title,
      amount,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      items,
      notes: body.notes || '',
      clientEmail: body.clientEmail || '',
      clientPhone: body.clientPhone || '',
      clientAddress: body.clientAddress || '',
      taxRate: body.taxRate || 25,
      discount: body.discount || 0
    }

    const updatedQuotes = [newQuote, ...quotes] // Add to beginning of array
    setQuotes(updatedQuotes)
    
    return NextResponse.json({ 
      success: true, 
      data: newQuote 
    })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
