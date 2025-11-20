// Shop Product Merger
// Combines Printful and Amazon products into unified shop display

import { UnifiedProduct, ProductSource } from './types/shop'
import { RawPrintfulProduct, RawAmazonProduct } from '@/types/common'

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'

// Infer product type from title or type field
function inferProductType(title: string, type?: string): UnifiedProduct['productType'] {
  const lowerTitle = title.toLowerCase()
  const lowerType = type?.toLowerCase() || ''

  if (lowerTitle.includes('mug') || lowerType.includes('mug')) return 'mug'
  if (lowerTitle.includes('t-shirt') || lowerTitle.includes('tshirt') || lowerType.includes('shirt')) return 'tshirt'
  if (lowerTitle.includes('poster') || lowerType.includes('poster')) return 'poster'
  if (lowerTitle.includes('hoodie') || lowerType.includes('hoodie')) return 'hoodie'
  if (lowerTitle.includes('tote') || lowerType.includes('tote')) return 'totebag'
  if (lowerTitle.includes('phone') || lowerTitle.includes('case') || lowerType.includes('phone')) return 'phone-case'
  if (lowerTitle.includes('wall') || lowerTitle.includes('framed') || lowerType.includes('wall')) return 'wall-art'

  return undefined
}

export function mergeShopProducts(
  printfulProducts: RawPrintfulProduct[],
  amazonProducts: RawAmazonProduct[]
): UnifiedProduct[] {
  const unified: UnifiedProduct[] = []

  // Convert Printful products
  for (const p of printfulProducts) {
    // Use placeholder if no image available
    const productImage = p.image || PLACEHOLDER_IMAGE
    const productImages = p.images && p.images.length > 0 ? p.images : [productImage]

    unified.push({
      id: `printful-${p.id}`,
      source: 'printful',
      title: p.title,
      description: p.description || '',
      price: parseFloat(p.basePrice || p.price || '0'),
      currency: p.currency || 'USD',
      image: productImage,
      images: productImages,
      variantCount: p.variantCount,
      variants: p.variants?.map(v => ({ ...v, price: parseFloat(v.price) })),
      syncProductId: p.syncProductId,
      syncVariantId: p.syncVariantId,
      tags: p.tags,
      category: p.type || p.category || '',
      productType: inferProductType(p.title, p.type || p.productType),
      featured: p.featured || p.source === 'local-curated',
      inStock: p.inStock !== false,
    })
  }

  // Convert Amazon products
  for (const p of amazonProducts) {
    // Use placeholder if no images available
    const hasImages = p.images && p.images.length > 0 && p.images[0]
    const productImage = hasImages ? p.images![0] : PLACEHOLDER_IMAGE
    const productImages = hasImages ? p.images! : [PLACEHOLDER_IMAGE]

    unified.push({
      id: `amazon-${p.id}`,
      source: 'amazon',
      title: p.name,
      description: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice,
      currency: 'USD',
      image: productImage,
      images: productImages,
      amazonUrl: p.amazonUrl,
      rating: p.rating,
      reviewCount: p.reviewCount,
      features: p.features,
      brand: p.brand,
      category: p.category,
      featured: p.featured || false,
      inStock: p.inStock,
    })
  }

  // Sort: featured first, then by price descending
  return unified.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.price - a.price
  })
}
