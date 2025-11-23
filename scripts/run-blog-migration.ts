/**
 * Blog Automation State Migration Script
 *
 * Creates automation_state table and initializes blog-post state
 *
 * Usage:
 *   npx tsx scripts/run-blog-migration.ts
 */

import { sql } from '@vercel/postgres'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function main() {
  console.log('🚀 Blog Automation State Migration')
  console.log('===================================\n')

  // Check if database is configured
  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL environment variable not set')
    console.error('Please configure Vercel Postgres and set the connection string in .env.local')
    process.exit(1)
  }

  try {
    // Test database connection
    console.log('🔌 Testing database connection...')
    const result = await sql`SELECT NOW() as current_time`
    console.log(`✅ Connected to database at ${result.rows[0].current_time}\n`)

    // Run migration
    console.log('📝 Running migration 002_blog_automation_state.sql...')
    const migrationPath = join(process.cwd(), 'lib', 'db', 'migrations', '002_blog_automation_state.sql')
    const migrationSQL = await readFile(migrationPath, 'utf-8')

    // Execute migration statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      await sql.query(statement)
    }

    console.log('✅ Migration completed successfully!\n')

    // Verify table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'automation_state'
      )
    `

    if (tableCheck.rows[0].exists) {
      console.log('✓ automation_state table created')

      // Check initial state
      const stateCheck = await sql`
        SELECT * FROM automation_state WHERE key = 'blog-post'
      `

      if (stateCheck.rows.length > 0) {
        console.log('✓ blog-post state initialized:')
        console.log(`  ${JSON.stringify(stateCheck.rows[0].value, null, 2)}\n`)
      }
    }

    console.log('📝 Next steps:')
    console.log('   1. Deploy the updated code to Vercel')
    console.log('   2. Test the blog-post cron endpoint')
    console.log('   3. Verify automation runs daily at 10am\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed')
    console.error(error)
    process.exit(1)
  }
}

// Run migration
main()
