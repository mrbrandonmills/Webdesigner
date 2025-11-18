#!/usr/bin/env tsx
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!

async function findProducts() {
  const response = await fetch('https://api.printful.com/products', {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`
    }
  })

  const data = await response.json()
  const products = data.result

  console.log('Phone Cases:')
  products.filter((p: any) => 
    p.title.toLowerCase().includes('case') && 
    (p.title.toLowerCase().includes('iphone') || p.title.toLowerCase().includes('phone'))
  ).forEach((p: any) => {
    console.log(`  ID: ${p.id} - ${p.title}`)
  })

  console.log('\nTote Bags:')
  products.filter((p: any) => 
    p.title.toLowerCase().includes('tote')
  ).forEach((p: any) => {
    console.log(`  ID: ${p.id} - ${p.title}`)
  })
}

findProducts()
