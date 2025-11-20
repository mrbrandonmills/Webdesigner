/**
 * Printful to Pinterest Pin Generator
 *
 * Automatically generates Pinterest-optimized content from your Printful products.
 * Creates pin titles, descriptions, hashtags, and alt text for each product.
 *
 * Usage:
 *   npx tsx scripts/automation/printful-to-pinterest.ts
 *   npx tsx scripts/automation/printful-to-pinterest.ts --export=tailwind
 */

import * as fs from 'fs'
import * as path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })

interface PrintfulProduct {
  id: number
  name: string
  description?: string
  variants: any[]
  thumbnail_url?: string
  sync_product?: {
    id: number
    external_id: string
    name: string
    variants: number
    synced: number
    thumbnail_url: string
  }
}

interface ProductPin {
  productId: number
  productName: string
  pinTitle: string
  pinDescription: string
  hashtags: string[]
  altText: string
  board: string
  link: string
  imageUrl: string
  price: string
}

// Pinterest-optimized product categories
const productBoards: Record<string, string> = {
  'canvas': 'Genesis Collection - Sacred Art',
  'poster': 'Genesis Collection - Sacred Art',
  'print': 'Genesis Collection - Sacred Art',
  'default': 'Genesis Collection - Sacred Art'
}

// SEO-optimized title formulas
const titleFormulas = [
  '{name} | Sacred Geometry Wall Art',
  '{name} - Museum Quality Canvas',
  '{name} Canvas Print | Consciousness Art',
  'Limited Edition: {name}',
  '{name} | AI Sacred Art'
]

// High-converting Pinterest hashtags for art
const artHashtags = [
  '#sacredgeometry', '#geometricart', '#canvasart', '#wallart',
  '#homedecor', '#modernart', '#abstractart', '#spiritualart',
  '#artprint', '#interiordesign', '#luxuryhome', '#artcollector',
  '#consciousart', '#mathematicalart', '#digitalart', '#aiart'
]

async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
  const apiKey = process.env.PRINTFUL_API_KEY
  const storeId = process.env.PRINTFUL_STORE_ID

  if (!apiKey || !storeId) {
    throw new Error('PRINTFUL_API_KEY and PRINTFUL_STORE_ID required')
  }

  console.log('📦 Fetching products from Printful...')

  const response = await fetch(`https://api.printful.com/store/products`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  if (!response.ok) {
    throw new Error(`Printful API error: ${response.status}`)
  }

  const data = await response.json()
  console.log(`   ✅ Found ${data.result.length} products`)

  return data.result
}

async function getProductDetails(productId: number): Promise<any> {
  const apiKey = process.env.PRINTFUL_API_KEY

  const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.result
}

async function generateProductPins(): Promise<ProductPin[]> {
  const products = await fetchPrintfulProducts()
  const pins: ProductPin[] = []

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  console.log('\n🎨 Generating Pinterest pins for products...\n')

  for (const product of products) {
    const syncProduct = product.sync_product || product

    // Get product details for pricing
    const details = await getProductDetails(syncProduct.id)

    // Find price range
    let priceRange = '$149 - $349'
    if (details?.sync_variants) {
      const prices = details.sync_variants.map((v: any) => parseFloat(v.retail_price))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      priceRange = minPrice === maxPrice
        ? `$${minPrice}`
        : `$${minPrice} - $${maxPrice}`
    }

    // Generate AI-optimized pin content
    const prompt = `Create Pinterest-optimized content for this art product:

Product Name: ${syncProduct.name}
Price: ${priceRange}
Brand: Brandon Mills - Sacred Geometry & Consciousness Art

Generate a JSON object with:
{
  "pinTitle": "SEO-optimized title under 100 chars",
  "pinDescription": "Compelling 200-300 char description with benefits and CTA",
  "altText": "Descriptive alt text for accessibility, 100 chars"
}

The description should:
- Highlight emotional and aesthetic benefits
- Mention "museum quality" and "archival materials"
- Include a soft call to action
- Appeal to affluent art collectors

Return ONLY valid JSON, no markdown.`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const jsonMatch = text.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        const generated = JSON.parse(jsonMatch[0])

        // Select random title formula and hashtags
        const titleFormula = titleFormulas[Math.floor(Math.random() * titleFormulas.length)]
        const title = titleFormula.replace('{name}', syncProduct.name.split(' - ')[0])

        // Select random subset of hashtags
        const selectedHashtags = [...artHashtags]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)

        // Determine board based on product name
        let board = productBoards.default
        for (const [keyword, boardName] of Object.entries(productBoards)) {
          if (syncProduct.name.toLowerCase().includes(keyword)) {
            board = boardName
            break
          }
        }

        pins.push({
          productId: syncProduct.id,
          productName: syncProduct.name,
          pinTitle: generated.pinTitle || title,
          pinDescription: generated.pinDescription,
          hashtags: selectedHashtags,
          altText: generated.altText,
          board,
          link: `https://brandonmills.com/shop?product=${syncProduct.id}&utm_source=pinterest&utm_medium=organic`,
          imageUrl: syncProduct.thumbnail_url || '',
          price: priceRange
        })

        console.log(`   ✅ ${syncProduct.name}`)
      }
    } catch (error: any) {
      console.log(`   ⚠️ ${syncProduct.name}: Using default content`)

      // Fallback to template-based content
      pins.push({
        productId: syncProduct.id,
        productName: syncProduct.name,
        pinTitle: `${syncProduct.name.split(' - ')[0]} | Sacred Geometry Canvas Art`,
        pinDescription: `Transform your space with this museum-quality canvas print from the Genesis Collection. ${syncProduct.name} captures the mathematical beauty of consciousness. Premium archival materials, ready to hang. ${priceRange}`,
        hashtags: artHashtags.slice(0, 10),
        altText: `${syncProduct.name} - Sacred geometry canvas print by Brandon Mills`,
        board: productBoards.default,
        link: `https://brandonmills.com/shop?product=${syncProduct.id}&utm_source=pinterest&utm_medium=organic`,
        imageUrl: syncProduct.thumbnail_url || '',
        price: priceRange
      })
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return pins
}

function exportToTailwind(pins: ProductPin[], outputDir: string): void {
  // Tailwind bulk upload format
  const content = pins.map(pin =>
    `${pin.pinTitle} | ${pin.pinDescription} ${pin.hashtags.join(' ')} | ${pin.link} | ${pin.board}`
  ).join('\n')

  fs.writeFileSync(path.join(outputDir, 'product-pins-tailwind.txt'), content)
  console.log(`   📄 Exported Tailwind bulk upload: product-pins-tailwind.txt`)
}

function exportToCSV(pins: ProductPin[], outputDir: string): void {
  const csv = [
    'Product ID,Product Name,Pin Title,Description,Hashtags,Alt Text,Board,Link,Image URL,Price',
    ...pins.map(pin =>
      `${pin.productId},"${pin.productName.replace(/"/g, '""')}","${pin.pinTitle.replace(/"/g, '""')}","${pin.pinDescription.replace(/"/g, '""')}","${pin.hashtags.join(' ')}","${pin.altText.replace(/"/g, '""')}","${pin.board}","${pin.link}","${pin.imageUrl}","${pin.price}"`
    )
  ].join('\n')

  fs.writeFileSync(path.join(outputDir, 'product-pins.csv'), csv)
  console.log(`   📄 Exported CSV: product-pins.csv`)
}

async function main() {
  console.log('\n🛍️ Printful to Pinterest Pin Generator')
  console.log('======================================\n')

  // Check required env vars
  if (!process.env.PRINTFUL_API_KEY) {
    console.error('❌ PRINTFUL_API_KEY not set')
    process.exit(1)
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not set')
    process.exit(1)
  }

  // Generate pins
  const pins = await generateProductPins()

  // Create output directory
  const outputDir = path.join(process.cwd(), 'data', 'product-pins')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save JSON
  const timestamp = new Date().toISOString().split('T')[0]
  const jsonPath = path.join(outputDir, `product-pins-${timestamp}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify(pins, null, 2))
  console.log(`\n💾 Saved ${pins.length} product pins to ${jsonPath}`)

  // Export formats
  const args = process.argv.slice(2)
  const exportFormat = args.find(a => a.startsWith('--export='))?.split('=')[1]

  console.log('\n📊 Exporting files...')
  exportToCSV(pins, outputDir)

  if (exportFormat === 'tailwind' || exportFormat === 'all') {
    exportToTailwind(pins, outputDir)
  }

  // Summary
  console.log('\n✅ Product Pin Generation Complete!')
  console.log('====================================')
  console.log(`   📌 Total pins: ${pins.length}`)
  console.log(`   💾 Output: ${outputDir}`)

  console.log('\n📋 Next Steps:')
  console.log('   1. Review generated pins in product-pins.csv')
  console.log('   2. Create pin images in Canva Pro (1000x1500 px)')
  console.log('   3. Upload to Tailwind with bulk upload file')
  console.log('   4. Schedule across your best-performing times')
  console.log('')
}

// Run
main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
