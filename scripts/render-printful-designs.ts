#!/usr/bin/env npx tsx

/**
 * Render Printful Designs Script
 * Batch renders all designs from the theme factory into print-ready files
 */

import { DesignRenderer } from '../lib/design-renderer'
import { contentThemes } from '../lib/store-curator'
import * as fs from 'fs/promises'
import * as path from 'path'

interface RenderStats {
  category: string
  theme: string
  variantsRendered: number
  timeMs: number
  errors: string[]
}

async function renderAllDesigns(): Promise<void> {
  console.log('🎨 Rendering Printful Designs...\n')

  const startTime = Date.now()
  const stats: RenderStats[] = []

  // Categories to process
  const categories: Array<'poetry' | 'photography' | 'philosophy'> = [
    'poetry',
    'photography',
    'philosophy',
  ]

  for (const category of categories) {
    console.log(`\n${category.toUpperCase()} Themes:`)
    console.log('─'.repeat(50))

    const themes = contentThemes[category]
    const themeIds = Object.keys(themes)

    for (const themeId of themeIds) {
      const themeStartTime = Date.now()
      const errors: string[] = []

      try {
        // Render all variants for this theme
        const renderedPaths = await DesignRenderer.renderAllVariants(
          category,
          themeId
        )

        const timeMs = Date.now() - themeStartTime
        const themeName = themes[themeId as keyof typeof themes].name

        console.log(
          `✅ ${themeName} (${themeId}) → ${renderedPaths.length} variants (${timeMs}ms)`
        )

        stats.push({
          category,
          theme: themeId,
          variantsRendered: renderedPaths.length,
          timeMs,
          errors,
        })

        // Add a small delay between themes to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        errors.push(errorMessage)

        console.error(`❌ Failed to render ${themeId}: ${errorMessage}`)

        stats.push({
          category,
          theme: themeId,
          variantsRendered: 0,
          timeMs: Date.now() - themeStartTime,
          errors,
        })
      }
    }
  }

  // Generate manifest
  console.log('\n📝 Generating manifest...')
  await DesignRenderer.generateManifest()

  // Print summary statistics
  const totalTime = Date.now() - startTime
  const totalDesigns = stats.reduce((sum, stat) => sum + stat.variantsRendered, 0)
  const failedThemes = stats.filter(stat => stat.errors.length > 0)

  console.log('\n' + '═'.repeat(60))
  console.log('📊 RENDERING COMPLETE')
  console.log('═'.repeat(60))

  console.log(`\n✨ Summary:`)
  console.log(`   Total designs rendered: ${totalDesigns}`)
  console.log(`   Total themes processed: ${stats.length}`)
  console.log(`   Failed themes: ${failedThemes.length}`)
  console.log(`   Total time: ${(totalTime / 1000).toFixed(2)} seconds`)

  if (failedThemes.length > 0) {
    console.log(`\n⚠️  Failed Themes:`)
    failedThemes.forEach(stat => {
      console.log(`   - ${stat.category}/${stat.theme}: ${stat.errors.join(', ')}`)
    })
  }

  // Calculate and display storage stats
  try {
    const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
    const manifestContent = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    console.log(`\n💾 Storage:`)
    console.log(`   Total size: ${(manifest.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Average size per design: ${(manifest.totalSizeBytes / manifest.totalDesigns / 1024).toFixed(2)} KB`)
  } catch (error) {
    // Manifest might not exist on first run
  }

  console.log(`\n✅ All designs are ready for Printful upload!`)
  console.log(`   Output directory: /Volumes/Super Mastery/Webdesigner/public/designs/rendered/`)
  console.log(`   Manifest: /Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json`)
}

// Handle errors gracefully
process.on('unhandledRejection', (error: Error) => {
  console.error('\n❌ Unhandled error:', error)
  process.exit(1)
})

// Run the script
renderAllDesigns().catch(error => {
  console.error('\n❌ Script failed:', error)
  process.exit(1)
})