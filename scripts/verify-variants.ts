#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

// Updated variant IDs from our sync script
const variantsToTest = [
  { id: 1320, desc: 'Mug 11oz' },
  { id: 4830, desc: 'Mug 15oz' },
  { id: 3876, desc: 'Poster 12×18' },
  { id: 1, desc: 'Poster 18×24' },
  { id: 16910, desc: 'iPhone 14 Case' },
  { id: 16912, desc: 'iPhone 14 Pro Case' },
  { id: 10457, desc: 'Eco Tote' },
  { id: 4398, desc: 'Wall Art 12×18' },
  { id: 3, desc: 'Wall Art 18×24' },
  { id: 4012, desc: 'T-shirt M' },
  { id: 4013, desc: 'T-shirt L' }
]

async function testVariant(variant: {id: number, desc: string}) {
  try {
    const response = await fetch(`https://api.printful.com/products/variant/${variant.id}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'X-PF-Store-Id': PRINTFUL_STORE_ID
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${variant.desc} (${variant.id}): ${data.result.variant.name}`)
      return true
    } else {
      console.log(`❌ ${variant.desc} (${variant.id}): NOT AVAILABLE`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${variant.desc} (${variant.id}): ERROR`)
    return false
  }
}

async function main() {
  console.log('🔍 VERIFYING ALL VARIANT IDS FROM SYNC SCRIPT:\n')
  
  let allValid = true
  for (const variant of variantsToTest) {
    const isValid = await testVariant(variant)
    if (!isValid) allValid = false
  }

  console.log('\n' + '='.repeat(50))
  if (allValid) {
    console.log('✅ SUCCESS: All variant IDs are valid!')
  } else {
    console.log('❌ ERROR: Some variant IDs are invalid!')
  }
}

main()
