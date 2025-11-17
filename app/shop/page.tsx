import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Star, ShoppingBag } from 'lucide-react'
import { affiliateProducts } from '@/lib/affiliate-products'

export const metadata: Metadata = {
  title: 'Premium Curated Products | Shop | Brandon Mills',
  description: 'Discover 21 premium products for polymaths: MacBook Pro, AirPods Max, philosophy books, NASA merch. Quality over quantity.',
  keywords: [
    'premium products',
    'curated shop',
    'polymath essentials',
    'quality products',
    'lifestyle products 2025',
    'recommended products',
    'affiliate shop',
    'premium lifestyle'
  ],
  openGraph: {
    title: 'Premium Curated Products | Shop | Brandon Mills',
    description: 'Discover 21 premium products for polymaths: MacBook Pro, AirPods Max, philosophy books, NASA merch. Quality over quantity.',
    type: 'website',
    url: 'https://brandonmills.com/shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Curated Products | Shop | Brandon Mills',
    description: 'Discover 21 premium products for polymaths. Quality over quantity.',
  },
}

export default function ShopPage() {
  const featuredProducts = affiliateProducts.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent-gold/30 rounded-full bg-accent-gold/5">
            <ShoppingBag size={16} className="text-accent-gold" />
            <span className="text-sm tracking-[0.3em] uppercase text-accent-gold">
              Curated Selection
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Shop
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Premium products I personally use and recommend. Each item is carefully selected for quality,
            effectiveness, and long-term value.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 container-wide">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="group border border-white/10 hover:border-accent-gold/50 transition-all duration-500"
              >
                <Link href={`/shop/${product.slug}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden">
                    {/* Placeholder for product image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag size={64} className="text-white/20 group-hover:text-accent-gold/30 transition-colors" />
                    </div>

                    {/* Sale Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent-gold text-black text-xs font-medium tracking-wider">
                        SAVE ${(product.originalPrice - product.price).toFixed(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Brand */}
                    <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                      {product.brand}
                    </p>

                    {/* Title */}
                    <h2 className="text-xl font-light font-serif text-white group-hover:text-accent-gold transition-colors line-clamp-2">
                      {product.name}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(product.rating)
                                ? 'fill-accent-gold text-accent-gold'
                                : 'text-white/20'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">
                        {product.reviewCount.toLocaleString()} reviews
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-light text-white">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-white/40 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-accent-gold text-sm tracking-wider group-hover:gap-4 transition-all">
                        VIEW DETAILS
                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="max-w-4xl mx-auto mt-20 p-8 border border-white/10 bg-white/[0.02]">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-3">
            Affiliate Disclosure
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            As an Amazon Associate, I earn from qualifying purchases. When you purchase through links on this site,
            I may receive a small commission at no additional cost to you. I only recommend products I personally use
            and believe add value to your life. Your support helps maintain this site and allows me to continue
            creating quality content.
          </p>
        </div>
      </section>
    </div>
  )
}
