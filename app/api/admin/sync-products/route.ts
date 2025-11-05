import { NextResponse } from 'next/server'
import { printfulClient } from '@/lib/printful-client'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Admin API for managing Printful sync products
 * GET: List all sync products
 * DELETE: Delete sync products
 * POST: Sync products with local database
 */

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
  printfulSyncProductId?: number
  printfulSyncVariantId?: number
  tags: string[]
  createdAt: string
}

/**
 * GET: List all sync products with detailed information
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDetails = searchParams.get('details') === 'true'

    console.log('📋 Fetching sync products from Printful...')

    // Get all sync products
    const syncProducts = await printfulClient.getSyncProducts({ limit: 100 })

    if (!includeDetails) {
      // Return basic list
      return NextResponse.json({
        success: true,
        count: syncProducts.length,
        products: syncProducts.map(p => ({
          id: p.id,
          external_id: p.external_id,
          name: p.name,
          thumbnail: p.thumbnail_url,
          synced: p.synced,
          is_ignored: p.is_ignored
        }))
      })
    }

    // Fetch detailed information for each product
    console.log('📦 Fetching detailed information for sync products...')

    const detailedProducts = await Promise.all(
      syncProducts.map(async (product) => {
        try {
          const fullProduct = await printfulClient.getSyncProduct(product.id)

          return {
            id: product.id,
            external_id: product.external_id,
            name: product.name,
            thumbnail: product.thumbnail_url,
            synced: product.synced,
            is_ignored: product.is_ignored,
            variants: fullProduct.sync_variants?.map(v => ({
              id: v.id,
              name: v.name,
              variant_id: v.variant_id,
              retail_price: v.retail_price,
              currency: v.currency,
              sku: v.sku,
              files: v.files?.map(f => ({
                type: f.type,
                url: f.url,
                preview_url: f.preview_url,
                thumbnail_url: f.thumbnail_url
              }))
            })) || []
          }
        } catch (error) {
          console.error(`Failed to fetch details for product ${product.id}:`, error)
          return {
            id: product.id,
            external_id: product.external_id,
            name: product.name,
            thumbnail: product.thumbnail_url,
            synced: product.synced,
            is_ignored: product.is_ignored,
            variants: [],
            error: 'Failed to fetch details'
          }
        }
      })
    )

    console.log(`✅ Retrieved ${detailedProducts.length} sync products`)

    return NextResponse.json({
      success: true,
      count: detailedProducts.length,
      products: detailedProducts
    })
  } catch (error) {
    console.error('Failed to list sync products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list sync products'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Delete one or more sync products
 * Body: { productIds: number[] } or { productId: number }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const productIds = body.productIds || (body.productId ? [body.productId] : [])

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No product IDs provided'
        },
        { status: 400 }
      )
    }

    console.log(`🗑️ Deleting ${productIds.length} sync products...`)

    const results = await Promise.all(
      productIds.map(async (id: number) => {
        try {
          await printfulClient.deleteSyncProduct(id)
          console.log(`✅ Deleted sync product ${id}`)
          return { id, success: true }
        } catch (error) {
          console.error(`❌ Failed to delete sync product ${id}:`, error)
          return { id, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })
    )

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    // Update local curated products to remove sync product references
    try {
      const filePath = path.join(process.cwd(), 'data', 'curated-products.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const data = JSON.parse(fileContent) as { products: CuratedProduct[] }

      // Clear sync IDs for deleted products
      data.products = data.products.map(p => {
        if (p.printfulSyncProductId && productIds.includes(p.printfulSyncProductId)) {
          return {
            ...p,
            printfulSyncProductId: undefined,
            printfulSyncVariantId: undefined
          }
        }
        return p
      })

      await writeFile(filePath, JSON.stringify(data, null, 2))
      console.log('✅ Updated local product database')
    } catch (error) {
      console.error('Failed to update local database:', error)
    }

    return NextResponse.json({
      success: successCount > 0,
      deleted: successCount,
      failed: failCount,
      results
    })
  } catch (error) {
    console.error('Failed to delete sync products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete sync products'
      },
      { status: 500 }
    )
  }
}

/**
 * POST: Sync local products with Printful or refresh mockups
 * Body: { action: 'sync' | 'refresh-mockups', productIds?: number[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, productIds } = body

    if (action === 'refresh-mockups') {
      // Refresh mockups for specified products
      if (!productIds || productIds.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No product IDs provided for mockup refresh'
          },
          { status: 400 }
        )
      }

      console.log(`🎨 Refreshing mockups for ${productIds.length} products...`)

      const results = await Promise.all(
        productIds.map(async (id: number) => {
          try {
            const product = await printfulClient.getSyncProduct(id)
            const firstVariant = product.sync_variants?.[0]

            if (!firstVariant || !firstVariant.files?.[0]) {
              return { id, success: false, error: 'No design file found' }
            }

            // Generate new mockup
            const mockupTask = await printfulClient.generateMockup({
              variant_ids: [firstVariant.variant_id],
              format: 'jpg',
              files: [
                {
                  placement: firstVariant.files[0].type || 'default',
                  image_url: firstVariant.files[0].url
                }
              ]
            })

            const mockupResult = await printfulClient.getMockupResult(mockupTask.task_key)
            const mockupUrl = mockupResult.result.mockups?.[0]?.mockup_url

            console.log(`✅ Refreshed mockup for product ${id}`)
            return { id, success: true, mockupUrl }
          } catch (error) {
            console.error(`❌ Failed to refresh mockup for product ${id}:`, error)
            return { id, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
          }
        })
      )

      return NextResponse.json({
        success: true,
        results
      })
    }

    if (action === 'sync') {
      // Sync local curated products with Printful
      console.log('🔄 Syncing local products with Printful...')

      const filePath = path.join(process.cwd(), 'data', 'curated-products.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const data = JSON.parse(fileContent) as { products: CuratedProduct[] }

      // Find products without sync IDs
      const unsyncedProducts = data.products.filter(p => !p.printfulSyncProductId && p.designUrl)

      if (unsyncedProducts.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'All products are already synced',
          syncedCount: 0
        })
      }

      console.log(`📤 Found ${unsyncedProducts.length} products to sync`)

      const syncResults = await Promise.all(
        unsyncedProducts.map(async (product) => {
          try {
            // Map product type to variant ID
            const variantMap: Record<string, number> = {
              'poster-small': 1349,
              'poster-medium': 1,
              'poster-large': 2,
              'canvas-small': 6578,
              'tshirt': 4012
            }

            const variantId = variantMap[product.productType] || 1

            const { product: syncProduct, mockupUrl } = await printfulClient.createProductWithDesign({
              name: product.title,
              designUrl: product.designUrl,
              productId: product.printfulProductId,
              variantId: variantId,
              retailPrice: product.price,
              externalId: product.id
            })

            // Update local product with sync IDs
            product.printfulSyncProductId = syncProduct.id
            product.printfulSyncVariantId = syncProduct.sync_variants?.[0]?.id
            if (mockupUrl) {
              product.mockupUrl = mockupUrl
            }

            console.log(`✅ Synced product: ${product.title}`)
            return { id: product.id, success: true, syncProductId: syncProduct.id }
          } catch (error) {
            console.error(`❌ Failed to sync product ${product.id}:`, error)
            return { id: product.id, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
          }
        })
      )

      // Save updated products
      await writeFile(filePath, JSON.stringify(data, null, 2))

      const successCount = syncResults.filter(r => r.success).length

      return NextResponse.json({
        success: true,
        message: `Synced ${successCount} of ${unsyncedProducts.length} products`,
        syncedCount: successCount,
        results: syncResults
      })
    }

    // Check sync status
    if (action === 'status') {
      console.log('📊 Checking sync status...')

      // Get Printful sync products
      const syncProducts = await printfulClient.getSyncProducts({ limit: 100 })

      // Get local products
      const filePath = path.join(process.cwd(), 'data', 'curated-products.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const data = JSON.parse(fileContent) as { products: CuratedProduct[] }

      const status = {
        printfulSyncProducts: syncProducts.length,
        localProducts: data.products.length,
        syncedLocalProducts: data.products.filter(p => p.printfulSyncProductId).length,
        unsyncedLocalProducts: data.products.filter(p => !p.printfulSyncProductId).length,
        orphanedSyncProducts: syncProducts.filter(sp =>
          !data.products.some(lp => lp.printfulSyncProductId === sp.id)
        ).map(p => ({
          id: p.id,
          external_id: p.external_id,
          name: p.name
        }))
      }

      return NextResponse.json({
        success: true,
        status
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: `Invalid action: ${action}. Use 'sync', 'refresh-mockups', or 'status'`
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Sync products error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync products'
      },
      { status: 500 }
    )
  }
}