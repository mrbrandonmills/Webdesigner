'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, ShoppingBag, Star, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'
import { UnifiedProduct } from '@/lib/types/shop'
import { MockupGenerator } from './mockup-generator'

interface EnhancedProductCardProps {
  product: UnifiedProduct
  onQuickView: (product: UnifiedProduct) => void
  featured?: boolean
}

export function EnhancedProductCard({
  product,
  onQuickView,
  featured = false
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Magnetic hover effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = (e.clientX - rect.left - width / 2) / width
    const y = (e.clientY - rect.top - height / 2) / height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  // Get category badge info
  const getCategoryBadge = () => {
    if (product.tags?.includes('poetry')) return { label: 'Poetry', color: 'bg-accent-gold/20 text-accent-gold border-accent-gold/40' }
    if (product.tags?.includes('photography')) return { label: 'Photography', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    if (product.tags?.includes('philosophy')) return { label: 'Philosophy', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
    return null
  }

  const badge = getCategoryBadge()
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Determine mockup type for CSS-based mockup generation
  const mockupType = product.productType === 'phone-case' || product.productType === 'wall-art'
    ? undefined
    : product.productType as 'tshirt' | 'poster' | 'mug' | 'hoodie' | 'totebag' | undefined

  // Use CSS mockup for Printful products, fallback to image for Amazon/others
  const canUseMockup = product.source === 'printful' && mockupType
  const hoverImage = !canUseMockup && product.images && product.images.length > 1 ? product.images[1] : null

  return (
    <motion.div
      ref={cardRef}
      className={`group relative overflow-hidden glass-card ${
        featured ? 'col-span-1 md:col-span-2 row-span-1 md:row-span-2' : ''
      }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201, 160, 80, 0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%',
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Image Container with Parallax */}
      <motion.div
        className={`relative overflow-hidden ${featured ? 'aspect-[16/10]' : 'aspect-[3/4]'}`}
        style={{
          rotateX: featured ? 0 : rotateX,
          rotateY: featured ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Primary Image */}
        <motion.img
          src={product.image}
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
        )}

        {/* CSS-based Mockup for Printful products */}
        {canUseMockup && mockupType && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MockupGenerator
              designImage={product.image}
              productType={mockupType}
              productTitle={product.title}
            />
          </motion.div>
        )}

        {/* Hover Image (fallback for Amazon/other products) - Cross-fade */}
        {hoverImage && (
          <motion.img
            src={hoverImage}
            alt={`${product.title} mockup`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 0.8 : 0.6 }}
          transition={{ duration: 0.4 }}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            {/* Category Badge */}
            {badge && (
              <motion.div
                className={`px-3 py-1 glass-badge text-xs tracking-wider uppercase ${badge.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {badge.label}
              </motion.div>
            )}

            {/* Featured Badge */}
            {featured && (
              <motion.div
                className="px-3 py-1 glass-badge bg-accent-gold/20 border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase flex items-center gap-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={12} />
                Featured
              </motion.div>
            )}

            {/* Limited Edition Badge */}
            {product.tags?.includes('limited-edition') && (
              <motion.div
                className="px-3 py-1 glass-badge bg-red-500/20 border-red-500/40 text-red-400 text-xs tracking-wider uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Limited Edition
              </motion.div>
            )}
          </div>

          {/* Discount Badge */}
          {hasDiscount && discount > 0 && (
            <motion.div
              className="px-3 py-1 glass-badge bg-green-500/20 border-green-500/40 text-green-400 text-xs tracking-wider uppercase"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              -{discount}%
            </motion.div>
          )}
        </div>

        {/* Rating (Amazon products) */}
        {product.rating && (
          <motion.div
            className="absolute bottom-4 left-4 flex items-center gap-2 glass-badge px-3 py-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <Star size={14} className="fill-accent-gold text-accent-gold" />
            <span className="text-sm font-medium">{product.rating}</span>
            {product.reviewCount && (
              <span className="text-xs text-white/60">({product.reviewCount.toLocaleString()})</span>
            )}
          </motion.div>
        )}

        {/* Hover Overlay with CTA */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="px-6 py-3 glass-button bg-white/90 text-black font-medium text-sm tracking-wider uppercase hover:bg-accent-gold/90 transition-colors"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => onQuickView(product)}
          >
            Quick View
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        className="p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Title */}
        <h3 className="text-xl font-serif font-light group-hover:text-accent-gold transition-colors duration-300 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-light text-accent-gold">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-white/40 line-through">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variant Count */}
          {product.variantCount && product.variantCount > 1 && (
            <span className="text-xs text-white/40 uppercase tracking-wider">
              {product.variantCount} options
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 pt-2">
          {product.source === 'amazon' ? (
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 glass-button bg-accent-gold/90 text-black hover:bg-accent-gold transition-colors text-center text-sm tracking-wider uppercase flex items-center justify-center gap-2 group/btn"
            >
              <span>View on Amazon</span>
              <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          ) : (
            <>
              <motion.button
                className="flex-1 px-6 py-3 glass-button hover:border-accent-gold hover:bg-accent-gold/10 transition-all text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Shimmer effect for loading state
export function ProductCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`overflow-hidden bg-white/5 border border-white/10 ${
      featured ? 'col-span-1 md:col-span-2 row-span-1 md:row-span-2' : ''
    }`}>
      <div className={`relative ${featured ? 'aspect-[16/10]' : 'aspect-[3/4]'} bg-gradient-to-br from-white/10 to-white/5 animate-pulse`} />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 animate-pulse rounded" />
        <div className="h-4 bg-white/5 animate-pulse rounded" />
        <div className="h-4 bg-white/5 animate-pulse rounded w-2/3" />
        <div className="h-8 bg-white/10 animate-pulse rounded" />
      </div>
    </div>
  )
}
