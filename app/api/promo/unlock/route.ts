import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validatePromoCode, recordPromoCodeUsage } from '@/lib/promo-codes'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import logger from '@/lib/logger'
import { UnlockPromoSchema, formatZodErrors } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/promo/unlock
 * Unlock content using a valid promo code
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = UnlockPromoSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { code, contentType, contentId, email } = validationResult.data

    // Validate the promo code
    const promoResult = validatePromoCode(code, contentType, contentId)

    if (!promoResult.valid) {
      return NextResponse.json(
        {
          success: false,
          message: promoResult.message || 'Invalid promo code',
        },
        { status: 400 }
      )
    }

    // Check if discount is 100% (free access)
    if (promoResult.discount !== 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'This promo code provides a discount but requires payment',
          discount: promoResult.discount,
        },
        { status: 400 }
      )
    }

    // Record the promo code usage
    recordPromoCodeUsage(code, email, contentType, contentId)

    // Create unlock record
    const unlockRecord = {
      contentType,
      contentId,
      email,
      promoCode: code,
      unlockedAt: new Date().toISOString(),
      method: 'promo_code',
    }

    // Save unlock record to file system
    if (contentType === 'meditation') {
      const unlocksDir = path.join(process.cwd(), 'data', 'meditation-unlocks')
      await mkdir(unlocksDir, { recursive: true })

      // Update email index
      const emailIndexFile = path.join(unlocksDir, 'by-email.json')
      let emailIndex: Record<string, string[]> = {}

      try {
        const indexContent = await readFile(emailIndexFile, 'utf-8')
        emailIndex = JSON.parse(indexContent)
      } catch {
        // File doesn't exist yet
      }

      if (!emailIndex[email]) {
        emailIndex[email] = []
      }

      // Add meditation to user's unlocked list
      if (!emailIndex[email].includes(contentId) && !emailIndex[email].includes('all')) {
        emailIndex[email].push(contentId)
      }

      await writeFile(emailIndexFile, JSON.stringify(emailIndex, null, 2))

      // Save individual promo unlock record
      const promoUnlockFile = path.join(
        unlocksDir,
        `promo-${code}-${email}-${Date.now()}.json`
      )
      await writeFile(promoUnlockFile, JSON.stringify(unlockRecord, null, 2))

      logger.success(`Meditation unlocked with promo: ${contentId} for ${email}`)
    } else if (contentType === 'book') {
      const unlocksDir = path.join(process.cwd(), 'data', 'book-unlocks')
      await mkdir(unlocksDir, { recursive: true })

      // Update email index
      const emailIndexFile = path.join(unlocksDir, 'by-email.json')
      let emailIndex: Record<string, string[]> = {}

      try {
        const indexContent = await readFile(emailIndexFile, 'utf-8')
        emailIndex = JSON.parse(indexContent)
      } catch {
        // File doesn't exist yet
      }

      if (!emailIndex[email]) {
        emailIndex[email] = []
      }

      // Add book to user's unlocked list
      if (!emailIndex[email].includes(contentId) && !emailIndex[email].includes('all')) {
        emailIndex[email].push(contentId)
      }

      await writeFile(emailIndexFile, JSON.stringify(emailIndex, null, 2))

      // Save individual promo unlock record
      const promoUnlockFile = path.join(
        unlocksDir,
        `promo-${code}-${email}-${Date.now()}.json`
      )
      await writeFile(promoUnlockFile, JSON.stringify(unlockRecord, null, 2))

      logger.success(`Book unlocked with promo: ${contentId} for ${email}`)
    }

    // Generate unlock token
    const unlockToken = Buffer.from(
      JSON.stringify({
        contentType,
        contentId,
        email,
        promoCode: code,
        timestamp: Date.now(),
      })
    ).toString('base64')

    return NextResponse.json({
      success: true,
      unlocked: true,
      contentType,
      contentId,
      unlockToken,
      message: 'Content unlocked successfully with promo code!',
    })
  } catch (error) {
    logger.error('Promo unlock error', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to unlock content. Please try again.',
      },
      { status: 500 }
    )
  }
}
