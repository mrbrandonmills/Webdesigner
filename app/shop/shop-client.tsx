'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { UnifiedProduct } from '@/lib/types/shop'
import { EnhancedProductCard, ProductCardSkeleton } from '@/components/shop/enhanced-product-card'
import { ProductDetailModal } from '@/components/shop/product-detail-modal'
import { FilterSortBar } from '@/components/shop/filter-sort-bar'
import { Sparkles, TrendingUp, Package } from 'lucide-react'

interface ShopPageClientProps {
  products: UnifiedProduct[]
}

// Extract unique categories from products
function extractCategories(products: UnifiedProduct[]): string[] {
  const categories = new Set<string>(['All'])

  products.forEach(product => {
    // Add source-based categories
    if (product.source === 'printful') {
      categories.add('Printful Originals')
    } else if (product.source === 'amazon') {
      categories.add('Curated')
    }

    // Add tag-based categories
    if (product.tags) {
      if (product.tags.includes('poetry')) categories.add('Poetry')
      if (product.tags.includes('photography')) categories.add('Photography')
      if (product.tags.includes('philosophy')) categories.add('Philosophy')
      if (product.tags.includes('lifestyle')) categories.add('Lifestyle')
      if (product.tags.includes('tech')) categories.add('Tech')
    }

    // Add category if exists
    if (product.category) {
      const cat = product.category.toLowerCase()
      if (cat.includes('book')) categories.add('Books')
      if (cat.includes('tech')) categories.add('Tech')
      if (cat.includes('lifestyle')) categories.add('Lifestyle')
    }
  })

  return Array.from(categories)
}

export function ShopPageClient({ products }: ShopPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const categories = useMemo(() => extractCategories(products), [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        if (selectedCategory === 'Printful Originals') {
          return product.source === 'printful'
        }
        if (selectedCategory === 'Curated') {
          return product.source === 'amazon'
        }
        if (selectedCategory === 'Poetry') {
          return product.tags?.includes('poetry')
        }
        if (selectedCategory === 'Photography') {
          return product.tags?.includes('photography')
        }
        if (selectedCategory === 'Philosophy') {
          return product.tags?.includes('philosophy')
        }
        if (selectedCategory === 'Books') {
          return product.category?.toLowerCase().includes('book')
        }
        if (selectedCategory === 'Tech') {
          return product.tags?.includes('tech') || product.category?.toLowerCase().includes('tech')
        }
        if (selectedCategory === 'Lifestyle') {
          return product.tags?.includes('lifestyle') || product.category?.toLowerCase().includes('lifestyle')
        }
        return false
      })
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          // Newest first (assuming higher IDs are newer)
          return b.id.localeCompare(a.id)
        case 'name-asc':
          return a.title.localeCompare(b.title)
        case 'name-desc':
          return b.title.localeCompare(a.title)
        case 'featured':
        default:
          // Featured first, then by price descending
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.price - a.price
      }
    })

    return filtered
  }, [products, selectedCategory, sortBy, searchQuery])

  // Get featured products for hero section
  const featuredProducts = useMemo(
    () => products.filter(p => p.featured).slice(0, 3),
    [products]
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-sm uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} />
            <span>Museum-Quality Collection</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-light font-serif">
            Curated Shop
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Every item in this collection has been carefully selected for its quality,
            craftsmanship, and ability to inspire. From original poetry designs to
            premium tools for thinking and creating.
          </p>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center gap-8 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Package size={20} className="text-accent-gold" />
              <span className="text-white/80">{products.length} Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-accent-gold" />
              <span className="text-white/80">{featuredProducts.length} Featured</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-accent-gold" />
              <span className="text-white/80">New Arrivals</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Filter & Sort Bar */}
      <FilterSortBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        productCount={filteredAndSortedProducts.length}
      />

      {/* Product Grid */}
      <section className="py-16 container-wide">
        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length === 0 ? (
            // Empty State
            <motion.div
              key="empty"
              className="text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                  <Package size={40} className="text-white/40" />
                </div>
                <h3 className="text-2xl font-serif font-light">No products found</h3>
                <p className="text-white/60">
                  Try adjusting your filters or search query
                </p>
                <motion.button
                  className="px-6 py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Product Grid with Masonry Layout
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredAndSortedProducts.map((product, index) => {
                // Make first product featured if it's actually featured
                const isFeatured = index === 0 && product.featured

                return (
                  <EnhancedProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    featured={isFeatured}
                  />
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} featured={i === 0} />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Affiliate Disclosure */}
      <section className="pb-20 container-wide">
        <motion.div
          className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
              <Sparkles size={20} className="text-accent-gold" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-light">Transparency & Quality</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white">Affiliate Disclosure:</strong> Some products
                on this page are affiliate links. When you purchase through links marked
                "Curated", I may earn a commission at no additional cost to you. Every product
                has been personally tested and genuinely recommended. "Printful Originals" are
                my own designs, featuring original poetry, photography, and philosophy.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter CTA */}
      <section className="pb-32 container-wide">
        <motion.div
          className="max-w-2xl mx-auto text-center space-y-8 py-16 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light">
            Get Notified of New Releases
          </h2>
          <p className="text-white/60">
            Be the first to know when I release new designs, curated products, and
            limited editions.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 focus:border-accent-gold focus:bg-white/10 transition-all text-white placeholder:text-white/40 outline-none"
            />
            <motion.button
              type="submit"
              className="px-8 py-3 bg-accent-gold text-black hover:bg-accent-hover transition-colors font-medium tracking-wider uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
