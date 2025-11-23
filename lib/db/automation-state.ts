/**
 * Automation State Database Management
 * Provides persistent state storage for automation tasks using Postgres
 */

import { sql } from '@vercel/postgres'

export interface BlogAutomationState {
  lastPostedIndex: number
  lastPostedDate: string
}

/**
 * Ensure automation_state table exists
 */
async function ensureTableExists(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS automation_state (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  } catch (error) {
    console.error('[DB] Error creating automation_state table:', error)
  }
}

/**
 * Get blog automation state from database
 */
export async function getBlogState(): Promise<BlogAutomationState> {
  try {
    // Ensure table exists first
    await ensureTableExists()

    const result = await sql`
      SELECT value
      FROM automation_state
      WHERE key = 'blog-post'
    `

    if (result.rows.length === 0) {
      // Initialize if doesn't exist
      await sql`
        INSERT INTO automation_state (key, value)
        VALUES ('blog-post', '{"lastPostedIndex": -1, "lastPostedDate": ""}'::jsonb)
      `
      return { lastPostedIndex: -1, lastPostedDate: '' }
    }

    return result.rows[0].value as BlogAutomationState
  } catch (error) {
    console.error('[DB] Error getting blog state:', error)
    // Return default state on error
    return { lastPostedIndex: -1, lastPostedDate: '' }
  }
}

/**
 * Update blog automation state in database
 */
export async function updateBlogState(state: BlogAutomationState): Promise<void> {
  try {
    await sql`
      INSERT INTO automation_state (key, value)
      VALUES ('blog-post', ${JSON.stringify(state)}::jsonb)
      ON CONFLICT (key)
      DO UPDATE SET value = ${JSON.stringify(state)}::jsonb
    `
  } catch (error) {
    console.error('[DB] Error updating blog state:', error)
    throw error
  }
}
