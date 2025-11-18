/**
 * Theme Factory Product Showcase Component
 * Displays featured theme factory products with enhanced styling
 */

'use client'

import { useState } from 'react'
import { ShoppingBag, Star, TrendingUp } from 'lucide-react'
import type { ThemeFactoryProduct } from '@/lib/theme-product-generator'

interface ThemeFactoryShowcaseProps {
  products: ThemeFactoryProduct[]
  onAddToCart?: (product: ThemeFactoryProduct, variant: any) => void
}

export function ThemeFactoryShowcase({ products, onAddToCart }: ThemeFactoryShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Get featured products
  const featuredProducts = filteredProducts.filter(p => p.featured)

  // Category counts
  const categoryCounts = {
    all: products.length,
    poetry: products.filter(p => p.category === 'poetry').length,
    photography: products.filter(p => p.category === 'photography').length,
    philosophy: products.filter(p => p.category === 'philosophy').length,
  }

  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId,
    }))
  }

  const getSelectedVariant = (product: ThemeFactoryProduct) => {
    const selectedId = selectedVariants[product.id]
    return product.variants.find(v => v.id === selectedId) || product.variants[0]
  }

  return (
    <div className="theme-factory-showcase">
      {/* Category Filter */}
      <div className="flex gap-4 justify-center mb-12">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-6 py-3 border transition-all duration-300 uppercase tracking-wider text-sm
              ${selectedCategory === cat
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
              }
            `}
          >
            {cat} ({count})
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      {featuredProducts.length > 0 && (
        <div className="mb-12 p-8 bg-gradient-to-r from-accent-gold/10 to-transparent border-l-4 border-accent-gold">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-accent-gold" size={24} />
            <h3 className="text-2xl font-serif text-accent-gold">Featured Collection</h3>
          </div>
          <p className="text-white/60">
            {featuredProducts.length} premium designs from the Theme Factory
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => {
          const selectedVariant = getSelectedVariant(product)

          return (
            <div
              key={product.id}
              className="group relative bg-black border border-white/10 hover:border-accent-gold/50 transition-all duration-500"
            >
              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-accent-gold text-black text-xs font-medium uppercase tracking-wider">
                  <Star size={12} className="fill-current" />
                  Featured
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-white/5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                {/* Title & Category */}
                <div>
                  <span className="text-xs uppercase tracking-wider text-accent-gold/70">
                    {product.category} • {product.theme}
                  </span>
                  <h3 className="mt-2 text-xl font-serif text-white group-hover:text-accent-gold transition-colors">
                    {product.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-white/60 line-clamp-3">
                  {product.metadata.themeEssence}
                </p>

                {/* Variant Selector */}
                {product.variants.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/40">
                      {product.productType === 't-shirt' || product.productType === 'hoodie'
                        ? 'Size'
                        : product.productType === 'poster' || product.productType === 'wall-art'
                        ? 'Dimensions'
                        : product.productType === 'mug'
                        ? 'Size'
                        : product.productType === 'phone-case'
                        ? 'Model'
                        : 'Option'
                      }
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantSelect(product.id, variant.id)}
                          className={`
                            px-3 py-1 text-xs border transition-all
                            ${selectedVariant.id === variant.id
                              ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                              : 'border-white/20 hover:border-white/40 text-white/60 hover:text-white'
                            }
                          `}
                        >
                          {variant.size || variant.dimensions || variant.color || 'Standard'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-light text-white">
                    ${selectedVariant.price.toFixed(2)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    USD
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart?.(product, selectedVariant)}
                  className="w-full py-3 bg-white text-black hover:bg-accent-gold transition-colors duration-300 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>

                {/* Product Metadata */}
                <div className="pt-4 border-t border-white/10 space-y-1">
                  <p className="text-xs text-white/40">
                    SKU: {product.syncProductId || product.id}
                  </p>
                  <p className="text-xs text-white/40">
                    {product.variantCount} variant{product.variantCount !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-white/40">No products found in this category</p>
        </div>
      )}

      {/* Collection Stats */}
      <div className="mt-16 p-8 bg-white/5 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-light text-accent-gold">{products.length}</p>
            <p className="text-sm uppercase tracking-wider text-white/60 mt-2">Total Products</p>
          </div>
          <div>
            <p className="text-3xl font-light text-accent-gold">{featuredProducts.length}</p>
            <p className="text-sm uppercase tracking-wider text-white/60 mt-2">Featured Items</p>
          </div>
          <div>
            <p className="text-3xl font-light text-accent-gold">
              ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)}
            </p>
            <p className="text-sm uppercase tracking-wider text-white/60 mt-2">Avg Price</p>
          </div>
          <div>
            <p className="text-3xl font-light text-accent-gold">20</p>
            <p className="text-sm uppercase tracking-wider text-white/60 mt-2">Unique Designs</p>
          </div>
        </div>
      </div>
    </div>
  )
}