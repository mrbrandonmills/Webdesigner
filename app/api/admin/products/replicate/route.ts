import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ProductVariation {
  id: string
  title: string
  description: string
  price: string
  themeId: string
  productType: string
  designUrl: string
  mockupUrl: string
  printfulProductId: number
  tags: string[]
  parentProductId?: string
  variationNumber?: number
  createdAt: string
}

interface ProductsData {
  products: ProductVariation[]
}

const WISDOM_QUOTES = [
  "Know Thyself",
  "The Unexamined Life Is Not Worth Living",
  "Become Who You Are",
  "Act As If What You Do Makes A Difference. It Does.",
  "The Only True Wisdom Is Knowing You Know Nothing",
  "Wherever You Go, There You Are",
  "Between Stimulus And Response There Is A Space",
  "Be Here Now",
  "The Body Keeps The Score",
  "Embodiment Is The Practice Of Becoming Real",
  "The Mind Is Everything. What You Think You Become.",
  "In The Beginner's Mind There Are Many Possibilities",
  "You Are The Sky. Everything Else Is Just The Weather.",
  "The Present Moment Is The Only Moment Available To Us"
]

/**
 * Create variations of top-performing products
 */
export async function POST(request: Request) {
  try {
    const { products, variationsPerProduct }: { products: string[], variationsPerProduct: number } = await request.json()

    console.log(`🎨 Creating ${variationsPerProduct} variations for ${products.length} top performers...`)

    const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

    // Read existing products
    let data: ProductsData = { products: [] }
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      data = JSON.parse(fileContent) as ProductsData
    } catch (error) {
      data = { products: [] }
    }

    const newVariations: ProductVariation[] = []

    // For each top performer, create variations
    for (const productId of products) {
      const original = data.products.find((p: any) => p.id === productId)

      if (!original) {
        console.warn(`Product ${productId} not found, skipping...`)
        continue
      }

      // Create variations
      for (let i = 0; i < variationsPerProduct; i++) {
        const variation = createVariation(original, i + 1)
        newVariations.push(variation)
      }
    }

    // Add new variations to products
    data.products.push(...newVariations)

    // Save updated file
    await writeFile(filePath, JSON.stringify(data, null, 2))

    console.log(`✅ Created ${newVariations.length} new product variations!`)

    return NextResponse.json({
      success: true,
      created: newVariations.length,
      totalProducts: data.products.length
    })
  } catch (error) {
    console.error('Product replication error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to replicate products'
      },
      { status: 500 }
    )
  }
}

/**
 * Create a variation of a successful product
 */
function createVariation(original: any, variationNumber: number): ProductVariation {
  const themeId = original.themeId || 'consciousness'
  const themeName = themeId.charAt(0).toUpperCase() + themeId.slice(1)

  // Generate variation title
  let title = original.title
  if (themeId === 'typography') {
    // New quote for typography variations
    const quote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]
    title = title.replace(/^"[^"]*"/, `"${quote}"`)
  } else {
    // Add variation number to title
    title = title.replace(' - ', ` V${variationNumber} - `)
  }

  // Slightly vary the price (±10%)
  const originalPrice = parseFloat(original.price)
  const priceVariation = originalPrice * (0.9 + Math.random() * 0.2)
  const newPrice = Math.round(priceVariation * 100) / 100

  // Create variation description emphasizing newness
  const description = original.description.replace(
    'Part of our',
    `New variation inspired by customer favorites. Part of our`
  )

  return {
    id: `${original.id}-var${variationNumber}-${Date.now()}`,
    title,
    description,
    price: newPrice.toFixed(2),
    themeId,
    productType: original.productType,
    designUrl: `${original.designUrl}&variation=${variationNumber}`,
    mockupUrl: `${original.mockupUrl}&variation=${variationNumber}`,
    printfulProductId: original.printfulProductId,
    tags: [...(original.tags || []), 'variation', 'bestseller-inspired'],
    parentProductId: original.id,
    variationNumber,
    createdAt: new Date().toISOString()
  }
}
