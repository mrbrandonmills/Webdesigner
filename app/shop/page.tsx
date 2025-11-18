import { Metadata } from 'next'
import { ShopPageClient } from './shop-client'
import { affiliateProducts } from '@/lib/affiliate-products'
import { mergeShopProducts } from '@/lib/shop-merger'
import themeFactoryProducts from '@/public/data/theme-factory-products.json'

export const metadata: Metadata = {
  title: 'Shop | Brandon Mills',
  description: 'Museum-quality products: custom merchandise, philosophy books, premium tech. Every item tells a story.',
}

async function getProducts() {
  try {
    // Fetch Printful products from API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const printfulRes = await fetch(`${baseUrl}/api/store/products`, {
      cache: 'no-store',
    })

    let printfulProducts = []
    if (printfulRes.ok) {
      const printfulData = await printfulRes.json()
      printfulProducts = printfulData.products || []
    }

    // Combine theme factory products with Printful API products
    // Theme factory products take precedence (they're our curated designs)
    const allPrintfulProducts = [...themeFactoryProducts.products, ...printfulProducts]

    // Merge with Amazon affiliate products
    return mergeShopProducts(allPrintfulProducts, affiliateProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to theme factory + Amazon products if API fails
    return mergeShopProducts(themeFactoryProducts.products, affiliateProducts)
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  return <ShopPageClient products={products} />
}
