'use client'

import { Award, Shield, Truck, RotateCcw, Ruler, Package } from 'lucide-react'
import { Product } from '@/types/store'

interface ProductInfoProps {
  product: Product
  selectedVariant?: any
}

export default function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const trustSignals = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Museum-quality materials',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: product.freeShippingThreshold ? `Orders over $${product.freeShippingThreshold}` : 'On all orders',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Risk-free purchase',
    },
    {
      icon: Award,
      title: 'Secure Checkout',
      description: 'SSL encrypted payment',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Title and Artist */}
      <div className="space-y-4">
        {product.isLimitedEdition && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/30 rounded-full">
            <Award className="text-accent-gold" size={16} />
            <span className="text-xs tracking-[0.2em] uppercase text-accent-gold font-medium">
              Limited Edition
              {product.editionSize && ` - ${product.editionNumber}/${product.editionSize}`}
            </span>
          </div>
        )}

        <div>
          <div className="text-sm text-white/40 tracking-[0.2em] uppercase mb-2">
            {product.brand}
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-3">
            {product.title}
          </h1>
          {product.artist && (
            <div className="text-xl text-white/60 font-light">
              by {product.artist}
              {product.artistSignature && (
                <span className="ml-2 text-accent-gold italic">{product.artistSignature}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div className="luxury-divider"></div>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg leading-relaxed font-light">
            {product.description}
          </p>
          {product.longDescription && (
            <div className="mt-4 text-white/60 leading-relaxed">
              {product.longDescription}
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-4">
          Specifications
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {product.dimensions && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="text-accent-gold" size={16} />
                <span className="text-xs text-white/40 tracking-wider uppercase">Dimensions</span>
              </div>
              <div className="text-lg font-light">
                {product.dimensions.width} × {product.dimensions.height}
                {product.dimensions.depth && ` × ${product.dimensions.depth}`} {product.dimensions.unit}
              </div>
            </div>
          )}

          {product.type && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-accent-gold" size={16} />
                <span className="text-xs text-white/40 tracking-wider uppercase">Product Type</span>
              </div>
              <div className="text-lg font-light">{product.type}</div>
            </div>
          )}
        </div>

        {/* Materials */}
        {product.materials && product.materials.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h4 className="text-xs text-white/40 tracking-wider uppercase mb-4">Materials</h4>
            <div className="space-y-3">
              {product.materials.map((material) => (
                <div key={material.id} className="space-y-1">
                  <div className="text-lg font-light">{material.name}</div>
                  <div className="text-sm text-white/60">{material.description}</div>
                  {material.finish && (
                    <div className="text-xs text-white/40">Finish: {material.finish}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Print method and paper type */}
        {(product.printMethod || product.paperType) && (
          <div className="grid grid-cols-2 gap-4">
            {product.printMethod && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-xs text-white/40 tracking-wider uppercase mb-2">Print Method</div>
                <div className="text-lg font-light">{product.printMethod}</div>
              </div>
            )}
            {product.paperType && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-xs text-white/40 tracking-wider uppercase mb-2">Paper Type</div>
                <div className="text-lg font-light">{product.paperType}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Care Instructions */}
      {product.careInstructions && (
        <div className="space-y-4">
          <div className="luxury-divider"></div>
          <div>
            <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-3">
              Care Instructions
            </h3>
            <p className="text-white/60 leading-relaxed">{product.careInstructions}</p>
          </div>
        </div>
      )}

      {/* Trust Signals */}
      <div className="space-y-4">
        <div className="luxury-divider"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustSignals.map((signal) => {
            const Icon = signal.icon
            return (
              <div
                key={signal.title}
                className="text-center p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-accent-gold/30 transition-all duration-300 group"
              >
                <Icon className="mx-auto mb-3 text-accent-gold group-hover:scale-110 transition-transform duration-300" size={24} />
                <div className="text-sm font-medium mb-1">{signal.title}</div>
                <div className="text-xs text-white/40">{signal.description}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Shipping and Returns */}
      <div className="space-y-4">
        <div className="luxury-divider"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.shippingInfo && (
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-3">
                Shipping Information
              </h3>
              <p className="text-white/60 leading-relaxed text-sm">{product.shippingInfo}</p>
              {product.estimatedDeliveryDays && (
                <p className="text-accent-gold mt-2 text-sm">
                  Estimated delivery: {product.estimatedDeliveryDays} business days
                </p>
              )}
            </div>
          )}
          {product.returnPolicy && (
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-3">
                Return Policy
              </h3>
              <p className="text-white/60 leading-relaxed text-sm">{product.returnPolicy}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
