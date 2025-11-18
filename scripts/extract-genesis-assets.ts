#!/usr/bin/env tsx
/**
 * Genesis Asset Extraction Script
 *
 * Scans the Genesis photography directories and creates a manifest
 * of all available photos grouped by category (editorial, campaigns, runway).
 * This manifest will be used by the theme factory to assign real photos
 * to product designs.
 */

import fs from 'fs/promises'
import path from 'path'
import { fullyDevelopedStories } from '../lib/genesis-stories'

interface PhotoManifest {
  totalPhotos: number
  categories: {
    [category: string]: string[]
  }
  storyPhotos: {
    [storyId: string]: string
  }
  amReedPhotos: string[]
  generatedAt: string
}

async function extractGenesisAssets() {
  console.log('🎨 Extracting Genesis photography assets...\n')

  const publicDir = path.join(process.cwd(), 'public')
  const genesisDir = path.join(publicDir, 'images/gallery/genesis')
  const amReedDir = path.join(publicDir, 'images/collaborations/am-reed-2024')

  const categories: { [key: string]: string[] } = {
    editorial: [],
    campaigns: [],
    runway: []
  }

  // Scan Genesis directories
  for (const category of Object.keys(categories)) {
    const categoryDir = path.join(genesisDir, category)
    try {
      const files = await fs.readdir(categoryDir)
      categories[category] = files
        .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
        .map(f => `/images/gallery/genesis/${category}/${f}`)
        .sort()

      console.log(`✅ ${category}: ${categories[category].length} photos`)
    } catch (error) {
      console.log(`⚠️  ${category}: directory not found`)
    }
  }

  // Scan AM Reed collaboration photos
  let amReedPhotos: string[] = []
  try {
    const files = await fs.readdir(amReedDir)
    amReedPhotos = files
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
      .map(f => `/images/collaborations/am-reed-2024/${f}`)
      .sort()
    console.log(`✅ am-reed-2024: ${amReedPhotos.length} photos`)
  } catch (error) {
    console.log(`⚠️  am-reed-2024: directory not found`)
  }

  // Extract photos from fully developed stories
  const storyPhotos: { [key: string]: string } = {}
  for (const story of fullyDevelopedStories) {
    storyPhotos[story.id] = story.src
    console.log(`✅ Story "${story.id}": ${story.src}`)
  }

  // Calculate total
  const totalPhotos =
    Object.values(categories).reduce((sum, arr) => sum + arr.length, 0) +
    amReedPhotos.length

  // Create manifest
  const manifest: PhotoManifest = {
    totalPhotos,
    categories,
    storyPhotos,
    amReedPhotos,
    generatedAt: new Date().toISOString()
  }

  // Ensure output directory exists
  const outputDir = path.join(publicDir, 'designs/genesis')
  await fs.mkdir(outputDir, { recursive: true })

  // Write manifest
  const manifestPath = path.join(outputDir, 'manifest.json')
  await fs.writeFile(
    manifestPath,
    JSON.stringify(manifest, null, 2)
  )

  console.log(`\n✨ Extraction complete!`)
  console.log(`📊 Total photos: ${totalPhotos}`)
  console.log(`📝 Manifest saved to: ${manifestPath}`)

  return manifest
}

extractGenesisAssets().catch(console.error)
