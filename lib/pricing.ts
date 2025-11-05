/**
 * Server-Side Pricing Service
 *
 * CRITICAL SECURITY: This service calculates prices server-side from Printful API.
 * NEVER trust client-provided prices - always validate against this service.
 *
 * Pricing Strategy:
 * - Fetch base cost from Printful API
 * - Apply luxury markup (70-85% margins)
 * - Cache prices for 5 minutes to reduce API calls
 * - Always return prices in USD cents for Stripe compatibility
 */

import { printfulClient } from './printful-client'
import logger from './logger'

// Price cache to reduce API calls (5 minute TTL)
interface PriceCache {
  price: number
  timestamp: number
}

const priceCache = new Map<string, PriceCache>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Luxury pricing markup configuration
 * These margins are typical for high-end art and design products
 */
const PRICING_CONFIG = {
  // Base markup multipliers by product type
  markup: {
    canvas: 2.8,      // 180% markup (64% margin) - Premium canvas prints
    posters: 2.5,     // 150% markup (60% margin) - Art prints
    apparel: 2.3,     // 130% markup (57% margin) - Custom apparel
    mugs: 2.7,        // 170% markup (63% margin) - Custom mugs
    home: 2.6,        // 160% markup (62% margin) - Home decor
    default: 2.5,     // 150% markup (60% margin) - Default for unknown types
  },
  // Minimum price to ensure profitability
  minimumPrice: 19.99,
}

/**
 * Determine product type from Printful product ID or variant ID
 * This helps apply appropriate markup
 */
function getProductType(productId: number): keyof typeof PRICING_CONFIG.markup {
  // Printful product ID ranges (approximate)
  if (productId >= 1 && productId <= 100) return 'apparel'
  if (productId >= 200 && productId <= 250) return 'posters'
  if (productId >= 300 && productId <= 350) return 'canvas'
  if (productId >= 400 && productId <= 450) return 'mugs'
  if (productId >= 500 && productId <= 600) return 'home'

  return 'default'
}

/**
 * Calculate the retail price for a product variant
 *
 * @param productId - Printful catalog product ID
 * @param variantId - Printful catalog variant ID
 * @returns Price in USD dollars (not cents) rounded to 2 decimals
 * @throws Error if unable to fetch pricing from Printful
 */
export async function calculateProductPrice(
  productId: number,
  variantId: number
): Promise<number> {
  try {
    // Check cache first
    const cacheKey = `${productId}-${variantId}`
    const cached = priceCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      logger.debug(`Price cache hit for ${cacheKey}: $${cached.price}`)
      return cached.price
    }

    // Fetch base cost from Printful
    logger.info(`Fetching price from Printful for product ${productId}, variant ${variantId}`)
    const variantPrice = await printfulClient.getVariantPrice(variantId)

    // Parse base cost
    const baseCost = parseFloat(variantPrice.price)

    if (isNaN(baseCost) || baseCost <= 0) {
      throw new Error(`Invalid base cost from Printful: ${variantPrice.price}`)
    }

    // Determine product type and apply appropriate markup
    const productType = getProductType(productId)
    const markup = PRICING_CONFIG.markup[productType]

    // Calculate retail price with markup
    let retailPrice = baseCost * markup

    // Apply minimum price floor
    if (retailPrice < PRICING_CONFIG.minimumPrice) {
      logger.warn(
        `Calculated price $${retailPrice.toFixed(2)} below minimum, using $${PRICING_CONFIG.minimumPrice}`,
        { productId, variantId, baseCost, markup }
      )
      retailPrice = PRICING_CONFIG.minimumPrice
    }

    // Round to 2 decimal places
    retailPrice = Math.round(retailPrice * 100) / 100

    // Cache the result
    priceCache.set(cacheKey, {
      price: retailPrice,
      timestamp: Date.now(),
    })

    logger.success(
      `Calculated price for ${productType}: Base $${baseCost.toFixed(2)} → Retail $${retailPrice.toFixed(2)} (${markup}x markup)`,
      { productId, variantId }
    )

    return retailPrice
  } catch (error) {
    logger.error('Failed to calculate product price', {
      error,
      productId,
      variantId,
    })
    throw new Error(
      `Unable to calculate price for product ${productId}, variant ${variantId}. Please try again.`
    )
  }
}

/**
 * Validate client-provided price against server-calculated price
 *
 * @param clientPrice - Price provided by client (in dollars)
 * @param productId - Printful catalog product ID
 * @param variantId - Printful catalog variant ID
 * @returns Object with validation result and server price
 */
export async function validatePrice(
  clientPrice: number,
  productId: number,
  variantId: number
): Promise<{
  valid: boolean
  serverPrice: number
  clientPrice: number
  difference: number
}> {
  const serverPrice = await calculateProductPrice(productId, variantId)
  const difference = Math.abs(serverPrice - clientPrice)

  // Allow 1 cent tolerance for rounding differences
  const valid = difference <= 0.01

  if (!valid) {
    logger.warn('Price validation failed - possible tampering detected', {
      productId,
      variantId,
      clientPrice,
      serverPrice,
      difference,
    })
  }

  return {
    valid,
    serverPrice,
    clientPrice,
    difference,
  }
}

/**
 * Batch validate multiple cart items
 * This is more efficient than validating one at a time
 *
 * @param items - Array of cart items with client prices
 * @returns Array of validation results
 */
export async function validateCartPrices(
  items: Array<{
    productId: number
    variantId: number
    price: number
  }>
): Promise<
  Array<{
    productId: number
    variantId: number
    valid: boolean
    serverPrice: number
    clientPrice: number
  }>
> {
  const validations = await Promise.all(
    items.map(async (item) => {
      const result = await validatePrice(
        item.price,
        item.productId,
        item.variantId
      )

      return {
        productId: item.productId,
        variantId: item.variantId,
        valid: result.valid,
        serverPrice: result.serverPrice,
        clientPrice: result.clientPrice,
      }
    })
  )

  return validations
}

/**
 * Clear the price cache (useful for testing or manual price updates)
 */
export function clearPriceCache(): void {
  priceCache.clear()
  logger.info('Price cache cleared')
}

/**
 * Get cache statistics (useful for monitoring)
 */
export function getCacheStats(): {
  size: number
  entries: Array<{ key: string; price: number; age: number }>
} {
  const now = Date.now()
  const entries = Array.from(priceCache.entries()).map(([key, value]) => ({
    key,
    price: value.price,
    age: Math.floor((now - value.timestamp) / 1000), // Age in seconds
  }))

  return {
    size: priceCache.size,
    entries,
  }
}
