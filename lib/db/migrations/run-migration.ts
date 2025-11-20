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
import { logger } from '@/lib/logger'

async function runMigration(migrationFile: string) {
  try {
    logger.info('n🚀 Running migration: ${migrationFile}')

    // Read the SQL file
    const migrationPath = join(__dirname, migrationFile)
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    logger.info('Executing ${statements.length} SQL statements...')

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          await sql.query(statement)
          logger.info('Statement ${i + 1}/${statements.length} executed')
        } catch (error: any) {
          // Some statements might fail if already exists (which is OK)
          if (
            error.message.includes('already exists') ||
            error.message.includes('does not exist')
          ) {
            logger.info('Statement ${i + 1}/${statements.length} skipped (already exists)')
          } else {
            throw error
          }
        }
      }
    }

    logger.info('Migration completed: ${migrationFile}\n')
  } catch (error) {
    logger.error('Migration failed', { migrationFile, error })
    throw error
  }
}

async function main() {
  logger.info('Database Migration Runner')
  logger.info('n')

  // Check if database is configured
  if (!process.env.POSTGRES_URL) {
    logger.error('Error: POSTGRES_URL environment variable not set')
    logger.error('Please configure Vercel Postgres and set the connection string in .env.local')
    process.exit(1)
  }

  try {
    // Test database connection
    logger.info('Testing database connection...')
    await sql`SELECT NOW() as current_time`
    logger.info('Database connection successful\n')

    // Run migrations in order
    await runMigration('001_initial_schema.sql')

    logger.info('All migrations completed successfully!')
    logger.info('n📊 You can now run the data migration script to import existing orders.')
    logger.info('Run: npx tsx scripts/migrate-orders-to-db.ts\n')

    process.exit(0)
  } catch (error) {
    logger.error('Migration process failed', error)
    process.exit(1)
  }
}

// Run migrations
main()
