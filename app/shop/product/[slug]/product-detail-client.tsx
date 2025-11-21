'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ShoppingBag, Check, Minus, Plus, ZoomIn, Truck, Shield, Award } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  category: string
  image: string
  price: number
  syncProductId?: number
  source: 'printful'
  productType: string
  tags: string[]
  description: string
  inStock: boolean
  featured: boolean
}

interface PrintfulProductDetailProps {
  product: Product
}

// Product size variants based on product type
const PRODUCT_VARIANTS: Record<string, { name: string; price: number; dimensions?: string }[]> = {
  poster: [
    { name: '12×16"', price: 0, dimensions: '12" × 16"' },
    { name: '18×24"', price: 15, dimensions: '18" × 24"' },
    { name: '24×36"', price: 35, dimensions: '24" × 36"' },
  ],
  'wall-art': [
    { name: '12×12"', price: 0, dimensions: '12" × 12" Framed' },
    { name: '18×18"', price: 45, dimensions: '18" × 18" Framed' },
    { name: '24×24"', price: 95, dimensions: '24" × 24" Framed' },
  ],
  mug: [
    { name: '11oz', price: 0, dimensions: '11oz Ceramic' },
    { name: '15oz', price: 3, dimensions: '15oz Ceramic' },
  ],
  tshirt: [
    { name: 'S', price: 0 },
    { name: 'M', price: 0 },
    { name: 'L', price: 0 },
    { name: 'XL', price: 0 },
    { name: '2XL', price: 3 },
    { name: '3XL', price: 5 },
  ],
  hoodie: [
    { name: 'S', price: 0 },
    { name: 'M', price: 0 },
    { name: 'L', price: 0 },
    { name: 'XL', price: 0 },
    { name: '2XL', price: 5 },
  ],
  totebag: [
    { name: 'Standard', price: 0, dimensions: '16" × 16"' },
  ],
  'phone-case': [
    { name: 'iPhone 14', price: 0 },
    { name: 'iPhone 15', price: 0 },
    { name: 'iPhone 15 Pro', price: 0 },
    { name: 'iPhone 15 Pro Max', price: 0 },
  ],
}

export function PrintfulProductDetail({ product }: PrintfulProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageZoomed, setImageZoomed] = useState(false)

  const variants = PRODUCT_VARIANTS[product.productType] || PRODUCT_VARIANTS.poster
  const currentVariant = variants[selectedVariant]
  const totalPrice = product.price + (currentVariant?.price || 0)

  const handleAddToCart = async () => {
    setAddingToCart(true)

    try {
      // Call Stripe checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            name: `${product.title} - ${currentVariant.name}`,
            price: totalPrice,
            quantity,
            image: product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`,
            syncProductId: product.syncProductId,
            variant: currentVariant.name,
          }],
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        if (url) {
          window.location.href = url
        }
      } else {
        // Fallback to cart animation
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
    } finally {
      setAddingToCart(false)
    }
  }

  // Get category badge color
  const getCategoryColor = () => {
    switch (product.category) {
      case 'poetry':
        return 'bg-accent-gold/20 text-accent-gold border-accent-gold/40'
      case 'photography':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40'
      case 'philosophy':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      default:
        return 'bg-white/10 text-white/80 border-white/20'
    }
  }

  return (
    <section className="pb-20 container-wide">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image - Full size, proper aspect ratio for portrait photography */}
            <div
              className={`relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden cursor-zoom-in transition-all duration-500 ${
                imageZoomed ? 'fixed inset-4 z-50 cursor-zoom-out' : 'aspect-[3/4]'
              }`}
              onClick={() => setImageZoomed(!imageZoomed)}
              style={{
                boxShadow: 'inset 0 0 60px rgba(201, 160, 80, 0.03), 0 0 80px rgba(201, 160, 80, 0.05)',
              }}
            >
              {/* The image - object-contain to show FULL design without cropping */}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 px-3 py-2 glass-button flex items-center gap-2 text-xs">
                <ZoomIn size={14} />
                {imageZoomed ? 'Click to close' : 'Click to zoom'}
              </div>

              {/* Category badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 border text-xs tracking-wider uppercase ${getCategoryColor()}`}>
                {product.category}
              </div>
            </div>

            {/* Zoom backdrop */}
            {imageZoomed && (
              <motion.div
                className="fixed inset-0 bg-black/90 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setImageZoomed(false)}
              />
            )}

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                <Truck size={24} className="text-accent-gold mx-auto" />
                <p className="text-xs text-white/70">Free US Shipping</p>
              </div>
              <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                <Shield size={24} className="text-accent-gold mx-auto" />
                <p className="text-xs text-white/70">Quality Guaranteed</p>
              </div>
              <div className="border border-white/10 p-4 text-center space-y-2 bg-white/[0.02]">
                <Award size={24} className="text-accent-gold mx-auto" />
                <p className="text-xs text-white/70">Museum Quality</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Title */}
            <div className="space-y-4">
              <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                Brandon Mills Collection
              </p>
              <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight text-white">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="border-t border-b border-white/10 py-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-light text-accent-gold">
                  ${totalPrice.toFixed(2)}
                </span>
                {currentVariant?.price > 0 && (
                  <span className="text-sm text-white/40">
                    (base ${product.price.toFixed(2)} + ${currentVariant.price.toFixed(2)})
                  </span>
                )}
              </div>
              <p className="text-sm text-green-400 mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                In Stock - Ships in 2-5 business days
              </p>
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-white/60">
                  Select {product.productType === 'tshirt' || product.productType === 'hoodie' ? 'Size' : 'Option'}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {variants.map((variant, index) => (
                    <motion.button
                      key={variant.name}
                      className={`px-6 py-3 border transition-all ${
                        selectedVariant === index
                          ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                          : 'border-white/20 text-white/80 hover:border-white/40'
                      }`}
                      onClick={() => setSelectedVariant(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{variant.name}</span>
                      {variant.dimensions && (
                        <span className="block text-xs opacity-60 mt-1">{variant.dimensions}</span>
                      )}
                      {variant.price > 0 && (
                        <span className="block text-xs text-accent-gold mt-1">+${variant.price}</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-white/60">Quantity</h3>
              <div className="flex items-center gap-4">
                <motion.button
                  className="p-3 border border-white/20 hover:border-white/40 transition-colors disabled:opacity-30"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus size={20} />
                </motion.button>
                <span className="text-2xl font-light w-16 text-center">{quantity}</span>
                <motion.button
                  className="p-3 border border-white/20 hover:border-white/40 transition-colors disabled:opacity-30"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="space-y-4 pt-4">
              <motion.button
                className={`w-full py-5 px-8 font-medium tracking-wider text-lg flex items-center justify-center gap-3 transition-all ${
                  addedToCart
                    ? 'bg-green-500/90 border-green-500 text-white'
                    : 'bg-accent-gold hover:bg-accent-hover text-black border-accent-gold'
                } border`}
                onClick={handleAddToCart}
                disabled={addingToCart || addedToCart}
                whileHover={{ scale: addedToCart ? 1 : 1.02 }}
                whileTap={{ scale: addedToCart ? 1 : 0.98 }}
              >
                {addingToCart ? (
                  <span className="animate-pulse">Processing...</span>
                ) : addedToCart ? (
                  <>
                    <Check size={24} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} />
                    <span>Buy Now - ${(totalPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-white/40 text-center">
                Secure checkout powered by Stripe
              </p>
            </div>

            {/* Product Details */}
            <div className="border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <h3 className="text-accent-gold text-sm tracking-wider uppercase">Product Details</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/80 text-sm">
                  <Check size={18} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-start gap-3 text-white/80 text-sm">
                  <Check size={18} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Vibrant, fade-resistant printing</span>
                </li>
                <li className="flex items-start gap-3 text-white/80 text-sm">
                  <Check size={18} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Produced on-demand in the USA</span>
                </li>
                <li className="flex items-start gap-3 text-white/80 text-sm">
                  <Check size={18} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Eco-friendly production</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
