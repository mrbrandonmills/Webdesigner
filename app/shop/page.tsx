import { Metadata } from 'next'
import { ShopPageClient } from './shop-client'
import { affiliateProducts } from '@/lib/affiliate-products'
import { mergeShopProducts } from '@/lib/shop-merger'
import themeFactoryProducts from '@/public/data/theme-factory-products.json'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateAggregateOfferSchema, generateBreadcrumbSchema } from '@/lib/json-ld'
import { UnifiedProduct } from '@/lib/types/shop'

// Force dynamic rendering to avoid build-time API fetch issues
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop Luxury Canvas Prints & Sacred Geometry Art | Brandon Mills',
  description: 'Shop museum-quality luxury canvas prints featuring sacred geometry art, philosophy books on self-actualization, and premium curated products. Free shipping on select items.',
  keywords: [
    'luxury canvas prints',
    'sacred geometry art',
    'museum quality prints',
    'philosophy books',
    'self-actualization books',
    'premium merchandise',
    'Brandon Mills shop',
    'art prints',
    'canvas wall art',
    'geometric art',
    'spiritual art',
    'meditation products',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/shop',
  },
  openGraph: {
    title: 'Shop Luxury Canvas Prints & Sacred Geometry Art | Brandon Mills',
    description: 'Museum-quality luxury canvas prints, sacred geometry art, philosophy books, and premium curated products.',
    type: 'website',
    url: 'https://brandonmills.com/shop',
    siteName: 'Brandon Mills',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills Shop - Luxury Canvas Prints & Sacred Geometry Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Luxury Canvas Prints & Sacred Geometry Art | Brandon Mills',
    description: 'Museum-quality luxury canvas prints, sacred geometry art, and philosophy books.',
    images: ['https://brandonmills.com/og-image.jpg'],
  },
}

// Transform theme factory products to match RawPrintfulProduct interface
function transformThemeFactoryProducts(products: typeof themeFactoryProducts.products) {
  return products.map(p => ({
    id: p.syncProductId || `tf-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
    title: p.name,
    description: `Premium ${p.category} product from our exclusive collection.`,
    basePrice: p.price,
    price: p.price,
    currency: 'USD',
    image: p.image,
    images: [p.image],
    syncProductId: p.syncProductId,
    type: p.category,
    category: p.category,
    featured: true,
    inStock: true,
    source: 'local-curated'
  }))
}

async function getProducts() {
  try {
    // Fetch Printful products from API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const printfulRes = await fetch(`${baseUrl}/api/store/products`, {
      cache: 'no-store',
    })

    let printfulProducts = []
    if (printfulRes.ok) {
      const printfulData = await printfulRes.json()
      printfulProducts = printfulData.products || []
    }

    // Transform theme factory products to match expected interface
    const transformedThemeProducts = transformThemeFactoryProducts(themeFactoryProducts.products)

    // Create a set of sync product IDs from theme factory products
    const themeFactorySyncIds = new Set(
      transformedThemeProducts.map(p => p.syncProductId).filter(id => id)
    )

    // Filter out Printful API products that already exist in theme factory
    // This avoids duplicates while maintaining local images for speed
    const uniquePrintfulProducts = printfulProducts.filter(
      (product: any) => !themeFactorySyncIds.has(product.syncProductId)
    )

    // Combine theme factory products with unique Printful API products
    // Theme factory products take precedence (they have local images for faster loading)
    const allPrintfulProducts = [...transformedThemeProducts, ...uniquePrintfulProducts]

    // Merge with Amazon affiliate products
    return mergeShopProducts(allPrintfulProducts, affiliateProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to theme factory + Amazon products if API fails
    const transformedThemeProducts = transformThemeFactoryProducts(themeFactoryProducts.products)
    return mergeShopProducts(transformedThemeProducts, affiliateProducts)
  }
}

// Generate ItemList schema for product collection
function generateItemListSchema(products: UnifiedProduct[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Brandon Mills Shop Collection',
    description: 'Museum-quality products including custom merchandise, philosophy books, and premium tech',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.image.startsWith('http')
          ? product.image
          : `https://brandonmills.com${product.image}`,
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: product.currency || 'USD',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        ...(product.rating && product.reviewCount ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        } : {}),
      },
    })),
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  // Calculate price range for aggregate offer
  const prices = products.map(p => p.price).filter(p => p > 0)
  const lowPrice = Math.min(...prices)
  const highPrice = Math.max(...prices)

  // Generate structured data
  const aggregateOfferSchema = generateAggregateOfferSchema({
    name: 'Brandon Mills Shop Collection',
    description: 'Museum-quality products: custom merchandise, philosophy books, premium tech. Every item tells a story.',
    lowPrice,
    highPrice,
    offerCount: products.length,
    image: '/og-image.jpg',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
  ])

  const itemListSchema = generateItemListSchema(products)

  return (
    <>
      <JsonLd data={[aggregateOfferSchema, breadcrumbSchema, itemListSchema]} />
      <ShopPageClient products={products} />
    </>
  )
}
