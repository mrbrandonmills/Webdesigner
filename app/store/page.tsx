'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Sparkles } from 'lucide-react'
import ScrollReveal from '@/components/scroll-reveal'
import { useCart } from '@/contexts/cart-context'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { RippleButton } from '@/components/ripple-button'

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        console.log('✅ API Success! Received data:', {
          success: data.success,
          isArray: Array.isArray(data.products),
          count: data.count,
          productsLength: data.products?.length
        })

        if (Array.isArray(data.products)) {
          console.log('📦 First product sample:', JSON.stringify(data.products[0], null, 2))

          // Just use the products directly - API already validated them
          setProducts(data.products)
          console.log(`✨ Set ${data.products.length} products to state`)
        } else {
          console.error('❌ Products is not an array:', typeof data.products)
          setProducts([])
        }
      } else {
        console.error('❌ API returned success: false', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
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
      <section className="pt-40 pb-32 container-wide relative overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-8">
              <Sparkles className="text-accent-gold" size={20} />
              <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
                Curated Collection
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light font-serif leading-[0.9] tracking-tight mb-8">
              The Collection
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="luxury-divider max-w-md mx-auto"></div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
              Where philosophy meets performance
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-loose font-light">
              Each piece created on-demand with museum-quality materials. Featuring work from editorial shoots,
              creative projects, and original designs — crafted for those who seek depth in every detail.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-20 container-wide">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 font-light mb-4">
              Explore By Category
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <ScrollReveal key={category.id || 'all'} direction="up" delay={index * 0.1}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  group relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-500 text-left overflow-hidden
                  transform hover:scale-105 hover:-translate-y-1
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/40 shadow-2xl shadow-accent-gold/30'
                    : 'bg-white/5 border border-white/10 hover:border-accent-gold/30 hover:bg-white/10 hover:shadow-xl hover:shadow-white/5'
                  }
                `}
              >
                {/* Animated gradient orb */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-gold/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {category.icon}
                  </div>
                  <div className="font-serif text-base mb-2 group-hover:text-accent-gold transition-colors duration-300">
                    {category.label}
                  </div>
                  <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300 leading-relaxed">
                    {category.desc}
                  </div>
                </div>

                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="pb-20 container-wide">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent-gold transition-all duration-300 z-10 group-focus-within:scale-110" size={20} />
            <input
              type="text"
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-16 pr-6 py-5 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 focus:shadow-lg focus:shadow-accent-gold/10 transition-all duration-500"
            />
            {/* Glow effect on focus */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold/20 via-accent-gold/10 to-accent-gold/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
          </div>
        </ScrollReveal>
      </section>

      {/* Products Grid */}
      <section className="pb-32 container-wide">
        {loading ? (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-white/60 font-light tracking-wide">Curating your collection...</p>
            </div>
            <ProductGridSkeleton count={9} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-block p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-6">
              <Search size={64} className="text-white/20" />
            </div>
            <h3 className="text-3xl font-serif text-white/60 mb-4">No products found</h3>
            <p className="text-white/40 font-light">Try adjusting your search or browse all categories</p>
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
              {filteredProducts.map((product, index) => {
                try {
                  return (
                    <ScrollReveal key={product.id} direction="up" delay={index * 0.1}>
                      <ProductCard product={product} />
                    </ScrollReveal>
                  )
                } catch (error) {
                  console.error('Error rendering product:', product.id, error)
                  return null
                }
              })}
            </div>
          </>
        )}
      </section>

      {/* Info Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="luxury-divider mb-20"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🎨',
                title: 'Museum Quality',
                desc: 'Premium materials and professional printing on every piece',
              },
              {
                icon: '🚚',
                title: 'Made to Order',
                desc: 'Each item crafted when you order, reducing waste',
              },
              {
                icon: '🌍',
                title: 'Global Shipping',
                desc: 'Worldwide fulfillment from local facilities',
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} direction="up" delay={index * 0.15}>
                <div className="group text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-accent-gold/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-accent-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.5}>
            <div className="luxury-divider mt-20"></div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const variant = product.variants?.[selectedVariant]
  const { addItem } = useCart()

  // Return null if no variants
  if (!product.variants || product.variants.length === 0) {
    return null
  }

  // Strategic pricing based on product type and positioning
  const getStrategicPrice = (product: Product): string => {
    const basePrice = parseFloat(product.basePrice) || 0
    const type = (product.type || '').toLowerCase()

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
      variantName: variant.name || `${variant.size || ''} ${variant.color || ''}`.trim() || 'Default',
      image: variant.image || product.image || '',
      price: suggestedPrice,
      type: product.type,
      brand: product.brand,
    })
  }

  return (
    <div className="group relative">
      {/* Glow effect behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10 scale-95 group-hover:scale-100"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transform transition-all duration-500 hover:border-accent-gold/30 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-white/10 to-white/5 relative">
        {variant?.image || product.image ? (
          <>
            <img
              src={variant?.image || product.image || ''}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-sm">Image coming soon</p>
            </div>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <RippleButton
            onClick={handleAddToCart}
            className="relative px-8 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full group/btn transform hover:scale-105 transition-all duration-300 shadow-xl shadow-accent-gold/30"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 pointer-events-none"></div>

            <span className="relative z-10 flex items-center gap-3">
              <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform duration-300" />
              <span>Add to Cart</span>
            </span>
          </RippleButton>
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg">
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
            <p className="text-xs text-white/40 mb-3 tracking-[0.2em] uppercase font-light">
              {product.variantCount} Options Available
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.slice(0, 4).map((v, index) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(index)}
                  className={`
                    px-4 py-2 text-xs rounded-full border backdrop-blur-sm transition-all duration-300
                    transform hover:scale-105
                    ${selectedVariant === index
                      ? 'border-accent-gold bg-accent-gold/20 text-accent-gold shadow-lg shadow-accent-gold/20'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-accent-gold/50 hover:bg-white/10'
                    }
                  `}
                >
                  {v.size || v.color}
                </button>
              ))}
              {product.variants.length > 4 && (
                <button className="px-4 py-2 text-xs rounded-full border border-white/10 bg-white/5 text-white/40 backdrop-blur-sm">
                  +{product.variants.length - 4}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div>
            <div className="text-3xl font-light text-accent-gold mb-1">
              ${suggestedPrice}
            </div>
            <div className="text-xs text-white/30 font-light">
              Base: ${product.basePrice}
            </div>
          </div>
          <button className="group/details flex items-center gap-2 text-accent-gold hover:text-accent-hover transition-all duration-300 text-sm tracking-[0.15em] uppercase">
            <span>Details</span>
            <span className="group-hover/details:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}
