import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/affiliate-products'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/ProductSchema'
import { LuxuryProductDetail } from '@/components/shop/luxury-product-detail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const priceHint = product.originalPrice
    ? `$${product.price} (${discount}% off)`
    : `$${product.price}`

  const seoTitle = `${product.name} Review 2025 - ${priceHint} | Brandon Mills`
  const seoDescription = `${product.description.slice(0, 120)}... Rating: ${product.rating}/5 (${product.reviewCount} reviews). ${product.benefits[0]}.`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.name,
      product.brand,
      `${product.category} 2025`,
      'review',
      'best ' + product.category,
      product.brand + ' products',
      'premium ' + product.category
    ],
    openGraph: {
      title: `${product.name} - ${product.brand}`,
      description: seoDescription,
      type: 'website',
      url: `https://brandonmills.com/shop/${product.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.brand}`,
      description: product.description.slice(0, 140),
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Generate the full product URL for schema
  const productUrl = `https://brandonmills.com/shop/${product.slug}`

  return (
    <>
      {/* SEO Schema Markup for Google Rich Snippets */}
      <ProductSchema product={product} url={productUrl} />
      <BreadcrumbSchema product={product} />

      {/* Navigation Breadcrumb */}
      <div className="fixed top-8 left-8 z-50">
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#63692B] text-[#F2EFE7] text-xs tracking-[0.3em] uppercase font-medium hover:bg-charcoal transition-colors duration-300"
        >
          ← Back to Shop
        </Link>
      </div>

      {/* Luxury Product Detail Component */}
      <LuxuryProductDetail product={product} />
    </>
  )
}
