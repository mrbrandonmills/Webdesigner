import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import themeFactoryProducts from '@/public/data/theme-factory-products.json'
import { PrintfulProductDetail } from './product-detail-client'

export const dynamic = 'force-dynamic'

// Parse slug to extract product ID
function parseSlug(slug: string): { id: string; title: string } {
  // Slug format: product-name-id
  const parts = slug.split('-')
  const id = parts[parts.length - 1]
  const title = parts.slice(0, -1).join('-')
  return { id, title }
}

// Get product data from theme factory
function getProductById(id: string) {
  // Check theme factory products
  const product = themeFactoryProducts.products.find(
    (p) => String(p.syncProductId) === id ||
           `tf-${p.name.toLowerCase().replace(/\s+/g, '-')}` === id
  )

  if (!product) return null

  // Transform to full product data
  return {
    id: String(product.syncProductId || id),
    title: product.name,
    category: product.category,
    image: product.image,
    price: parseFloat(product.price),
    syncProductId: product.syncProductId,
    source: 'printful' as const,
    // Derive product type from name
    productType: getProductType(product.name),
    // Derive tags from category
    tags: [product.category],
    description: getProductDescription(product.name, product.category),
    inStock: true,
    featured: true,
  }
}

function getProductType(name: string): string {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('mug')) return 'mug'
  if (nameLower.includes('t-shirt') || nameLower.includes('tshirt')) return 'tshirt'
  if (nameLower.includes('hoodie')) return 'hoodie'
  if (nameLower.includes('tote') || nameLower.includes('bag')) return 'totebag'
  if (nameLower.includes('phone') || nameLower.includes('case')) return 'phone-case'
  if (nameLower.includes('framed') || nameLower.includes('wall')) return 'wall-art'
  if (nameLower.includes('poster') || nameLower.includes('print')) return 'poster'
  return 'poster'
}

function getProductDescription(name: string, category: string): string {
  const descriptions: Record<string, string> = {
    poetry: 'Original poetry from "Fine Lines" collection, featuring carefully crafted verses that explore the boundaries between chaos and order. Each piece is museum-quality printed on premium materials.',
    photography: 'Professional photography capturing moments of beauty and contemplation. High-resolution prints on archival-quality materials, perfect for modern spaces.',
    philosophy: 'Thoughtful designs inspired by philosophical concepts and the journey of self-actualization. Premium quality for the thoughtful collector.',
  }

  return descriptions[category] || `Premium ${category} product from the Brandon Mills collection. Museum-quality craftsmanship meets artistic expression.`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { id } = parseSlug(slug)
  const product = getProductById(id)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.title} | Brandon Mills Shop`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: 'website',
      images: [{ url: product.image.startsWith('http') ? product.image : `https://brandonmills.com${product.image}` }],
    },
  }
}

export default async function PrintfulProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { id } = parseSlug(slug)
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <section className="pt-32 pb-8 container-wide">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/shop"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase inline-block transition-all hover:tracking-[0.4em]"
          >
            ← Back to Shop
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <Suspense fallback={<ProductSkeleton />}>
        <PrintfulProductDetail product={product} />
      </Suspense>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <section className="pb-20 container-wide">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white/5 animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 bg-white/10 animate-pulse w-1/3" />
            <div className="h-12 bg-white/10 animate-pulse w-2/3" />
            <div className="h-24 bg-white/5 animate-pulse" />
            <div className="h-16 bg-white/10 animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    </section>
  )
}
