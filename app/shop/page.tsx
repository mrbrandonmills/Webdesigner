import { Metadata } from 'next'
import { ShopPageClient } from './shop-client'
import { getAllShopProducts, getProductMeta } from '@/lib/premium-products'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateAggregateOfferSchema, generateBreadcrumbSchema } from '@/lib/json-ld'
import { UnifiedProduct } from '@/lib/types/shop'

export const metadata: Metadata = {
  title: 'Shop Museum-Quality Art Prints | Brandon Mills',
  description: 'Curated collection of museum-quality fine art prints, gallery canvas, metal prints, and premium wall art. Fine Art Trade Guild approved. 100+ year color guarantee.',
  keywords: [
    'museum quality art prints',
    'fine art giclee prints',
    'gallery canvas prints',
    'metal wall art',
    'acrylic prints',
    'poetry art prints',
    'philosophy art',
    'fine art photography',
    'archival prints',
    'Brandon Mills art',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/shop',
  },
  openGraph: {
    title: 'Shop Museum-Quality Art Prints | Brandon Mills',
    description: 'Curated collection of museum-quality fine art prints. Fine Art Trade Guild approved with 100+ year color guarantee.',
    type: 'website',
    url: 'https://brandonmills.com/shop',
    siteName: 'Brandon Mills',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills Shop - Museum-Quality Art Prints',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Museum-Quality Art Prints | Brandon Mills',
    description: 'Curated collection of museum-quality fine art prints with 100+ year color guarantee.',
    images: ['https://brandonmills.com/og-image.jpg'],
  },
}

// Generate ItemList schema for product collection
function generateItemListSchema(products: UnifiedProduct[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Brandon Mills Art Collection',
    description: 'Museum-quality fine art prints, gallery canvas, and premium wall art',
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

export default function ShopPage() {
  // Get all products (premium + Amazon affiliate)
  const products = getAllShopProducts()
  const meta = getProductMeta()

  // Calculate price range for aggregate offer
  const prices = products.map(p => p.price).filter(p => p > 0)
  const lowPrice = Math.min(...prices)
  const highPrice = Math.max(...prices)

  // Generate structured data
  const aggregateOfferSchema = generateAggregateOfferSchema({
    name: 'Brandon Mills Art Collection',
    description: 'Museum-quality fine art prints, gallery canvas, metal prints, and premium wall art. Fine Art Trade Guild approved.',
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
