/**
 * Google Search Console Verification File
 *
 * GET /googlee62551f0bc5c4b9c.html
 * Returns the verification file as plain text
 */

import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'public', 'googlee62551f0bc5c4b9c.html')
    const content = readFileSync(filePath, 'utf-8')

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    return new NextResponse('google-site-verification: googlee62551f0bc5c4b9c.html', {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}
