/**
 * Generate Curated Store
 * Uses AI curator + theme factory to create intentional products
 */

import { NextResponse } from 'next/server'
import { StoreCurator } from '@/lib/store-curator'
import { DesignGenerator } from '@/lib/design-generator'
import { writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

export async function POST() {
  try {
    console.log('🎨 Starting curated store generation...')

    // Get all curated recommendations from the curator
    const recommendations = StoreCurator.getCuratedCollection()

    console.log(`📋 Curator selected ${recommendations.length} products`)

    // Generate designs for each recommendation
    const curatedProducts: CuratedProduct[] = []

    for (const rec of recommendations) {
      console.log(`🎨 Generating design for: ${rec.themeName} (${rec.productType})`)

      let designSvg: string

      // Generate design based on content type
      if (rec.contentId.startsWith('poetry-')) {
        const poemId = rec.contentId.replace('poetry-', '')
        designSvg = DesignGenerator.generatePoetryDesign(poemId, rec.productType)
      } else if (rec.contentId.startsWith('photo-')) {
        // For photos, we'll use the actual photo + frame overlay
        const photoId = rec.contentId.replace('photo-', '')
        designSvg = DesignGenerator.generatePhotographyFrame(photoId)
      } else if (rec.contentId.startsWith('essay-')) {
        const essayId = rec.contentId.replace('essay-', '')
        designSvg = DesignGenerator.generatePhilosophyDesign(essayId, rec.productType)
      } else {
        console.warn(`Unknown content type: ${rec.contentId}`)
        continue
      }

      const designUrl = DesignGenerator.svgToDataUrl(designSvg)

      // Create product entry
      const product: CuratedProduct = {
        id: `${rec.themeId}-${rec.productType}`,
        title: `${rec.themeName} — ${formatProductType(rec.productType)}`,
        description: rec.reasoning,
        price: rec.estimatedPrice,
        themeId: rec.themeId,
        productType: rec.productType,
        designUrl,
        mockupUrl: designUrl, // For now, using design as mockup
        printfulProductId: StoreCurator.getPrintfulProductId(rec.productType),
        tags: [
          rec.themeId.split('-')[0], // e.g., 'fine' from 'fine-lines'
          rec.productType,
          rec.targetMarket.split(',')[0].trim().toLowerCase(),
        ],
        createdAt: new Date().toISOString(),
        priority: rec.priority,
        reasoning: rec.reasoning,
      }

      curatedProducts.push(product)
      console.log(`✅ Created product: ${product.title}`)
    }

    // Sort by priority
    curatedProducts.sort((a, b) => b.priority - a.priority)

    // Write to curated-products.json
    const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

    await writeFile(
      filePath,
      JSON.stringify({ products: curatedProducts }, null, 2),
      'utf-8'
    )

    console.log(`📦 Wrote ${curatedProducts.length} curated products to file`)

    return NextResponse.json({
      success: true,
      message: `Generated ${curatedProducts.length} curated products`,
      products: curatedProducts.map(p => ({
        id: p.id,
        title: p.title,
        type: p.productType,
        priority: p.priority,
      })),
      summary: {
        total: curatedProducts.length,
        byType: curatedProducts.reduce((acc, p) => {
          acc[p.productType] = (acc[p.productType] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byTheme: curatedProducts.reduce((acc, p) => {
          const theme = p.themeId.split('-')[0]
          acc[theme] = (acc[theme] || 0) + 1
          return acc
        }, {} as Record<string, number>),
      },
    })
  } catch (error) {
    console.error('Failed to generate curated store:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate curated store',
      },
      { status: 500 }
    )
  }
}

/**
 * Format product type for display
 */
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
