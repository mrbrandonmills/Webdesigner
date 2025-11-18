/**
 * Google Search Console Verification File API Route
 *
 * Serves the verification file from /api/googlee62551f0bc5c4b9c.html
 * Then we'll use middleware to redirect requests from root to this API route
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Return the verification content directly
  return new NextResponse('google-site-verification: googlee62551f0bc5c4b9c.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
