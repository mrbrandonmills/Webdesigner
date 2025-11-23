/**
 * Admin Migration Endpoint
 * Runs database migrations - should be protected in production
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    console.log('[Migration] Running blog automation state migration...')

    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'automation_state'
      )
    `

    if (tableCheck.rows[0].exists) {
      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        tableExists: true
      })
    }

    // Create automation_state table
    await sql`
      CREATE TABLE IF NOT EXISTS automation_state (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('[Migration] Created automation_state table')

    // Create index
    await sql`
      CREATE INDEX IF NOT EXISTS idx_automation_state_updated
      ON automation_state(updated_at DESC)
    `

    console.log('[Migration] Created index')

    // Insert initial blog automation state
    await sql`
      INSERT INTO automation_state (key, value)
      VALUES ('blog-post', '{"lastPostedIndex": -1, "lastPostedDate": ""}'::jsonb)
      ON CONFLICT (key) DO NOTHING
    `

    console.log('[Migration] Initialized blog-post state')

    // Create trigger (if update_updated_at_column function exists)
    try {
      await sql`
        CREATE TRIGGER update_automation_state_updated_at
          BEFORE UPDATE ON automation_state
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `
      console.log('[Migration] Created trigger')
    } catch (error) {
      console.log('[Migration] Trigger creation skipped (function may not exist)')
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      steps: [
        'Created automation_state table',
        'Created index',
        'Initialized blog-post state'
      ]
    })

  } catch (error) {
    console.error('[Migration] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
