import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import OpenAI from 'openai'
import { put } from '@vercel/blob'
import { z } from 'zod'
import { printfulClient } from '@/lib/printful-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60 seconds for image generation

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Input validation schema
const GenerateRequestSchema = z.object({
  themes: z.array(
    z.enum(['consciousness', 'embodiment', 'philosophy', 'nature', 'typography', 'editorial'])
  ).min(1, 'At least one theme is required').max(6, 'Maximum 6 themes allowed'),
  products: z.array(
    z.enum(['poster-small', 'poster-medium', 'poster-large', 'canvas-small', 'tshirt'])
  ).min(1, 'At least one product type is required').max(5, 'Maximum 5 product types allowed')
})

// Design theme prompts mapped to AI image generation
const THEME_PROMPTS: Record<string, string> = {
  consciousness: 'Abstract minimalist art representing consciousness and awareness. Sacred geometry, flowing energy, meditative states. Muted earth tones with gold accents. Premium art print quality. 8K resolution.',
  embodiment: 'Elegant abstract art capturing human movement and embodiment. Flowing lines, dynamic forms, grace and strength. Sophisticated black and gold palette. Museum-quality aesthetic. 8K resolution.',
  philosophy: 'Sophisticated abstract visualization of philosophical concepts. Existentialism, being, becoming. Minimalist modern art. Neutral tones with gold highlights. Premium gallery aesthetic. 8K resolution.',
  nature: 'Refined abstract art inspired by natural elements. Organic shapes, earth, water, air, fire. Harmonious composition. Earthy palette with metallic accents. High-end art print quality. 8K resolution.',
  typography: 'Minimalist typography design featuring philosophical wisdom quote. Clean serif fonts, elegant spacing, subtle textures. Black background with gold text. Premium poster aesthetic. 8K resolution.',
  editorial: 'Editorial fashion photography aesthetic reimagined as abstract art. High contrast, dramatic lighting, sophisticated composition. Black, white, and gold palette. Vogue-quality premium art. 8K resolution.'
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
  "Embodiment Is The Practice Of Becoming Real"
]

interface GenerateRequest {
  themes: string[]
  products: string[]
}

interface GeneratedProduct {
  id: string
  title: string
  description: string
  price: string
  themeId: string
  productType: string
  designUrl: string
  mockupUrl: string
  printfulProductId: number
  printfulSyncProductId?: number
  printfulSyncVariantId?: number
  tags: string[]
  createdAt: string
}

interface ProductsData {
  products: GeneratedProduct[]
}

export async function POST(request: Request) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your environment variables.'
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    // Validate input with Zod
    const validationResult = GenerateRequestSchema.safeParse(body)

    if (!validationResult.success) {
      // Extract validation error messages
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request parameters',
          details: errors
        },
        { status: 400 }
      )
    }

    // Use validated data
    const { themes, products } = validationResult.data

    console.log(`🎨 Generating ${themes.length * products.length} products...`)
    console.log(`   Themes: ${themes.join(', ')}`)
    console.log(`   Products: ${products.join(', ')}`)

    const generatedProducts = []

    // Cache designs per theme to avoid regenerating
    const designCache: Record<string, string> = {}

    // Generate product for each theme × product combination
    for (const themeId of themes) {
      // Generate design once per theme and cache it
      if (!designCache[themeId]) {
        console.log(`🎨 Generating new AI design for theme: ${themeId}`)
        designCache[themeId] = await generateAIDesign(themeId)
      } else {
        console.log(`♻️  Reusing cached design for theme: ${themeId}`)
      }

      for (const productId of products) {
        const product = await generateProduct(themeId, productId, designCache[themeId])
        generatedProducts.push(product)
      }
    }

    // Save to curated products file
    const filePath = path.join(process.cwd(), 'data', 'curated-products.json')

    // Read existing products
    let existingData: ProductsData = { products: [] }
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      existingData = JSON.parse(fileContent) as ProductsData
    } catch (error) {
      // File doesn't exist yet, use empty array
    }

    // Add new products
    existingData.products.push(...generatedProducts)

    // Write back to file
    await writeFile(filePath, JSON.stringify(existingData, null, 2))

    console.log(`✅ Generated and saved ${generatedProducts.length} products!`)
    console.log(`📦 Total products in store: ${existingData.products.length}`)

    return NextResponse.json({
      success: true,
      products: generatedProducts,
      count: generatedProducts.length,
      totalProducts: existingData.products.length,
      message: `Successfully generated ${generatedProducts.length} products with AI-designed artwork`
    })
  } catch (error) {
    // Log detailed error server-side for debugging
    console.error('❌ Product generation error:', error)

    // Extract error message for pattern matching (keep internal)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Provide sanitized error messages to client
    if (errorMessage.includes('API key') || errorMessage.includes('apiKey')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service configuration error. Please contact administrator.'
        },
        { status: 500 }
      )
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service rate limit exceeded. Please try again in a few minutes.'
        },
        { status: 429 }
      )
    }

    if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service quota exceeded. Please contact administrator.'
        },
        { status: 503 }
      )
    }

    // Generic error without exposing internal details
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate products. Please try again or contact support.'
      },
      { status: 500 }
    )
  }
}

async function generateProduct(themeId: string, productId: string, designUrl: string): Promise<GeneratedProduct> {
  // Product configurations with Printful variant IDs
  const productConfig: Record<string, any> = {
    'poster-small': {
      name: '12×16" Premium Poster',
      price: '49.00',
      printfulId: 1,
      variantId: 1349, // 12×16 poster
      placement: 'default'
    },
    'poster-medium': {
      name: '18×24" Gallery Print',
      price: '79.00',
      printfulId: 1,
      variantId: 1, // 18×24 poster
      placement: 'default'
    },
    'poster-large': {
      name: '24×36" Statement Piece',
      price: '99.00',
      printfulId: 1,
      variantId: 2, // 24×36 poster
      placement: 'default'
    },
    'canvas-small': {
      name: '16×20" Canvas',
      price: '149.00',
      printfulId: 29,
      variantId: 6578, // 16×20 canvas
      placement: 'default'
    },
    'tshirt': {
      name: 'Premium T-Shirt',
      price: '35.00',
      printfulId: 71,
      variantId: 4012, // Unisex Medium Black
      placement: 'front'
    }
  }

  const config = productConfig[productId]
  const themeName = themeId.charAt(0).toUpperCase() + themeId.slice(1)

  // Generate unique title
  const title = themeId === 'typography'
    ? `"${WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]}" - ${config.name}`
    : `${themeName} Collection - ${config.name}`

  // Generate description
  const description = generateDescription(themeId, config.name)

  // Generate unique external ID
  const externalId = `${themeId}-${productId}-${Date.now()}`

  let mockupUrl = `/api/placeholder-mockup?theme=${themeId}&product=${productId}`
  let printfulSyncProductId: number | undefined
  let printfulSyncVariantId: number | undefined

  try {
    // Create actual Printful sync product with the AI-generated design
    console.log(`🚀 Creating Printful sync product: ${title}`)

    const { product: syncProduct, mockupUrl: generatedMockupUrl } = await printfulClient.createProductWithDesign({
      name: title,
      designUrl: designUrl,
      productId: config.printfulId,
      variantId: config.variantId,
      retailPrice: config.price,
      placement: config.placement,
      externalId: externalId
    })

    printfulSyncProductId = syncProduct.id

    // Get the first sync variant ID
    if (syncProduct.sync_variants && syncProduct.sync_variants.length > 0) {
      printfulSyncVariantId = syncProduct.sync_variants[0].id
    }

    // Use Printful-generated mockup if available
    if (generatedMockupUrl) {
      mockupUrl = generatedMockupUrl
    }

    console.log(`✅ Printful sync product created successfully! ID: ${printfulSyncProductId}`)
  } catch (error) {
    console.error(`⚠️ Failed to create Printful sync product, continuing with local data:`, error)
    // Continue without Printful sync - product will still be saved locally
  }

  return {
    id: externalId,
    title,
    description,
    price: config.price,
    themeId,
    productType: productId,
    designUrl,
    mockupUrl,
    printfulProductId: config.printfulId,
    printfulSyncProductId,
    printfulSyncVariantId,
    tags: [themeId, 'limited-edition', 'ai-generated'],
    createdAt: new Date().toISOString()
  }
}

function generateDescription(themeId: string, productName: string): string {
  const descriptions: Record<string, string> = {
    consciousness: `Explore the depths of awareness with this stunning ${productName}. Created through AI-guided artistic expression, this piece captures the essence of mindfulness and presence. Part of our limited Consciousness Collection.`,

    embodiment: `Movement meets art in this ${productName}. Inspired by the philosophy of embodiment and the grace of human form, this piece celebrates the connection between mind and body. Part of our exclusive Embodiment Series.`,

    philosophy: `A visual meditation on existential thought. This ${productName} transforms philosophical concepts into stunning abstract art. Perfect for the thoughtful space. Part of our Philosophy Collection.`,

    nature: `Organic beauty reimagined. This ${productName} draws inspiration from the natural world, creating a harmonious blend of earth elements and modern aesthetics. Part of our Nature-Inspired Collection.`,

    typography: `Words that resonate. This minimalist ${productName} features timeless philosophical wisdom in elegant typography. A daily reminder of profound truth. Part of our Wisdom Typography Series.`,

    editorial: `Editorial sophistication meets fine art. This ${productName} channels high-fashion photography aesthetics into a striking visual piece. Museum-quality production. Part of our Editorial Collection.`
  }

  return descriptions[themeId] || `Stunning ${productName} from our curated collection.`
}

async function generateAIDesign(themeId: string): Promise<string> {
  try {
    console.log(`🎨 Generating AI design for theme: ${themeId}`)

    // Get the AI prompt for this theme
    const prompt = THEME_PROMPTS[themeId] || THEME_PROMPTS.consciousness

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard', // Use 'hd' for higher quality (costs more)
      style: 'natural', // 'vivid' or 'natural'
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E')
    }

    console.log(`✅ Image generated, downloading...`)

    // Download the image from DALL-E's temporary URL
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' })

    // Upload to Vercel Blob for permanent storage
    const filename = `designs/${themeId}-${Date.now()}.png`
    const { url } = await put(filename, imageBlob, {
      access: 'public',
      contentType: 'image/png',
    })

    console.log(`✅ Image saved to Vercel Blob: ${url}`)

    return url
  } catch (error) {
    console.error('AI design generation failed:', error)

    // Fallback to placeholder if generation fails
    return `/api/ai-design-placeholder?theme=${themeId}&t=${Date.now()}`
  }
}
