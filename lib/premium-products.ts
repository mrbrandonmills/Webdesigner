/**
 * Premium Products Library
 * Curated collection of museum-quality products via Prodigi
 */

import premiumProductsData from '@/public/data/premium-products.json'
import { UnifiedProduct } from '@/lib/types/shop'
import { affiliateProducts as getAffiliateProducts } from '@/lib/affiliate-products'

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
 * Get all shop products (Amazon affiliate products)
 * Using getFeaturedProducts from affiliate-products.ts
 * FILTERED to only include products with working image URLs
 */
export function getAllShopProducts(): UnifiedProduct[] {
  // CRITICAL EMERGENCY FILTER: Only show products with verified working images
  // This whitelist is inlined here to bypass any module caching issues
  const WORKING_ASINS = [
    'B0CMVPMPZ8', 'B0CM5JV268', '0735211299', '0812968255', '0062316117',
    '0140455116', 'B08PZHYWJS', 'B09XS7JWHH', 'B07L5GDTYY', '8883701127',
    'B071Y3MSRK', 'B0016BFD4K', 'B0009R16MA', '080701429X', '0380810336', '1631060171'
  ];

  // Apply whitelist filter DIRECTLY here to ensure it's executed
  const filtered = getAffiliateProducts.filter(product => {
    const asinMatch = product.amazonUrl.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[2] : null;
    return asin && WORKING_ASINS.includes(asin);
  });

  // Transform to UnifiedProduct format
  return filtered.map((product: any) => ({
    id: product.id,
    title: product.name,
    description: product.description || product.name,
    image: product.images[0],
    images: product.images,
    price: product.price,
    currency: 'USD',
    inStock: product.inStock,
    featured: product.featured || false,
    source: 'amazon' as const,
    productType: product.category,
    category: product.category,
    tags: product.tags || [],
    amazonUrl: product.amazonUrl,
    rating: product.rating,
    reviewCount: product.reviewCount,
    brand: product.brand,
    originalPrice: product.originalPrice,
    features: product.features
  }))
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
