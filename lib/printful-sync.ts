/**
 * Printful Sync Service
 * Handles uploading designs and creating sync products in Printful catalog
 */

import fs from 'fs'
import path from 'path'
import { printfulClient } from './printful-client'

// Interfaces
export interface RenderedDesign {
  category: string
  name: string
  file: string
  path: string
  absolutePath: string
  sizeBytes: number
  sizeMB: string
  productType: string
  format: string
}

export interface PrintfulSyncResult {
  success: boolean
  designName: string
  category: string
  productType: string
  syncProductId?: number
  syncVariantIds?: number[]
  mockupUrls?: string[]
  fileId?: string
  error?: string
  timestamp: string
}

export interface ProductTypeMapping {
  printfulProductId: number
  printfulProductName: string
  variantIds: number[]
  placement: string
  retailPrice: string
  description: string
}

// Product type mappings with Printful catalog IDs
const PRODUCT_MAPPINGS: Record<string, ProductTypeMapping> = {
  't-shirt': {
    printfulProductId: 71,
    printfulProductName: 'Bella + Canvas 3001 - Unisex Staple T-Shirt',
    variantIds: [4012, 4013, 4014, 4015], // M, L, XL, 2XL in Black
    placement: 'front',
    retailPrice: '39.95',
    description: 'Premium unisex t-shirt with luxury design'
  },
  'poster': {
    printfulProductId: 1,
    printfulProductName: 'Poster',
    variantIds: [3483, 3484], // 12×18 and 18×24
    placement: 'default',
    retailPrice: '29.95',
    description: 'Museum-quality poster print'
  },
  'mug': {
    printfulProductId: 19,
    printfulProductName: 'White Glossy Mug',
    variantIds: [3472, 3473], // 11oz and 15oz
    placement: 'default',
    retailPrice: '24.95',
    description: 'Premium ceramic mug with luxury design'
  },
  'phone-case': {
    printfulProductId: 292,
    printfulProductName: 'Clear Case for iPhone®',
    variantIds: [12318, 12319, 12320], // iPhone 14, 14 Pro, 14 Pro Max
    placement: 'default',
    retailPrice: '34.95',
    description: 'Clear protective case with luxury design'
  },
  'tote-bag': {
    printfulProductId: 326,
    printfulProductName: 'Eco Tote Bag',
    variantIds: [12262], // 15×15
    placement: 'default',
    retailPrice: '44.95',
    description: 'Eco-friendly tote bag with luxury design'
  },
  'wall-art': {
    printfulProductId: 2,
    printfulProductName: 'Framed Poster',
    variantIds: [3490, 3491], // 12×18 and 18×24 with black frame
    placement: 'default',
    retailPrice: '89.95',
    description: 'Framed wall art with luxury design'
  }
}

export class PrintfulSyncService {
  private apiKey: string
  private storeId: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || ''
    this.storeId = process.env.PRINTFUL_STORE_ID || ''
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (!this.apiKey || !this.storeId) {
      console.warn('⚠️ Printful API credentials not configured')
    }
  }

  /**
   * Upload design file to Printful from local file path
   */
  async uploadDesignFile(filePath: string): Promise<string> {
    try {
      console.log(`📤 Uploading file: ${path.basename(filePath)}`)

      // For local development, use local server; for production use actual URL
      const isProduction = process.env.NODE_ENV === 'production'
      let fileUrl: string

      if (isProduction && this.baseUrl.includes('brandonmills.com')) {
        // Production: use actual site URL
        const relativePath = filePath.replace('/Volumes/Super Mastery/Webdesigner/public', '')
        fileUrl = `${this.baseUrl}${relativePath}`
      } else {
        // Development: use local HTTP server
        const relativePath = filePath.replace('/Volumes/Super Mastery/Webdesigner/public/', '')
        fileUrl = `http://localhost:8080/${relativePath}`
      }

      console.log(`   From URL: ${fileUrl}`)

      // Use the existing printfulClient method which handles auth correctly
      const uploadResult = await printfulClient.uploadFileFromUrl(fileUrl, path.basename(filePath))

      console.log(`✅ File uploaded successfully: ID ${uploadResult.id}`)
      return uploadResult.id
    } catch (error) {
      console.error(`❌ Failed to upload file ${filePath}:`, error)
      throw error
    }
  }

  /**
   * Create sync product with design
   */
  async createSyncProduct(
    design: RenderedDesign,
    fileId: string
  ): Promise<PrintfulSyncResult> {
    try {
      const mapping = PRODUCT_MAPPINGS[design.productType]
      if (!mapping) {
        throw new Error(`No mapping found for product type: ${design.productType}`)
      }

      // Format product name
      const productName = `${this.formatCategoryName(design.category)} - ${this.formatDesignName(design.name)}`

      // Create external ID for tracking
      const externalId = `${design.category}-${design.name}-${design.productType}-${Date.now()}`

      console.log(`📦 Creating sync product: ${productName}`)

      // Prepare sync variants for selected sizes/variants
      const syncVariants = mapping.variantIds.slice(0, 2).map((variantId, index) => ({
        external_id: `${externalId}-v${index}`,
        variant_id: variantId,
        retail_price: mapping.retailPrice,
        files: [
          {
            id: parseInt(fileId),
            type: mapping.placement
          }
        ]
      }))

      // Create sync product request
      const syncProductData = {
        sync_product: {
          external_id: externalId,
          name: productName,
          thumbnail: `${this.baseUrl}${design.path}`
        },
        sync_variants: syncVariants
      }

      // Create the sync product
      const syncProduct = await printfulClient.createSyncProduct(syncProductData)

      console.log(`✅ Sync product created: ID ${syncProduct.id}`)

      // Generate mockups (async, don't wait)
      let mockupUrls: string[] = []
      try {
        mockupUrls = await this.generateMockups(syncProduct.id, mapping.variantIds.slice(0, 2))
      } catch (mockupError) {
        console.warn(`⚠️ Mockup generation failed, continuing:`, mockupError)
      }

      return {
        success: true,
        designName: design.name,
        category: design.category,
        productType: design.productType,
        syncProductId: syncProduct.id,
        syncVariantIds: syncVariants.map(v => v.variant_id),
        mockupUrls,
        fileId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error(`❌ Failed to create sync product:`, error)
      return {
        success: false,
        designName: design.name,
        category: design.category,
        productType: design.productType,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Generate product mockups
   */
  async generateMockups(syncProductId: number, variantIds: number[]): Promise<string[]> {
    try {
      console.log(`🎨 Generating mockups for product ${syncProductId}...`)

      // Get sync product details to retrieve file URL
      const syncProduct = await printfulClient.getSyncProduct(syncProductId)

      if (!syncProduct.sync_variants || syncProduct.sync_variants.length === 0) {
        throw new Error('No sync variants found')
      }

      const fileUrl = syncProduct.sync_variants[0].files[0]?.url
      if (!fileUrl) {
        throw new Error('No file URL found in sync variant')
      }

      // Create mockup generation task
      const mockupTask = await printfulClient.generateMockup({
        variant_ids: variantIds,
        format: 'jpg',
        files: [
          {
            placement: 'default',
            image_url: fileUrl
          }
        ]
      })

      // Wait for mockup generation to complete
      const mockupResult = await printfulClient.getMockupResult(mockupTask.task_key)

      const mockupUrls = mockupResult.result.mockups?.map(m => m.mockup_url) || []
      console.log(`✅ Generated ${mockupUrls.length} mockups`)

      return mockupUrls
    } catch (error) {
      console.error(`❌ Failed to generate mockups:`, error)
      return []
    }
  }

  /**
   * Sync all rendered designs to Printful
   */
  async syncAllDesigns(): Promise<PrintfulSyncResult[]> {
    const results: PrintfulSyncResult[] = []

    try {
      // Read manifest
      const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

      // Process each category
      for (const [category, designs] of Object.entries(manifest.categories)) {
        for (const [designName, files] of Object.entries(designs as any)) {
          for (const file of files as RenderedDesign[]) {
            // Add category and name to the file object
            const design: RenderedDesign = {
              ...file,
              category,
              name: designName
            }

            console.log(`\n🚀 Processing: ${category} - ${designName} (${design.productType})`)

            try {
              // Add delay to respect rate limits (120 requests/min = 2/sec)
              await this.delay(500)

              // Upload file
              const fileId = await this.uploadDesignFile(design.absolutePath)

              // Create sync product
              const result = await this.createSyncProduct(design, fileId)
              results.push(result)

              if (result.success) {
                console.log(`✅ Successfully synced: ${result.syncProductId}`)
              } else {
                console.log(`❌ Failed to sync: ${result.error}`)
              }
            } catch (error) {
              console.error(`❌ Error processing ${designName}:`, error)
              results.push({
                success: false,
                designName,
                category,
                productType: design.productType,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
              })
            }
          }
        }
      }

      // Save results to file
      const outputPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync.json'
      fs.writeFileSync(outputPath, JSON.stringify({
        syncDate: new Date().toISOString(),
        totalDesigns: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }, null, 2))

      console.log(`\n💾 Sync results saved to: ${outputPath}`)

    } catch (error) {
      console.error('❌ Fatal error during sync:', error)
    }

    return results
  }

  /**
   * Sync a single design (for testing)
   */
  async syncSingleDesign(
    category: string,
    designName: string,
    productType: string
  ): Promise<PrintfulSyncResult> {
    try {
      // Read manifest
      const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

      // Find the specific design
      const categoryData = manifest.categories[category]
      if (!categoryData) {
        throw new Error(`Category ${category} not found`)
      }

      const designData = categoryData[designName]
      if (!designData) {
        throw new Error(`Design ${designName} not found in category ${category}`)
      }

      const file = designData.find((f: any) => f.productType === productType)
      if (!file) {
        throw new Error(`Product type ${productType} not found for design ${designName}`)
      }

      const design: RenderedDesign = {
        ...file,
        category,
        name: designName
      }

      console.log(`\n🚀 Syncing single design: ${category} - ${designName} (${productType})`)

      // Upload file
      const fileId = await this.uploadDesignFile(design.absolutePath)

      // Create sync product
      const result = await this.createSyncProduct(design, fileId)

      // Save result
      const outputPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync-test.json'
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))

      return result
    } catch (error) {
      console.error('❌ Failed to sync single design:', error)
      return {
        success: false,
        designName,
        category,
        productType,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Helper methods
  private formatCategoryName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  private formatDesignName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const printfulSync = new PrintfulSyncService()