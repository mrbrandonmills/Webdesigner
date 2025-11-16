/**
 * Promo Code Management System
 *
 * Supports promo codes for both meditations and books
 * Handles validation, usage tracking, and expiration
 */

export interface PromoCode {
  code: string
  type: 'meditation' | 'book' | 'all' // What can be unlocked
  target?: string // Specific meditation slug or book ID (if not 'all')
  discount: number // Percentage discount (100 = free)
  maxUses?: number // Max total uses (undefined = unlimited)
  expiresAt?: string // ISO date string
  createdAt: string
  createdBy: string
  description?: string
  usageCount?: number // Track how many times used
}

export interface PromoCodeUsage {
  code: string
  usedBy: string // Email or identifier
  usedAt: string
  contentType: 'meditation' | 'book'
  contentId: string
}

// In-memory promo codes (will be replaced with database/file storage)
const PROMO_CODES: Map<string, PromoCode> = new Map()

// Initialize with some default codes
const initializeDefaultCodes = () => {
  // BLOCKC2024 - Free access to Block C book
  PROMO_CODES.set('BLOCKC2024', {
    code: 'BLOCKC2024',
    type: 'book',
    target: 'block-c',
    discount: 100,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    description: 'Free access to Block C for co-author',
  })

  // COAUTHOR2024 - Free access to all meditations
  PROMO_CODES.set('COAUTHOR2024', {
    code: 'COAUTHOR2024',
    type: 'meditation',
    discount: 100,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    description: 'Free access to all meditations',
  })

  // WELCOME10 - 10% off any meditation or book
  PROMO_CODES.set('WELCOME10', {
    code: 'WELCOME10',
    type: 'all',
    discount: 10,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    description: 'Welcome discount - 10% off',
  })
}

// Initialize on module load
initializeDefaultCodes()

/**
 * Validate a promo code for a specific content type and ID
 */
export function validatePromoCode(
  code: string,
  contentType: 'meditation' | 'book',
  contentId: string
): {
  valid: boolean
  discount: number
  message?: string
} {
  const normalizedCode = code.toUpperCase().trim()
  const promoCode = PROMO_CODES.get(normalizedCode)

  if (!promoCode) {
    return {
      valid: false,
      discount: 0,
      message: 'Invalid promo code',
    }
  }

  // Check expiration
  if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
    return {
      valid: false,
      discount: 0,
      message: 'This promo code has expired',
    }
  }

  // Check max uses
  if (promoCode.maxUses !== undefined &&
      promoCode.usageCount !== undefined &&
      promoCode.usageCount >= promoCode.maxUses) {
    return {
      valid: false,
      discount: 0,
      message: 'This promo code has reached its usage limit',
    }
  }

  // Check content type match
  if (promoCode.type !== 'all' && promoCode.type !== contentType) {
    return {
      valid: false,
      discount: 0,
      message: `This code is only valid for ${promoCode.type}s`,
    }
  }

  // Check target match (if specific target is set)
  if (promoCode.target && promoCode.target !== contentId) {
    return {
      valid: false,
      discount: 0,
      message: 'This code is not valid for this content',
    }
  }

  return {
    valid: true,
    discount: promoCode.discount,
    message: promoCode.discount === 100
      ? 'Free access!'
      : `${promoCode.discount}% discount applied`,
  }
}

/**
 * Record usage of a promo code
 */
export function recordPromoCodeUsage(
  code: string,
  usedBy: string,
  contentType: 'meditation' | 'book',
  contentId: string
): void {
  const normalizedCode = code.toUpperCase().trim()
  const promoCode = PROMO_CODES.get(normalizedCode)

  if (promoCode) {
    // Increment usage count
    if (promoCode.usageCount === undefined) {
      promoCode.usageCount = 0
    }
    promoCode.usageCount++

    // In a real implementation, you would:
    // 1. Save usage to database/file
    // 2. Update promo code usage count
    // 3. Create audit trail
    console.log(`[PROMO] Code ${code} used by ${usedBy} for ${contentType}:${contentId}`)
  }
}

/**
 * Create a new promo code
 */
export function createPromoCode(promoCode: Omit<PromoCode, 'createdAt' | 'usageCount'>): PromoCode {
  const newCode: PromoCode = {
    ...promoCode,
    code: promoCode.code.toUpperCase().trim(),
    createdAt: new Date().toISOString(),
    usageCount: 0,
  }

  PROMO_CODES.set(newCode.code, newCode)

  // In a real implementation, persist to database/file
  console.log(`[PROMO] Created code: ${newCode.code}`)

  return newCode
}

/**
 * Get all promo codes (admin only)
 */
export function getAllPromoCodes(): PromoCode[] {
  return Array.from(PROMO_CODES.values())
}

/**
 * Get a specific promo code details
 */
export function getPromoCode(code: string): PromoCode | undefined {
  return PROMO_CODES.get(code.toUpperCase().trim())
}

/**
 * Delete a promo code
 */
export function deletePromoCode(code: string): boolean {
  return PROMO_CODES.delete(code.toUpperCase().trim())
}

/**
 * Update a promo code
 */
export function updatePromoCode(code: string, updates: Partial<PromoCode>): PromoCode | undefined {
  const normalizedCode = code.toUpperCase().trim()
  const existing = PROMO_CODES.get(normalizedCode)

  if (!existing) {
    return undefined
  }

  const updated: PromoCode = {
    ...existing,
    ...updates,
    code: normalizedCode, // Don't allow code changes
    createdAt: existing.createdAt, // Don't allow creation date changes
  }

  PROMO_CODES.set(normalizedCode, updated)
  return updated
}

/**
 * Calculate final price after discount
 */
export function calculateDiscountedPrice(originalPrice: number, discount: number): number {
  const discountedPrice = originalPrice * (1 - discount / 100)
  return Math.max(0, Math.round(discountedPrice * 100) / 100) // Round to 2 decimals, min 0
}
