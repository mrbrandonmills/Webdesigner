'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
}

interface ProductGalleryProps {
  images: ProductImage[]
  productTitle: string
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const currentImage = images[selectedIndex] || images[0]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false)
          setIsZoomed(false)
        } else if (e.key === 'ArrowLeft') {
          handlePrevious()
        } else if (e.key === 'ArrowRight') {
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, selectedIndex])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen])

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-6xl mb-4">📷</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative group">
        <div
          ref={imageRef}
          className="aspect-square bg-white/5 rounded-3xl overflow-hidden relative cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
        >
          <motion.img
            key={currentImage.id}
            src={currentImage.url}
            alt={currentImage.alt || productTitle}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              transform: isZoomed ? `scale(2) translate(${50 - mousePosition.x}%, ${50 - mousePosition.y}%)` : 'scale(1)',
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Zoom indicator overlay */}
          <div
            className={`
              absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center
              transition-opacity duration-300 pointer-events-none
              ${isZoomed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
            `}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-full p-6">
              <ZoomIn className="text-white" size={32} />
            </div>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="absolute top-6 right-6 p-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Navigation arrows for multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`
                aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300
                ${
                  index === selectedIndex
                    ? 'border-accent-gold shadow-lg shadow-accent-gold/30 scale-105'
                    : 'border-white/10 hover:border-accent-gold/50 hover:scale-105'
                }
              `}
            >
              <img
                src={image.url}
                alt={image.alt || `${productTitle} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 z-10"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-accent-gold hover:border-accent-gold hover:text-black transition-all duration-300 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-lg">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* Main image in lightbox */}
            <motion.div
              key={currentImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl max-h-[90vh] mx-auto px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.url}
                alt={currentImage.alt || productTitle}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
