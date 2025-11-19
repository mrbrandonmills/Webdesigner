import { Metadata } from 'next'
import { ShopPageClient } from './shop-client'
import { affiliateProducts } from '@/lib/affiliate-products'
import { mergeShopProducts } from '@/lib/shop-merger'
import themeFactoryProducts from '@/public/data/theme-factory-products.json'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateAggregateOfferSchema, generateBreadcrumbSchema } from '@/lib/json-ld'
import { UnifiedProduct } from '@/lib/types/shop'

export const metadata: Metadata = {
  title: 'Shop | Brandon Mills',
  description: 'Museum-quality products: custom merchandise, philosophy books, premium tech. Every item tells a story.',
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

    // Create a set of sync product IDs from theme factory products
    const themeFactorySyncIds = new Set(
      themeFactoryProducts.products.map(p => p.syncProductId).filter(id => id)
    )

    // Filter out Printful API products that already exist in theme factory
    // This avoids duplicates while maintaining local images for speed
    const uniquePrintfulProducts = printfulProducts.filter(
      (product: any) => !themeFactorySyncIds.has(product.syncProductId)
    )

    // Combine theme factory products with unique Printful API products
    // Theme factory products take precedence (they have local images for faster loading)
    const allPrintfulProducts = [...themeFactoryProducts.products, ...uniquePrintfulProducts]

    // Merge with Amazon affiliate products
    return mergeShopProducts(allPrintfulProducts, affiliateProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to theme factory + Amazon products if API fails
    return mergeShopProducts(themeFactoryProducts.products, affiliateProducts)
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
