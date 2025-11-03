import { NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Placeholder for AI-generated designs
 * Returns a simple SVG as fallback
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const theme = searchParams.get('theme') || 'default'

  // Theme-based colors
  const colors: Record<string, string> = {
    consciousness: '#D4AF37',
    embodiment: '#C4A661',
    philosophy: '#B8934C',
    nature: '#8B7355',
    typography: '#FFD700',
    editorial: '#E5C073',
    default: '#D4AF37'
  }

  const color = colors[theme] || colors.default

  // Generate a simple gradient SVG
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#grad)" />
      <text x="512" y="512" font-family="serif" font-size="48" fill="white" text-anchor="middle" opacity="0.2">
        ${theme}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
