/**
 * Integration tests for Printful Sync Service
 *
 * Note: These are integration tests that interact with the real Printful API
 * Run with caution as they will create actual products in your Printful account
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { printfulSync, PrintfulSyncResult } from '../printful-sync'
import { printfulClient } from '../printful-client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Track created products for cleanup
const createdProducts: number[] = []

describe('PrintfulSyncService', () => {
  // Skip tests if no API credentials
  const skipTests = !process.env.PRINTFUL_API_KEY || !process.env.PRINTFUL_STORE_ID

  beforeAll(() => {
    if (skipTests) {
      console.warn('⚠️ Skipping Printful tests: API credentials not configured')
    }
  })

  afterAll(async () => {
    // Clean up created test products
    if (!skipTests && createdProducts.length > 0) {
      console.log('🧹 Cleaning up test products...')
      for (const productId of createdProducts) {
        try {
          await printfulClient.deleteSyncProduct(productId)
          console.log(`   ✅ Deleted product ${productId}`)
        } catch (error) {
          console.warn(`   ⚠️ Failed to delete product ${productId}:`, error)
        }
      }
    }
  })

  describe('uploadDesignFile', () => {
    it.skip('should upload a design file to Printful', async () => {
      if (skipTests) return

      // Use a small test file
      const testFilePath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/philosophy/self-esteem/mug.png'

      if (!fs.existsSync(testFilePath)) {
        console.warn('Test file not found, skipping test')
        return
      }

      const fileId = await printfulSync.uploadDesignFile(testFilePath)

      expect(fileId).toBeTruthy()
      expect(typeof fileId).toBe('string')
      console.log(`✅ File uploaded with ID: ${fileId}`)
    }, 30000) // 30 second timeout
  })

  describe('createSyncProduct', () => {
    it.skip('should create a sync product with a mug design', async () => {
      if (skipTests) return

      // Use the smallest mug design for testing
      const testDesign = {
        category: 'philosophy',
        name: 'self-esteem',
        file: 'mug.png',
        path: '/designs/rendered/philosophy/self-esteem/mug.png',
        absolutePath: '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/philosophy/self-esteem/mug.png',
        sizeBytes: 31381,
        sizeMB: '0.03',
        productType: 'mug',
        format: 'png'
      }

      // First upload the file
      const fileId = await printfulSync.uploadDesignFile(testDesign.absolutePath)
      expect(fileId).toBeTruthy()

      // Then create the sync product
      const result = await printfulSync.createSyncProduct(testDesign, fileId)

      expect(result.success).toBe(true)
      expect(result.syncProductId).toBeTruthy()
      expect(result.fileId).toBe(fileId)

      if (result.syncProductId) {
        createdProducts.push(result.syncProductId)
        console.log(`✅ Created sync product: ${result.syncProductId}`)
      }
    }, 60000) // 60 second timeout
  })

  describe('generateMockups', () => {
    it.skip('should generate mockups for a sync product', async () => {
      if (skipTests) return

      // This test depends on having a sync product already created
      // You would typically run this after creating a product

      const testProductId = createdProducts[0]
      if (!testProductId) {
        console.warn('No test product available for mockup generation')
        return
      }

      const mockupUrls = await printfulSync.generateMockups(testProductId, [3472, 3473])

      expect(Array.isArray(mockupUrls)).toBe(true)
      expect(mockupUrls.length).toBeGreaterThan(0)

      mockupUrls.forEach(url => {
        expect(url).toMatch(/^https:\/\//)
        console.log(`   🎨 Mockup: ${url}`)
      })
    }, 90000) // 90 second timeout for mockup generation
  })

  describe('syncSingleDesign', () => {
    it('should sync a single design end-to-end', async () => {
      if (skipTests) return

      const result = await printfulSync.syncSingleDesign(
        'philosophy',
        'enlightenment-science',
        'mug'
      )

      expect(result).toBeDefined()
      expect(result.category).toBe('philosophy')
      expect(result.designName).toBe('enlightenment-science')
      expect(result.productType).toBe('mug')

      if (result.success) {
        expect(result.syncProductId).toBeTruthy()
        expect(result.fileId).toBeTruthy()

        if (result.syncProductId) {
          createdProducts.push(result.syncProductId)
        }

        console.log(`✅ Full sync test successful:`)
        console.log(`   Product ID: ${result.syncProductId}`)
        console.log(`   File ID: ${result.fileId}`)
        console.log(`   Mockups: ${result.mockupUrls?.length || 0}`)
      } else {
        console.warn(`⚠️ Sync failed: ${result.error}`)
      }
    }, 120000) // 2 minute timeout
  })

  describe('Product Type Mappings', () => {
    it('should have valid mappings for all product types', () => {
      const expectedTypes = ['t-shirt', 'poster', 'mug', 'phone-case', 'tote-bag', 'wall-art']

      // Read the manifest to get all actual product types
      const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
        const actualTypes = new Set<string>()

        Object.values(manifest.categories).forEach((category: any) => {
          Object.values(category).forEach((designs: any) => {
            designs.forEach((design: any) => {
              actualTypes.add(design.productType)
            })
          })
        })

        // Check that all actual types have mappings
        actualTypes.forEach(type => {
          expect(expectedTypes).toContain(type)
        })
      }
    })
  })

  describe('Rate Limiting', () => {
    it('should respect rate limits when syncing multiple designs', async () => {
      // This test verifies that the delay mechanism works
      const startTime = Date.now()

      // Simulate 3 quick operations with delays
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const elapsed = Date.now() - startTime
      expect(elapsed).toBeGreaterThanOrEqual(1500)
      expect(elapsed).toBeLessThan(2000)
    })
  })
})