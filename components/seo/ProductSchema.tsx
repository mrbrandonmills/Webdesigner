import { AffiliateProduct } from '@/lib/affiliate-products'

interface ProductSchemaProps {
  product: AffiliateProduct
  url: string
}

/**
 * ProductSchema Component
 *
 * Generates JSON-LD structured data for Google rich snippets.
 * This improves SEO by enabling rich results in search with:
 * - Product name, image, and description
 * - Star ratings and review counts
 * - Price and availability information
 * - Brand information
 *
 * Google Rich Results Test: https://search.google.com/test/rich-results
 */
export function ProductSchema({ product, url }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    sku: product.id,
    productID: product.id,
    image: product.images.length > 0
      ? product.images.map(img => `https://brandonmills.com${img}`)
      : 'https://brandonmills.com/og-image.jpg', // Fallback to OG image
    offers: {
      '@type': 'Offer',
      url: url,
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      seller: {
        '@type': 'Organization',
        name: 'Brandon Mills',
        url: 'https://brandonmills.com',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    category: product.category,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

/**
 * BreadcrumbSchema Component
 *
 * Generates breadcrumb structured data for better navigation in search results.
 * Shows the page hierarchy: Home > Shop > Category > Product
 */
export function BreadcrumbSchema({ product }: { product: AffiliateProduct }) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://brandonmills.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://brandonmills.com/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category,
        item: `https://brandonmills.com/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `https://brandonmills.com/shop/${product.slug}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

/**
 * OrganizationSchema Component
 *
 * Defines the website owner/organization for knowledge graph.
 * Only needed once per site, but included for completeness.
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Brandon Mills',
    url: 'https://brandonmills.com',
    description: 'Polymath, designer, creator, and Renaissance individual exploring technology, philosophy, and creative pursuits.',
    sameAs: [
      // Add social media profiles when available
      // 'https://twitter.com/brandonmills',
      // 'https://linkedin.com/in/brandonmills',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
