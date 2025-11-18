'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ExternalLink, Check, Heart, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { UnifiedProduct } from '@/lib/types/shop'
import { ProductGallery } from './product-gallery'
import { MockupGenerator } from './mockup-generator'

interface ProductDetailModalProps {
  product: UnifiedProduct | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(0)
      setQuantity(1)
      setAddedToCart(false)
    }
  }, [product])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!product) return null

  const handleAddToCart = async () => {
    // TODO: Implement actual cart logic
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  // Determine product type for mockup generation
  const getProductType = (): 'tshirt' | 'poster' | 'mug' | 'hoodie' | 'totebag' => {
    if (product.tags?.includes('poster') || product.category?.includes('poster')) return 'poster'
    if (product.tags?.includes('mug') || product.category?.includes('mug')) return 'mug'
    if (product.tags?.includes('hoodie') || product.category?.includes('hoodie')) return 'hoodie'
    if (product.tags?.includes('tote') || product.category?.includes('tote')) return 'totebag'
    return 'tshirt'
  }

  // Get images with mockup fallback
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images
    }
    return [product.image]
  }

  const images = getProductImages()
  const productType = getProductType()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 z-20 p-3 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            {/* Action Buttons */}
            <div className="absolute top-6 right-20 z-20 flex gap-2">
              <motion.button
                className={`p-3 backdrop-blur-sm transition-colors ${
                  isFavorited
                    ? 'bg-red-500/80 text-white'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                onClick={() => setIsFavorited(!isFavorited)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
              </motion.button>

              <motion.button
                className="p-3 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={20} />
              </motion.button>
            </div>

            {/* Content Grid */}
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
              <div className="container-wide py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-full">
                {/* Left: Image Gallery */}
                <motion.div
                  className="relative h-[600px] lg:h-full"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {images.length > 1 ? (
                    <ProductGallery images={images} productTitle={product.title} />
                  ) : (
                    <div className="h-full">
                      <MockupGenerator
                        designImage={product.image}
                        productType={productType}
                        productTitle={product.title}
                      />
                    </div>
                  )}
                </motion.div>

                {/* Right: Product Details */}
                <motion.div
                  className="flex flex-col justify-between space-y-8"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-6">
                    {/* Category Badge */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 border border-accent-gold/40 bg-accent-gold/10 text-accent-gold text-xs tracking-wider uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                      {product.title}
                    </h2>

                    {/* Rating (Amazon products) */}
                    {product.rating && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.05 }}
                            >
                              <div
                                className={`w-5 h-5 ${
                                  i < Math.floor(product.rating!)
                                    ? 'text-accent-gold'
                                    : 'text-white/20'
                                }`}
                              >
                                ★
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <span className="text-white/60">
                          {product.rating} ({product.reviewCount?.toLocaleString()} reviews)
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-light text-accent-gold">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-2xl text-white/40 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium uppercase tracking-wider">
                            Save ${(product.originalPrice - product.price).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                      <p className="text-lg text-white/70 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Features (Amazon products) */}
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm uppercase tracking-wider text-white/60">
                          Key Features
                        </h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start gap-3 text-white/80"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                            >
                              <Check size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Variant Selector (Printful products) */}
                    {product.variants && product.variants.length > 1 && (
                      <div className="space-y-3">
                        <h3 className="text-sm uppercase tracking-wider text-white/60">
                          Select Size
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                          {product.variants.map((variant, index) => (
                            <motion.button
                              key={variant.id}
                              className={`px-6 py-3 border-2 transition-all ${
                                selectedVariant === index
                                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                                  : 'border-white/20 hover:border-white/40 text-white/80'
                              }`}
                              onClick={() => setSelectedVariant(index)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {variant.dimensions || variant.name || variant.size}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector (Printful products) */}
                    {product.source === 'printful' && (
                      <div className="space-y-3">
                        <h3 className="text-sm uppercase tracking-wider text-white/60">
                          Quantity
                        </h3>
                        <div className="flex items-center gap-4">
                          <motion.button
                            className="p-3 border border-white/20 hover:border-accent-gold hover:bg-accent-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Minus size={20} />
                          </motion.button>

                          <span className="text-2xl font-light w-16 text-center">
                            {quantity}
                          </span>

                          <motion.button
                            className="p-3 border border-white/20 hover:border-accent-gold hover:bg-accent-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setQuantity(Math.min(99, quantity + 1))}
                            disabled={quantity >= 99}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus size={20} />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    {product.source === 'amazon' ? (
                      <motion.a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-8 py-4 bg-accent-gold text-black hover:bg-accent-hover transition-colors text-center text-lg tracking-wider uppercase font-medium flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>View on Amazon</span>
                        <ExternalLink size={20} />
                      </motion.a>
                    ) : (
                      <motion.button
                        className={`w-full px-8 py-4 transition-all text-lg tracking-wider uppercase font-medium flex items-center justify-center gap-3 ${
                          addedToCart
                            ? 'bg-green-500 text-white'
                            : 'bg-accent-gold text-black hover:bg-accent-hover'
                        }`}
                        onClick={handleAddToCart}
                        disabled={addedToCart}
                        whileHover={{ scale: addedToCart ? 1 : 1.02 }}
                        whileTap={{ scale: addedToCart ? 1 : 0.98 }}
                      >
                        {addedToCart ? (
                          <>
                            <Check size={20} />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={20} />
                            <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                          </>
                        )}
                      </motion.button>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center justify-center gap-2 text-sm">
                      {product.inStock ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-white/60">In Stock - Ships in 2-3 days</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span className="text-white/60">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
