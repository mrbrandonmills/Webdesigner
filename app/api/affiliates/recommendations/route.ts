import { NextRequest, NextResponse } from 'next/server'
import { affiliateProducts, AffiliateProduct } from '@/lib/affiliate-products'
import { logger } from '@/lib/logger'

// Map categories to our product database categories
const categoryMapping: Record<string, string[]> = {
  photography: ['Photo & Video', 'Premium Tech'],
  luxury: ['Luxury Skincare', 'Luxury Lifestyle', 'Premium Tech'],
  art: ['Photo & Video', 'Philosophy & Books'],
  workspace: ['Technology', 'Premium Tech', 'Luxury Lifestyle'],
  tech: ['Technology', 'Premium Tech'],
  books: ['Philosophy & Books'],
  lifestyle: ['Model & Lifestyle', 'Luxury Lifestyle', 'Home & Garden'],
  beauty: ['Beauty & Personal Care', 'Luxury Skincare'],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'photography'
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get the mapped categories for the requested category
    const mappedCategories = categoryMapping[category.toLowerCase()] || ['Technology', 'Premium Tech']

    // Filter products by the mapped categories
    let filteredProducts = affiliateProducts.filter(product =>
      mappedCategories.some(cat => product.category === cat)
    )

    // If no products found in category, return featured products as fallback
    if (filteredProducts.length === 0) {
      filteredProducts = affiliateProducts.filter(p => p.featured)
    }

    // Sort by featured first, then by rating
    filteredProducts.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.rating - a.rating
    })

    // Limit the results
    const results = filteredProducts.slice(0, limit)

    // Transform to match the expected format for AffiliateProductGrid
    const transformedResults = results.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || `https://images.unsplash.com/photo-1606986628253-05620e9b0a80?w=800&q=80`,
      url: product.amazonUrl,
      program: 'amazon',
      affiliateId: product.id,
      category: product.category.toLowerCase().replace(/ /g, '-'),
      commission: product.price * 0.04, // Average 4% Amazon commission
      featured: product.featured,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      brand: product.brand,
      features: product.features?.slice(0, 3), // Top 3 features for card display
    }))

    return NextResponse.json({
      category,
      totalRecommendations: transformedResults.length,
      recommendations: transformedResults,
    })
  } catch (error) {
    logger.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}