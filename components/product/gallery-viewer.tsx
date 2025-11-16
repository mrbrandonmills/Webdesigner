'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import ZoomModal from './zoom-modal'

interface GalleryImage {
  id: string
  url: string
  alt: string
  position?: number
  isMain?: boolean
}

interface GalleryViewerProps {
  images: GalleryImage[]
  productName: string
  editionInfo?: {
    isLimited: boolean
    editionNumber?: number
    editionSize?: number
  }
}

/**
 * Museum-quality gallery viewer for $5,000 limited edition prints
 * Features:
 * - Full-screen zoom capability
 * - Smooth transitions with luxury feel
 * - Keyboard navigation (arrows, ESC)
 * - Thumbnail grid with active states
 * - Gold accent interactions
 * - Mobile responsive
 */
export default function GalleryViewer({ images, productName, editionInfo }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentIndex] || images[0]

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl flex items-center justify-center border border-white/10">
        <div className="text-center text-white/40">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-sm tracking-wider uppercase">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Gallery Frame - Museum Quality */}
      <motion.div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Main Image Container */}
        <div
          className="relative aspect-[3/4] bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden cursor-zoom-in border border-white/10 hover:border-accent-gold/30 transition-all duration-700"
          onClick={() => setIsZoomOpen(true)}
        >
          {/* Image with smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={currentIndex === 0}
                quality={95}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gold Frame Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top gold accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {/* Bottom gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {/* Left gold accent */}
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {/* Right gold accent */}
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Zoom hint overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-black/80 backdrop-blur-xl border border-accent-gold/50 rounded-full p-6 shadow-2xl shadow-accent-gold/20"
            >
              <ZoomIn className="w-8 h-8 text-accent-gold" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Navigation Arrows (for multiple images) */}
          {images.length > 1 && (
            <>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : -20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/20 hover:border-accent-gold hover:bg-accent-gold/10 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/20 hover:border-accent-gold hover:bg-accent-gold/10 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
              </motion.button>
            </>
          )}

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-xl border border-accent-gold/30 text-white text-sm tracking-wider rounded-full"
            >
              <span className="text-accent-gold font-medium">{currentIndex + 1}</span>
              <span className="text-white/60 mx-1">/</span>
              <span className="text-white/90">{images.length}</span>
            </motion.div>
          )}

          {/* Fullscreen Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomOpen(true)
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 p-3 bg-black/80 backdrop-blur-xl border border-white/20 hover:border-accent-gold hover:bg-accent-gold/10 text-white rounded-full transition-all duration-300 z-10"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>

          {/* Limited Edition Badge */}
          {editionInfo?.isLimited && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute top-4 left-4 px-4 py-2 bg-accent-gold/90 backdrop-blur-xl border border-accent-gold text-black rounded-full z-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase">
                  {editionInfo.editionNumber && editionInfo.editionSize
                    ? `${editionInfo.editionNumber}/${editionInfo.editionSize}`
                    : 'Limited Edition'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Thumbnail Grid - Christie's Auction Style */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-4 gap-4"
        >
          {images.map((image, index) => (
            <motion.button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative aspect-square overflow-hidden border-2 transition-all duration-500
                ${
                  index === currentIndex
                    ? 'border-accent-gold shadow-lg shadow-accent-gold/30 bg-accent-gold/5'
                    : 'border-white/10 hover:border-accent-gold/50'
                }
              `}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                quality={85}
              />

              {/* Active indicator */}
              {index === currentIndex && (
                <motion.div
                  layoutId="activeThumb"
                  className="absolute inset-0 border-2 border-accent-gold pointer-events-none"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Zoom Modal */}
      <ZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={images}
        initialIndex={currentIndex}
        productName={productName}
        editionInfo={editionInfo}
      />
    </div>
  )
}
