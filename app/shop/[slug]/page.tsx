import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Star, Check, ShoppingBag, Award, Shield, Clock } from 'lucide-react'
import { getProductBySlug } from '@/lib/affiliate-products'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Shop | Brandon Mills`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <section className="pt-32 pb-12 container-wide">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/shop"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase inline-block transition-all hover:tracking-[0.4em]"
          >
            ← Back to Shop
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="pb-20 container-wide">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div
                className="relative aspect-square border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(201, 160, 80, 0.03), 0 0 80px rgba(201, 160, 80, 0.05)',
                }}
              >
                {/* Placeholder - will be replaced with actual product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={120} className="text-white/10" />
                </div>

                {product.originalPrice && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-accent-gold text-black font-medium">
                    <span className="text-2xl font-serif">{discount}%</span>
                    <span className="text-xs block tracking-wider">OFF</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                  <Shield size={24} className="text-accent-gold mx-auto" />
                  <p className="text-xs text-white/70">FDA Cleared</p>
                </div>
                <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                  <Award size={24} className="text-accent-gold mx-auto" />
                  <p className="text-xs text-white/70">#1 IPL Device</p>
                </div>
                <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                  <Clock size={24} className="text-accent-gold mx-auto" />
                  <p className="text-xs text-white/70">Results in 4 Weeks</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Brand */}
              <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                {product.brand}
              </p>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight text-white">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-accent-gold text-accent-gold'
                          : 'text-white/20'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-white/60">
                  {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="border-t border-b border-white/10 py-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-light text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-white/40 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-sm">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {product.inStock && (
                  <p className="text-sm text-green-400 mt-3">✓ In Stock</p>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed">
                {product.description}
              </p>

              {/* CTA Button */}
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group inline-flex items-center justify-center gap-3 w-full py-5 px-8 bg-accent-gold hover:bg-accent-hover text-black font-medium tracking-wider transition-all text-lg"
              >
                <ShoppingBag size={24} />
                BUY ON AMAZON
                <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <p className="text-xs text-white/40 text-center">
                Secure checkout on Amazon.com • Free returns • Fast shipping
              </p>

              {/* Key Benefits */}
              <div className="border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <h3 className="text-accent-gold text-sm tracking-wider uppercase">
                  Why This Product
                </h3>
                <ul className="space-y-3">
                  {product.benefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80 text-sm">
                      <Check size={18} className="text-accent-gold flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="mt-20 space-y-16">
            {/* Features */}
            <div>
              <h2 className="text-3xl font-light font-serif text-white mb-8 pb-4 border-b border-white/10">
                Features & Technology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature, index) => {
                  const [title, ...descParts] = feature.split(' - ')
                  const description = descParts.join(' - ')
                  return (
                    <div
                      key={index}
                      className="border border-white/10 bg-white/[0.02] p-6 space-y-2 hover:border-accent-gold/30 transition-colors"
                    >
                      <h3 className="text-accent-gold font-medium">{title}</h3>
                      {description && (
                        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-3xl font-light font-serif text-white mb-8 pb-4 border-b border-white/10">
                Technical Specifications
              </h2>
              <div className="border border-white/10 bg-white/[0.02]">
                {Object.entries(product.specs).map(([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-8 p-6 border-b border-white/10 last:border-b-0"
                  >
                    <dt className="text-white/60 text-sm">{key}</dt>
                    <dd className="text-white font-light">{value}</dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Who Is This For */}
            <div>
              <h2 className="text-3xl font-light font-serif text-white mb-8 pb-4 border-b border-white/10">
                Perfect For
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.forWhom.map((person, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 border border-white/10 bg-white/[0.02]"
                  >
                    <Check size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm leading-relaxed">{person}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="border border-accent-gold/20 bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] p-12 text-center space-y-6">
              <h2 className="text-3xl font-light font-serif text-white">
                Ready to Experience Professional Results at Home?
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Join thousands who have transformed their hair removal routine with the world's #1 IPL device.
                FDA-cleared, dermatologist-recommended, and backed by clinical studies.
              </p>
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group inline-flex items-center justify-center gap-3 py-5 px-12 bg-accent-gold hover:bg-accent-hover text-black font-medium tracking-wider transition-all text-lg"
              >
                <ShoppingBag size={24} />
                BUY NOW ON AMAZON
                <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-xs text-white/40">
                {product.originalPrice && `Limited time offer • Save $${(product.originalPrice - product.price).toFixed(0)} • `}
                Secure checkout • Free returns
              </p>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="mt-16 p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/50 text-xs leading-relaxed">
              <strong className="text-accent-gold">Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases.
              This means if you purchase through the links on this page, I may receive a small commission at no additional cost to you.
              I only recommend products I genuinely believe in and use personally. Your support helps maintain this site and create quality content.
              Thank you for your trust.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
