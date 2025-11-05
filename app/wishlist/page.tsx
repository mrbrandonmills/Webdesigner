'use client'

import { useState, useEffect } from 'react'
import { Heart, X, ShoppingCart, Trash2, Share2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { RippleButton } from '@/components/ripple-button'
import ScrollReveal from '@/components/scroll-reveal'
import { motion, AnimatePresence } from 'framer-motion'

interface WishlistItem {
  id: string
  productId: number
  product: {
    id: number
    title: string
    brand: string
    type: string
    description: string
    image: string
    basePrice: string
    variants: any[]
  }
  addedAt: string
  priceAtTimeOfAdd: string
  notes?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    loadWishlist()
    loadRecentlyViewed()
  }, [])

  const loadWishlist = () => {
    try {
      const saved = localStorage.getItem('wishlist')
      if (saved) {
        const items = JSON.parse(saved)
        setWishlistItems(items)
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentlyViewed = async () => {
    try {
      const saved = localStorage.getItem('recentlyViewed')
      if (!saved) return

      const viewed = JSON.parse(saved)
      const productIds = viewed.slice(0, 4).map((v: any) => v.productId)

      // Fetch product details
      const response = await fetch('/api/store/curated-products')
      const data = await response.json()

      if (data.success) {
        const viewedProducts = data.products.filter((p: any) =>
          productIds.includes(p.id.toString())
        )
        setRecentlyViewed(viewedProducts)
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error)
    }
  }

  const removeFromWishlist = (itemId: string) => {
    const updated = wishlistItems.filter((item) => item.id !== itemId)
    setWishlistItems(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const moveToCart = (item: WishlistItem) => {
    const variant = item.product.variants?.[0]
    if (!variant) return

    addItem({
      productId: item.product.id,
      variantId: variant.id,
      productTitle: item.product.title,
      variantName: variant.name || 'Default',
      image: variant.image || item.product.image || '',
      price: item.priceAtTimeOfAdd,
      type: item.product.type,
      brand: item.product.brand,
    })

    removeFromWishlist(item.id)
  }

  const moveAllToCart = () => {
    wishlistItems.forEach((item) => {
      const variant = item.product.variants?.[0]
      if (variant) {
        addItem({
          productId: item.product.id,
          variantId: variant.id,
          productTitle: item.product.title,
          variantName: variant.name || 'Default',
          image: variant.image || item.product.image || '',
          price: item.priceAtTimeOfAdd,
          type: item.product.type,
          brand: item.product.brand,
        })
      }
    })

    setWishlistItems([])
    localStorage.setItem('wishlist', JSON.stringify([]))
  }

  const shareWishlist = () => {
    const wishlistUrl = window.location.href
    if (navigator.share) {
      navigator
        .share({
          title: 'My Wishlist',
          url: wishlistUrl,
        })
        .catch(() => {
          // Fallback
          navigator.clipboard.writeText(wishlistUrl)
          alert('Wishlist link copied to clipboard!')
        })
    } else {
      navigator.clipboard.writeText(wishlistUrl)
      alert('Wishlist link copied to clipboard!')
    }
  }

  const getStrategicPrice = (basePrice: string, type: string): string => {
    const price = parseFloat(basePrice) || 0
    const productType = type.toLowerCase()

    if (productType.includes('poster') || productType.includes('print')) {
      if (price < 12) return '49.00'
      if (price < 15) return '79.00'
      if (price < 20) return '99.00'
      return '149.00'
    }

    if (productType.includes('canvas')) {
      if (price < 35) return '149.00'
      if (price < 50) return '179.00'
      return '249.00'
    }

    if (productType.includes('shirt') || productType.includes('tee')) return '35.00'
    if (productType.includes('hoodie')) return '65.00'
    if (productType.includes('mug')) return '22.00'

    return (price * 3.5).toFixed(2)
  }

  const getTotalValue = () => {
    return wishlistItems.reduce(
      (sum, item) => sum + parseFloat(item.priceAtTimeOfAdd || '0'),
      0
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 pb-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl overflow-hidden animate-pulse">
                <div className="flex gap-6 p-6">
                  <div className="w-32 h-32 bg-white/10 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-white/10 rounded"></div>
                    <div className="h-6 bg-white/10 rounded"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="pt-40 pb-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="text-accent-gold" size={32} />
                  <h1 className="text-5xl md:text-7xl font-serif font-light">Your Wishlist</h1>
                </div>
                <p className="text-xl text-white/60">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                  {wishlistItems.length > 0 && (
                    <span className="text-accent-gold ml-2">
                      (${getTotalValue().toFixed(2)} total value)
                    </span>
                  )}
                </p>
              </div>

              {wishlistItems.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={shareWishlist}
                    className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-accent-gold/30 transition-all duration-300"
                    aria-label="Share wishlist"
                  >
                    <Share2 size={20} />
                  </button>
                  <RippleButton
                    onClick={moveAllToCart}
                    className="px-8 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-accent-gold/30"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingCart size={20} />
                      <span>Add All to Cart</span>
                    </span>
                  </RippleButton>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <ScrollReveal direction="up">
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-6">
                  <Heart size={64} className="text-accent-gold/40" />
                </div>
                <h3 className="text-3xl font-serif text-white/60 mb-4">
                  Your Wishlist is Empty
                </h3>
                <p className="text-white/40 font-light mb-8 max-w-md mx-auto">
                  Save your favorite items to come back to them later. All your saved items will
                  appear here.
                </p>
                <Link
                  href="/store"
                  className="inline-block px-8 py-4 bg-accent-gold text-black rounded-full font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 transition-all duration-300"
                  >
                    <div className="flex gap-6 p-6">
                      {/* Product Image */}
                      <Link
                        href={`/store/${item.product.id}`}
                        className="flex-shrink-0 group/image"
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <div className="text-4xl">📦</div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="text-xs text-white/40 tracking-wider uppercase mb-1">
                            {item.product.brand}
                          </div>
                          <Link href={`/store/${item.product.id}`}>
                            <h3 className="text-lg font-serif mb-1 hover:text-accent-gold transition-colors truncate">
                              {item.product.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-white/60 line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-2xl font-light text-accent-gold">
                            ${item.priceAtTimeOfAdd}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
                          aria-label="Remove from wishlist"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={() => moveToCart(item)}
                          className="p-3 bg-accent-gold/10 border border-accent-gold/30 rounded-full hover:bg-accent-gold hover:text-black transition-all duration-300"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Added date */}
                    <div className="px-6 pb-4 text-xs text-white/30">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-20 bg-white/[0.02]">
          <div className="container-wide">
            <ScrollReveal direction="up">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-serif">Recently Viewed</h2>
                <Link
                  href="/store"
                  className="flex items-center gap-2 text-accent-gold hover:text-accent-hover transition-colors group"
                >
                  <span className="text-sm tracking-wider uppercase">View All</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((product, index) => {
                const variant = product.variants?.[0]
                const price = getStrategicPrice(product.basePrice, product.type)

                return (
                  <ScrollReveal key={product.id} direction="up" delay={index * 0.1}>
                    <Link
                      href={`/store/${product.id}`}
                      className="group block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-white/10 to-white/5">
                        {variant?.image || product.image ? (
                          <img
                            src={variant?.image || product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <div className="text-6xl">📦</div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        <div>
                          <div className="text-xs text-white/40 tracking-wider uppercase mb-1">
                            {product.brand}
                          </div>
                          <h3 className="text-lg font-serif mb-1 group-hover:text-accent-gold transition-colors">
                            {product.title}
                          </h3>
                        </div>
                        <div className="text-2xl font-light text-accent-gold">${price}</div>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
