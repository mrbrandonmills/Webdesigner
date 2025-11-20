/**
 * Utility functions for the luxury e-commerce store
 */

import { Product, ProductVariant, WishlistItem, RecentlyViewed } from '@/types/store'
import { logger } from '@/lib/logger'

/**
 * Wishlist item with product reference
 */
interface WishlistStorageItem {
  id: string
  productId: number
  product: Product
  addedAt: string
  priceAtTimeOfAdd: string
}

/**
 * Recently viewed storage item
 */
interface RecentlyViewedStorageItem {
  productId: number
  viewedAt: string
}

/**
 * Strategic pricing based on product type
 */
export function getStrategicPrice(basePrice: string | number, productType: string): string {
  const price = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice
  const type = productType.toLowerCase()

  // Gallery Prints / Posters - Premium art pricing
  if (type.includes('poster') || type.includes('print')) {
    if (price < 12) return '49.00' // 18×24" and smaller
    if (price < 15) return '79.00' // 24×36"
    if (price < 20) return '99.00' // Large formats
    return '149.00' // Extra large
  }

  // Canvas Art - Gallery-quality pricing
  if (type.includes('canvas')) {
    if (price < 35) return '149.00' // 16×20" and smaller
    if (price < 50) return '179.00' // 24×36"
    if (price < 70) return '249.00' // Large canvas
    return '349.00' // Premium large canvas
  }

  // T-Shirts - Premium casual wear
  if (type.includes('shirt') || type.includes('tee') || type.includes('t-shirt')) {
    return '35.00'
  }

  // Hoodies & Sweatshirts - Luxury streetwear
  if (type.includes('hoodie') || type.includes('sweatshirt')) {
    return '65.00'
  }

  // Mugs & Drinkware - Daily luxury items
  if (type.includes('mug') || type.includes('cup')) {
    return '22.00'
  }

  // Tank Tops - Premium activewear
  if (type.includes('tank')) {
    return '32.00'
  }

  // Long Sleeve - Premium casual
  if (type.includes('long sleeve')) {
    return '42.00'
  }

  // Phone Cases - Tech accessories
  if (type.includes('case') || type.includes('phone')) {
    return '29.00'
  }

  // Tote Bags - Lifestyle accessories
  if (type.includes('tote') || type.includes('bag')) {
    return '35.00'
  }

  // Default: Premium positioning with 3.5x markup
  return (price * 3.5).toFixed(2)
}

/**
 * Format currency
 */
export function formatPrice(price: string | number, currency: string = 'USD'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numPrice)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Format dimensions
 */
export function formatDimensions(width: number, height: number, depth?: number, unit: string = 'inches'): string {
  if (depth) {
    return `${width} × ${height} × ${depth} ${unit}`
  }
  return `${width} × ${height} ${unit}`
}

/**
 * Generate product URL slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Check if product is in stock
 */
export function isInStock(variant: ProductVariant): boolean {
  return variant.inStock && (variant.stockQuantity ? variant.stockQuantity > 0 : true)
}

/**
 * Get low stock warning threshold
 */
export function isLowStock(variant: ProductVariant, threshold: number = 10): boolean {
  if (!variant.inStock) return false
  return variant.stockQuantity ? variant.stockQuantity <= threshold && variant.stockQuantity > 0 : false
}

/**
 * Filter products by criteria
 */
export function filterProducts(
  products: Product[],
  filters: {
    category?: string
    priceRange?: { min: number; max: number }
    inStock?: boolean
    featured?: boolean
    search?: string
  }
): Product[] {
  return products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }

    // Price filter
    if (filters.priceRange) {
      const price = parseFloat(product.basePrice)
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }
    }

    // Stock filter
    if (filters.inStock && !product.variants.some((v) => v.inStock)) {
      return false
    }

    // Featured filter
    if (filters.featured && !product.featured) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))

      if (!matchesSearch) {
        return false
      }
    }

    return true
  })
}

/**
 * Sort products
 */
export function sortProducts(
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'title'
): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice))
    case 'price-desc':
      return sorted.sort((a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice))
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
    case 'popular':
      return sorted.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(
  totalPrice: number,
  freeShippingThreshold: number = 75,
  standardRate: number = 8.99
): number {
  if (totalPrice >= freeShippingThreshold) {
    return 0
  }
  return standardRate
}

/**
 * Format estimated delivery date
 */
export function formatDeliveryDate(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Wishlist management
 */
export const wishlistUtils = {
  add: (productId: number, product: Product): void => {
    if (typeof window === 'undefined') return

    try {
      const existing = localStorage.getItem('wishlist')
      const wishlist: WishlistStorageItem[] = existing ? JSON.parse(existing) : []

      const newItem: WishlistStorageItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        product,
        addedAt: new Date().toISOString(),
        priceAtTimeOfAdd: product.basePrice,
      }

      wishlist.push(newItem)
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } catch (error) {
      logger.error('Failed to add to wishlist:', error)
    }
  },

  remove: (itemId: string): void => {
    if (typeof window === 'undefined') return

    try {
      const existing = localStorage.getItem('wishlist')
      if (!existing) return

      const wishlist: WishlistStorageItem[] = JSON.parse(existing)
      const filtered = wishlist.filter((item: WishlistStorageItem) => item.id !== itemId)
      localStorage.setItem('wishlist', JSON.stringify(filtered))
    } catch (error) {
      logger.error('Failed to remove from wishlist:', error)
    }
  },

  isInWishlist: (productId: number): boolean => {
    if (typeof window === 'undefined') return false

    try {
      const existing = localStorage.getItem('wishlist')
      if (!existing) return false

      const wishlist: WishlistStorageItem[] = JSON.parse(existing)
      return wishlist.some((item: WishlistStorageItem) => item.productId === productId)
    } catch (error) {
      logger.error('Failed to check wishlist:', error)
      return false
    }
  },

  getAll: (): WishlistStorageItem[] => {
    if (typeof window === 'undefined') return []

    try {
      const existing = localStorage.getItem('wishlist')
      return existing ? JSON.parse(existing) : []
    } catch (error) {
      logger.error('Failed to get wishlist:', error)
      return []
    }
  },
}

/**
 * Recently viewed management
 */
export const recentlyViewedUtils = {
  add: (productId: number): void => {
    if (typeof window === 'undefined') return

    try {
      const existing = localStorage.getItem('recentlyViewed')
      const viewed: RecentlyViewedStorageItem[] = existing ? JSON.parse(existing) : []

      // Remove if already exists
      const filtered = viewed.filter((item: RecentlyViewedStorageItem) => item.productId !== productId)

      // Add to beginning
      filtered.unshift({
        productId,
        viewedAt: new Date().toISOString(),
      })

      // Keep only last 20
      const trimmed = filtered.slice(0, 20)

      localStorage.setItem('recentlyViewed', JSON.stringify(trimmed))
    } catch (error) {
      logger.error('Failed to add to recently viewed:', error)
    }
  },

  getAll: (): RecentlyViewedStorageItem[] => {
    if (typeof window === 'undefined') return []

    try {
      const existing = localStorage.getItem('recentlyViewed')
      return existing ? JSON.parse(existing) : []
    } catch (error) {
      logger.error('Failed to get recently viewed:', error)
      return []
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('recentlyViewed')
    } catch (error) {
      logger.error('Failed to clear recently viewed:', error)
    }
  },
}

/**
 * Validate promo code
 */
export function validatePromoCode(code: string): { valid: boolean; discount: number; message: string } {
  const validCodes: Record<string, { discount: number; message: string }> = {
    WELCOME10: { discount: 10, message: '10% off your order' },
    SAVE15: { discount: 15, message: '15% off your order' },
    LUXURY20: { discount: 20, message: '20% off your order' },
    FIRSTORDER: { discount: 25, message: '25% off your first order' },
  }

  const upperCode = code.toUpperCase()

  if (validCodes[upperCode]) {
    return {
      valid: true,
      ...validCodes[upperCode],
    }
  }

  return {
    valid: false,
    discount: 0,
    message: 'Invalid promo code',
  }
}

/**
 * Generate share URL for product
 */
export function generateShareUrl(productId: number, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/store/${productId}`
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`

  return past.toLocaleDateString()
}
