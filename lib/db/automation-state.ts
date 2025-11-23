/**
 * Automation State Database Management
 * Provides persistent state storage for automation tasks using Postgres
 * Falls back to date-based calculation if database is unavailable
 */

export interface BlogAutomationState {
  lastPostedIndex: number
  lastPostedDate: string
}

// Start date for blog automation (when the automation began)
const AUTOMATION_START_DATE = new Date('2025-11-23')

/**
 * Calculate which blog post index to use based on date
 * This provides stateless operation when database is unavailable
 */
function calculateIndexFromDate(totalPosts: number): number {
  const today = new Date()
  const daysSinceStart = Math.floor((today.getTime() - AUTOMATION_START_DATE.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceStart % totalPosts
}

/**
 * Ensure automation_state table exists
 */
async function ensureTableExists(): Promise<void> {
  try {
    // Dynamic import to avoid loading postgres when not needed
    const postgres = await import('@vercel/postgres').catch(() => null)
    if (!postgres) return

    const sql = postgres.sql
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
 * Falls back to stateless date-based calculation if database unavailable
 */
export async function getBlogState(totalPosts: number = 50): Promise<BlogAutomationState> {
  // Always use stateless mode for now (Postgres not configured in production)
  console.log('[Automation] Using date-based stateless mode')
  const today = new Date().toISOString().split('T')[0]
  return {
    lastPostedIndex: calculateIndexFromDate(totalPosts) - 1, // -1 so next post is calculated correctly
    lastPostedDate: ''  // Empty so it will post today
  }

  /* Database mode disabled until Postgres is configured in Vercel
  // Check if database is configured
  if (!process.env.POSTGRES_URL && !process.env.POSTGRES_PRISMA_URL) {
    console.log('[DB] No Postgres configured, using date-based stateless mode')
    const today = new Date().toISOString().split('T')[0]
    return {
      lastPostedIndex: calculateIndexFromDate(totalPosts) - 1,
      lastPostedDate: ''
    }
  }

  try {
    await ensureTableExists()
    const postgres = await import('@vercel/postgres').catch(() => null)
    if (!postgres) throw new Error('Postgres not available')

    const sql = postgres.sql
    const result = await sql`SELECT value FROM automation_state WHERE key = 'blog-post'`

    if (result.rows.length === 0) {
      await sql`INSERT INTO automation_state (key, value) VALUES ('blog-post', '{"lastPostedIndex": -1, "lastPostedDate": ""}'::jsonb)`
      return { lastPostedIndex: -1, lastPostedDate: '' }
    }
    return result.rows[0].value as BlogAutomationState
  } catch (error) {
    console.error('[DB] Error, falling back to date-based mode:', error)
    return {
      lastPostedIndex: calculateIndexFromDate(totalPosts) - 1,
      lastPostedDate: ''
    }
  }
  */
}

/**
 * Update blog automation state in database
 * Silently fails if database unavailable (stateless mode will continue working)
 */
export async function updateBlogState(state: BlogAutomationState): Promise<void> {
  // Stateless mode - no update needed
  console.log('[Automation] Stateless mode - state not persisted')
  return

  /* Database mode disabled until Postgres is configured
  if (!process.env.POSTGRES_URL && !process.env.POSTGRES_PRISMA_URL) {
    console.log('[DB] No Postgres configured, skipping state update')
    return
  }

  try {
    const postgres = await import('@vercel/postgres').catch(() => null)
    if (!postgres) return

    const sql = postgres.sql
    await sql`INSERT INTO automation_state (key, value) VALUES ('blog-post', ${JSON.stringify(state)}::jsonb)
             ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(state)}::jsonb`
  } catch (error) {
    console.error('[DB] Error updating blog state:', error)
  }
  */
}
