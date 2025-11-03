import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Track analytics events server-side for backup/analysis
 */
export async function POST(request: Request) {
  try {
    const { event, data, timestamp } = await request.json()

    // Log to console for monitoring
    console.log(`📊 [${event}]`, data)

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
    console.error('Analytics tracking error:', error)
    // Don't fail on analytics errors
    return NextResponse.json({ success: true })
  }
}
