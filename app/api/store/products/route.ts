import { NextResponse } from 'next/server'
import { printfulClient } from '@/lib/printful-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Get catalog products from Printful V2 API
 *
 * Categories:
 * - 24 = Posters
 * - 29 = Canvas Prints
 * - 10 = T-shirts & Apparel
 * - 19 = Mugs
 * - 26 = Home & Living
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Map categories to Printful IDs
    const categoryMap: Record<string, number> = {
      'posters': 24,
      'canvas': 29,
      'apparel': 10,
      'mugs': 19,
      'home': 26,
    }

    const categoryId = category ? categoryMap[category] : undefined

    console.log(`Fetching catalog products${categoryId ? ` for category ${category}` : ''}`)

    // Fetch catalog products
    const products = await printfulClient.getCatalogProducts({
      category_id: categoryId,
      limit: 100,
    })

    console.log(`✅ Fetched ${products.length} products from Printful`)

    // Fetch variants and prices for each product
    const productsWithDetails = await Promise.all(
      products.slice(0, 20).map(async (product) => {
        try {
          // Get variants (sizes/colors)
          const variants = await printfulClient.getCatalogVariants(product.id)

          // Get first variant's price as reference
          const firstVariantPrice = variants.length > 0
            ? await printfulClient.getVariantPrice(variants[0].id)
            : null

          return {
            id: product.id,
            title: product.title,
            brand: product.brand || 'Unknown',
            model: product.model || '',
            description: product.description || '',
            type: product.type_name || product.type || 'Product',
            image: variants[0]?.image || null,
            basePrice: firstVariantPrice?.price || '0',
            currency: firstVariantPrice?.currency || 'USD',
            variantCount: variants.length,
            variants: variants.slice(0, 5).map(v => ({
              id: v.id,
              name: v.name,
              size: v.size || '',
              color: v.color || '',
              image: v.image,
            })),
          }
        } catch (error) {
          console.error(`Failed to fetch details for product ${product.id}:`, error)
          return null
        }
      })
    )

    // Filter out failed products
    const validProducts = productsWithDetails.filter(p => p !== null)

    console.log(`📦 Returning ${validProducts.length} valid products out of ${products.length} total`)
    if (validProducts.length > 0) {
      console.log('Sample product structure:', JSON.stringify(validProducts[0], null, 2))
    }

    return NextResponse.json({
      success: true,
      products: validProducts,
      count: validProducts.length,
      total: products.length,
    })
  } catch (error) {
    console.error('Printful catalog error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch catalog',
        details: 'Check API credentials: PRINTFUL_API_KEY and PRINTFUL_STORE_ID',
      },
      { status: 500 }
    )
  }
}
