/**
 * Order Migration Script
 *
 * Migrates existing JSON orders from filesystem to Vercel Postgres database
 *
 * Usage:
 *   npx tsx scripts/migrate-orders-to-db.ts
 *
 * Options:
 *   --dry-run    Preview what would be migrated without making changes
 *   --force      Skip confirmation prompts
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { sql } from '@vercel/postgres'
import { createOrder, getOrderByStripeSessionId } from '@/lib/db/client'
import type { CreateOrderInput, OrderItem } from '@/lib/db/types'

interface LegacyOrder {
  id: string
  stripeSessionId: string
  stripePaymentIntent?: string
  customerEmail: string
  customerName: string
  shippingAddress?: any
  items: OrderItem[]
  totalAmount: number
  currency: string
  status: string
  printfulStatus?: string
  printfulOrderId?: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const isForce = args.includes('--force')

  console.log('🚀 Order Migration Script')
  console.log('========================\n')

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

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
    const result = await sql`SELECT NOW() as current_time`
    console.log(`✅ Connected to database at ${result.rows[0].current_time}\n`)

    // Check if orders table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'orders'
      )
    `
    if (!tableCheck.rows[0].exists) {
      console.error('❌ Error: orders table does not exist')
      console.error('Please run the database migration first:')
      console.error('   npx tsx lib/db/migrations/run-migration.ts\n')
      process.exit(1)
    }

    // Find all order JSON files
    const ordersDir = join(process.cwd(), 'data', 'orders')
    console.log(`📂 Looking for orders in: ${ordersDir}`)

    let files: string[]
    try {
      files = await readdir(ordersDir)
    } catch (error) {
      console.error('❌ Error: Could not read orders directory')
      console.error('No orders found to migrate.\n')
      process.exit(1)
    }

    const orderFiles = files.filter(
      (f) => f.startsWith('order_') && f.endsWith('.json')
    )

    if (orderFiles.length === 0) {
      console.log('ℹ️  No order files found to migrate.\n')
      process.exit(0)
    }

    console.log(`📦 Found ${orderFiles.length} order files\n`)

    // Confirmation prompt (unless --force)
    if (!isForce && !isDryRun) {
      console.log('⚠️  This will migrate all orders to the database.')
      console.log('   Orders that already exist (by Stripe session ID) will be skipped.\n')
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    // Process each order file
    let migrated = 0
    let skipped = 0
    let failed = 0

    for (let i = 0; i < orderFiles.length; i++) {
      const file = orderFiles[i]
      const orderPath = join(ordersDir, file)

      try {
        // Read order data
        const orderJson = await readFile(orderPath, 'utf-8')
        const legacyOrder: LegacyOrder = JSON.parse(orderJson)

        console.log(
          `[${i + 1}/${orderFiles.length}] Processing order: ${legacyOrder.id}`
        )

        // Check if order already exists in database
        const existing = await getOrderByStripeSessionId(
          legacyOrder.stripeSessionId
        )

        if (existing) {
          console.log(`   ⏭️  Skipped (already exists in database)\n`)
          skipped++
          continue
        }

        if (isDryRun) {
          console.log(`   ✓ Would migrate order`)
          console.log(`     - Customer: ${legacyOrder.customerEmail}`)
          console.log(`     - Total: ${legacyOrder.currency.toUpperCase()} ${legacyOrder.totalAmount}`)
          console.log(`     - Items: ${legacyOrder.items.length}\n`)
          migrated++
          continue
        }

        // Prepare order data for database
        const orderInput: CreateOrderInput = {
          stripeSessionId: legacyOrder.stripeSessionId,
          stripePaymentIntent: legacyOrder.stripePaymentIntent || null,
          customerEmail: legacyOrder.customerEmail,
          customerName: legacyOrder.customerName,
          shippingAddress: legacyOrder.shippingAddress || null,
          items: legacyOrder.items,
          totalAmount: legacyOrder.totalAmount,
          currency: legacyOrder.currency,
          status: (legacyOrder.status as any) || 'paid',
          printfulStatus: (legacyOrder.printfulStatus as any) || 'pending',
          metadata: legacyOrder.metadata || null,
        }

        // Insert into database with the original ID and timestamps
        await sql`
          INSERT INTO orders (
            id,
            stripe_session_id,
            stripe_payment_intent_id,
            customer_email,
            customer_name,
            shipping_address,
            billing_address,
            items,
            total_amount,
            currency,
            status,
            printful_status,
            printful_order_id,
            metadata,
            created_at,
            updated_at
          ) VALUES (
            ${legacyOrder.id},
            ${orderInput.stripeSessionId},
            ${orderInput.stripePaymentIntent},
            ${orderInput.customerEmail},
            ${orderInput.customerName},
            ${orderInput.shippingAddress ? JSON.stringify(orderInput.shippingAddress) : null},
            ${null},
            ${JSON.stringify(orderInput.items)},
            ${orderInput.totalAmount},
            ${orderInput.currency},
            ${orderInput.status},
            ${orderInput.printfulStatus},
            ${legacyOrder.printfulOrderId || null},
            ${orderInput.metadata ? JSON.stringify(orderInput.metadata) : null},
            ${legacyOrder.createdAt},
            ${legacyOrder.updatedAt}
          )
        `

        console.log(`   ✅ Migrated successfully`)
        console.log(`      - Customer: ${legacyOrder.customerEmail}`)
        console.log(`      - Total: ${legacyOrder.currency.toUpperCase()} ${legacyOrder.totalAmount}`)
        console.log(`      - Items: ${legacyOrder.items.length}\n`)
        migrated++
      } catch (error: any) {
        console.error(`   ❌ Failed to migrate: ${error.message}\n`)
        failed++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary')
    console.log('='.repeat(50))
    console.log(`✅ Migrated: ${migrated}`)
    console.log(`⏭️  Skipped:  ${skipped}`)
    console.log(`❌ Failed:   ${failed}`)
    console.log('='.repeat(50) + '\n')

    if (isDryRun) {
      console.log('🔍 This was a dry run. No changes were made.')
      console.log('   Run without --dry-run to perform the migration.\n')
    } else if (migrated > 0) {
      console.log('✅ Migration completed successfully!')
      console.log('\n📝 Next steps:')
      console.log('   1. Update USE_DATABASE=true in .env.local')
      console.log('   2. Test the admin orders page')
      console.log('   3. Test a new order via Stripe webhook')
      console.log('   4. Keep filesystem backups until fully verified\n')
    } else {
      console.log('ℹ️  No orders were migrated.\n')
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed')
    console.error(error)
    process.exit(1)
  }
}

// Run migration
main()
