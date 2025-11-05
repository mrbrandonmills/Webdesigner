import { NextResponse } from 'next/server'
import { printfulClient } from '@/lib/printful-client'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// In-memory cache with TTL
let productCache: {
  data: any
  timestamp: number
} | null = null

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
 * Get products from Printful sync products and local curated products
 * Priority order:
 * 1. Printful sync products (actual orderable products)
 * 2. Local curated products (fallback)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const forceRefresh = searchParams.get('refresh') === 'true'

    // Check cache first (unless force refresh)
    if (!forceRefresh && productCache && Date.now() - productCache.timestamp < CACHE_TTL) {
      console.log('📦 Returning cached products')
      return NextResponse.json(productCache.data)
    }

    console.log('🔄 Fetching fresh products from Printful and local storage...')

    const products = []

    // 1. Try to fetch sync products from Printful
    try {
      console.log('📥 Fetching sync products from Printful...')
      const syncProducts = await printfulClient.getSyncProducts({ limit: 100 })

      if (syncProducts && syncProducts.length > 0) {
        console.log(`✅ Found ${syncProducts.length} sync products on Printful`)

        // Fetch detailed info for each sync product
        const detailedProducts = await Promise.all(
          syncProducts.slice(0, 50).map(async (syncProduct) => {
            try {
              // Get full product with variants
              const fullProduct = await printfulClient.getSyncProduct(syncProduct.id)

              // Get the first variant for pricing and details
              const firstVariant = fullProduct.sync_variants?.[0]

              if (!firstVariant) return null

              return {
                id: syncProduct.external_id || `sync-${syncProduct.id}`,
                title: syncProduct.name,
                description: `Premium quality product from our exclusive collection.`,
                type: 'Custom Product',
                image: syncProduct.thumbnail_url || firstVariant.files?.[0]?.preview_url || null,
                basePrice: firstVariant.retail_price || '0',
                currency: firstVariant.currency || 'USD',
                syncProductId: syncProduct.id,
                syncVariantId: firstVariant.id,
                variantCount: fullProduct.sync_variants?.length || 1,
                variants: fullProduct.sync_variants?.slice(0, 5).map(v => ({
                  id: v.id,
                  name: v.name,
                  price: v.retail_price,
                  sku: v.sku,
                  image: v.files?.[0]?.preview_url || null
                })) || [],
                source: 'printful-sync'
              }
            } catch (error) {
              console.error(`Failed to fetch details for sync product ${syncProduct.id}:`, error)
              return null
            }
          })
        )

        // Add valid sync products
        const validSyncProducts = detailedProducts.filter(p => p !== null)
        products.push(...validSyncProducts)
        console.log(`✅ Processed ${validSyncProducts.length} valid sync products`)
      } else {
        console.log('⚠️ No sync products found on Printful')
      }
    } catch (error) {
      console.error('Failed to fetch sync products from Printful:', error)
    }

    // 2. Fetch local curated products as fallback/addition
    try {
      console.log('📂 Fetching local curated products...')
      const filePath = path.join(process.cwd(), 'data', 'curated-products.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const curatedData = JSON.parse(fileContent) as { products: CuratedProduct[] }

      if (curatedData.products && curatedData.products.length > 0) {
        console.log(`✅ Found ${curatedData.products.length} curated products locally`)

        // Transform curated products to match the API format
        const transformedCurated = curatedData.products.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.productType,
          image: p.mockupUrl || p.designUrl,
          basePrice: p.price,
          currency: 'USD',
          syncProductId: p.printfulSyncProductId || null,
          syncVariantId: p.printfulSyncVariantId || null,
          variantCount: 1,
          variants: [],
          tags: p.tags,
          source: 'local-curated',
          createdAt: p.createdAt
        }))

        // Only add curated products that don't have sync products yet
        // or if we have no sync products at all
        const curatedToAdd = products.length === 0
          ? transformedCurated // Add all if no sync products
          : transformedCurated.filter(c => !c.syncProductId) // Only non-synced ones

        products.push(...curatedToAdd)
        console.log(`✅ Added ${curatedToAdd.length} curated products`)
      }
    } catch (error) {
      console.log('No local curated products found or error reading file:', error)
    }

    // 3. If still no products, fetch catalog products as last resort
    if (products.length === 0) {
      console.log('⚠️ No sync or curated products found, fetching catalog products...')

      // Map categories to Printful IDs
      const categoryMap: Record<string, number> = {
        'posters': 24,
        'canvas': 29,
        'apparel': 10,
        'mugs': 19,
        'home': 26,
      }

      const categoryId = category ? categoryMap[category] : undefined

      const catalogProducts = await printfulClient.getCatalogProducts({
        category_id: categoryId,
        limit: 20,
      })

      // Fetch details for catalog products
      const catalogWithDetails = await Promise.all(
        catalogProducts.map(async (product) => {
          try {
            const variants = await printfulClient.getCatalogVariants(product.id)
            const firstVariantPrice = variants.length > 0
              ? await printfulClient.getVariantPrice(variants[0].id)
              : null

            return {
              id: `catalog-${product.id}`,
              title: product.title,
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
              source: 'printful-catalog'
            }
          } catch (error) {
            console.error(`Failed to fetch details for catalog product ${product.id}:`, error)
            return null
          }
        })
      )

      const validCatalogProducts = catalogWithDetails.filter(p => p !== null)
      products.push(...validCatalogProducts)
    }

    // Sort products: sync products first, then curated, then catalog
    products.sort((a, b) => {
      const sourceOrder = { 'printful-sync': 0, 'local-curated': 1, 'printful-catalog': 2 }
      return (sourceOrder[a.source as keyof typeof sourceOrder] || 3) -
             (sourceOrder[b.source as keyof typeof sourceOrder] || 3)
    })

    console.log(`📦 Returning ${products.length} total products`)
    console.log(`   Sources: ${products.reduce((acc, p) => {
      acc[p.source] = (acc[p.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)}`)

    const responseData = {
      success: true,
      products: products,
      count: products.length,
      sources: {
        syncProducts: products.filter(p => p.source === 'printful-sync').length,
        curatedProducts: products.filter(p => p.source === 'local-curated').length,
        catalogProducts: products.filter(p => p.source === 'printful-catalog').length,
      }
    }

    // Update cache
    productCache = {
      data: responseData,
      timestamp: Date.now()
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Store products API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        details: 'Check API credentials: PRINTFUL_API_KEY and PRINTFUL_STORE_ID',
      },
      { status: 500 }
    )
  }
}