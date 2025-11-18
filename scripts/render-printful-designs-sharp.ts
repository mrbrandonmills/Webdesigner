#!/usr/bin/env npx tsx

/**
 * Render Printful Designs Script (Sharp Version)
 * Batch renders all designs from the theme factory into print-ready files
 * Uses pure Sharp for stability
 */

import { DesignRendererSharp } from '../lib/design-renderer-sharp'
import { contentThemes } from '../lib/store-curator'
import * as fs from 'fs/promises'

interface RenderStats {
  category: string
  theme: string
  variantsRendered: number
  timeMs: number
  errors: string[]
}

async function renderAllDesigns(): Promise<void> {
  console.log('🎨 Rendering Printful Designs (Sharp Engine)...')
  console.log('=' .repeat(60))

  const startTime = Date.now()
  const stats: RenderStats[] = []

  // Categories to process
  const categories: Array<'poetry' | 'photography' | 'philosophy'> = [
    'poetry',
    'photography',
    'philosophy',
  ]

  for (const category of categories) {
    console.log(`\n📁 ${category.toUpperCase()} THEMES`)
    console.log('─'.repeat(50))

    const themes = contentThemes[category]
    const themeIds = Object.keys(themes)

    for (const themeId of themeIds) {
      const themeStartTime = Date.now()
      const errors: string[] = []
      const themeName = themes[themeId as keyof typeof themes].name

      console.log(`\n🎨 ${themeName} (${themeId})`)

      try {
        // Render all variants for this theme
        const renderedPaths = await DesignRendererSharp.renderAllVariants(
          category,
          themeId
        )

        const timeMs = Date.now() - themeStartTime

        console.log(`⏱️  Completed in ${timeMs}ms (${renderedPaths.length} variants)`)

        stats.push({
          category,
          theme: themeId,
          variantsRendered: renderedPaths.length,
          timeMs,
          errors,
        })

        // Small delay to prevent system overload
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        errors.push(errorMessage)

        console.error(`❌ Failed: ${errorMessage}`)

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
  await DesignRendererSharp.generateManifest()

  // Print summary statistics
  const totalTime = Date.now() - startTime
  const totalDesigns = stats.reduce((sum, stat) => sum + stat.variantsRendered, 0)
  const successfulThemes = stats.filter(stat => stat.errors.length === 0)
  const failedThemes = stats.filter(stat => stat.errors.length > 0)

  console.log('\n' + '═'.repeat(60))
  console.log('📊 RENDERING COMPLETE')
  console.log('═'.repeat(60))

  // Category breakdown
  for (const category of categories) {
    const categoryStats = stats.filter(s => s.category === category)
    const categoryTotal = categoryStats.reduce((sum, stat) => sum + stat.variantsRendered, 0)
    console.log(`\n${category.toUpperCase()}:`)
    console.log(`  Themes: ${categoryStats.length}`)
    console.log(`  Designs: ${categoryTotal}`)
  }

  console.log(`\n✨ Overall Summary:`)
  console.log(`   Total designs rendered: ${totalDesigns}`)
  console.log(`   Successful themes: ${successfulThemes.length}/${stats.length}`)
  console.log(`   Total time: ${(totalTime / 1000).toFixed(2)} seconds`)
  console.log(`   Average per theme: ${(totalTime / stats.length / 1000).toFixed(2)} seconds`)

  if (failedThemes.length > 0) {
    console.log(`\n⚠️  Failed Themes:`)
    failedThemes.forEach(stat => {
      console.log(`   - ${stat.category}/${stat.theme}: ${stat.errors.join(', ')}`)
    })
  }

  // Storage stats
  try {
    const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
    const manifestContent = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    console.log(`\n💾 Storage Statistics:`)
    console.log(`   Total size: ${manifest.totalSizeMB} MB`)
    console.log(`   Average per design: ${(manifest.totalSizeBytes / manifest.totalDesigns / 1024).toFixed(0)} KB`)

    // Show some example files
    console.log(`\n📄 Sample Files Generated:`)
    const sampleCategories = Object.keys(manifest.categories)
    for (const cat of sampleCategories.slice(0, 2)) {
      const themes = Object.keys(manifest.categories[cat])
      if (themes.length > 0) {
        const firstTheme = themes[0]
        const files = manifest.categories[cat][firstTheme]
        if (files && files.length > 0) {
          console.log(`   ${cat}/${firstTheme}:`)
          files.slice(0, 2).forEach((file: any) => {
            console.log(`     - ${file.file} (${file.sizeMB} MB)`)
          })
        }
      }
    }
  } catch (error) {
    // Manifest might not exist on first run
  }

  console.log(`\n✅ All designs are ready for Printful upload!`)
  console.log(`   Output: /public/designs/rendered/`)
  console.log(`   Manifest: /public/designs/rendered/manifest.json`)
  console.log(`\n🚀 Next steps:`)
  console.log(`   1. Review designs in /public/designs/rendered/`)
  console.log(`   2. Upload to Printful via API or dashboard`)
  console.log(`   3. Map designs to products in Shopify`)
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