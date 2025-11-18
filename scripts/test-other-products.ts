#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

// Common phone case product IDs to check
const phoneProducts = [
  { id: 255, name: 'Clear Case' },
  { id: 276, name: 'Snap Case' },
  { id: 302, name: 'Tough Case' },
  { id: 447, name: 'Premium Case' }
]

// Common tote bag product IDs
const toteProducts = [
  { id: 11, name: 'Tote Bag' },
  { id: 131, name: 'Eco Tote' },
  { id: 204, name: 'Canvas Tote' }
]

async function checkProduct(productId: number, productName: string) {
  try {
    const response = await fetch(`https://api.printful.com/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'X-PF-Store-Id': PRINTFUL_STORE_ID
      }
    })

    if (response.ok) {
      const data = await response.json()
      const variants = data.result.variants
      console.log(`\n✅ ${productName} (ID: ${productId}) - ${data.result.product.title}`)

      // For phone cases, find iPhone variants
      if (productName.includes('Case')) {
        const iphoneVariants = variants.filter((v: any) =>
          v.name.includes('iPhone 14') || v.name.includes('iPhone 15')
        ).slice(0, 3)

        iphoneVariants.forEach((v: any) => {
          console.log(`   ID: ${v.id} - ${v.name}`)
        })
      }

      // For totes, find standard size
      if (productName.includes('Tote')) {
        const toteVariants = variants.filter((v: any) =>
          v.name.includes('15×15') || v.name.includes('Natural')
        ).slice(0, 3)

        toteVariants.forEach((v: any) => {
          console.log(`   ID: ${v.id} - ${v.name}`)
        })
      }

      return true
    }
    return false
  } catch (error) {
    console.log(`❌ ${productName} (ID: ${productId}) - Not available`)
    return false
  }
}

async function main() {
  console.log('🔍 Finding Phone Case Product IDs...')
  for (const product of phoneProducts) {
    await checkProduct(product.id, product.name)
  }

  console.log('\n🔍 Finding Tote Bag Product IDs...')
  for (const product of toteProducts) {
    await checkProduct(product.id, product.name)
  }

  // Check wall art too
  console.log('\n🔍 Checking Wall Art Product...')
  await checkProduct(2, 'Framed Poster')
}

main()