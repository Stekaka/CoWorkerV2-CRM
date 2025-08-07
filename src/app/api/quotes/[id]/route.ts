/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

// Tillfällig in-memory storage - i produktion skulle detta vara en databas
// Vi importerar quotes array från parent route
// VIKTIGT: Detta är en temporär lösning - i produktion använd databas

// Hack för att dela quotes mellan routes - använd databas i produktion
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
    // Fallback to local array (won't persist)
    console.warn('Could not set global quotes')
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotes = getQuotes()
    const quote = quotes.find((q: any) => q.id === params.id)
    
    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: quote 
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const quotes = getQuotes()
    const quoteIndex = quotes.findIndex((q: any) => q.id === params.id)
    
    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Beräkna totaler för items om de uppdateras
    let items = body.items
    if (items) {
      items = items.map((item: any) => ({
        ...item,
        total: item.quantity * item.unitPrice
      }))

      // Beräkna ny total amount
      const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
      const discountAmount = subtotal * ((body.discount || 0) / 100)
      const afterDiscount = subtotal - discountAmount
      const taxAmount = afterDiscount * ((body.taxRate || 25) / 100)
      body.amount = afterDiscount + taxAmount
      body.items = items
    }

    const updatedQuote = {
      ...quotes[quoteIndex],
      ...body,
      id: params.id // Säkerställ att ID inte ändras
    }

    quotes[quoteIndex] = updatedQuote
    setQuotes(quotes)
    
    return NextResponse.json({ 
      success: true, 
      data: updatedQuote 
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotes = getQuotes()
    const quoteIndex = quotes.findIndex((q: any) => q.id === params.id)
    
    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    const deletedQuote = quotes.splice(quoteIndex, 1)[0]
    setQuotes(quotes)
    
    return NextResponse.json({ 
      success: true, 
      data: deletedQuote 
    })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete quote' },
      { status: 500 }
    )
  }
}
