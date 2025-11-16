'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface LuxuryPriceProps {
  price: string
  currency?: string
  isLimitedEdition?: boolean
  originalPrice?: string
}

/**
 * Luxury price presentation for high-value products
 * Features sophisticated typography and visual hierarchy
 */
export default function LuxuryPrice({
  price,
  currency = 'USD',
  isLimitedEdition = false,
  originalPrice,
}: LuxuryPriceProps) {
  const formattedPrice = parseFloat(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-4"
    >
      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <div className="text-5xl md:text-6xl font-light font-serif text-white">
          ${formattedPrice}
        </div>
        <div className="text-sm text-white/40 tracking-wider uppercase pb-2">
          {currency}
        </div>
      </div>

      {/* Original price if on sale */}
      {originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
        <div className="flex items-center gap-3">
          <span className="text-xl text-white/40 line-through">
            ${parseFloat(originalPrice).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/30 text-accent-gold text-xs tracking-wider uppercase rounded-full">
            Save $
            {(parseFloat(originalPrice) - parseFloat(price)).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}

      {/* Limited edition value proposition */}
      {isLimitedEdition && (
        <div className="flex items-center gap-2 text-sm text-accent-gold">
          <Sparkles className="w-4 h-4" />
          <span className="tracking-wider">Investment-grade collectible</span>
        </div>
      )}

      {/* Luxury divider */}
      <div className="pt-2">
        <div className="h-px bg-gradient-to-r from-accent-gold/50 via-accent-gold/20 to-transparent" />
      </div>
    </motion.div>
  )
}
