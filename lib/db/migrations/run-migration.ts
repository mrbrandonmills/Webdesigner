/**
 * Database Migration Runner
 *
 * Executes SQL migration scripts against Vercel Postgres
 *
 * Usage:
 *   npx tsx lib/db/migrations/run-migration.ts
 */

import { sql } from '@vercel/postgres'
import { readFileSync } from 'fs'
import { join } from 'path'

async function runMigration(migrationFile: string) {
  try {
    console.log(`\n🚀 Running migration: ${migrationFile}`)

    // Read the SQL file
    const migrationPath = join(__dirname, migrationFile)
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          await sql.query(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
        } catch (error: any) {
          // Some statements might fail if already exists (which is OK)
          if (
            error.message.includes('already exists') ||
            error.message.includes('does not exist')
          ) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`)
          } else {
            throw error
          }
        }
      }
    }

    console.log(`✅ Migration completed: ${migrationFile}\n`)
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`)
    console.error(error)
    throw error
  }
}

async function main() {
  console.log('🗄️  Database Migration Runner')
  console.log('================================\n')

  // Check if database is configured
  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL environment variable not set')
    console.error(
      'Please configure Vercel Postgres and set the connection string in .env.local'
    )
    process.exit(1)
  }

  try {
    // Test database connection
    console.log('🔌 Testing database connection...')
    await sql`SELECT NOW() as current_time`
    console.log('✅ Database connection successful\n')

    // Run migrations in order
    await runMigration('001_initial_schema.sql')

    console.log('🎉 All migrations completed successfully!')
    console.log('\n📊 You can now run the data migration script to import existing orders.')
    console.log('   Run: npx tsx scripts/migrate-orders-to-db.ts\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration process failed')
    console.error(error)
    process.exit(1)
  }
}

// Run migrations
main()
