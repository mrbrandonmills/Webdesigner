'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface MockupGeneratorProps {
  designImage: string
  productType: 'tshirt' | 'poster' | 'mug' | 'hoodie' | 'totebag'
  productTitle: string
}

export function MockupGenerator({
  designImage,
  productType,
  productTitle,
}: MockupGeneratorProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // T-Shirt Mockup
  if (productType === 'tshirt') {
    return (
      <div className="relative w-full aspect-[3/4] bg-neutral-900 overflow-hidden">
        {/* T-shirt silhouette background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[70%] h-[60%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {/* Design overlay on shirt */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={designImage}
                alt={productTitle}
                className="w-[85%] h-[85%] object-contain mix-blend-lighten"
                style={{
                  filter: 'contrast(1.1) saturate(1.2) brightness(1.1)',
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Subtle shadow for depth */}
            <div className="absolute inset-0 shadow-2xl pointer-events-none" />
          </motion.div>
        </div>

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[70%] h-[60%] bg-white/5 animate-pulse rounded" />
          </div>
        )}

        {/* Mockup label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs uppercase tracking-wider">
          T-Shirt Preview
        </div>
      </div>
    )
  }

  // Poster Mockup
  if (productType === 'poster') {
    return (
      <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-neutral-100 to-neutral-200 p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* White mat border */}
        <motion.div
          className="relative w-full h-full bg-white p-4 md:p-6 shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.95 }}
          transition={{ duration: 0.6 }}
        >
          {/* Design in frame */}
          <div className="relative w-full h-full border border-neutral-200">
            <img
              src={designImage}
              alt={productTitle}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-8 md:inset-12">
            <div className="w-full h-full bg-white/50 animate-pulse" />
          </div>
        )}

        {/* Mockup label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs uppercase tracking-wider">
          Framed Print Preview
        </div>

        {/* Wall texture overlay */}
        <div className="absolute inset-0 opacity-5 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" /%3E%3C/svg%3E")',
          }}
        />
      </div>
    )
  }

  // Mug Mockup
  if (productType === 'mug') {
    return (
      <div className="relative w-full aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-[70%] h-[70%]"
          initial={{ opacity: 0, rotateY: -30 }}
          animate={{ opacity: imageLoaded ? 1 : 0, rotateY: imageLoaded ? 0 : -30 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        >
          {/* Mug body with cylindrical perspective */}
          <div className="relative w-full h-full">
            {/* White mug base */}
            <div
              className="absolute inset-0 bg-white shadow-xl"
              style={{
                borderRadius: '45% 45% 50% 50% / 55% 55% 45% 45%',
                boxShadow: '10px 10px 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.1)',
              }}
            />

            {/* Design on mug */}
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="w-[60%] h-[45%] overflow-hidden"
                style={{
                  transform: 'perspective(400px) rotateY(-8deg)',
                }}
              >
                <img
                  src={designImage}
                  alt={productTitle}
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>

            {/* Mug handle */}
            <div
              className="absolute right-[-15%] top-[20%] w-[30%] h-[40%] border-4 border-white rounded-r-full"
              style={{
                boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.1)',
              }}
            />

            {/* Rim highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-[8%] bg-gradient-to-b from-white to-transparent opacity-60"
              style={{
                borderRadius: '45% 45% 0 0 / 55% 55% 0 0',
              }}
            />
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[70%] h-[70%] bg-white/50 animate-pulse rounded-full" />
          </div>
        )}

        {/* Mockup label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs uppercase tracking-wider">
          Mug Preview
        </div>
      </div>
    )
  }

  // Hoodie Mockup
  if (productType === 'hoodie') {
    return (
      <div className="relative w-full aspect-[3/4] bg-neutral-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[75%] h-[65%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {/* Design on hoodie */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={designImage}
                alt={productTitle}
                className="w-[80%] h-[80%] object-contain mix-blend-lighten"
                style={{
                  filter: 'contrast(1.15) saturate(1.3) brightness(1.1)',
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Hood shadow overlay */}
            <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-black/30 to-transparent" />
          </motion.div>
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[75%] h-[65%] bg-white/5 animate-pulse rounded" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs uppercase tracking-wider">
          Hoodie Preview
        </div>
      </div>
    )
  }

  // Tote Bag Mockup
  if (productType === 'totebag') {
    return (
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-300 flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-[60%] h-[70%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tote bag body */}
          <div className="relative w-full h-full bg-[#f5f5dc] shadow-2xl"
            style={{
              clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
            }}
          >
            {/* Design on bag */}
            <div className="absolute inset-[15%] flex items-center justify-center">
              <img
                src={designImage}
                alt={productTitle}
                className="w-full h-full object-contain"
                style={{
                  filter: 'contrast(1.1) saturate(1.2)',
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Bag handles */}
            <div className="absolute top-0 left-[20%] w-[20%] h-[15%] border-t-4 border-l-4 border-r-4 border-[#c9a050] rounded-t-full" />
            <div className="absolute top-0 right-[20%] w-[20%] h-[15%] border-t-4 border-l-4 border-r-4 border-[#c9a050] rounded-t-full" />
          </div>
        </motion.div>

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[60%] h-[70%] bg-[#f5f5dc]/50 animate-pulse"
              style={{
                clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>
        )}

        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs uppercase tracking-wider">
          Tote Bag Preview
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="relative w-full aspect-square bg-neutral-900 flex items-center justify-center">
      <img
        src={designImage}
        alt={productTitle}
        className="w-full h-full object-contain p-8"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}
