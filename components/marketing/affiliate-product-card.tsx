'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, DollarSign, Info } from 'lucide-react'
import {
  generateAffiliateLink,
  trackAffiliateClick,
  calculateCommission,
  type AffiliateProduct
} from '@/lib/affiliate-manager'
import { trackAmazonClick } from '@/lib/analytics'

interface AffiliateProductCardProps {
  product: AffiliateProduct
  showCommission?: boolean
  utmSource?: string
}

export function AffiliateProductCard({
  product,
  showCommission = false,
  utmSource = 'website'
}: AffiliateProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const affiliateLink = generateAffiliateLink(product, {
    source: utmSource,
    medium: 'affiliate',
    campaign: product.category,
  })

  const commission = calculateCommission(product.price, product.program)

  const handleClick = async () => {
    // Only run on client side (not during SSR)
    if (typeof window === 'undefined') return

    // Track the click in our database
    await trackAffiliateClick(product.id, product.program, {
      referrer: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Track in Google Analytics
    trackAmazonClick(product.name, product.price, product.category)

    // Open in new tab
    window.open(affiliateLink, '_blank', 'noopener,noreferrer')
  }

  const getProgramBadge = () => {
    const badges: Record<string, { label: string; color: string }> = {
      amazon: { label: 'Amazon', color: 'bg-orange-500' },
      shareasale: { label: 'ShareASale', color: 'bg-green-500' },
      cj: { label: 'CJ Affiliate', color: 'bg-blue-500' },
      printful: { label: 'Printful', color: 'bg-purple-500' },
      bh: { label: 'B&H', color: 'bg-red-500' },
      other: { label: 'Partner', color: 'bg-gray-500' },
    }

    const badge = badges[product.program] || badges.other
    return (
      <span
        className={`${badge.color} text-white text-xs px-2 py-1 rounded-full`}
      >
        {badge.label}
      </span>
    )
  }

  return (
    <div
      className="group relative glass-card rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-2 left-2 z-10 glass-badge bg-accent-gold/20 border-accent-gold/40 text-accent-gold text-xs px-2 py-1 rounded">
          Featured
        </div>
      )}

      {/* Affiliate Program Badge */}
      <div className="absolute top-2 right-2 z-10">
        {getProgramBadge()}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Info size={48} />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
          {product.name}
        </h3>

        <p className="text-white/60 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Commission */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-light text-accent-gold">${product.price.toFixed(2)}</div>
          {showCommission && commission > 0 && (
            <div className="text-sm text-green-400 flex items-center">
              <DollarSign size={14} />
              <span>Earn ${commission.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block glass-badge text-white/70 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="w-full glass-button bg-accent-gold/90 text-black py-3 px-4 rounded flex items-center justify-center hover:bg-accent-gold transition-colors"
        >
          <span>View Product</span>
          <ExternalLink size={16} className="ml-2" />
        </button>

        {/* Affiliate Disclosure */}
        <div className="mt-3 text-xs text-white/40 text-center">
          Affiliate link - We may earn a commission
        </div>
      </div>

      {/* Hover Overlay with Quick Actions */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity pointer-events-none" />
      )}
    </div>
  )
}

// Grid component for multiple products
export function AffiliateProductGrid({
  products,
  showCommission = false,
  utmSource = 'website',
}: {
  products: AffiliateProduct[]
  showCommission?: boolean
  utmSource?: string
}) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <AffiliateProductCard
          key={product.id}
          product={product}
          showCommission={showCommission}
          utmSource={utmSource}
        />
      ))}
    </div>
  )
}