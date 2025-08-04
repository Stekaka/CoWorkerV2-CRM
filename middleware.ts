import { NextResponse } from 'next/server'

// Tillfälligt inaktiverad för debugging
export async function middleware() {
  // Låt alla requests gå igenom utan auth-kontroll
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
