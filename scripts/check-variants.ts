#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

async function getVariants(productId: number, productName: string, filter?: string) {
  const response = await fetch(`https://api.printful.com/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'X-PF-Store-Id': PRINTFUL_STORE_ID
    }
  })

  if (response.ok) {
    const data = await response.json()
    const variants = data.result.variants

    console.log(`\n${productName} (ID: ${productId}):`)
    
    const filtered = filter 
      ? variants.filter((v: any) => v.name.includes(filter))
      : variants.slice(0, 5)

    filtered.forEach((v: any) => {
      console.log(`  ID: ${v.id} - ${v.name}`)
    })
  }
}

async function main() {
  // Phone cases - Snap Case for iPhone
  await getVariants(683, 'Snap Case for iPhone', 'iPhone 14')
  await getVariants(683, 'Snap Case for iPhone', 'iPhone 15')
  
  // Tote bags
  await getVariants(84, 'All-Over Print Tote Bag')
  await getVariants(367, 'Eco Tote Bag')
}

main()
