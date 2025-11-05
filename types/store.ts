/**
 * Comprehensive type definitions for luxury e-commerce store
 */

export interface Dimensions {
  width: number
  height: number
  depth?: number
  unit: 'inches' | 'cm' | 'mm'
}

export interface Material {
  id: string
  name: string
  description: string
  finish?: string
  care?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
  isMain: boolean
  thumbnailUrl?: string
  highResUrl?: string
}

export interface ProductVariant {
  id: number
  productId: number
  name: string
  sku?: string
  size?: string
  color?: string
  material?: string
  frame?: string
  image: string
  price: string
  compareAtPrice?: string
  inStock: boolean
  stockQuantity?: number
  dimensions?: Dimensions
  weight?: number
}

export interface FrameOption {
  id: string
  name: string
  material: string
  color: string
  finish: string
  image: string
  priceModifier: number
  description: string
}

export interface MatOption {
  id: string
  color: string
  width: number
  image: string
  priceModifier: number
}

export interface GlazingOption {
  id: string
  name: string
  type: 'glass' | 'acrylic' | 'none'
  uvProtection: boolean
  antiGlare: boolean
  priceModifier: number
  description: string
}

export interface Product {
  id: number
  title: string
  slug: string
  artist: string
  artistSignature?: string
  brand: string
  model: string
  description: string
  longDescription?: string
  type: string
  category: string
  images: ProductImage[]
  variants: ProductVariant[]
  basePrice: string
  currency: string

  // Limited edition info
  isLimitedEdition: boolean
  editionSize?: number
  editionNumber?: number
  certificateOfAuthenticity?: boolean

  // Product specs
  materials: Material[]
  dimensions: Dimensions
  weight?: number
  printMethod?: string
  paperType?: string

  // Care & details
  careInstructions?: string
  shippingInfo?: string
  returnPolicy?: string

  // Trust & quality
  qualityGuarantee?: boolean
  freeShippingThreshold?: number
  estimatedDeliveryDays?: number

  // SEO & metadata
  tags?: string[]
  featured?: boolean
  createdAt?: string
  updatedAt?: string

  // Analytics
  viewCount?: number
  purchaseCount?: number
}

export interface Collection {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  artist: string
  heroImage: string
  products: Product[]

  // Collection story
  creativeProcess?: string
  inspiration?: string
  technicalDetails?: string
  behindTheScenes?: string[]

  // Metadata
  location?: string
  date?: string
  featured?: boolean
  isLimitedEdition?: boolean
  createdAt?: string
}

export interface WishlistItem {
  id: string
  productId: number
  product: Product
  variantId?: number
  addedAt: string
  priceAtTimeOfAdd: string
  notes?: string
}

export interface CartItemEnhanced {
  productId: number
  variantId: number
  productTitle: string
  variantName: string
  image: string
  price: string
  quantity: number
  type: string
  brand: string

  // Enhanced fields
  dimensions?: Dimensions
  frameOption?: FrameOption
  matOption?: MatOption
  glazingOption?: GlazingOption
  personalizedText?: string
}

export interface ProductConfiguration {
  variantId: number
  frameOption?: FrameOption
  matOption?: MatOption
  glazingOption?: GlazingOption
  totalPrice: number
}

export interface ProductReview {
  id: string
  productId: number
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
}

export interface SizeComparison {
  size: string
  dimensions: Dimensions
  commonComparison: string // e.g., "Similar to a standard poster"
  roomType: string // e.g., "Perfect for living room"
  viewingDistance: string
}

export interface ShippingOption {
  id: string
  name: string
  carrier: string
  estimatedDays: number
  price: number
  trackingIncluded: boolean
  signatureRequired?: boolean
  insuranceIncluded?: boolean
}

export interface ProductFilter {
  category?: string[]
  priceRange?: { min: number; max: number }
  sizes?: string[]
  materials?: string[]
  colors?: string[]
  inStock?: boolean
  featured?: boolean
  limitedEdition?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'title'
}

export interface RecentlyViewed {
  productId: number
  viewedAt: string
  product?: Product
}

export interface ComparisonProduct {
  product: Product
  variant?: ProductVariant
}

export interface TrustSignal {
  icon: string
  title: string
  description: string
}

export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase?: number
  expiresAt?: string
  usageLimit?: number
  usageCount?: number
}
