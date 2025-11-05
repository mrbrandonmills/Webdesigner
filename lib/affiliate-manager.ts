/**
 * Affiliate Manager
 * Handles all affiliate program integrations and link generation
 */

export interface AffiliateProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  url: string
  program: 'amazon' | 'shareasale' | 'cj' | 'printful' | 'bh' | 'other'
  affiliateId?: string
  category: string
  commission?: number
  featured?: boolean
  metadata?: Record<string, any>
}

export interface AffiliateClick {
  id: string
  productId: string
  program: string
  timestamp: Date
  referrer?: string
  userAgent?: string
  ip?: string
  converted?: boolean
  conversionValue?: number
}

export interface AffiliateProgram {
  id: string
  name: string
  status: 'active' | 'pending' | 'inactive'
  apiKey?: string
  affiliateId?: string
  commissionRate?: number
  cookieDuration?: number
}

// Affiliate program configurations
export const AFFILIATE_PROGRAMS: Record<string, AffiliateProgram> = {
  amazon: {
    id: 'amazon',
    name: 'Amazon Associates',
    status: 'pending',
    affiliateId: process.env.AMAZON_ASSOCIATES_TAG,
    commissionRate: 0.04, // Average 4%
    cookieDuration: 1, // 24 hours
  },
  shareasale: {
    id: 'shareasale',
    name: 'ShareASale',
    status: 'pending',
    affiliateId: process.env.SHAREASALE_AFFILIATE_ID,
    commissionRate: 0.10, // Average 10%
    cookieDuration: 30,
  },
  cj: {
    id: 'cj',
    name: 'CJ Affiliate',
    status: 'pending',
    affiliateId: process.env.CJ_PUBLISHER_ID,
    commissionRate: 0.05, // Average 5%
    cookieDuration: 30,
  },
  printful: {
    id: 'printful',
    name: 'Printful',
    status: 'active',
    affiliateId: process.env.PRINTFUL_REFERRAL_CODE,
    commissionRate: 0.10, // 10%
    cookieDuration: 45,
  },
  bh: {
    id: 'bh',
    name: 'B&H Photo',
    status: 'pending',
    affiliateId: process.env.BH_AFFILIATE_ID,
    commissionRate: 0.02, // 2%
    cookieDuration: 1,
  },
}

/**
 * Generate affiliate link based on program
 */
export function generateAffiliateLink(
  product: AffiliateProduct,
  utmParams?: {
    source?: string
    medium?: string
    campaign?: string
  }
): string {
  const program = AFFILIATE_PROGRAMS[product.program]
  if (!program || !program.affiliateId) {
    return product.url // Return original URL if no affiliate ID
  }

  let affiliateUrl = product.url

  switch (product.program) {
    case 'amazon':
      // Amazon affiliate link format
      if (product.affiliateId) {
        affiliateUrl = `https://www.amazon.com/dp/${product.affiliateId}?tag=${program.affiliateId}`
      }
      break

    case 'shareasale':
      // ShareASale link format
      affiliateUrl = `https://shareasale.com/r.cfm?b=${product.affiliateId}&u=${program.affiliateId}&m=${product.metadata?.merchantId}&urllink=${encodeURIComponent(product.url)}`
      break

    case 'cj':
      // CJ Affiliate link format
      affiliateUrl = `https://www.anrdoezrs.net/links/${program.affiliateId}/${product.affiliateId}/type/dlg/${encodeURIComponent(product.url)}`
      break

    case 'printful':
      // Printful referral link
      affiliateUrl = `${product.url}?ref=${program.affiliateId}`
      break

    case 'bh':
      // B&H Photo affiliate link
      affiliateUrl = `${product.url}?BI=${program.affiliateId}`
      break

    default:
      affiliateUrl = product.url
  }

  // Add UTM parameters if provided
  if (utmParams) {
    const url = new URL(affiliateUrl)
    if (utmParams.source) url.searchParams.set('utm_source', utmParams.source)
    if (utmParams.medium) url.searchParams.set('utm_medium', utmParams.medium)
    if (utmParams.campaign) url.searchParams.set('utm_campaign', utmParams.campaign)
    affiliateUrl = url.toString()
  }

  return affiliateUrl
}

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(
  productId: string,
  program: string,
  metadata?: {
    referrer?: string
    userAgent?: string
  }
): Promise<void> {
  try {
    const response = await fetch('/api/affiliates/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        program,
        timestamp: new Date().toISOString(),
        ...metadata,
      }),
    })

    if (!response.ok) {
      console.error('Failed to track affiliate click')
    }

    // Also track in Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: program,
        value: productId,
      })
    }
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
  }
}

/**
 * Fetch Amazon product details via Product Advertising API
 */
export async function fetchAmazonProduct(asin: string): Promise<AffiliateProduct | null> {
  if (!process.env.AMAZON_ASSOCIATES_ACCESS_KEY || !process.env.AMAZON_ASSOCIATES_SECRET_KEY) {
    console.warn('Amazon API credentials not configured')
    return null
  }

  try {
    // This would integrate with Amazon's Product Advertising API
    // For now, returning mock data structure
    const response = await fetch('/api/affiliates/amazon/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asin }),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Amazon product:', error)
    return null
  }
}

/**
 * Calculate estimated commission
 */
export function calculateCommission(
  price: number,
  program: string
): number {
  const affiliateProgram = AFFILIATE_PROGRAMS[program]
  if (!affiliateProgram || !affiliateProgram.commissionRate) {
    return 0
  }

  return price * affiliateProgram.commissionRate
}

/**
 * Get affiliate disclosure text
 */
export function getAffiliateDisclosure(type: 'full' | 'short' = 'full'): string {
  if (type === 'short') {
    return 'This post contains affiliate links. We may earn a commission at no extra cost to you.'
  }

  return `As an Amazon Associate and member of other affiliate programs, I earn from qualifying purchases.
  This means if you click on an affiliate link and purchase the item, I may receive an affiliate commission
  at no extra cost to you. All opinions remain my own, and I only recommend products I personally use and
  believe will add value to my readers. Thank you for supporting Brandon Mills Photography!`
}

/**
 * Format affiliate product for display
 */
export function formatAffiliateProduct(product: AffiliateProduct): {
  title: string
  subtitle: string
  price: string
  commission: string
  link: string
} {
  const commission = calculateCommission(product.price, product.program)

  return {
    title: product.name,
    subtitle: product.description.substring(0, 100) + '...',
    price: `$${product.price.toFixed(2)}`,
    commission: commission > 0 ? `Earn ~$${commission.toFixed(2)}` : '',
    link: generateAffiliateLink(product),
  }
}

/**
 * Validate affiliate link
 */
export function isValidAffiliateLink(url: string): boolean {
  try {
    const urlObj = new URL(url)

    // Check for known affiliate parameters
    const affiliateParams = [
      'tag=', // Amazon
      'ref=', // Various programs
      'u=', // ShareASale
      'BI=', // B&H
      'utm_source=affiliate',
    ]

    return affiliateParams.some(param => url.includes(param))
  } catch {
    return false
  }
}

/**
 * Get recommended products by category
 */
export async function getRecommendedProducts(
  category: string,
  limit = 10
): Promise<AffiliateProduct[]> {
  try {
    const response = await fetch(`/api/affiliates/recommendations?category=${category}&limit=${limit}`)
    if (!response.ok) return []

    const products = await response.json()
    return products
  } catch (error) {
    console.error('Error fetching recommended products:', error)
    return []
  }
}

/**
 * Search affiliate products across all programs
 */
export async function searchAffiliateProducts(
  query: string,
  programs?: string[]
): Promise<AffiliateProduct[]> {
  try {
    const params = new URLSearchParams({ q: query })
    if (programs?.length) {
      params.append('programs', programs.join(','))
    }

    const response = await fetch(`/api/affiliates/search?${params}`)
    if (!response.ok) return []

    const products = await response.json()
    return products
  } catch (error) {
    console.error('Error searching affiliate products:', error)
    return []
  }
}

// Export utility for creating affiliate product objects
export function createAffiliateProduct(
  data: Partial<AffiliateProduct>
): AffiliateProduct {
  return {
    id: data.id || `${data.program}-${Date.now()}`,
    name: data.name || 'Unknown Product',
    description: data.description || '',
    price: data.price || 0,
    image: data.image || '/placeholder.jpg',
    url: data.url || '#',
    program: data.program || 'other',
    category: data.category || 'general',
    affiliateId: data.affiliateId,
    commission: data.commission,
    featured: data.featured || false,
    metadata: data.metadata || {},
  }
}