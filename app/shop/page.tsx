import { Metadata } from 'next'
import { ExternalLink, ShoppingBag, Star } from 'lucide-react'
import { affiliateProducts } from '@/lib/affiliate-products'
import { mergeShopProducts } from '@/lib/shop-merger'

export const metadata: Metadata = {
  title: 'Shop | Brandon Mills',
  description: 'Curated products: custom merchandise, philosophy books, premium tech. Quality over quantity.',
}

async function getProducts() {
  try {
    // Fetch Printful products
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const printfulRes = await fetch(`${baseUrl}/api/store/products`, {
      cache: 'no-store',
    })

    let printfulProducts = []
    if (printfulRes.ok) {
      const printfulData = await printfulRes.json()
      printfulProducts = printfulData.products || []
    }

    // Merge with Amazon affiliate products
    return mergeShopProducts(printfulProducts, affiliateProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to just Amazon products if Printful fails
    return mergeShopProducts([], affiliateProducts)
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-light font-serif">
            Curated Shop
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {products.length} products: Custom merchandise, philosophy books, premium tech
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12 container-wide">
        <div className="flex gap-4 justify-center flex-wrap">
          {['All', 'Printful Originals', 'Premium Tech', 'Books', 'Lifestyle'].map((cat) => (
            <button
              key={cat}
              className="px-6 py-2 border border-white/10 hover:border-accent-gold transition-colors text-sm tracking-wider uppercase"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-32 container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white/5 border border-white/10 hover:border-accent-gold transition-all duration-500"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Source Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-xs tracking-wider uppercase">
                  {product.source === 'printful' ? 'Original' : 'Curated'}
                </div>

                {/* Rating (Amazon only) */}
                {product.rating && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1">
                    <Star size={14} className="fill-accent-gold text-accent-gold" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-white/60">({product.reviewCount?.toLocaleString()})</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-serif group-hover:text-accent-gold transition-colors">
                  {product.title}
                </h3>

                <p className="text-sm text-white/60 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-light">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-white/40 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-green-500 font-medium">
                        SAVE ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {product.source === 'amazon' ? (
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-accent-gold text-black hover:bg-accent-hover transition-colors text-center text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                  >
                    View on Amazon <ExternalLink size={16} />
                  </a>
                ) : (
                  <button className="w-full px-6 py-3 border border-white/10 hover:bg-white/5 transition-colors text-sm tracking-wider uppercase flex items-center justify-center gap-2">
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto p-6 bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 leading-relaxed">
            <strong className="text-white">Affiliate Disclosure:</strong> This page contains
            affiliate links. When you purchase through links marked &quot;Curated&quot;, we may earn a
            commission at no additional cost to you. All products are genuinely recommended.
          </p>
        </div>
      </section>
    </div>
  )
}
