import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import { SubscribeSchema, formatZodErrors } from '@/lib/validations'
import { logger } from '@/lib/logger'

interface Subscriber {
  email: string
  source: string
  subscribedAt: string
  ip?: string
  userAgent?: string
}

interface SubscribersData {
  subscribers: Subscriber[]
  totalCount: number
  lastUpdated: string
}

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

async function ensureDataFile(): Promise<SubscribersData> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist, create it
    const initialData: SubscribersData = {
      subscribers: [],
      totalCount: 0,
      lastUpdated: new Date().toISOString()
    }

    // Ensure data directory exists
    const dataDir = path.dirname(SUBSCRIBERS_FILE)
    await fs.mkdir(dataDir, { recursive: true })

    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

async function saveSubscribers(data: SubscribersData): Promise<void> {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = SubscribeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { email, source } = validationResult.data

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Load existing subscribers
    const data = await ensureDataFile()

    // Check if already subscribed
    const existingSubscriber = data.subscribers.find(
      (sub) => sub.email.toLowerCase() === normalizedEmail
    )

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    // Get request metadata
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create new subscriber
    const newSubscriber: Subscriber = {
      email: normalizedEmail,
      source,
      subscribedAt: new Date().toISOString(),
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : ip,
      userAgent
    }

    // Add to subscribers list
    data.subscribers.push(newSubscriber)
    data.totalCount = data.subscribers.length
    data.lastUpdated = new Date().toISOString()

    // Save to file
    await saveSubscribers(data)

    // Log the new subscription (for monitoring)
    logger.info('New subscriber: ${normalizedEmail} from ${source}')

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      totalSubscribers: data.totalCount
    })

  } catch (error) {
    logger.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscriber count (useful for admin)
export async function GET(request: NextRequest) {
  try {
    // Simple auth check using query param (replace with proper auth in production)
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')

    if (adminKey !== process.env.ADMIN_API_KEY && adminKey !== 'preview') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await ensureDataFile()

    // Return summary stats
    return NextResponse.json({
      totalSubscribers: data.totalCount,
      lastUpdated: data.lastUpdated,
      // Group by source
      bySource: data.subscribers.reduce((acc, sub) => {
        acc[sub.source] = (acc[sub.source] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // Recent subscribers (last 10)
      recent: adminKey === process.env.ADMIN_API_KEY
        ? data.subscribers.slice(-10).reverse().map(({ email, source, subscribedAt }) => ({
            email,
            source,
            subscribedAt
          }))
        : undefined
    })

  } catch (error) {
    logger.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriber data' },
      { status: 500 }
    )
  }
}
