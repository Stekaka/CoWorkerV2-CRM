import { NextResponse } from 'next/server'

export async function middleware() {
  // Tillåt alla requests för debugging – återaktivera auth-skydd sen!
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
