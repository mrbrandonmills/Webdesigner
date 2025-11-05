import { NextRequest, NextResponse } from 'next/server'

// In production, store in database
const clickData: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const click = {
      id: `click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: body.productId,
      program: body.program,
      timestamp: new Date().toISOString(),
      referrer: body.referrer || request.headers.get('referer'),
      userAgent: body.userAgent || request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      sessionId: body.sessionId,
    }

    // Store click data
    clickData.push(click)

    // In production, save to database
    // await db.affiliateClicks.create({ data: click })

    // Track in analytics
    // await trackEvent('affiliate_click', {
    //   program: click.program,
    //   productId: click.productId,
    // })

    return NextResponse.json({ success: true, clickId: click.id })
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    )
  }
}

// GET endpoint for analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const program = searchParams.get('program')
    const days = parseInt(searchParams.get('days') || '7')

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    let clicks = clickData.filter(
      click => new Date(click.timestamp) > cutoffDate
    )

    if (program) {
      clicks = clicks.filter(c => c.program === program)
    }

    // Aggregate data
    const stats = {
      totalClicks: clicks.length,
      clicksByProgram: clicks.reduce((acc: any, click) => {
        acc[click.program] = (acc[click.program] || 0) + 1
        return acc
      }, {}),
      recentClicks: clicks.slice(-10),
      dailyClicks: aggregateByDay(clicks),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching click stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

function aggregateByDay(clicks: any[]) {
  const byDay: Record<string, number> = {}

  clicks.forEach(click => {
    const day = new Date(click.timestamp).toISOString().split('T')[0]
    byDay[day] = (byDay[day] || 0) + 1
  })

  return Object.entries(byDay).map(([date, count]) => ({
    date,
    count,
  }))
}