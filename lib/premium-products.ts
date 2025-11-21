/**
 * Premium Products Library
 * Curated collection of museum-quality products via Prodigi
 */

import premiumProductsData from '@/public/data/premium-products.json'
import { UnifiedProduct } from '@/lib/types/shop'

export interface PremiumProduct {
  id: string
  name: string
  collection: string
  category: string
  featured: boolean
  description: string
  shortDescription: string
  image: string
  designImage: string
  provider: string
  prodigiSku: string
  basePrice: number
  variants: Array<{
    name: string
    sku: string
    price: number
    dimensions: string
  }>
  features: string[]
  tags: string[]
}

export interface ProductCollection {
  name: string
  description: string
  featured: boolean
}

/**
 * Transform premium products to UnifiedProduct format for shop display
 */
function transformPremiumProducts(products: PremiumProduct[]): UnifiedProduct[] {
  return products.map(product => ({
    id: product.id,
    title: product.name,
    description: product.description,
    image: product.image,
    images: [product.image, product.designImage].filter((v, i, a) => a.indexOf(v) === i),
    price: product.basePrice,
    currency: 'USD',
    inStock: true,
    featured: product.featured,
    source: 'prodigi' as const,
    productType: product.category as any,
    category: product.collection,
    tags: product.tags,
    // Prodigi-specific fields - transform variants to include required 'id' field
    variants: product.variants.map((v, idx) => ({
      id: `${product.id}-${idx}`,
      name: v.name,
      price: v.price,
      dimensions: v.dimensions,
    })),
    features: product.features,
    variantCount: product.variants.length,
  }))
}

/**
 * Get all premium products (curated collection)
 */
export function getPremiumProducts(): UnifiedProduct[] {
  const products = premiumProductsData.products as PremiumProduct[]
  return transformPremiumProducts(products)
}

/**
 * Get featured premium products
 */
export function getFeaturedPremiumProducts(): UnifiedProduct[] {
  const products = premiumProductsData.products as PremiumProduct[]
  return transformPremiumProducts(products.filter(p => p.featured))
}

/**
 * Get products by collection
 */
export function getProductsByCollection(collection: string): UnifiedProduct[] {
  const products = premiumProductsData.products as PremiumProduct[]
  return transformPremiumProducts(products.filter(p => p.collection === collection))
}

/**
 * Get a single product by ID
 */
export function getProductById(id: string): UnifiedProduct | undefined {
  const products = premiumProductsData.products as PremiumProduct[]
  const product = products.find(p => p.id === id)
  if (!product) return undefined
  return transformPremiumProducts([product])[0]
}

/**
 * Get raw premium product data (for detail pages)
 */
export function getRawPremiumProduct(id: string): PremiumProduct | undefined {
  const products = premiumProductsData.products as PremiumProduct[]
  return products.find(p => p.id === id)
}

/**
 * Get all collections
 */
export function getCollections(): Record<string, ProductCollection> {
  return premiumProductsData.collections as Record<string, ProductCollection>
}

/**
 * Get all shop products (premium only - curated museum-quality items)
 * Amazon affiliate products removed - they had low-quality/mismatched images
 */
export function getAllShopProducts(): UnifiedProduct[] {
  // Only return curated premium products with proper images
  return getPremiumProducts()
}

/**
 * Get product metadata
 */
export function getProductMeta() {
  return premiumProductsData.meta
}

/**
 * Product type display names
 */
export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  'art-print': 'Fine Art Print',
  'framed-print': 'Framed Print',
  'metal-print': 'Metal Print',
  'acrylic-print': 'Acrylic Print',
  'canvas': 'Gallery Canvas',
  'poster': 'Poster',
  'mug': 'Ceramic Mug',
  'tshirt': 'T-Shirt',
  'totebag': 'Tote Bag',
  'phone-case': 'Phone Case',
}

/**
 * Collection display data
 */
export const COLLECTION_DISPLAY: Record<string, { icon: string; color: string }> = {
  poetry: { icon: 'feather', color: 'gold' },
  photography: { icon: 'camera', color: 'blue' },
  philosophy: { icon: 'brain', color: 'purple' },
}
