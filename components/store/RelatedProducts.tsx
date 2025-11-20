'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/cart-context'
import { RippleButton } from '@/components/ripple-button'
import Link from 'next/link'
import { clientLogger } from '@/lib/client-logger'

interface RelatedProduct {
  id: number
  title: string
  brand: string
  type: string
  image: string
  basePrice: string
  variants: any[]
}

interface RelatedProductsProps {
  currentProductId: number
  category?: string
  maxItems?: number
}

export default function RelatedProducts({
  currentProductId,
  category,
  maxItems = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchRelatedProducts()
  }, [currentProductId])

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/store/curated-products')
      const data = await response.json()

      if (data.success) {
        // Filter out current product and limit results
        const filtered = data.products
          .filter((p: RelatedProduct) => p.id !== currentProductId)
          .slice(0, maxItems)

        setProducts(filtered)
      }
    } catch (error) {
      clientLogger.error('Failed to fetch related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStrategicPrice = (product: RelatedProduct): string => {
    const basePrice = parseFloat(product.basePrice) || 0
    const type = (product.type || '').toLowerCase()

    if (type.includes('poster') || type.includes('print')) {
      if (basePrice < 12) return '49.00'
      if (basePrice < 15) return '79.00'
      if (basePrice < 20) return '99.00'
      return '149.00'
    }

    if (type.includes('canvas')) {
      if (basePrice < 35) return '149.00'
      if (basePrice < 50) return '179.00'
      return '249.00'
    }

    if (type.includes('shirt') || type.includes('tee')) return '35.00'
    if (type.includes('hoodie')) return '65.00'
    if (type.includes('mug')) return '22.00'

    return (basePrice * 3.5).toFixed(2)
  }

  const handleQuickAdd = (product: RelatedProduct) => {
    const variant = product.variants?.[0]
    if (!variant) return

    const price = getStrategicPrice(product)

    addItem({
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantName: variant.name || 'Default',
      image: variant.image || product.image || '',
      price: price,
      type: product.type,
      brand: product.brand,
    })
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-wide">
          <h2 className="text-3xl font-serif mb-12 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/10"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-6 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 bg-white/[0.02]">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/30 rounded-full mb-6">
            <Sparkles className="text-accent-gold" size={16} />
            <span className="text-xs tracking-[0.2em] uppercase text-accent-gold">
              Curated For You
            </span>
          </div>
          <h2 className="text-4xl font-serif">You May Also Like</h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const variant = product.variants?.[0]
            const price = getStrategicPrice(product)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10 scale-95 group-hover:scale-100"></div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 group-hover:-translate-y-2">
                  {/* Product Image */}
                  <Link href={`/store/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-white/10 to-white/5 relative">
                      {variant?.image || product.image ? (
                        <>
                          <img
                            src={variant?.image || product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <div className="text-6xl">📦</div>
                        </div>
                      )}

                      {/* Quick Add Overlay */}
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <RippleButton
                          onClick={(e) => {
                            e.preventDefault()
                            handleQuickAdd(product)
                          }}
                          className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-accent-gold/30 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingCart size={16} />
                            <span>Quick Add</span>
                          </span>
                        </RippleButton>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full text-xs tracking-wider uppercase">
                        {product.type}
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6 space-y-3">
                    <div>
                      <div className="text-xs text-white/40 tracking-wider uppercase mb-1">
                        {product.brand}
                      </div>
                      <Link href={`/store/${product.id}`}>
                        <h3 className="text-lg font-serif mb-1 hover:text-accent-gold transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="text-2xl font-light text-accent-gold">${price}</div>
                      <Link
                        href={`/store/${product.id}`}
                        className="text-accent-gold hover:text-accent-hover transition-colors text-sm tracking-wider uppercase flex items-center gap-1"
                      >
                        <span>View</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
