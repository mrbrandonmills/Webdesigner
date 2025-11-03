'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Search } from 'lucide-react'
import ScrollReveal from '@/components/scroll-reveal'
import { useCart } from '@/contexts/cart-context'

interface Product {
  id: number
  title: string
  brand: string
  model: string
  description: string
  type: string
  image: string | null
  basePrice: string
  currency: string
  variantCount: number
  variants: {
    id: number
    name: string
    size: string
    color: string
    image: string
  }[]
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory
        ? `/api/store/products?category=${selectedCategory}`
        : '/api/store/products'

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        console.error('Failed to fetch products:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: null, label: 'All Products', icon: '🎨', desc: 'Browse everything' },
    { id: 'posters', label: 'Gallery Prints', icon: '🖼️', desc: 'Museum-quality posters' },
    { id: 'canvas', label: 'Canvas Art', icon: '🎭', desc: 'Gallery-wrapped canvas' },
    { id: 'apparel', label: 'Apparel', icon: '👕', desc: 'Premium clothing' },
    { id: 'mugs', label: 'Lifestyle', icon: '☕', desc: 'Daily essentials' },
  ]

  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      return (
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
            Premium prints, apparel, and art — where philosophy meets performance
          </p>
          <p className="text-white/60 max-w-2xl mx-auto">
            Each piece created on-demand with museum-quality materials.
            Featuring work from editorial shoots, creative projects, and original designs.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 container-wide">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id || 'all'}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                p-6 border transition-all text-left
                ${selectedCategory === category.id
                  ? 'bg-accent-gold/10 border-accent-gold'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
                }
              `}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="font-medium mb-1">{category.label}</div>
              <div className="text-xs text-white/40">{category.desc}</div>
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
            <p className="mt-4 text-white/60">Loading collection from Printful...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-white/40">No products found</p>
            <p className="mt-2 text-white/30">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-white/60">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} direction="up" delay={index * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Info Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="luxury-divider mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎨</div>
              <h3 className="text-xl font-serif">Museum Quality</h3>
              <p className="text-white/60 text-sm">
                Premium materials and professional printing on every piece
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🚚</div>
              <h3 className="text-xl font-serif">Made to Order</h3>
              <p className="text-white/60 text-sm">
                Each item crafted when you order, reducing waste
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🌍</div>
              <h3 className="text-xl font-serif">Global Shipping</h3>
              <p className="text-white/60 text-sm">
                Worldwide fulfillment from local facilities
              </p>
            </div>
          </div>
          <div className="luxury-divider mt-12"></div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const variant = product.variants[selectedVariant]
  const { addItem } = useCart()

  // Strategic pricing based on product type and positioning
  const getStrategicPrice = (product: Product): string => {
    const basePrice = parseFloat(product.basePrice)
    const type = product.type.toLowerCase()

    // Gallery Prints / Posters - Premium art pricing
    if (type.includes('poster') || type.includes('print')) {
      if (basePrice < 12) return '49.00'  // 18×24" and smaller
      if (basePrice < 15) return '79.00'  // 24×36"
      if (basePrice < 20) return '99.00'  // Large formats
      return '149.00' // Extra large
    }

    // Canvas Art - Gallery-quality pricing
    if (type.includes('canvas')) {
      if (basePrice < 35) return '149.00' // 16×20" and smaller
      if (basePrice < 50) return '179.00' // 24×36"
      if (basePrice < 70) return '249.00' // Large canvas
      return '349.00' // Premium large canvas
    }

    // T-Shirts - Premium casual wear
    if (type.includes('shirt') || type.includes('tee') || type.includes('t-shirt')) {
      return '35.00'
    }

    // Hoodies & Sweatshirts - Luxury streetwear
    if (type.includes('hoodie') || type.includes('sweatshirt')) {
      return '65.00'
    }

    // Mugs & Drinkware - Daily luxury items
    if (type.includes('mug') || type.includes('cup')) {
      return '22.00'
    }

    // Tank Tops - Premium activewear
    if (type.includes('tank')) {
      return '32.00'
    }

    // Long Sleeve - Premium casual
    if (type.includes('long sleeve')) {
      return '42.00'
    }

    // Phone Cases - Tech accessories
    if (type.includes('case') || type.includes('phone')) {
      return '29.00'
    }

    // Tote Bags - Lifestyle accessories
    if (type.includes('tote') || type.includes('bag')) {
      return '35.00'
    }

    // Default: Premium positioning with 3.5x markup
    return (basePrice * 3.5).toFixed(2)
  }

  const suggestedPrice = getStrategicPrice(product)

  const handleAddToCart = () => {
    if (!variant) return

    addItem({
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantName: variant.name,
      image: variant.image || product.image || '',
      price: suggestedPrice,
      type: product.type,
      brand: product.brand,
    })
  }

  return (
    <div className="luxury-card bg-white/5 border border-white/10 overflow-hidden group">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-white/5 relative">
        {variant?.image || product.image ? (
          <img
            src={variant?.image || product.image || ''}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-sm">Image coming soon</p>
            </div>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
          >
            <ShoppingCart size={20} className="inline mr-2" />
            Add to Cart
          </button>
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-xs tracking-wider uppercase">
          {product.type}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs text-white/40 tracking-wider uppercase mb-1">
            {product.brand}
          </div>
          <h3 className="text-xl font-serif mb-1">{product.title}</h3>
          <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div>
            <p className="text-xs text-white/40 mb-2 tracking-wider uppercase">
              {product.variantCount} Options Available
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.slice(0, 4).map((v, index) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(index)}
                  className={`
                    px-3 py-1 text-xs border transition-all
                    ${selectedVariant === index
                      ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                    }
                  `}
                >
                  {v.size || v.color}
                </button>
              ))}
              {product.variants.length > 4 && (
                <button className="px-3 py-1 text-xs border border-white/10 text-white/40">
                  +{product.variants.length - 4}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="text-2xl font-light">
              ${suggestedPrice}
            </div>
            <div className="text-xs text-white/40">
              Base: ${product.basePrice}
            </div>
          </div>
          <button className="text-accent-gold hover:text-accent-hover transition-colors text-sm tracking-wider uppercase">
            Details →
          </button>
        </div>
      </div>
    </div>
  )
}
