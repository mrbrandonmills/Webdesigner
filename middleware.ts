import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from './lib/session-jwt'

const AUTH_COOKIE_NAME = 'brandon-admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect all /admin routes (both pages and API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)

    // Check if session token exists and is valid
    const isValidSession = authCookie?.value ? await validateSession(authCookie.value) : false

    if (!isValidSession) {
      // For API routes, return 401 Unauthorized instead of redirecting
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin authentication required' },
          { status: 401 }
        )
      }

      // For regular admin pages, redirect to login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'  // Protect admin API routes as well
  ],
}
