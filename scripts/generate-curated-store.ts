/**
 * Generate Curated Store
 * Standalone script to populate the store with intentional products
 */

import { StoreCurator } from '../lib/store-curator'
import { DesignGenerator } from '../lib/design-generator'
import { writeFile } from 'fs/promises'
import path from 'path'

interface CuratedProduct {
  id: string
  title: string
  description: string
  price: string
  themeId: string
  productType: string
  designUrl: string
  mockupUrl: string
  printfulProductId: number
  tags: string[]
  createdAt: string
  priority: number
  reasoning: string
}

function formatProductType(type: string): string {
  const formatted: Record<string, string> = {
    'framed-poster': 'Framed Poster',
    'premium-framed-poster': 'Premium Framed Poster',
    'large-canvas': 'Large Canvas',
    'canvas': 'Canvas Print',
    'greeting-cards': 'Greeting Card',
    'greeting-card-sets': 'Card Set (5)',
    'luxury-greeting-cards': 'Luxury Card',
    'postcards': 'Postcard',
    'educational-prints': 'Educational Print',
  }

  return formatted[type] || type
}

async function generateCuratedStore() {
  console.log('🎨 Starting curated store generation...\n')

  // Get all curated recommendations
  const recommendations = StoreCurator.getCuratedCollection()

  console.log(`📋 Curator selected ${recommendations.length} products\n`)

  // Generate designs
  const curatedProducts: CuratedProduct[] = []

  for (const rec of recommendations) {
    console.log(`🎨 ${rec.themeName} → ${rec.productType}`)

    let designSvg: string

    // Generate design based on content type
    if (rec.contentId.startsWith('poetry-')) {
      const poemId = rec.contentId.replace('poetry-', '')
      designSvg = DesignGenerator.generatePoetryDesign(poemId, rec.productType)
    } else if (rec.contentId.startsWith('photo-')) {
      const photoId = rec.contentId.replace('photo-', '')
      designSvg = DesignGenerator.generatePhotographyFrame(photoId)
    } else if (rec.contentId.startsWith('essay-')) {
      const essayId = rec.contentId.replace('essay-', '')
      designSvg = DesignGenerator.generatePhilosophyDesign(essayId, rec.productType)
    } else {
      console.warn(`❌ Unknown content type: ${rec.contentId}`)
      continue
    }

    const designUrl = DesignGenerator.svgToDataUrl(designSvg)

    const product: CuratedProduct = {
      id: `${rec.themeId}-${rec.productType}`,
      title: `${rec.themeName} — ${formatProductType(rec.productType)}`,
      description: rec.reasoning,
      price: rec.estimatedPrice,
      themeId: rec.themeId,
      productType: rec.productType,
      designUrl,
      mockupUrl: designUrl,
      printfulProductId: StoreCurator.getPrintfulProductId(rec.productType),
      tags: [
        rec.themeId.split('-')[0],
        rec.productType,
        rec.targetMarket.split(',')[0].trim().toLowerCase(),
      ],
      createdAt: new Date().toISOString(),
      priority: rec.priority,
      reasoning: rec.reasoning,
    }

    curatedProducts.push(product)
    console.log(`   ✅ Priority ${product.priority} | $${product.price}`)
  }

  console.log(`\n📦 Generated ${curatedProducts.length} curated products`)

  // Sort by priority
  curatedProducts.sort((a, b) => b.priority - a.priority)

  // Write to file
  const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

  await writeFile(
    filePath,
    JSON.stringify({ products: curatedProducts }, null, 2),
    'utf-8'
  )

  console.log(`\n✨ Curated store saved to: ${filePath}`)

  // Print summary
  console.log('\n📊 Summary:')
  console.log(`   Total: ${curatedProducts.length} products`)

  const byType = curatedProducts.reduce((acc, p) => {
    acc[p.productType] = (acc[p.productType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n   By Type:')
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`   - ${formatProductType(type)}: ${count}`)
  })

  const byTheme = curatedProducts.reduce((acc, p) => {
    const theme = p.themeId.split('-').slice(0, 2).join(' ')
    acc[theme] = (acc[theme] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n   By Theme:')
  Object.entries(byTheme).forEach(([theme, count]) => {
    console.log(`   - ${theme}: ${count}`)
  })

  console.log('\n🎉 Done! Your store now has intentional products with meaning.\n')
}

generateCuratedStore().catch(console.error)
