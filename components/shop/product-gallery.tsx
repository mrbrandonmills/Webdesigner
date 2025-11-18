'use client'

import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  productTitle: string
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImage = images[currentIndex] || images[0]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection
    if (newIndex >= 0 && newIndex < images.length) {
      setDirection(newDirection)
      setCurrentIndex(newIndex)
    }
  }

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold && currentIndex < images.length - 1) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold && currentIndex > 0) {
      paginate(-1)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main Image Display */}
      <div className="relative flex-1 bg-black/20 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={currentImage}
            alt={`${productTitle} - Image ${currentIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-contain ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            onClick={() => setIsZoomed(!isZoomed)}
            whileHover={{ scale: isZoomed ? 1.5 : 1.02 }}
            style={{
              scale: isZoomed ? 1.5 : 1,
            }}
          />
        </AnimatePresence>

        {/* Zoom Indicator */}
        <motion.div
          className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm text-white rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ZoomIn size={20} />
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Next Button */}
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => paginate(1)}
              disabled={currentIndex === images.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentIndex + 1} / {images.length}
          </motion.div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <motion.div
          className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-accent-gold scale-105'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              whileHover={{ scale: index === currentIndex ? 1.05 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 border-2 border-accent-gold"
                  layoutId="thumbnail-highlight"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Swipe Indicator for Mobile */}
      <motion.div
        className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.1, 0.9, 1] }}
      >
        ← Swipe to browse →
      </motion.div>
    </div>
  )
}
