'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, SlidersHorizontal, ShoppingCart, Sparkles, Grid, List } from 'lucide-react'
import ScrollReveal from '@/components/scroll-reveal'
import { useCart } from '@/contexts/cart-context'
import { RippleButton } from '@/components/ripple-button'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface CollectionProduct {
  id: number
  title: string
  brand: string
  type: string
  description: string
  image: string
  basePrice: string
  variants: any[]
}

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.collectionId as string
  const { addItem } = useCart()

  const [products, setProducts] = useState<CollectionProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<CollectionProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })

  // Mock collection data - in production, fetch from API
  const collections: Record<string, any> = {
    'gallery-prints': {
      title: 'Gallery Prints',
      description: 'Museum-quality prints for the discerning collector',
      longDescription:
        'Our gallery print collection features exclusive works from editorial shoots and creative projects. Each piece is printed on premium archival paper using professional giclée techniques.',
      artist: 'Brandon Mills',
      heroImage: '/api/placeholder/1920/600',
      location: 'Studio Collection',
      date: '2024',
      featured: true,
      creativeProcess:
        'Every print in this collection began as a carefully composed photograph, captured with meticulous attention to light, composition, and mood. The digital files are then professionally color-corrected and optimized for large-format printing.',
      inspiration:
        'Inspired by the intersection of commercial photography and fine art, these pieces bridge the gap between editorial work and gallery-worthy prints.',
      technicalDetails:
        'Printed using 12-color giclée process on museum-grade archival paper. Each print is individually inspected for quality and arrives ready to frame.',
    },
    'canvas-art': {
      title: 'Canvas Art',
      description: 'Gallery-wrapped canvas pieces that make a statement',
      longDescription:
        'Transform your space with our premium canvas collection. Each piece is printed on professional-grade canvas and stretched over solid wood frames.',
      artist: 'Brandon Mills',
      heroImage: '/api/placeholder/1920/600',
      location: 'Canvas Collection',
      date: '2024',
      featured: true,
    },
    'lifestyle': {
      title: 'Lifestyle Collection',
      description: 'Premium everyday items featuring exclusive designs',
      longDescription:
        'Bring artistry into your daily life with our curated lifestyle collection. From apparel to drinkware, each item is crafted with the same attention to detail as our prints.',
      artist: 'Brandon Mills',
      heroImage: '/api/placeholder/1920/600',
      location: 'Lifestyle',
      date: '2024',
      featured: true,
    },
  }

  const collection = collections[collectionId] || {
    title: 'Collection',
    description: 'Curated products',
    artist: 'Brandon Mills',
  }

  useEffect(() => {
    fetchCollectionProducts()
  }, [collectionId])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, sortBy, priceRange])

  const fetchCollectionProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/store/curated-products')
      const data = await response.json()

      if (data.success) {
        // Filter by collection type
        let filtered = data.products
        if (collectionId === 'gallery-prints') {
          filtered = data.products.filter((p: any) =>
            p.type.toLowerCase().includes('poster') || p.type.toLowerCase().includes('print')
          )
        } else if (collectionId === 'canvas-art') {
          filtered = data.products.filter((p: any) => p.type.toLowerCase().includes('canvas'))
        } else if (collectionId === 'lifestyle') {
          filtered = data.products.filter((p: any) =>
            p.type.toLowerCase().includes('mug') ||
            p.type.toLowerCase().includes('shirt') ||
            p.type.toLowerCase().includes('hoodie')
          )
        }

        setProducts(filtered)
        setFilteredProducts(filtered)
      }
    } catch (error) {
      console.error('Failed to fetch collection products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Apply sorting
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice))
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice))
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredProducts(filtered)
  }

  const getStrategicPrice = (product: CollectionProduct): string => {
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

  const handleQuickAdd = (product: CollectionProduct) => {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <button
              onClick={() => router.push('/store')}
              className="flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors group mb-12"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="tracking-wider uppercase text-sm">Back to Store</span>
            </button>
          </ScrollReveal>

          <div className="max-w-4xl">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/30 rounded-full mb-6">
                <Sparkles className="text-accent-gold" size={16} />
                <span className="text-xs tracking-[0.2em] uppercase text-accent-gold">
                  Curated Collection
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <h1 className="text-6xl md:text-8xl font-serif font-light mb-6">
                {collection.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-2xl text-white/90 font-light mb-8">{collection.description}</p>
            </ScrollReveal>

            {collection.longDescription && (
              <ScrollReveal direction="up" delay={0.5}>
                <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
                  {collection.longDescription}
                </p>
              </ScrollReveal>
            )}

            {collection.location && collection.date && (
              <ScrollReveal direction="up" delay={0.6}>
                <div className="flex items-center gap-6 mt-8 text-sm text-white/40">
                  <span>{collection.location}</span>
                  <span>•</span>
                  <span>{collection.date}</span>
                  <span>•</span>
                  <span>{collection.artist}</span>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="py-8 border-t border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Product count */}
              <div className="text-white/60">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-accent-gold/50 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-full transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-accent-gold text-black'
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-full transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-accent-gold text-black'
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 container-wide">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/10"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-6 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-serif mb-2">No products found</h3>
            <p className="text-white/60">Try adjusting your filters</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {filteredProducts.map((product, index) => {
              const variant = product.variants?.[0]
              const price = getStrategicPrice(product)

              return viewMode === 'grid' ? (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10"></div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
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

                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full text-xs tracking-wider uppercase">
                          {product.type}
                        </div>
                      </div>
                    </Link>

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
                        <p className="text-white/60 text-sm line-clamp-2">
                          {product.description}
                        </p>
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
              ) : (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 transition-all duration-300"
                >
                  <div className="flex gap-6 p-6">
                    <Link href={`/store/${product.id}`} className="flex-shrink-0">
                      <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white/5">
                        {variant?.image || product.image ? (
                          <img
                            src={variant?.image || product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <div className="text-4xl">📦</div>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-white/40 tracking-wider uppercase mb-2">
                          {product.brand}
                        </div>
                        <Link href={`/store/${product.id}`}>
                          <h3 className="text-2xl font-serif mb-2 hover:text-accent-gold transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-white/60 leading-relaxed">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-3xl font-light text-accent-gold">${price}</div>
                        <div className="flex items-center gap-3">
                          <RippleButton
                            onClick={() => handleQuickAdd(product)}
                            className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-accent-gold/30 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <ShoppingCart size={16} />
                              <span>Add to Cart</span>
                            </span>
                          </RippleButton>
                          <Link
                            href={`/store/${product.id}`}
                            className="px-6 py-3 border border-white/10 rounded-full hover:border-accent-gold/50 hover:bg-white/5 transition-all duration-300 text-sm tracking-wider uppercase"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* Collection Story */}
      {(collection.creativeProcess || collection.inspiration || collection.technicalDetails) && (
        <section className="py-20 bg-white/[0.02]">
          <div className="container-wide max-w-4xl">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif mb-4">The Collection Story</h2>
                <div className="luxury-divider max-w-md mx-auto"></div>
              </div>
            </ScrollReveal>

            <div className="space-y-12">
              {collection.creativeProcess && (
                <ScrollReveal direction="up">
                  <div>
                    <h3 className="text-xl font-serif mb-4 text-accent-gold">Creative Process</h3>
                    <p className="text-white/60 leading-relaxed">{collection.creativeProcess}</p>
                  </div>
                </ScrollReveal>
              )}

              {collection.inspiration && (
                <ScrollReveal direction="up">
                  <div>
                    <h3 className="text-xl font-serif mb-4 text-accent-gold">Inspiration</h3>
                    <p className="text-white/60 leading-relaxed">{collection.inspiration}</p>
                  </div>
                </ScrollReveal>
              )}

              {collection.technicalDetails && (
                <ScrollReveal direction="up">
                  <div>
                    <h3 className="text-xl font-serif mb-4 text-accent-gold">
                      Technical Details
                    </h3>
                    <p className="text-white/60 leading-relaxed">{collection.technicalDetails}</p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
