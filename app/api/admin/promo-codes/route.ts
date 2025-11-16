import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createPromoCode,
  getAllPromoCodes,
  deletePromoCode,
  updatePromoCode,
} from '@/lib/promo-codes'
import logger from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Validation schema for creating promo codes
const createPromoCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['meditation', 'book', 'all']),
  target: z.string().optional(),
  discount: z.number().min(1).max(100),
  maxUses: z.number().optional(),
  expiresAt: z.string().optional(),
  description: z.string().optional(),
  createdBy: z.string().default('admin'),
})

/**
 * GET /api/admin/promo-codes
 * Get all promo codes (admin only)
 */
export async function GET(request: Request) {
  try {
    // TODO: Add admin authentication check
    const codes = getAllPromoCodes()

    return NextResponse.json({
      success: true,
      codes,
    })
  } catch (error) {
    logger.error('Failed to fetch promo codes', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch promo codes',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/promo-codes
 * Create a new promo code (admin only)
 */
export async function POST(request: Request) {
  try {
    // TODO: Add admin authentication check

    const body = await request.json()
    const validationResult = createPromoCodeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const promoCodeData = validationResult.data

    // Create the promo code
    const newCode = createPromoCode(promoCodeData)

    logger.success(`Admin created promo code: ${newCode.code}`)

    return NextResponse.json({
      success: true,
      code: newCode,
      message: 'Promo code created successfully',
    })
  } catch (error) {
    logger.error('Failed to create promo code', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create promo code',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/promo-codes?code=XXX
 * Delete a promo code (admin only)
 */
export async function DELETE(request: Request) {
  try {
    // TODO: Add admin authentication check

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: 'Code parameter is required',
        },
        { status: 400 }
      )
    }

    const deleted = deletePromoCode(code)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Promo code not found',
        },
        { status: 404 }
      )
    }

    logger.info(`Admin deleted promo code: ${code}`)

    return NextResponse.json({
      success: true,
      message: 'Promo code deleted successfully',
    })
  } catch (error) {
    logger.error('Failed to delete promo code', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete promo code',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/promo-codes?code=XXX
 * Update a promo code (admin only)
 */
export async function PUT(request: Request) {
  try {
    // TODO: Add admin authentication check

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: 'Code parameter is required',
        },
        { status: 400 }
      )
    }

    const body = await request.json()

    const updatedCode = updatePromoCode(code, body)

    if (!updatedCode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Promo code not found',
        },
        { status: 404 }
      )
    }

    logger.info(`Admin updated promo code: ${code}`)

    return NextResponse.json({
      success: true,
      code: updatedCode,
      message: 'Promo code updated successfully',
    })
  } catch (error) {
    logger.error('Failed to update promo code', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update promo code',
      },
      { status: 500 }
    )
  }
}
