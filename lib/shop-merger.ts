// Shop Product Merger
// Combines Printful and Amazon products into unified shop display

import { UnifiedProduct, ProductSource } from './types/shop'

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
  printfulProducts: any[],
  amazonProducts: any[]
): UnifiedProduct[] {
  const unified: UnifiedProduct[] = []

  // Convert Printful products
  for (const p of printfulProducts) {
    unified.push({
      id: `printful-${p.id}`,
      source: 'printful',
      title: p.title,
      description: p.description,
      price: parseFloat(p.basePrice),
      currency: p.currency,
      image: p.image,
      images: p.images || [p.image],
      variantCount: p.variantCount,
      variants: p.variants,
      syncProductId: p.syncProductId,
      syncVariantId: p.syncVariantId,
      tags: p.tags,
      category: p.type,
      productType: inferProductType(p.title, p.type),
      featured: p.source === 'local-curated',
      inStock: true,
    })
  }

  // Convert Amazon products
  for (const p of amazonProducts) {
    unified.push({
      id: `amazon-${p.id}`,
      source: 'amazon',
      title: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      currency: 'USD',
      image: p.images[0],
      images: p.images,
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
