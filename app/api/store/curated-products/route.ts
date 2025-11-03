import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const revalidate = 60 // Cache for 60 seconds

/**
 * Get curated products - FAST loading from local file
 * No Printful API calls = instant response
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

    const fileContent = await readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    console.log(`⚡ Loaded ${data.products.length} curated products (instant!)`)

    return NextResponse.json({
      success: true,
      products: data.products,
      count: data.products.length,
      cached: true
    })
  } catch (error) {
    console.error('Failed to load curated products:', error)

    // Return empty array if file doesn't exist yet
    return NextResponse.json({
      success: true,
      products: [],
      count: 0,
      message: 'No curated products yet. Generate some in the admin!'
    })
  }
}
