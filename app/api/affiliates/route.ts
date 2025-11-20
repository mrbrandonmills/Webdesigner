import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  AFFILIATE_PROGRAMS,
  createAffiliateProduct,
  type AffiliateProduct
} from '@/lib/affiliate-manager'
import { logger } from '@/lib/logger'
import {
  CreateAffiliateProductSchema,
  UpdateAffiliateProductSchema,
  formatZodErrors
} from '@/lib/validations'

// Simulated database - in production, use Vercel KV or database
let affiliateProducts: AffiliateProduct[] = [
  // Photography Equipment
  {
    id: 'canon-r5',
    name: 'Canon EOS R5 Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 45MP sensor, 8K video, and advanced autofocus. Perfect for high-resolution photography and videography.',
    price: 3899.00,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    url: 'https://www.bhphotovideo.com/c/product/1547010-REG/',
    program: 'bh',
    affiliateId: '1547010',
    category: 'cameras',
    commission: 77.98,
    featured: true,
  },
  {
    id: 'sony-a7iv',
    name: 'Sony a7 IV Mirrorless Camera',
    description: 'Versatile full-frame camera with 33MP sensor, advanced AF, and professional video capabilities.',
    price: 2498.00,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=800',
    url: 'https://www.amazon.com/dp/B09JZT6YK5',
    program: 'amazon',
    affiliateId: 'B09JZT6YK5',
    category: 'cameras',
    commission: 49.96,
    featured: true,
  },
  // Lighting Equipment
  {
    id: 'godox-ad200',
    name: 'Godox AD200 Pro Pocket Flash',
    description: 'Portable 200W strobe with TTL, HSS, and wireless control. Essential for on-location photography.',
    price: 329.00,
    image: 'https://images.unsplash.com/photo-1617638924751-92d272ce9b77?w=800',
    url: 'https://www.amazon.com/dp/B07DKHKT6K',
    program: 'amazon',
    affiliateId: 'B07DKHKT6K',
    category: 'lighting',
    commission: 6.58,
  },
  // Art & Home Decor
  {
    id: 'society6-prints',
    name: 'Society6 Art Print Collection',
    description: 'Curated collection of premium art prints from independent artists worldwide.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
    url: 'https://society6.com/art-prints',
    program: 'shareasale',
    affiliateId: '694618',
    category: 'art',
    metadata: { merchantId: '68218' },
    commission: 4.50,
  },
  // Creative Software
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud Photography Plan',
    description: 'Lightroom, Photoshop, and 1TB cloud storage for photographers.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800',
    url: 'https://www.adobe.com/creativecloud/photography.html',
    program: 'cj',
    affiliateId: '13272445',
    category: 'software',
    commission: 16.99,
    featured: true,
  },
  // Luxury Items
  {
    id: 'montblanc-notebook',
    name: 'Montblanc Fine Stationery Notebook',
    description: 'Premium leather-bound notebook for creative professionals and collectors.',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800',
    url: 'https://www.montblanc.com/notebooks',
    program: 'cj',
    affiliateId: '4918502',
    category: 'luxury',
    commission: 8.25,
  },
]

// GET /api/affiliates - Get all affiliate products or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const program = searchParams.get('program')

    let products = [...affiliateProducts]

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category)
    }
    if (featured === 'true') {
      products = products.filter(p => p.featured)
    }
    if (program) {
      products = products.filter(p => p.program === program)
    }

    return NextResponse.json(products)
  } catch (error) {
    logger.error('Error fetching affiliate products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate products' },
      { status: 500 }
    )
  }
}

// POST /api/affiliates - Add new affiliate product (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = CreateAffiliateProductSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create new product
    const newProduct = createAffiliateProduct({
      ...data,
      id: data.id || `${data.program}-${Date.now()}`,
    } as any)

    // Add to collection
    affiliateProducts.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    logger.error('Error creating affiliate product:', error)
    return NextResponse.json(
      { error: 'Failed to create affiliate product' },
      { status: 500 }
    )
  }
}

// PUT /api/affiliates - Update affiliate product
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add authentication check

    const body = await request.json()

    // Validate input with Zod
    const validationResult = UpdateAffiliateProductSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const data = validationResult.data

    const index = affiliateProducts.findIndex(p => p.id === data.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    affiliateProducts[index] = {
      ...affiliateProducts[index],
      ...data,
    } as any

    return NextResponse.json(affiliateProducts[index])
  } catch (error) {
    logger.error('Error updating affiliate product:', error)
    return NextResponse.json(
      { error: 'Failed to update affiliate product' },
      { status: 500 }
    )
  }
}

// DELETE /api/affiliates - Delete affiliate product
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add authentication check

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const index = affiliateProducts.findIndex(p => p.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Remove product
    const deleted = affiliateProducts.splice(index, 1)[0]

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    logger.error('Error deleting affiliate product:', error)
    return NextResponse.json(
      { error: 'Failed to delete affiliate product' },
      { status: 500 }
    )
  }
}