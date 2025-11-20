import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validatePromoCode, recordPromoCodeUsage } from '@/lib/promo-codes'
import logger from '@/lib/logger'
import { ValidatePromoSchema, formatZodErrors } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/promo/validate
 * Validate a promo code for specific content
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = ValidatePromoSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { code, contentType, contentId, email } = validationResult.data

    // Validate the promo code
    const result = validatePromoCode(code, contentType, contentId)

    // If valid and we have an email, record the usage
    if (result.valid && email) {
      recordPromoCodeUsage(code, email, contentType, contentId)
    }

    logger.info(
      `Promo code validation: ${code} for ${contentType}:${contentId} - ${
        result.valid ? 'VALID' : 'INVALID'
      }`
    )

    return NextResponse.json({
      valid: result.valid,
      discount: result.discount,
      message: result.message,
      isFree: result.discount === 100,
    })
  } catch (error) {
    logger.error('Promo code validation error', error)

    return NextResponse.json(
      {
        valid: false,
        message: 'Failed to validate promo code. Please try again.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/promo/validate?code=XXX&contentType=meditation&contentId=morning-mindfulness
 * Check if a promo code is valid (without recording usage)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const contentType = searchParams.get('contentType') as 'meditation' | 'book'
    const contentId = searchParams.get('contentId')

    if (!code || !contentType || !contentId) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Missing required parameters',
        },
        { status: 400 }
      )
    }

    if (contentType !== 'meditation' && contentType !== 'book') {
      return NextResponse.json(
        {
          valid: false,
          message: 'Invalid content type',
        },
        { status: 400 }
      )
    }

    const result = validatePromoCode(code, contentType, contentId)

    return NextResponse.json({
      valid: result.valid,
      discount: result.discount,
      message: result.message,
      isFree: result.discount === 100,
    })
  } catch (error) {
    logger.error('Promo code check error', error)

    return NextResponse.json(
      {
        valid: false,
        message: 'Failed to check promo code',
      },
      { status: 500 }
    )
  }
}
