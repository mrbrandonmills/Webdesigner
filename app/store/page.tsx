'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Filter, Search, ExternalLink } from 'lucide-react'
import ScrollReveal from '@/components/scroll-reveal'

interface Product {
  id: number
  external_id: string
  name: string
  thumbnail: string
  variants: {
    id: number
    name: string
    price: string
    currency: string
    image: string
    thumbnail: string
  }[]
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/store/products')
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', label: 'All Products', icon: '🎨' },
    { id: 'prints', label: 'Gallery Prints', icon: '🖼️' },
    { id: 'canvas', label: 'Canvas Art', icon: '🎭' },
    { id: 'apparel', label: 'Apparel', icon: '👕' },
    { id: 'home', label: 'Home & Living', icon: '🏠' },
  ]

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all') {
      const categoryKeywords = {
        prints: ['print', 'poster', 'photo'],
        canvas: ['canvas'],
        apparel: ['shirt', 'tee', 'hoodie', 'sweatshirt'],
        home: ['mug', 'pillow', 'blanket', 'towel'],
      }
      const keywords = categoryKeywords[selectedCategory as keyof typeof categoryKeywords] || []
      const matchesCategory = keywords.some(keyword =>
        product.name.toLowerCase().includes(keyword)
      )
      if (!matchesCategory) return false
    }

    // Search filter
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            The Collection
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
            Premium prints, apparel, and art — curated from editorial photography and creative work
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 container-wide">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-6 py-3 border transition-all
                ${selectedCategory === category.id
                  ? 'bg-accent-gold text-black border-accent-gold'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                }
              `}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="pb-12 container-wide">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold transition-colors"
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 container-wide">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white/60">Loading collection...</p>
          </div>
        ) : filteredProducts.length === 0 && products.length > 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-white/40">No products found</p>
            <p className="mt-2 text-white/30">Try adjusting your filters</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} direction="up" delay={index * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ComingSoonSection />
        )}
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const variant = product.variants[selectedVariant]

  return (
    <div className="luxury-card bg-white/5 border border-white/10 overflow-hidden group">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-white/5 relative">
        <img
          src={variant.image || product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors">
            <ShoppingCart size={20} className="inline mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-serif mb-1">{product.name}</h3>
          <p className="text-white/60 text-sm">{variant.name}</p>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {product.variants.slice(0, 4).map((v, index) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(index)}
                className={`
                  w-12 h-12 border-2 rounded overflow-hidden transition-all
                  ${selectedVariant === index
                    ? 'border-accent-gold'
                    : 'border-white/10 hover:border-white/30'
                  }
                `}
              >
                <img
                  src={v.thumbnail}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {product.variants.length > 4 && (
              <button className="w-12 h-12 border-2 border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs text-white/40">
                +{product.variants.length - 4}
              </button>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-2xl font-light">
            {variant.currency === 'USD' ? '$' : variant.currency}
            {variant.price}
          </span>
          <button className="text-accent-gold hover:text-accent-hover transition-colors text-sm tracking-wider uppercase">
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}

function ComingSoonSection() {
  const placeholderCategories = [
    {
      title: 'Gallery Prints',
      description: 'Museum-quality prints from editorial shoots and creative work',
      products: [
        {
          name: 'Editorial Collection',
          description: 'High-fashion photography on premium paper',
          price: 'From $49',
        },
        {
          name: 'Limited Editions',
          description: 'Signed and numbered prints',
          price: 'From $149',
        },
      ],
    },
    {
      title: 'Canvas Art',
      description: 'Curated images on gallery-wrapped canvas',
      products: [
        {
          name: 'Large Format Canvas',
          description: '24x36" gallery-wrapped canvas prints',
          price: 'From $199',
        },
      ],
    },
    {
      title: 'Apparel',
      description: 'Signature photography on premium clothing',
      products: [
        {
          name: 'Artist Tees',
          description: 'Premium cotton with editorial imagery',
          price: 'From $35',
        },
        {
          name: 'Luxury Hoodies',
          description: 'High-quality hoodies featuring best work',
          price: 'From $65',
        },
      ],
    },
  ]

  return (
    <div className="space-y-24">
      <div className="text-center space-y-8">
        <div className="luxury-divider mx-auto"></div>
        <h2 className="text-3xl md:text-5xl font-light font-serif">
          Collection Launching Soon
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
          Premium merchandise featuring work from editorial shoots, commercial campaigns,
          and creative projects. Each piece is printed on-demand with museum-quality materials.
        </p>
        <div className="luxury-divider mx-auto"></div>
      </div>

      {/* Coming Soon Categories */}
      {placeholderCategories.map((category, categoryIndex) => (
        <div key={category.title} className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-4xl font-light font-serif">{category.title}</h3>
            <p className="text-white/60 max-w-2xl mx-auto">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products.map((product, productIndex) => (
              <div
                key={product.name}
                className="luxury-card bg-white/5 border border-white/10 p-8 opacity-60"
              >
                <div className="space-y-4">
                  <div className="aspect-square bg-white/5 rounded flex items-center justify-center">
                    <p className="text-white/40 text-sm">Preview Coming Soon</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-1">{product.name}</h4>
                    <p className="text-white/60 text-sm">{product.description}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-lg font-light tracking-wider text-white/60">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Email Signup */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h3 className="text-2xl font-serif">Get Notified</h3>
        <p className="text-white/60">
          Be the first to know when the collection launches
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
          >
            Notify Me
          </button>
        </form>
      </div>
    </div>
  )
}
