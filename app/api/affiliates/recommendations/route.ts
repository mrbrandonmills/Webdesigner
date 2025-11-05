import { NextRequest, NextResponse } from 'next/server'
import { AffiliateProduct } from '@/lib/affiliate-manager'

// Curated recommendations by category
const recommendations: Record<string, AffiliateProduct[]> = {
  photography: [
    {
      id: 'rec-cam-1',
      name: 'Sony FE 24-70mm f/2.8 GM II',
      description: 'Professional zoom lens with exceptional sharpness and bokeh',
      price: 2298.00,
      image: 'https://images.unsplash.com/photo-1606986628253-05620e9b0a80?w=800',
      url: 'https://www.bhphotovideo.com/c/product/1711871-REG/',
      program: 'bh',
      affiliateId: '1711871',
      category: 'lenses',
      commission: 45.96,
      featured: true,
    },
    {
      id: 'rec-cam-2',
      name: 'Peak Design Everyday Backpack 30L',
      description: 'Premium camera bag for professional photographers',
      price: 299.95,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      url: 'https://www.amazon.com/dp/B07H7L4XGZ',
      program: 'amazon',
      affiliateId: 'B07H7L4XGZ',
      category: 'bags',
      commission: 12.00,
      featured: true,
    },
    {
      id: 'rec-cam-3',
      name: 'Capture One Pro 23',
      description: 'Professional RAW photo editing software',
      price: 299.00,
      image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800',
      url: 'https://www.captureone.com/',
      program: 'shareasale',
      affiliateId: '894372',
      category: 'software',
      commission: 89.70,
      metadata: { merchantId: '78923' },
    },
  ],
  luxury: [
    {
      id: 'rec-lux-1',
      name: 'Leica Q2 Monochrom',
      description: 'The ultimate black and white photography camera',
      price: 5995.00,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      url: 'https://www.bhphotovideo.com/c/product/1604500-REG/',
      program: 'bh',
      affiliateId: '1604500',
      category: 'cameras',
      commission: 119.90,
      featured: true,
    },
    {
      id: 'rec-lux-2',
      name: 'Hermès Photo Album',
      description: 'Handcrafted leather photo album for precious memories',
      price: 1850.00,
      image: 'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800',
      url: 'https://www.hermes.com/',
      program: 'cj',
      affiliateId: '5892034',
      category: 'luxury',
      commission: 92.50,
    },
    {
      id: 'rec-lux-3',
      name: 'Bang & Olufsen Beoplay H95',
      description: 'Premium headphones for creative professionals',
      price: 899.00,
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
      url: 'https://www.amazon.com/dp/B08CXKZH1Y',
      program: 'amazon',
      affiliateId: 'B08CXKZH1Y',
      category: 'audio',
      commission: 35.96,
    },
  ],
  art: [
    {
      id: 'rec-art-1',
      name: 'Museum Glass Frame Collection',
      description: 'Professional-grade frames with UV-protective glass',
      price: 189.00,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      url: 'https://www.framebridge.com/',
      program: 'shareasale',
      affiliateId: '782901',
      category: 'frames',
      commission: 28.35,
      metadata: { merchantId: '92834' },
    },
    {
      id: 'rec-art-2',
      name: 'Epson SureColor P900',
      description: 'Professional photo printer for gallery-quality prints',
      price: 1295.00,
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      url: 'https://www.bhphotovideo.com/c/product/1565297-REG/',
      program: 'bh',
      affiliateId: '1565297',
      category: 'printers',
      commission: 25.90,
    },
    {
      id: 'rec-art-3',
      name: 'Canson Infinity PrintMaking Rag',
      description: 'Museum-grade fine art paper for prints',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
      url: 'https://www.amazon.com/dp/B005XO8P8E',
      program: 'amazon',
      affiliateId: 'B005XO8P8E',
      category: 'paper',
      commission: 3.60,
    },
  ],
  workspace: [
    {
      id: 'rec-work-1',
      name: 'BenQ SW321C PhotoVue Monitor',
      description: '32" 4K color-accurate monitor for photo editing',
      price: 1999.00,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      url: 'https://www.bhphotovideo.com/c/product/1618842-REG/',
      program: 'bh',
      affiliateId: '1618842',
      category: 'monitors',
      commission: 39.98,
      featured: true,
    },
    {
      id: 'rec-work-2',
      name: 'Herman Miller Aeron Chair',
      description: 'Ergonomic chair for long editing sessions',
      price: 1395.00,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
      url: 'https://www.hermanmiller.com/',
      program: 'cj',
      affiliateId: '4729183',
      category: 'furniture',
      commission: 69.75,
    },
    {
      id: 'rec-work-3',
      name: 'Wacom Cintiq Pro 24',
      description: 'Professional pen display for photo retouching',
      price: 2499.95,
      image: 'https://images.unsplash.com/photo-1559163179-3fd017316d4d?w=800',
      url: 'https://www.amazon.com/dp/B07L77D8M3',
      program: 'amazon',
      affiliateId: 'B07L77D8M3',
      category: 'tablets',
      commission: 100.00,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'photography'
    const limit = parseInt(searchParams.get('limit') || '10')

    const categoryRecommendations = recommendations[category] || recommendations.photography
    const results = categoryRecommendations.slice(0, limit)

    return NextResponse.json({
      category,
      totalRecommendations: results.length,
      recommendations: results,
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}