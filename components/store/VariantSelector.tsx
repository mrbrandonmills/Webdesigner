'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { ProductVariant } from '@/types/store'
import { motion } from 'framer-motion'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant
  onSelectVariant: (variant: ProductVariant) => void
  showImages?: boolean
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
  showImages = false,
}: VariantSelectorProps) {
  // Group variants by type (size, color, material)
  const sizeVariants = variants.filter((v) => v.size)
  const colorVariants = variants.filter((v) => v.color && !v.size)
  const materialVariants = variants.filter((v) => v.material)

  const uniqueSizes = [...new Set(sizeVariants.map((v) => v.size))].filter(Boolean)
  const uniqueColors = [...new Set(colorVariants.map((v) => v.color))].filter(Boolean)
  const uniqueMaterials = [...new Set(materialVariants.map((v) => v.material))].filter(Boolean)

  return (
    <div className="space-y-8">
      {/* Size Selection */}
      {uniqueSizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm tracking-[0.2em] uppercase text-white/40">
              Size
            </h3>
            <button className="text-xs text-accent-gold hover:text-accent-hover transition-colors">
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uniqueSizes.map((size) => {
              const variant = variants.find((v) => v.size === size)
              if (!variant) return null

              const isSelected = selectedVariant.size === size
              const isInStock = variant.inStock

              return (
                <button
                  key={size}
                  onClick={() => isInStock && onSelectVariant(variant)}
                  disabled={!isInStock}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold/10 shadow-lg shadow-accent-gold/20'
                        : isInStock
                        ? 'border-white/10 bg-white/5 hover:border-accent-gold/50 hover:bg-white/10'
                        : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-accent-gold rounded-full flex items-center justify-center">
                      <Check size={12} className="text-black" />
                    </div>
                  )}
                  <div className={`text-lg font-light ${isSelected ? 'text-accent-gold' : ''}`}>
                    {size}
                  </div>
                  {variant.dimensions && (
                    <div className="text-xs text-white/40 mt-1">
                      {variant.dimensions.width} × {variant.dimensions.height} {variant.dimensions.unit}
                    </div>
                  )}
                  {!isInStock && (
                    <div className="text-xs text-red-400 mt-1">Out of Stock</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {uniqueColors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm tracking-[0.2em] uppercase text-white/40">
            Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => {
              const variant = variants.find((v) => v.color === color)
              if (!variant) return null

              const isSelected = selectedVariant.color === color
              const isInStock = variant.inStock

              return (
                <button
                  key={color}
                  onClick={() => isInStock && onSelectVariant(variant)}
                  disabled={!isInStock}
                  className={`
                    relative px-6 py-3 rounded-full border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold/10 shadow-lg shadow-accent-gold/20'
                        : isInStock
                        ? 'border-white/10 bg-white/5 hover:border-accent-gold/50 hover:bg-white/10'
                        : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold rounded-full flex items-center justify-center">
                      <Check size={12} className="text-black" />
                    </div>
                  )}
                  <span className={`text-sm ${isSelected ? 'text-accent-gold' : ''}`}>
                    {color}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Material Selection */}
      {uniqueMaterials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm tracking-[0.2em] uppercase text-white/40">
            Material
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {uniqueMaterials.map((material) => {
              const variant = variants.find((v) => v.material === material)
              if (!variant) return null

              const isSelected = selectedVariant.material === material
              const isInStock = variant.inStock

              return (
                <button
                  key={material}
                  onClick={() => isInStock && onSelectVariant(variant)}
                  disabled={!isInStock}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                    ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold/10 shadow-lg shadow-accent-gold/20'
                        : isInStock
                        ? 'border-white/10 bg-white/5 hover:border-accent-gold/50 hover:bg-white/10'
                        : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  )}
                  <div className={`text-lg font-light ${isSelected ? 'text-accent-gold' : ''}`}>
                    {material}
                  </div>
                  {!isInStock && (
                    <div className="text-xs text-red-400 mt-1">Out of Stock</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Visual variant selector with images */}
      {showImages && variants.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-sm tracking-[0.2em] uppercase text-white/40">
            All Variants
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {variants.map((variant) => {
              const isSelected = selectedVariant.id === variant.id
              const isInStock = variant.inStock

              return (
                <button
                  key={variant.id}
                  onClick={() => isInStock && onSelectVariant(variant)}
                  disabled={!isInStock}
                  className={`
                    relative rounded-xl border-2 overflow-hidden transition-all duration-300
                    ${
                      isSelected
                        ? 'border-accent-gold shadow-lg shadow-accent-gold/20 scale-105'
                        : isInStock
                        ? 'border-white/10 hover:border-accent-gold/50 hover:scale-105'
                        : 'border-white/5 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center z-10">
                      <Check size={14} className="text-black" />
                    </div>
                  )}
                  <div className="aspect-square bg-white/5">
                    {variant.image ? (
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <div className="text-4xl">📦</div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-black/60 backdrop-blur-sm">
                    <div className={`text-sm font-light ${isSelected ? 'text-accent-gold' : ''}`}>
                      {variant.name}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      ${variant.price}
                    </div>
                    {!isInStock && (
                      <div className="text-xs text-red-400 mt-1">Out of Stock</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-sm">
        {selectedVariant.inStock ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white/60">
              In Stock
              {selectedVariant.stockQuantity && selectedVariant.stockQuantity < 10 && (
                <span className="text-accent-gold ml-1">
                  - Only {selectedVariant.stockQuantity} left!
                </span>
              )}
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400">Out of Stock</span>
          </>
        )}
      </div>
    </div>
  )
}
