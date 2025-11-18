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

    // Create a set of sync product IDs from theme factory products
    const themeFactorySyncIds = new Set(
      themeFactoryProducts.products.map(p => p.syncProductId).filter(id => id)
    )

    // Filter out Printful API products that already exist in theme factory
    // This avoids duplicates while maintaining local images for speed
    const uniquePrintfulProducts = printfulProducts.filter(
      (product: any) => !themeFactorySyncIds.has(product.syncProductId)
    )

    // Combine theme factory products with unique Printful API products
    // Theme factory products take precedence (they have local images for faster loading)
    const allPrintfulProducts = [...themeFactoryProducts.products, ...uniquePrintfulProducts]

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
