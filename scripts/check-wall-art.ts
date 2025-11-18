#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

async function getVariants(productId: number, productName: string) {
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
    
    const filtered = variants.filter((v: any) => 
      (v.name.includes('12×18') || v.name.includes('12″×18″')) ||
      (v.name.includes('18×24') || v.name.includes('18″×24″'))
    )

    filtered.forEach((v: any) => {
      console.log(`  ID: ${v.id} - ${v.name}`)
    })
  }
}

async function main() {
  // Framed poster
  await getVariants(2, 'Enhanced Matte Paper Framed Poster')
  
  // Also test the variant ID 3490 that's in the script
  const testResponse = await fetch('https://api.printful.com/products/variant/3490', {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'X-PF-Store-Id': PRINTFUL_STORE_ID
    }
  })

  if (testResponse.ok) {
    const data = await testResponse.json()
    console.log(`\nVariant 3490 check:`)
    console.log(`  ${data.result.variant.name}`)
  } else {
    console.log(`\nVariant 3490: NOT AVAILABLE`)
  }
}

main()
