import { NextResponse } from 'next/server'
import { z } from 'zod'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { AnalyticsTrackSchema, formatZodErrors } from '@/lib/validations'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Track analytics events server-side for backup/analysis
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = AnalyticsTrackSchema.safeParse(body)
    if (!validationResult.success) {
      // Don't fail on analytics validation errors, just log and return success
      logger.error('Analytics validation error:', validationResult.error.errors)
      return NextResponse.json({ success: true })
    }

    const { event, data, timestamp } = validationResult.data

    // Log to console for monitoring
    logger.info('event}]', { data: data })

    // Optionally save to file for persistence
    const analyticsDir = path.join(process.cwd(), 'data', 'analytics')

    try {
      await mkdir(analyticsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const today = new Date().toISOString().split('T')[0]
    const logFile = path.join(analyticsDir, `${today}.jsonl`)

    // Append event to daily log file (JSONL format - one JSON object per line)
    const logEntry = JSON.stringify({ event, data, timestamp }) + '\n'

    try {
      const existingContent = await readFile(logFile, 'utf-8').catch(() => '')
      await writeFile(logFile, existingContent + logEntry)
    } catch (error) {
      // If file doesn't exist, create it
      await writeFile(logFile, logEntry)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Analytics tracking error:', error)
    // Don't fail on analytics errors
    return NextResponse.json({ success: true })
  }
}
