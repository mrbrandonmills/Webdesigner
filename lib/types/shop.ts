// Unified Shop Product Types
// Supports both Printful (custom merchandise) and Amazon (affiliate products)

export type ProductSource = 'printful' | 'amazon'

export interface ProductVariant {
  id: number | string
  name?: string
  size?: string
  color?: string
  dimensions?: string
  image?: string
  price?: number
  printfulVariantId?: number
  syncVariantId?: number
  inStock?: boolean
}

export interface UnifiedProduct {
  id: string
  source: ProductSource
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  image: string
  images?: string[]

  // Amazon-specific
  amazonUrl?: string
  affiliateTag?: string
  rating?: number
  reviewCount?: number
  features?: string[]
  brand?: string

  // Printful-specific
  variantCount?: number
  variants?: ProductVariant[]
  syncProductId?: number
  syncVariantId?: number
  tags?: string[]
  productType?: 'tshirt' | 'poster' | 'mug' | 'hoodie' | 'totebag' | 'phone-case' | 'wall-art'

  // Common
  category: string
  featured: boolean
  inStock: boolean
}
