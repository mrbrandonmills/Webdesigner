import { NextResponse } from 'next/server'
import { printfulClient } from '@/lib/printful-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Get all store products from Printful
 */
export async function GET() {
  try {
    const products = await printfulClient.getProducts()

    // Fetch full details for each product (includes variants and images)
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        try {
          const details = await printfulClient.getProduct(product.id.toString())
          return {
            id: product.id,
            external_id: product.external_id,
            name: product.name,
            thumbnail: product.thumbnail_url,
            variants: details.sync_variants.map(variant => ({
              id: variant.id,
              name: variant.name,
              price: variant.retail_price,
              currency: variant.currency,
              image: variant.files?.[0]?.preview_url || product.thumbnail_url,
              thumbnail: variant.files?.[0]?.thumbnail_url || product.thumbnail_url,
            })),
          }
        } catch (error) {
          console.error(`Failed to fetch product ${product.id}:`, error)
          return null
        }
      })
    )

    // Filter out failed products
    const validProducts = productsWithDetails.filter(p => p !== null)

    return NextResponse.json({
      success: true,
      products: validProducts,
      count: validProducts.length,
    })
  } catch (error) {
    console.error('Printful products error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}
