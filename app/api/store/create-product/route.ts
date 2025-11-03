import { NextResponse } from 'next/server'
import { printfulClient } from '@/lib/printful-client'

export const runtime = 'nodejs'
export const maxDuration = 60

interface CreateProductRequest {
  imageUrl: string
  productType: 'poster' | 'canvas' | 'tshirt' | 'hoodie' | 'mug'
  title: string
  price: string
}

/**
 * Create a Printful product from a portfolio image
 */
export async function POST(request: Request) {
  try {
    const { imageUrl, productType, title, price } = await request.json() as CreateProductRequest

    if (!imageUrl || !productType || !title || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Printful product variant IDs for different products
    // These are Printful's catalog IDs - get the latest from their API docs
    const productVariants = {
      poster: [
        { id: 1, variant_id: 1 }, // 18×24" poster
        { id: 1, variant_id: 2 }, // 24×36" poster
      ],
      canvas: [
        { id: 29, variant_id: 4438 }, // 16×20" canvas
        { id: 29, variant_id: 4440 }, // 24×36" canvas
      ],
      tshirt: [
        { id: 71, variant_id: 4011 }, // Bella Canvas 3001 - S
        { id: 71, variant_id: 4012 }, // Bella Canvas 3001 - M
        { id: 71, variant_id: 4013 }, // Bella Canvas 3001 - L
        { id: 71, variant_id: 4014 }, // Bella Canvas 3001 - XL
      ],
      hoodie: [
        { id: 146, variant_id: 7679 }, // Unisex Hoodie - S
        { id: 146, variant_id: 7680 }, // Unisex Hoodie - M
        { id: 146, variant_id: 7681 }, // Unisex Hoodie - L
        { id: 146, variant_id: 7682 }, // Unisex Hoodie - XL
      ],
      mug: [
        { id: 19, variant_id: 1317 }, // 11oz white mug
        { id: 19, variant_id: 1318 }, // 15oz white mug
      ],
    }

    const selectedVariants = productVariants[productType]

    if (!selectedVariants) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      )
    }

    // Create product in Printful
    console.log(`Creating ${productType} product: "${title}"`)

    const productData = {
      sync_product: {
        name: title,
        thumbnail: imageUrl,
      },
      sync_variants: selectedVariants.map(variant => ({
        variant_id: variant.variant_id,
        retail_price: price,
        files: [
          {
            url: imageUrl,
            type: productType === 'tshirt' || productType === 'hoodie' ? 'default' : 'preview',
            position: productType === 'tshirt' || productType === 'hoodie' ? 'front' : undefined,
          },
        ],
      })),
    }

    const result = await printfulClient.createProduct(productData)

    console.log('✅ Product created:', result.sync_product.id)

    return NextResponse.json({
      success: true,
      product: result,
      message: `Successfully created ${productType}: "${title}"`,
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    )
  }
}

/**
 * Get available product templates
 */
export async function GET() {
  try {
    const products = await printfulClient.getCatalogProducts()

    // Filter to most popular products for model/actor portfolio
    const popularProducts = products.filter((p: any) =>
      ['poster', 'canvas', 't-shirt', 'hoodie', 'mug', 'pillow'].some(type =>
        p.type?.toLowerCase().includes(type) || p.title?.toLowerCase().includes(type)
      )
    )

    return NextResponse.json({
      success: true,
      products: popularProducts,
      count: popularProducts.length,
    })
  } catch (error) {
    console.error('Failed to fetch product templates:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    )
  }
}
