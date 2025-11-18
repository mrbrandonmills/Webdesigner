/**
 * Tests for Theme Product Generator
 */

import { describe, it, expect, beforeAll } from '@jest/globals'
import { ThemeProductGenerator, ThemeFactoryProduct } from '../theme-product-generator'
import fs from 'fs/promises'
import path from 'path'

describe('ThemeProductGenerator', () => {
  let generator: ThemeProductGenerator
  let products: ThemeFactoryProduct[]

  beforeAll(async () => {
    generator = new ThemeProductGenerator()
    // Generate all products for testing
    products = await generator.generateAllProducts()
  })

  describe('Product Generation', () => {
    it('should generate the correct number of products', () => {
      expect(products.length).toBe(20)
    })

    it('should have products from all categories', () => {
      const categories = new Set(products.map(p => p.category))
      expect(categories).toContain('poetry')
      expect(categories).toContain('photography')
      expect(categories).toContain('philosophy')
    })

    it('should generate unique product IDs', () => {
      const ids = products.map(p => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have correct ID format', () => {
      products.forEach(product => {
        expect(product.id).toMatch(/^tf-[a-z-]+-[a-z-]+$/)
      })
    })
  })

  describe('Product Structure', () => {
    it('should have all required fields', () => {
      products.forEach(product => {
        expect(product.source).toBe('printful')
        expect(product.theme).toBeDefined()
        expect(product.category).toBeDefined()
        expect(product.title).toBeDefined()
        expect(product.description).toBeDefined()
        expect(product.price).toBeGreaterThan(0)
        expect(product.currency).toBe('USD')
        expect(product.image).toBeDefined()
        expect(product.images).toBeInstanceOf(Array)
        expect(product.productType).toBeDefined()
        expect(product.printfulProductId).toBeGreaterThan(0)
        expect(product.variants).toBeInstanceOf(Array)
        expect(product.variantCount).toBe(product.variants.length)
        expect(product.tags).toBeInstanceOf(Array)
        expect(typeof product.featured).toBe('boolean')
        expect(product.inStock).toBe(true)
        expect(product.metadata).toBeDefined()
      })
    })

    it('should have valid image paths', () => {
      products.forEach(product => {
        expect(product.image).toMatch(/^\/designs\/rendered\//)
        product.images.forEach(img => {
          expect(img).toMatch(/^\/(designs|mockups)\//)
        })
      })
    })
  })

  describe('Pricing Strategy', () => {
    it('should have correct pricing for each product type', () => {
      const priceMap: Record<string, number> = {
        't-shirt': 39.95,
        'poster': 29.95,
        'wall-art': 89.95,
        'mug': 24.95,
        'phone-case': 34.95,
        'tote-bag': 44.95,
      }

      products.forEach(product => {
        const expectedPrice = priceMap[product.productType]
        if (expectedPrice) {
          expect(product.price).toBe(expectedPrice)
        }
      })
    })

    it('should have variant pricing', () => {
      products.forEach(product => {
        product.variants.forEach(variant => {
          expect(variant.price).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Product Variants', () => {
    it('should have appropriate variants for t-shirts', () => {
      const tshirts = products.filter(p => p.productType === 't-shirt')
      tshirts.forEach(product => {
        expect(product.variants.length).toBe(4) // S, M, L, XL
        product.variants.forEach(variant => {
          expect(variant.size).toMatch(/^(S|M|L|XL)$/)
          expect(variant.color).toBe('Black')
        })
      })
    })

    it('should have appropriate variants for posters', () => {
      const posters = products.filter(p => p.productType === 'poster')
      posters.forEach(product => {
        expect(product.variants.length).toBe(2) // 16x20, 24x36
        product.variants.forEach(variant => {
          expect(variant.dimensions).toMatch(/^\d+x\d+$/)
        })
      })
    })

    it('should have appropriate variants for mugs', () => {
      const mugs = products.filter(p => p.productType === 'mug')
      mugs.forEach(product => {
        expect(product.variants.length).toBe(2) // 11oz, 15oz
        product.variants.forEach(variant => {
          expect(variant.size).toMatch(/^(11|15)oz$/)
        })
      })
    })
  })

  describe('Featured Products', () => {
    it('should mark appropriate products as featured', () => {
      const featuredProducts = products.filter(p => p.featured)
      expect(featuredProducts.length).toBeGreaterThan(0)

      // Poetry t-shirts and posters should be featured
      const poetryFeatured = products.filter(
        p => p.category === 'poetry' && (p.productType === 't-shirt' || p.productType === 'poster')
      )
      poetryFeatured.forEach(product => {
        expect(product.featured).toBe(true)
      })

      // Photography posters and wall art should be featured
      const photoFeatured = products.filter(
        p => p.category === 'photography' && (p.productType === 'poster' || p.productType === 'wall-art')
      )
      photoFeatured.forEach(product => {
        expect(product.featured).toBe(true)
      })

      // Philosophy mugs should be featured
      const philoFeatured = products.filter(
        p => p.category === 'philosophy' && p.productType === 'mug'
      )
      philoFeatured.forEach(product => {
        expect(product.featured).toBe(true)
      })
    })
  })

  describe('Product Metadata', () => {
    it('should have complete metadata', () => {
      products.forEach(product => {
        expect(product.metadata.themeEssence).toBeDefined()
        expect(product.metadata.contentSource).toBeDefined()
        expect(product.metadata.designStyle).toBeDefined()

        // Product-specific metadata
        if (product.productType === 't-shirt' || product.productType === 'hoodie') {
          expect(product.metadata.fabricQuality).toBeDefined()
          expect(product.metadata.printQuality).toBeDefined()
          expect(product.metadata.careInstructions).toBeDefined()
        }

        if (product.productType === 'poster' || product.productType === 'wall-art') {
          expect(product.metadata.dimensions).toBeDefined()
          expect(product.metadata.material).toBeDefined()
          expect(product.metadata.finish).toBeDefined()
        }

        if (product.productType === 'mug') {
          expect(product.metadata.dimensions).toBeDefined()
          expect(product.metadata.material).toBeDefined()
          expect(product.metadata.careInstructions).toBeDefined()
        }
      })
    })
  })

  describe('SEO and Tags', () => {
    it('should have SEO-optimized tags', () => {
      products.forEach(product => {
        expect(product.tags.length).toBeGreaterThan(3)
        expect(product.tags).toContain('brandon-mills')
        expect(product.tags).toContain('luxury')
        expect(product.tags).toContain(product.category)
      })
    })

    it('should have descriptive titles', () => {
      products.forEach(product => {
        expect(product.title.length).toBeGreaterThan(10)
        expect(product.title).toContain(' - ')
      })
    })

    it('should have compelling descriptions', () => {
      products.forEach(product => {
        expect(product.description.length).toBeGreaterThan(50)
        expect(product.description).toContain('Brandon Mills')
      })
    })
  })

  describe('Catalog Output', () => {
    it('should save catalog to correct location', async () => {
      await generator.saveProductCatalog(products)

      const catalogPath = path.join(process.cwd(), 'public/data/theme-factory-products.json')
      const catalogContent = await fs.readFile(catalogPath, 'utf-8')
      const catalog = JSON.parse(catalogContent)

      expect(catalog.products).toHaveLength(20)
      expect(catalog.totalProducts).toBe(20)
      expect(catalog.categories).toBeDefined()
      expect(catalog.generatedAt).toBeDefined()
    })

    it('should have correct category counts', async () => {
      const catalogPath = path.join(process.cwd(), 'public/data/theme-factory-products.json')
      const catalogContent = await fs.readFile(catalogPath, 'utf-8')
      const catalog = JSON.parse(catalogContent)

      expect(catalog.categories.poetry).toBe(5)
      expect(catalog.categories.photography).toBe(12)
      expect(catalog.categories.philosophy).toBe(3)
    })
  })

  describe('Sync Product Integration', () => {
    it('should have sync product IDs where available', () => {
      const syncedProducts = products.filter(p => p.syncProductId !== undefined)
      expect(syncedProducts.length).toBe(20) // All products should be synced

      syncedProducts.forEach(product => {
        expect(product.syncProductId).toBeGreaterThan(400000000)
      })
    })
  })
})

describe('ThemeProductGenerator Edge Cases', () => {
  let generator: ThemeProductGenerator

  beforeAll(() => {
    generator = new ThemeProductGenerator()
  })

  it('should handle missing theme data gracefully', () => {
    const design = {
      file: 'test.png',
      path: '/test/path',
      productType: 't-shirt'
    }

    expect(() => {
      generator.generateProduct(design, 'non-existent', 'poetry')
    }).toThrow('Theme not found')
  })

  it('should generate valid products without sync data', () => {
    const design = {
      file: 'mug.png',
      path: '/designs/rendered/poetry/fine-lines/mug.png',
      productType: 'mug'
    }

    const product = generator.generateProduct(design, 'fine-lines', 'poetry')

    expect(product).toBeDefined()
    expect(product.syncProductId).toBeUndefined()
    expect(product.images.length).toBeGreaterThan(1) // Should have placeholder mockups
  })
})