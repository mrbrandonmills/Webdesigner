/**
 * Theme Factory Product Generator
 * Generates complete product catalog data for all themes
 * Combines rendered designs with product information, pricing, and metadata
 */

import { contentThemes } from './store-curator'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '@/lib/logger'

/**
 * Theme object structure from store-curator
 */
interface ContentTheme {
  name: string
  essence: string
  mood: string
  aestheticDirection?: string
  targetAudience?: string
  colorPalette?: readonly string[]
  keywords?: readonly string[]
  [key: string]: unknown
}

export interface ProductVariant {
  id: string
  size?: string
  color?: string
  dimensions?: string
  price: number
  printfulVariantId?: number
  syncVariantId?: number
  inStock: boolean
}

export interface ProductMetadata {
  themeEssence: string
  contentSource: string
  designStyle: string
  fabricQuality?: string
  printQuality?: string
  careInstructions?: string
  dimensions?: string
  material?: string
  finish?: string
}

export interface ThemeFactoryProduct {
  id: string
  source: 'printful'
  theme: string
  category: 'poetry' | 'photography' | 'philosophy' | 'books'
  title: string
  description: string
  price: number
  currency: string
  image: string
  images: string[]
  productType: string
  printfulProductId: number
  syncProductId?: number
  variantCount: number
  variants: ProductVariant[]
  tags: string[]
  featured: boolean
  inStock: boolean
  metadata: ProductMetadata
}

interface RenderedDesign {
  file: string
  path: string
  productType: string
}

interface ManifestData {
  categories: {
    poetry?: Record<string, RenderedDesign[]>
    photography?: Record<string, RenderedDesign[]>
    philosophy?: Record<string, RenderedDesign[]>
  }
}

interface SyncProduct {
  category: string
  name: string
  productType: string
  syncProductId: number
  variantCount: number
  mockupUrls: string[]
}

export class ThemeProductGenerator {
  private printfulProductMap: Record<string, number> = {
    't-shirt': 71,           // Unisex Staple T-Shirt | Bella + Canvas 3001
    'hoodie': 146,           // Unisex Heavyweight Hoodie | Gildan 18500
    'poster': 1,             // Enhanced Matte Paper Poster
    'wall-art': 29,          // Canvas print
    'mug': 19,               // Ceramic Mug 11oz
    'phone-case': 207,       // Clear Case for iPhone®
    'tote-bag': 86,          // Cotton Tote Bag
    'pillow': 133,           // Premium Pillow
  }

  private pricingStrategy: Record<string, number> = {
    't-shirt': 39.95,
    'hoodie': 59.95,
    'poster': 29.95,
    'wall-art': 89.95,
    'mug': 24.95,
    'phone-case': 34.95,
    'tote-bag': 44.95,
    'pillow': 49.95,
  }

  /**
   * Generate product from design + theme data
   */
  generateProduct(
    design: RenderedDesign,
    themeName: string,
    category: 'poetry' | 'photography' | 'philosophy',
    syncData?: SyncProduct
  ): ThemeFactoryProduct {
    const themeCategory = contentThemes[category]
    if (!themeCategory) {
      throw new Error(`Category not found: ${category}`)
    }

    const theme = (themeCategory as Record<string, ContentTheme>)[themeName]
    if (!theme) {
      throw new Error(`Theme not found: ${category}/${themeName}`)
    }

    const productType = design.productType
    const productId = `tf-${themeName}-${productType}`
    const price = this.pricingStrategy[productType] || 39.95

    // Generate title based on category and product type
    const title = this.generateTitle(theme.name, productType, category)

    // Generate description connecting design to content
    const description = this.generateDescription(theme, productType, category)

    // Generate variants based on product type
    const variants = this.generateVariants(productId, productType, price)

    // Generate metadata
    const metadata = this.generateMetadata(theme, productType, category)

    // Determine if featured
    const featured = this.shouldBeFeatured(category, productType)

    // Generate tags
    const tags = this.generateTags(theme, category, productType)

    return {
      id: productId,
      source: 'printful',
      theme: themeName,
      category,
      title,
      description,
      price,
      currency: 'USD',
      image: design.path,
      images: this.generateImages(design, syncData),
      productType,
      printfulProductId: this.printfulProductMap[productType] || 1,
      syncProductId: syncData?.syncProductId,
      variantCount: variants.length,
      variants,
      tags,
      featured,
      inStock: true,
      metadata,
    }
  }

  /**
   * Generate product title
   */
  private generateTitle(themeName: string, productType: string, category: string): string {
    const productNames: Record<string, string> = {
      't-shirt': 'Premium T-Shirt',
      'hoodie': 'Luxury Hoodie',
      'poster': category === 'photography' ? 'Museum Poster' : 'Art Print',
      'wall-art': 'Gallery Canvas',
      'mug': category === 'philosophy' ? 'Wisdom Mug' : 'Ceramic Mug',
      'phone-case': 'Designer Phone Case',
      'tote-bag': 'Canvas Tote',
      'pillow': 'Decorative Pillow',
    }

    return `${themeName} - ${productNames[productType] || 'Product'}`
  }

  /**
   * Generate compelling product description
   */
  private generateDescription(
    theme: ContentTheme,
    productType: string,
    category: string
  ): string {
    const categoryIntros = {
      poetry: `Luxury streetwear featuring Brandon Mills' poetry "${theme.name}" - ${theme.essence.toLowerCase()}.`,
      photography: `Limited edition ${productType === 'poster' ? 'photographic print' : 'product'} from Brandon Mills' AM Reed collaboration. ${theme.essence}.`,
      philosophy: `Daily inspiration from Brandon Mills for the modern polymath. ${theme.essence}.`,
    }

    const productDetails: Record<string, string> = {
      't-shirt': 'Each verse printed with museum-quality precision on premium cotton.',
      'poster': 'Museum-quality printing on archival paper.',
      'wall-art': 'Gallery-wrapped canvas with premium finish.',
      'mug': 'Perfect for morning contemplation with your coffee ritual.',
      'phone-case': 'Protect your device with artistic sophistication.',
      'tote-bag': 'Carry your essentials with literary elegance.',
    }

    const intro = categoryIntros[category as keyof typeof categoryIntros] || ''
    const detail = productDetails[productType] || 'Premium quality construction.'

    return `${intro} ${detail}\n\nContent: "${theme.mood}"`
  }

  /**
   * Generate product variants
   */
  private generateVariants(productId: string, productType: string, price: number): ProductVariant[] {
    const variants: ProductVariant[] = []

    switch (productType) {
      case 't-shirt':
      case 'hoodie':
        const sizes = ['S', 'M', 'L', 'XL']
        sizes.forEach((size, index) => {
          variants.push({
            id: `${productId}-${size.toLowerCase()}`,
            size,
            color: 'Black',
            price,
            printfulVariantId: 4011 + index,
            syncVariantId: 123456 + index,
            inStock: true,
          })
        })
        break

      case 'poster':
      case 'wall-art':
        const posterSizes = ['16x20', '24x36']
        posterSizes.forEach((dimensions, index) => {
          const sizePrice = index === 0 ? price : price + 20
          variants.push({
            id: `${productId}-${dimensions.replace('x', '')}`,
            dimensions,
            price: sizePrice,
            printfulVariantId: 1001 + index,
            syncVariantId: 234567 + index,
            inStock: true,
          })
        })
        break

      case 'mug':
        const mugSizes = ['11oz', '15oz']
        mugSizes.forEach((size, index) => {
          const mugPrice = index === 0 ? price : price + 5
          variants.push({
            id: `${productId}-${size}`,
            size,
            color: 'White',
            price: mugPrice,
            printfulVariantId: 2001 + index,
            syncVariantId: 345678 + index,
            inStock: true,
          })
        })
        break

      case 'phone-case':
        const phoneModels = ['iPhone 15 Pro', 'iPhone 14']
        phoneModels.forEach((model, index) => {
          variants.push({
            id: `${productId}-${model.toLowerCase().replace(/\s+/g, '-')}`,
            size: model,
            price,
            printfulVariantId: 3001 + index,
            syncVariantId: 456789 + index,
            inStock: true,
          })
        })
        break

      case 'tote-bag':
      case 'pillow':
        variants.push({
          id: `${productId}-standard`,
          price,
          printfulVariantId: 5001,
          syncVariantId: 567890,
          inStock: true,
        })
        break

      default:
        variants.push({
          id: `${productId}-default`,
          price,
          inStock: true,
        })
    }

    return variants
  }

  /**
   * Generate product metadata
   */
  private generateMetadata(
    theme: ContentTheme,
    productType: string,
    category: string
  ): ProductMetadata {
    const base: ProductMetadata = {
      themeEssence: theme.essence,
      contentSource: `${category}-${theme.name.toLowerCase().replace(/\s+/g, '-')}`,
      designStyle: theme.aestheticDirection || 'Contemporary minimalism',
    }

    // Add product-specific metadata
    switch (productType) {
      case 't-shirt':
      case 'hoodie':
        return {
          ...base,
          fabricQuality: productType === 't-shirt'
            ? '100% combed ring-spun cotton, 4.3 oz'
            : '50/50 cotton-polyester blend, 8 oz',
          printQuality: 'Direct-to-garment printing, vibrant colors',
          careInstructions: 'Machine wash cold, tumble dry low',
        }

      case 'poster':
      case 'wall-art':
        return {
          ...base,
          dimensions: '16x20 inches (standard)',
          material: productType === 'poster'
            ? 'Enhanced matte paper, 189 g/m²'
            : 'Premium canvas, gallery wrapped',
          finish: productType === 'poster' ? 'Matte' : 'Semi-gloss',
        }

      case 'mug':
        return {
          ...base,
          dimensions: '11oz capacity',
          material: 'Premium ceramic',
          careInstructions: 'Dishwasher and microwave safe',
        }

      case 'phone-case':
        return {
          ...base,
          material: 'Durable polycarbonate',
          finish: 'Clear with printed design',
          careInstructions: 'Wipe clean with soft cloth',
        }

      case 'tote-bag':
        return {
          ...base,
          dimensions: '15" x 16"',
          material: '100% cotton canvas',
          careInstructions: 'Machine wash cold',
        }

      default:
        return base
    }
  }

  /**
   * Generate product images array
   */
  private generateImages(design: RenderedDesign, syncData?: SyncProduct): string[] {
    const images = [design.path]

    // Add placeholder mockup paths (local paths, not external URLs for now)
    const mockupBase = `/mockups/${design.productType}`
    images.push(
      `${mockupBase}-front.jpg`,
      `${mockupBase}-lifestyle.jpg`
    )

    // Note: In production, we would fetch real mockup URLs from Printful API
    // For now, using placeholder paths that follow our expected format

    return images
  }

  /**
   * Determine if product should be featured
   */
  private shouldBeFeatured(category: string, productType: string): boolean {
    // Feature poetry t-shirts and posters
    if (category === 'poetry' && (productType === 't-shirt' || productType === 'poster')) {
      return true
    }

    // Feature all photography posters and wall art
    if (category === 'photography' && (productType === 'poster' || productType === 'wall-art')) {
      return true
    }

    // Feature philosophy mugs
    if (category === 'philosophy' && productType === 'mug') {
      return true
    }

    return false
  }

  /**
   * Generate SEO-optimized tags
   */
  private generateTags(
    theme: ContentTheme,
    category: string,
    productType: string
  ): string[] {
    const tags = [
      category,
      productType.replace('-', ' '),
      'brandon-mills',
      'luxury',
      theme.name.toLowerCase().replace(/\s+/g, '-'),
    ]

    // Add mood descriptors
    if (theme.mood) {
      const moods = theme.mood.toLowerCase().split(',').map((m: string) => m.trim())
      tags.push(...moods.slice(0, 2))
    }

    // Add target audience tags
    if (theme.targetAudience) {
      const audiences = theme.targetAudience.toLowerCase().split(',').map((a: string) => a.trim())
      tags.push(audiences[0])
    }

    // Category-specific tags
    if (category === 'poetry') {
      tags.push('streetwear', 'literary')
    } else if (category === 'photography') {
      tags.push('art', 'limited-edition')
    } else if (category === 'philosophy') {
      tags.push('wisdom', 'inspiration')
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Generate all products from rendered designs
   */
  async generateAllProducts(): Promise<ThemeFactoryProduct[]> {
    const products: ThemeFactoryProduct[] = []

    try {
      // Load manifest
      const manifestPath = path.join(process.cwd(), 'public/designs/rendered/manifest.json')
      const manifestContent = await fs.readFile(manifestPath, 'utf-8')
      const manifest: ManifestData = JSON.parse(manifestContent)

      // Load sync data
      const syncPath = path.join(process.cwd(), 'public/designs/printful-sync-demo.json')
      const syncContent = await fs.readFile(syncPath, 'utf-8')
      const syncData = JSON.parse(syncContent)
      const syncMap = new Map<string, SyncProduct>()

      // Create sync lookup map
      syncData.results.forEach((item: SyncProduct) => {
        const key = `${item.category}-${item.name}-${item.productType}`
        syncMap.set(key, item)
      })

      // Process each category
      for (const [category, themes] of Object.entries(manifest.categories)) {
        if (!themes) continue

        for (const [themeName, designs] of Object.entries(themes)) {
          for (const design of designs) {
            const syncKey = `${category}-${themeName}-${design.productType}`
            const syncProduct = syncMap.get(syncKey)

            try {
              const product = this.generateProduct(
                design,
                themeName,
                category as 'poetry' | 'photography' | 'philosophy',
                syncProduct
              )
              products.push(product)
            } catch (error) {
              logger.error('Error generating product for ${syncKey}:', error)
            }
          }
        }
      }

      // Sort products by featured status and category
      products.sort((a, b) => {
        if (a.featured !== b.featured) return b.featured ? 1 : -1
        if (a.category !== b.category) {
          const categoryOrder = { poetry: 0, photography: 1, philosophy: 2, books: 3 }
          return categoryOrder[a.category] - categoryOrder[b.category]
        }
        return 0
      })

    } catch (error) {
      logger.error('Error loading source files:', error)
      throw error
    }

    return products
  }

  /**
   * Save product catalog to JSON file
   */
  async saveProductCatalog(products: ThemeFactoryProduct[]): Promise<void> {
    // Calculate category counts
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const catalog = {
      products,
      categories,
      totalProducts: products.length,
      generatedAt: new Date().toISOString(),
    }

    const outputPath = path.join(process.cwd(), 'public/data/theme-factory-products.json')

    // Ensure directory exists
    const dir = path.dirname(outputPath)
    await fs.mkdir(dir, { recursive: true })

    // Write file
    await fs.writeFile(outputPath, JSON.stringify(catalog, null, 2))

    logger.info('Catalog saved to ${outputPath}')
    logger.info('Total products: ${products.length}')
    logger.info('Categories:', { data: categories })
  }
}