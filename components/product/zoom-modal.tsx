'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface GalleryImage {
  id: string
  url: string
  alt: string
}

interface ZoomModalProps {
  isOpen: boolean
  onClose: () => void
  images: GalleryImage[]
  initialIndex: number
  productName: string
  editionInfo?: {
    isLimited: boolean
    editionNumber?: number
    editionSize?: number
  }
}

/**
 * Full-screen zoom modal for museum-quality image viewing
 * Features:
 * - High-resolution display
 * - Keyboard navigation (arrows, ESC)
 * - Smooth animations
 * - Product name overlay
 * - Edition information display
 * - Dark luxury aesthetic
 */
export default function ZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  productName,
  editionInfo,
}: ZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  // Sync with parent component's index
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Keyboard navigation and shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZoomed((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200]"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          }}
          onClick={onClose}
        >
          {/* Top Bar - Controls */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="container-wide flex items-center justify-between">
              {/* Product Name */}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-serif text-white mb-1">
                  {productName}
                </h2>
                {editionInfo?.isLimited && (
                  <div className="flex items-center gap-2 text-sm text-accent-gold">
                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                    <span className="tracking-wider uppercase">
                      {editionInfo.editionNumber && editionInfo.editionSize
                        ? `Edition ${editionInfo.editionNumber} of ${editionInfo.editionSize}`
                        : 'Limited Edition'}
                    </span>
                  </div>
                )}
              </div>

              {/* Zoom Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsZoomed(!isZoomed)
                }}
                className="p-3 glass-button rounded-full mr-3"
                aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
              >
                {isZoomed ? (
                  <ZoomOut className="w-5 h-5 text-white" strokeWidth={1.5} />
                ) : (
                  <ZoomIn className="w-5 h-5 text-white" strokeWidth={1.5} />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-3 glass-button rounded-full group"
                aria-label="Close viewer"
              >
                <X className="w-6 h-6 text-white group-hover:text-accent-gold transition-colors" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          {/* Main Image Container */}
          <div
            className="h-full flex items-center justify-center p-6 md:p-20"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full max-w-7xl"
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />

                {/* Museum-style frame effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-gold/40" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-gold/40" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-gold/40" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent-gold/40" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white rounded-full flex items-center justify-center group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 group-hover:text-accent-gold transition-colors" strokeWidth={1.5} />
              </motion.button>

              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white rounded-full flex items-center justify-center group"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 group-hover:text-accent-gold transition-colors" strokeWidth={1.5} />
              </motion.button>
            </>
          )}

          {/* Bottom Bar - Image Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div className="container-wide flex items-center justify-between">
              {/* Image counter */}
              <div className="px-6 py-3 glass-badge rounded-full">
                <span className="text-white font-medium tracking-wider">
                  <span className="text-accent-gold">{currentIndex + 1}</span>
                  <span className="text-white/60 mx-2">/</span>
                  <span>{images.length}</span>
                </span>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 glass-badge rounded text-xs">&#8592;</kbd>
                  <kbd className="px-2 py-1 glass-badge rounded text-xs">&#8594;</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 glass-badge rounded text-xs">Z</kbd>
                  <span>Zoom</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 glass-badge rounded text-xs">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subtle paper texture overlay for luxury feel */}
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
