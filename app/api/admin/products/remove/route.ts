import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Remove underperforming products from the store
 */
export async function POST(request: Request) {
  try {
    const { productIds }: { productIds: string[] } = await request.json()

    logger.info('Removing ${productIds.length} underperforming products...')

    const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

    // Read existing products
    let data = { products: [] }
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      data = JSON.parse(fileContent)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'No products file found' },
        { status: 404 }
      )
    }

    // Filter out the underperformers
    const before = data.products.length
    data.products = data.products.filter((p: any) => !productIds.includes(p.id))
    const removed = before - data.products.length

    // Save updated file
    await writeFile(filePath, JSON.stringify(data, null, 2))

    logger.info('Removed ${removed} products. ${data.products.length} remaining.')

    return NextResponse.json({
      success: true,
      removed,
      remaining: data.products.length
    })
  } catch (error) {
    logger.error('Product removal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove products'
      },
      { status: 500 }
    )
  }
}
