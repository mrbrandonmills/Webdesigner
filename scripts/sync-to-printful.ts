#!/usr/bin/env tsx
/**
 * Sync Rendered Designs to Printful Catalog
 *
 * Usage:
 *   npx tsx scripts/sync-to-printful.ts              # Sync all designs
 *   npx tsx scripts/sync-to-printful.ts --test       # Test with single design
 *   npx tsx scripts/sync-to-printful.ts --category poetry --name poet-proponent --type mug
 */

import { printfulSync } from '../lib/printful-sync'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// ASCII art header
const HEADER = `
╔════════════════════════════════════════════════╗
║     🚀 PRINTFUL SYNC - DESIGN UPLOADER 🚀      ║
║    Syncing rendered designs to Printful...     ║
╚════════════════════════════════════════════════╝
`

// Check for test mode or specific design
const args = process.argv.slice(2)
const isTestMode = args.includes('--test')
const categoryArg = args.indexOf('--category')
const nameArg = args.indexOf('--name')
const typeArg = args.indexOf('--type')

async function main() {
  console.log(HEADER)

  // Verify environment variables
  if (!process.env.PRINTFUL_API_KEY || !process.env.PRINTFUL_STORE_ID) {
    console.error('❌ Error: PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set in .env.local')
    process.exit(1)
  }

  console.log('✅ Printful credentials loaded')
  console.log(`📍 Store ID: ${process.env.PRINTFUL_STORE_ID}`)
  console.log('')

  try {
    if (isTestMode) {
      // Test mode: sync single design
      console.log('🧪 TEST MODE: Syncing single design...\n')

      const result = await printfulSync.syncSingleDesign(
        'poetry',
        'poet-proponent',
        'mug'
      )

      if (result.success) {
        console.log('\n✅ Test sync successful!')
        console.log(`   Sync Product ID: ${result.syncProductId}`)
        console.log(`   File ID: ${result.fileId}`)
        console.log(`   Mockup URLs: ${result.mockupUrls?.length || 0} generated`)
        console.log('\n📊 Test result saved to: public/designs/printful-sync-test.json')
        console.log('\n🎯 Next step: Check your Printful dashboard to verify the product')
        console.log(`   https://www.printful.com/dashboard/sync-products/${result.syncProductId}`)
      } else {
        console.log('\n❌ Test sync failed:', result.error)
      }

    } else if (categoryArg !== -1 && nameArg !== -1 && typeArg !== -1) {
      // Sync specific design
      const category = args[categoryArg + 1]
      const name = args[nameArg + 1]
      const type = args[typeArg + 1]

      console.log(`📦 Syncing specific design: ${category} - ${name} (${type})\n`)

      const result = await printfulSync.syncSingleDesign(category, name, type)

      if (result.success) {
        console.log('\n✅ Sync successful!')
        console.log(`   Sync Product ID: ${result.syncProductId}`)
        console.log(`   File ID: ${result.fileId}`)
        console.log(`   Mockup URLs: ${result.mockupUrls?.length || 0} generated`)
      } else {
        console.log('\n❌ Sync failed:', result.error)
      }

    } else {
      // Full sync: all designs
      console.log('🎯 Starting full sync of all 20 designs...\n')
      console.log('⚠️  This will create products in your Printful account')
      console.log('⏱️  Estimated time: 5-10 minutes\n')

      // Add countdown
      for (let i = 5; i > 0; i--) {
        process.stdout.write(`Starting in ${i}...\r`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      console.log('Starting now!      \n')

      const results = await printfulSync.syncAllDesigns()

      // Print summary
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      console.log('\n' + '═'.repeat(50))
      console.log('📊 SYNC SUMMARY')
      console.log('═'.repeat(50))
      console.log(`✅ Successful: ${successful} products`)
      console.log(`❌ Failed: ${failed} products`)
      console.log(`📁 Total processed: ${results.length} designs`)
      console.log('\n💾 Full results saved to: public/designs/printful-sync.json')

      // List successful products
      if (successful > 0) {
        console.log('\n✅ Successfully synced products:')
        results
          .filter(r => r.success)
          .forEach(r => {
            console.log(`   • ${r.category} - ${r.designName} (${r.productType}) - ID: ${r.syncProductId}`)
          })
      }

      // List failed products
      if (failed > 0) {
        console.log('\n❌ Failed products:')
        results
          .filter(r => !r.success)
          .forEach(r => {
            console.log(`   • ${r.category} - ${r.designName} (${r.productType}): ${r.error}`)
          })
      }

      console.log('\n🎯 Next Steps:')
      console.log('   1. Review products in Printful dashboard')
      console.log('   2. Check mockup quality')
      console.log('   3. Adjust pricing if needed')
      console.log('   4. Enable products for sale')
      console.log(`   5. Visit: https://www.printful.com/dashboard/sync-products`)
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Helper function to display progress
function showProgress(current: number, total: number, message: string) {
  const percentage = Math.round((current / total) * 100)
  const barLength = 30
  const filledLength = Math.round((percentage / 100) * barLength)
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

  process.stdout.write(`\r[${bar}] ${percentage}% - ${message}`)

  if (current === total) {
    console.log('') // New line when complete
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})