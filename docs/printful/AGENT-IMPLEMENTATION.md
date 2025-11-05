# Printful Buying Agent - Technical Implementation Guide
## Code Examples & Architecture Details

**Companion to:** BUYING-AGENT-STRATEGY.md
**Date:** November 5, 2025
**Purpose:** Detailed code implementation for buying agent system

---

## Table of Contents

1. [Core Agent Services](#core-agent-services)
2. [Database Schema Implementation](#database-schema-implementation)
3. [API Routes](#api-routes)
4. [Admin Dashboard Components](#admin-dashboard-components)
5. [Automation & Cron Jobs](#automation--cron-jobs)
6. [Testing Strategy](#testing-strategy)

---

## Core Agent Services

### 1. Catalog Analyzer Service

**File:** `lib/agent/catalog-analyzer.ts`

```typescript
import { printfulClient } from '@/lib/printful-client'
import { db } from '@/lib/db'
import { catalogAnalysis, agentProducts } from '@/lib/db/schema/buying-agent'
import { eq } from 'drizzle-orm'

interface ProductAnalysis {
  printfulProductId: number
  agentScore: number
  qualityTier: 'premium' | 'standard' | 'economy'
  profitMargin: number
  trending: boolean
  seasonal: boolean
  recommendedForStore: boolean
}

interface AnalysisReport {
  totalProducts: number
  recommended: number
  highMargin: number
  premiumTier: number
  trending: number
  seasonal: number
  topRecommendations: ProductAnalysis[]
  timestamp: Date
}

export class CatalogAnalyzer {
  // Luxury brands we prioritize
  private readonly LUXURY_BRANDS = [
    'Bella+Canvas',
    'Next Level',
    'American Apparel',
    'Gildan Softstyle',
  ]

  // Categories we focus on
  private readonly TARGET_CATEGORIES = {
    'fine-art': [24, 29], // Posters, Canvas
    'apparel': [10, 19],  // T-shirts, Hoodies
    'home': [26],         // Home & Living
    'accessories': [261], // Bags, etc
  }

  /**
   * Main analysis function - analyzes entire Printful catalog
   */
  async analyzePrintfulCatalog(): Promise<AnalysisReport> {
    console.log('🔍 Starting Printful catalog analysis...')

    const allAnalyses: ProductAnalysis[] = []

    // Analyze each category
    for (const [categoryName, categoryIds] of Object.entries(this.TARGET_CATEGORIES)) {
      for (const categoryId of categoryIds) {
        console.log(`  Analyzing category: ${categoryName} (ID: ${categoryId})`)

        try {
          const products = await printfulClient.getCatalogProducts({
            category_id: categoryId,
            limit: 100,
          })

          console.log(`  Found ${products.length} products in category ${categoryId}`)

          // Analyze each product
          for (const product of products) {
            const analysis = await this.analyzeProduct(product, categoryName)
            allAnalyses.push(analysis)

            // Save to database
            await this.saveAnalysis(analysis)
          }
        } catch (error) {
          console.error(`  Failed to analyze category ${categoryId}:`, error)
        }
      }
    }

    // Generate report
    const report = this.generateReport(allAnalyses)
    console.log('✅ Catalog analysis complete')
    console.log(`  Total products analyzed: ${report.totalProducts}`)
    console.log(`  Recommended for store: ${report.recommended}`)
    console.log(`  High margin products: ${report.highMargin}`)
    console.log(`  Premium tier: ${report.premiumTier}`)

    return report
  }

  /**
   * Analyze a single product
   */
  private async analyzeProduct(
    product: any,
    categoryName: string
  ): Promise<ProductAnalysis> {
    // Get variants to analyze pricing
    const variants = await printfulClient.getCatalogVariants(product.id)

    // Calculate scores for all variants
    const variantScores = await Promise.all(
      variants.slice(0, 10).map(variant => this.scoreVariant(product, variant, categoryName))
    )

    // Use best variant score
    const bestScore = Math.max(...variantScores.map(s => s.score))
    const bestVariant = variantScores.find(s => s.score === bestScore)

    return {
      printfulProductId: product.id,
      agentScore: bestScore,
      qualityTier: this.determineQualityTier(product),
      profitMargin: bestVariant?.profitMargin || 0,
      trending: await this.checkTrending(product),
      seasonal: this.isSeasonal(product),
      recommendedForStore: bestScore >= 60, // 60+ score = recommended
    }
  }

  /**
   * Score a product variant (0-100 points)
   */
  private async scoreVariant(
    product: any,
    variant: any,
    categoryName: string
  ): Promise<{ score: number; profitMargin: number }> {
    let score = 0

    // 1. Quality Tier (40 points max)
    const qualityScore = this.scoreQualityTier(product.brand)
    score += qualityScore

    // 2. Profit Margin (30 points max)
    const pricing = await this.getVariantPricing(variant.id, categoryName)
    const marginScore = this.scoreProfitMargin(pricing.profitMargin)
    score += marginScore

    // 3. Brand Alignment (20 points max)
    const brandScore = this.scoreBrandAlignment(product)
    score += brandScore

    // 4. Market Trends (10 points max)
    const trendScore = await this.scoreTrending(product) ? 10 : 0
    score += trendScore

    return {
      score,
      profitMargin: pricing.profitMargin,
    }
  }

  /**
   * Score quality tier based on brand
   */
  private scoreQualityTier(brand: string): number {
    if (this.LUXURY_BRANDS.includes(brand)) {
      return 40 // Premium tier
    } else if (brand.toLowerCase().includes('premium')) {
      return 25 // Mid-tier
    } else {
      return 10 // Standard tier
    }
  }

  /**
   * Get variant pricing and calculate luxury price
   */
  private async getVariantPricing(
    variantId: number,
    categoryName: string
  ): Promise<{
    cost: number
    luxuryPrice: number
    profitMargin: number
  }> {
    try {
      const priceData = await printfulClient.getVariantPrice(variantId)
      const cost = parseFloat(priceData.price)

      // Calculate luxury price based on category
      const multipliers = {
        'fine-art': 7.0,
        'apparel': 4.5,
        'home': 4.0,
        'accessories': 3.5,
      }

      const multiplier = multipliers[categoryName] || 3.0
      const luxuryPrice = this.roundToLuxuryPrice(cost * multiplier)

      const profitMargin = ((luxuryPrice - cost) / luxuryPrice) * 100

      return { cost, luxuryPrice, profitMargin }
    } catch (error) {
      console.error(`Failed to get pricing for variant ${variantId}:`, error)
      return { cost: 0, luxuryPrice: 0, profitMargin: 0 }
    }
  }

  /**
   * Score profit margin
   */
  private scoreProfitMargin(margin: number): number {
    if (margin >= 80) return 30      // Excellent
    if (margin >= 70) return 25      // Great
    if (margin >= 60) return 20      // Good
    if (margin >= 50) return 10      // Acceptable
    return 0                          // Too low
  }

  /**
   * Score brand alignment with luxury positioning
   */
  private scoreBrandAlignment(product: any): number {
    let score = 0

    // Luxury brand
    if (this.LUXURY_BRANDS.includes(product.brand)) {
      score += 15
    }

    // Premium keywords in title
    const premiumKeywords = ['premium', 'luxury', 'quality', 'soft', 'organic']
    const titleLower = (product.title || '').toLowerCase()
    if (premiumKeywords.some(keyword => titleLower.includes(keyword))) {
      score += 5
    }

    return score
  }

  /**
   * Check if product is trending
   */
  private async checkTrending(product: any): Promise<boolean> {
    // TODO: Implement actual trend analysis
    // Could check:
    // - Recent sales data
    // - Search volume
    // - Social media mentions
    // - Industry reports

    // For now, use simple heuristics
    const trendingKeywords = ['oversized', 'vintage', 'minimalist', 'organic', 'sustainable']
    const titleLower = (product.title || '').toLowerCase()

    return trendingKeywords.some(keyword => titleLower.includes(keyword))
  }

  /**
   * Score trending status
   */
  private async scoreTrending(product: any): Promise<boolean> {
    return this.checkTrending(product)
  }

  /**
   * Check if product is seasonal
   */
  private isSeasonal(product: any): boolean {
    const seasonalKeywords = [
      'winter', 'summer', 'spring', 'fall',
      'hoodie', 'tank', 'long sleeve', 'beanie',
    ]

    const titleLower = (product.title || '').toLowerCase()
    return seasonalKeywords.some(keyword => titleLower.includes(keyword))
  }

  /**
   * Determine quality tier
   */
  private determineQualityTier(product: any): 'premium' | 'standard' | 'economy' {
    if (this.LUXURY_BRANDS.includes(product.brand)) {
      return 'premium'
    }

    const titleLower = (product.title || '').toLowerCase()
    if (titleLower.includes('premium') || titleLower.includes('luxury')) {
      return 'premium'
    }

    if (titleLower.includes('economy') || titleLower.includes('basic')) {
      return 'economy'
    }

    return 'standard'
  }

  /**
   * Round price to luxury pricing points
   */
  private roundToLuxuryPrice(price: number): number {
    if (price < 50) {
      // Round to $X9 (e.g., $29, $39, $49)
      return Math.round(price / 10) * 10 - 1
    } else if (price < 100) {
      // Round to $X9 (e.g., $59, $79, $89)
      return Math.round(price / 10) * 10 - 1
    } else {
      // Round to $X99 (e.g., $99, $149, $199, $299)
      const rounded = Math.round(price / 50) * 50
      return rounded - 1
    }
  }

  /**
   * Save analysis to database
   */
  private async saveAnalysis(analysis: ProductAnalysis): Promise<void> {
    try {
      await db.insert(catalogAnalysis).values({
        printfulProductId: analysis.printfulProductId,
        agentScore: analysis.agentScore,
        qualityTier: analysis.qualityTier,
        profitMargin: analysis.profitMargin.toString(),
        trending: analysis.trending,
        seasonal: analysis.seasonal,
        recommendedForStore: analysis.recommendedForStore,
        analyzedAt: new Date(),
      })
    } catch (error) {
      console.error('Failed to save analysis:', error)
    }
  }

  /**
   * Generate analysis report
   */
  private generateReport(analyses: ProductAnalysis[]): AnalysisReport {
    const recommended = analyses.filter(a => a.recommendedForStore)
    const highMargin = analyses.filter(a => a.profitMargin >= 70)
    const premiumTier = analyses.filter(a => a.qualityTier === 'premium')
    const trending = analyses.filter(a => a.trending)
    const seasonal = analyses.filter(a => a.seasonal)

    // Get top recommendations
    const topRecommendations = analyses
      .filter(a => a.recommendedForStore)
      .sort((a, b) => b.agentScore - a.agentScore)
      .slice(0, 20)

    return {
      totalProducts: analyses.length,
      recommended: recommended.length,
      highMargin: highMargin.length,
      premiumTier: premiumTier.length,
      trending: trending.length,
      seasonal: seasonal.length,
      topRecommendations,
      timestamp: new Date(),
    }
  }
}

// Export singleton instance
export const catalogAnalyzer = new CatalogAnalyzer()
```

### 2. Product Addition Service

**File:** `lib/agent/product-adder.ts`

```typescript
import { printfulClient } from '@/lib/printful-client'
import { db } from '@/lib/db'
import { agentProducts } from '@/lib/db/schema/buying-agent'
import { designGenerator } from './design-generator'
import { mockupGenerator } from './mockup-generator'

interface AddProductRequest {
  printfulProductId: number
  variantIds?: number[] // Optional: specific variants to add
  designSource?: 'portfolio' | 'ai' | 'hybrid'
  autoApprove?: boolean
}

interface AddedProduct {
  id: string
  title: string
  category: string
  price: number
  profitMargin: number
  designUrl: string
  mockupUrls: string[]
}

export class ProductAdder {
  /**
   * Add product(s) to store
   */
  async addProducts(requests: AddProductRequest[]): Promise<AddedProduct[]> {
    console.log(`🛍️ Adding ${requests.length} products to store...`)

    const results: AddedProduct[] = []

    for (const request of requests) {
      try {
        const product = await this.addSingleProduct(request)
        results.push(product)
      } catch (error) {
        console.error(`Failed to add product ${request.printfulProductId}:`, error)
      }
    }

    console.log(`✅ Added ${results.length} products successfully`)
    return results
  }

  /**
   * Add a single product
   */
  private async addSingleProduct(request: AddProductRequest): Promise<AddedProduct> {
    // 1. Fetch product details from Printful
    const product = await printfulClient.getCatalogProduct(request.printfulProductId)
    const variants = await printfulClient.getCatalogVariants(request.printfulProductId)

    console.log(`  Adding: ${product.title}`)

    // 2. Select variants to add
    const selectedVariants = request.variantIds
      ? variants.filter(v => request.variantIds!.includes(v.id))
      : this.selectBestVariants(variants)

    console.log(`  Selected ${selectedVariants.length} variants`)

    // 3. Generate or select design
    const design = await designGenerator.generateDesign({
      product,
      source: request.designSource || 'ai',
    })

    console.log(`  Design created: ${design.url}`)

    // 4. Generate mockups
    const mockups = await mockupGenerator.generateMockups({
      variantIds: selectedVariants.map(v => v.id),
      designUrl: design.url,
      product,
    })

    console.log(`  Generated ${mockups.length} mockups`)

    // 5. Calculate pricing
    const pricing = await this.calculatePricing(selectedVariants[0].id, product)

    // 6. Generate product title and description
    const title = this.generateTitle(product)
    const description = this.generateDescription(product)

    // 7. Determine category
    const category = this.categorizeProduct(product)

    // 8. Save to database
    const dbProduct = await db.insert(agentProducts).values({
      printfulProductId: product.id,
      printfulVariantId: selectedVariants[0].id,
      title,
      description,
      category,
      qualityTier: this.determineQualityTier(product),
      printfulCost: pricing.cost.toString(),
      luxuryPrice: pricing.luxuryPrice.toString(),
      profitMargin: pricing.profitMargin.toString(),
      status: request.autoApprove ? 'active' : 'pending',
      designUrl: design.url,
      mockupUrls: JSON.stringify(mockups.map(m => m.url)),
      tags: JSON.stringify(this.generateTags(product)),
      launchDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return {
      id: dbProduct[0].id,
      title,
      category,
      price: pricing.luxuryPrice,
      profitMargin: pricing.profitMargin,
      designUrl: design.url,
      mockupUrls: mockups.map(m => m.url),
    }
  }

  /**
   * Select best variants (colors/sizes) for luxury positioning
   */
  private selectBestVariants(variants: any[]): any[] {
    // Luxury colors: black, white, beige, gray, navy
    const luxuryColors = [
      'black',
      'white',
      'natural',
      'heather',
      'gray',
      'navy',
      'charcoal',
      'cream',
      'sand',
    ]

    // Filter to luxury colors
    const luxuryVariants = variants.filter(v => {
      const colorLower = (v.color || '').toLowerCase()
      return luxuryColors.some(luxColor => colorLower.includes(luxColor))
    })

    // If no luxury colors, fall back to first variant
    return luxuryVariants.length > 0 ? luxuryVariants : [variants[0]]
  }

  /**
   * Calculate luxury pricing
   */
  private async calculatePricing(
    variantId: number,
    product: any
  ): Promise<{
    cost: number
    luxuryPrice: number
    profitMargin: number
  }> {
    const priceData = await printfulClient.getVariantPrice(variantId)
    const cost = parseFloat(priceData.price)

    // Determine category multiplier
    const category = this.categorizeProduct(product)
    const multipliers = {
      'fine-art': 7.0,
      'apparel': 4.5,
      'home': 4.0,
      'accessories': 3.5,
    }

    const multiplier = multipliers[category] || 3.0
    const luxuryPrice = this.roundToLuxuryPrice(cost * multiplier)

    const profitMargin = ((luxuryPrice - cost) / luxuryPrice) * 100

    return { cost, luxuryPrice, profitMargin }
  }

  /**
   * Generate product title
   */
  private generateTitle(product: any): string {
    // Use Printful product name as base
    const baseName = product.title

    // Add luxury descriptor
    const descriptors = [
      'Premium',
      'Luxury',
      'Museum-Quality',
      'Gallery',
      'Signature',
    ]

    const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)]

    return `${descriptor} ${baseName}`
  }

  /**
   * Generate product description
   */
  private generateDescription(product: any): string {
    const category = this.categorizeProduct(product)

    const templates = {
      'fine-art': `Museum-quality ${product.title.toLowerCase()} featuring exclusive Brandon Mills artwork. Each print is carefully crafted on premium materials with exceptional attention to detail. Perfect for collectors and art enthusiasts seeking sophisticated wall art. Part of the limited Brandon Mills Collection.`,

      'apparel': `Premium ${product.title.toLowerCase()} from the Brandon Mills signature collection. Crafted from the finest materials with exclusive artistic designs that embody philosophy, consciousness, and embodiment. Luxury comfort meets artistic expression. Limited production run ensures exclusivity.`,

      'home': `Transform your space with this luxury ${product.title.toLowerCase()}. Featuring exclusive Brandon Mills artwork, this piece brings artistic sophistication to your home. Premium materials and exceptional craftsmanship make this a statement piece worthy of any collector.`,

      'accessories': `Carry art with you. This premium ${product.title.toLowerCase()} features exclusive Brandon Mills designs that merge philosophy and aesthetics. Crafted from high-quality materials, it's both functional and artistic. A subtle statement of refined taste.`,
    }

    return templates[category] || product.description || 'Luxury product from Brandon Mills Collection'
  }

  /**
   * Categorize product
   */
  private categorizeProduct(product: any): string {
    const type = (product.type_name || product.type || '').toLowerCase()

    if (type.includes('poster') || type.includes('canvas') || type.includes('print')) {
      return 'fine-art'
    }
    if (type.includes('shirt') || type.includes('hoodie') || type.includes('apparel')) {
      return 'apparel'
    }
    if (type.includes('pillow') || type.includes('blanket') || type.includes('home')) {
      return 'home'
    }
    return 'accessories'
  }

  /**
   * Determine quality tier
   */
  private determineQualityTier(product: any): 'premium' | 'standard' | 'economy' {
    const luxuryBrands = ['Bella+Canvas', 'Next Level', 'American Apparel']

    if (luxuryBrands.includes(product.brand)) {
      return 'premium'
    }

    const titleLower = (product.title || '').toLowerCase()
    if (titleLower.includes('premium') || titleLower.includes('luxury')) {
      return 'premium'
    }

    return 'standard'
  }

  /**
   * Generate product tags
   */
  private generateTags(product: any): string[] {
    const tags = ['luxury', 'brandon-mills', 'limited-edition']

    const category = this.categorizeProduct(product)
    tags.push(category)

    if (product.brand) {
      tags.push(product.brand.toLowerCase().replace(/\+/g, '-'))
    }

    return tags
  }

  /**
   * Round to luxury pricing
   */
  private roundToLuxuryPrice(price: number): number {
    if (price < 50) {
      return Math.round(price / 10) * 10 - 1
    } else if (price < 100) {
      return Math.round(price / 10) * 10 - 1
    } else {
      const rounded = Math.round(price / 50) * 50
      return rounded - 1
    }
  }
}

// Export singleton
export const productAdder = new ProductAdder()
```

### 3. Agent Controller

**File:** `lib/agent/controller.ts`

```typescript
import { catalogAnalyzer } from './catalog-analyzer'
import { productAdder } from './product-adder'
import { inventoryManager } from './inventory-manager'
import { collectionPlanner } from './collection-planner'
import { db } from '@/lib/db'
import { catalogAnalysis } from '@/lib/db/schema/buying-agent'
import { desc, eq } from 'drizzle-orm'

export class BuyingAgentController {
  /**
   * Run daily automated tasks
   */
  async runDailyTasks(): Promise<void> {
    console.log('🤖 Buying Agent - Running Daily Tasks')
    console.log(`   Timestamp: ${new Date().toISOString()}`)

    try {
      // 1. Quick catalog check (new products only)
      await this.checkForNewProducts()

      // 2. Manage inventory lifecycle
      await inventoryManager.runDailyLifecycleCheck()

      // 3. Update pricing based on performance
      await this.updateDynamicPricing()

      console.log('✅ Daily tasks complete')
    } catch (error) {
      console.error('❌ Daily tasks failed:', error)
      throw error
    }
  }

  /**
   * Run weekly automated tasks
   */
  async runWeeklyTasks(): Promise<void> {
    console.log('🤖 Buying Agent - Running Weekly Tasks')
    console.log(`   Timestamp: ${new Date().toISOString()}`)

    try {
      // 1. Full catalog re-analysis
      const report = await catalogAnalyzer.analyzePrintfulCatalog()

      console.log('📊 Analysis Report:')
      console.log(`   Total products: ${report.totalProducts}`)
      console.log(`   Recommended: ${report.recommended}`)
      console.log(`   High margin: ${report.highMargin}`)
      console.log(`   Premium tier: ${report.premiumTier}`)

      // 2. Add top recommendations (if configured)
      if (process.env.AGENT_AUTO_ADD === 'true') {
        await this.addTopRecommendations(5)
      }

      // 3. Deprecate slow movers
      await inventoryManager.deprecateSlowMovers()

      // 4. Generate performance report
      await this.generateWeeklyReport()

      console.log('✅ Weekly tasks complete')
    } catch (error) {
      console.error('❌ Weekly tasks failed:', error)
      throw error
    }
  }

  /**
   * Run monthly automated tasks
   */
  async runMonthlyTasks(): Promise<void> {
    console.log('🤖 Buying Agent - Running Monthly Tasks')
    console.log(`   Timestamp: ${new Date().toISOString()}`)

    try {
      // 1. Plan next seasonal collection
      await collectionPlanner.planNextSeason()

      // 2. Generate monthly performance report
      await this.generateMonthlyReport()

      // 3. Full inventory optimization
      await inventoryManager.optimizeInventory()

      console.log('✅ Monthly tasks complete')
    } catch (error) {
      console.error('❌ Monthly tasks failed:', error)
      throw error
    }
  }

  /**
   * Check for new products in Printful catalog
   */
  private async checkForNewProducts(): Promise<void> {
    // TODO: Implement incremental catalog check
    console.log('   Checking for new products...')
  }

  /**
   * Add top recommended products
   */
  private async addTopRecommendations(count: number): Promise<void> {
    console.log(`   Adding top ${count} recommendations...`)

    // Get top recommendations from latest analysis
    const recommendations = await db
      .select()
      .from(catalogAnalysis)
      .where(eq(catalogAnalysis.recommendedForStore, true))
      .orderBy(desc(catalogAnalysis.agentScore))
      .limit(count)

    if (recommendations.length === 0) {
      console.log('   No recommendations found')
      return
    }

    // Add products
    await productAdder.addProducts(
      recommendations.map(r => ({
        printfulProductId: r.printfulProductId,
        autoApprove: false, // Require manual approval
      }))
    )

    console.log(`   Added ${recommendations.length} products for review`)
  }

  /**
   * Update dynamic pricing based on performance
   */
  private async updateDynamicPricing(): Promise<void> {
    console.log('   Updating dynamic pricing...')
    // TODO: Implement pricing optimization
  }

  /**
   * Generate weekly performance report
   */
  private async generateWeeklyReport(): Promise<void> {
    console.log('   Generating weekly report...')
    // TODO: Implement reporting
  }

  /**
   * Generate monthly performance report
   */
  private async generateMonthlyReport(): Promise<void> {
    console.log('   Generating monthly report...')
    // TODO: Implement reporting
  }
}

// Export singleton
export const buyingAgentController = new BuyingAgentController()
```

---

## Database Schema Implementation

**File:** `lib/db/schema/buying-agent.ts`

```typescript
import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  json,
} from 'drizzle-orm/pg-core'

/**
 * Agent-managed products
 * Replaces curated-products.json
 */
export const agentProducts = pgTable('agent_products', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Printful references
  printfulProductId: integer('printful_product_id').notNull(),
  printfulVariantId: integer('printful_variant_id').notNull(),

  // Product details
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // fine-art, apparel, home, accessories

  // Quality and pricing
  qualityTier: text('quality_tier').notNull(), // premium, standard, economy
  printfulCost: decimal('printful_cost', { precision: 10, scale: 2 }),
  luxuryPrice: decimal('luxury_price', { precision: 10, scale: 2 }),
  profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }),

  // Lifecycle management
  status: text('status').default('active'), // pending, active, bestseller, slow, deprecated

  // Performance metrics
  salesCount: integer('sales_count').default(0),
  viewCount: integer('view_count').default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 4 }),

  // Assets
  designUrl: text('design_url'),
  mockupUrls: json('mockup_urls').$type<string[]>(),

  // Metadata
  tags: json('tags').$type<string[]>(),
  launchDate: timestamp('launch_date').defaultNow(),
  lastSale: timestamp('last_sale'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

/**
 * Catalog analysis results
 * Stores agent scoring of Printful products
 */
export const catalogAnalysis = pgTable('catalog_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),

  printfulProductId: integer('printful_product_id').notNull(),

  // Agent scoring
  agentScore: integer('agent_score'), // 0-100
  qualityTier: text('quality_tier'),  // premium, standard, economy
  profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }),

  // Flags
  trending: boolean('trending').default(false),
  seasonal: boolean('seasonal').default(false),
  recommendedForStore: boolean('recommended_for_store').default(false),

  // Timestamp
  analyzedAt: timestamp('analyzed_at').defaultNow(),
})

/**
 * Seasonal collections
 */
export const seasonalCollections = pgTable('seasonal_collections', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),
  season: text('season').notNull(), // winter, spring, summer, fall
  year: integer('year').notNull(),

  // Dates
  launchDate: timestamp('launch_date'),
  endDate: timestamp('end_date'),

  // Collection details
  theme: text('theme'),
  status: text('status').default('planned'), // planned, active, ended

  // Products in collection
  products: json('products').$type<string[]>(), // Array of product IDs

  // Performance
  salesTotal: decimal('sales_total', { precision: 10, scale: 2 }).default('0'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
})

/**
 * Agent performance metrics
 */
export const agentMetrics = pgTable('agent_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),

  metricType: text('metric_type').notNull(), // revenue, profit, conversion, etc
  metricValue: decimal('metric_value', { precision: 10, scale: 2 }),

  // Time period
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow(),
})

/**
 * Agent decisions log
 * Audit trail of all agent decisions
 */
export const agentDecisions = pgTable('agent_decisions', {
  id: uuid('id').defaultRandom().primaryKey(),

  decisionType: text('decision_type').notNull(), // add_product, deprecate, price_change, etc
  productId: uuid('product_id'),
  printfulProductId: integer('printful_product_id'),

  // Decision details
  recommendation: text('recommendation'),
  reasoning: json('reasoning').$type<Record<string, any>>(),

  // Status
  status: text('status').default('pending'), // pending, approved, rejected, auto_approved

  // Admin override
  approvedBy: text('approved_by'),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## API Routes

### Agent Status API

**File:** `app/api/agent/status/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { agentProducts, catalogAnalysis, seasonalCollections } from '@/lib/db/schema/buying-agent'
import { count, sql, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get product counts by status
    const productStats = await db
      .select({
        status: agentProducts.status,
        count: count(),
      })
      .from(agentProducts)
      .groupBy(agentProducts.status)

    // Get total sales and revenue
    const salesStats = await db
      .select({
        totalSales: sql<number>`SUM(${agentProducts.salesCount})`,
        totalRevenue: sql<number>`SUM(${agentProducts.salesCount} * ${agentProducts.luxuryPrice})`,
        avgProfitMargin: sql<number>`AVG(${agentProducts.profitMargin})`,
      })
      .from(agentProducts)
      .where(eq(agentProducts.status, 'active'))

    // Get latest catalog analysis
    const latestAnalysis = await db
      .select({
        analyzedAt: catalogAnalysis.analyzedAt,
        totalAnalyzed: count(),
        recommended: sql<number>`SUM(CASE WHEN ${catalogAnalysis.recommendedForStore} THEN 1 ELSE 0 END)`,
      })
      .from(catalogAnalysis)
      .groupBy(catalogAnalysis.analyzedAt)
      .orderBy(sql`${catalogAnalysis.analyzedAt} DESC`)
      .limit(1)

    // Get active collections
    const activeCollections = await db
      .select()
      .from(seasonalCollections)
      .where(eq(seasonalCollections.status, 'active'))

    return NextResponse.json({
      success: true,
      status: {
        healthy: true,
        lastRun: latestAnalysis[0]?.analyzedAt || null,
      },
      products: {
        total: productStats.reduce((sum, stat) => sum + stat.count, 0),
        byStatus: productStats.reduce((acc, stat) => {
          acc[stat.status] = stat.count
          return acc
        }, {} as Record<string, number>),
      },
      performance: {
        totalSales: salesStats[0]?.totalSales || 0,
        totalRevenue: salesStats[0]?.totalRevenue || 0,
        avgProfitMargin: salesStats[0]?.avgProfitMargin || 0,
      },
      catalog: {
        lastAnalyzed: latestAnalysis[0]?.analyzedAt || null,
        totalAnalyzed: latestAnalysis[0]?.totalAnalyzed || 0,
        recommended: latestAnalysis[0]?.recommended || 0,
      },
      collections: {
        active: activeCollections.length,
        current: activeCollections[0] || null,
      },
    })
  } catch (error) {
    console.error('Agent status error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get agent status',
      },
      { status: 500 }
    )
  }
}
```

### Analyze Catalog API

**File:** `app/api/agent/analyze-catalog/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { catalogAnalyzer } from '@/lib/agent/catalog-analyzer'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for full catalog analysis

export async function POST(request: Request) {
  try {
    console.log('🔍 Starting catalog analysis...')

    // Run full catalog analysis
    const report = await catalogAnalyzer.analyzePrintfulCatalog()

    return NextResponse.json({
      success: true,
      message: 'Catalog analysis complete',
      report: {
        totalProducts: report.totalProducts,
        recommended: report.recommended,
        highMargin: report.highMargin,
        premiumTier: report.premiumTier,
        trending: report.trending,
        seasonal: report.seasonal,
        timestamp: report.timestamp,
      },
      topRecommendations: report.topRecommendations.slice(0, 10).map(r => ({
        printfulProductId: r.printfulProductId,
        score: r.agentScore,
        profitMargin: r.profitMargin,
        qualityTier: r.qualityTier,
      })),
    })
  } catch (error) {
    console.error('Catalog analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    )
  }
}
```

### Add Products API

**File:** `app/api/agent/add-products/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { productAdder } from '@/lib/agent/product-adder'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for design generation

interface AddProductsRequest {
  productIds: number[]
  autoApprove?: boolean
  designSource?: 'portfolio' | 'ai' | 'hybrid'
}

export async function POST(request: Request) {
  try {
    const body: AddProductsRequest = await request.json()

    console.log(`🛍️ Adding ${body.productIds.length} products...`)

    // Add products
    const results = await productAdder.addProducts(
      body.productIds.map(id => ({
        printfulProductId: id,
        autoApprove: body.autoApprove || false,
        designSource: body.designSource || 'ai',
      }))
    )

    return NextResponse.json({
      success: true,
      message: `Added ${results.length} products`,
      count: results.length,
      products: results,
    })
  } catch (error) {
    console.error('Add products error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add products',
      },
      { status: 500 }
    )
  }
}
```

---

## Cron Job Setup

**File:** `app/api/cron/buying-agent/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { buyingAgentController } from '@/lib/agent/controller'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max

/**
 * Cron endpoint for automated agent tasks
 *
 * Set up in Vercel:
 * - Daily: 0 2 * * * (2am UTC daily)
 * - Weekly: 0 3 * * 0 (3am UTC Sunday)
 * - Monthly: 0 4 1 * * (4am UTC 1st of month)
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const workflow = searchParams.get('workflow')

  try {
    switch (workflow) {
      case 'daily':
        await buyingAgentController.runDailyTasks()
        return NextResponse.json({
          success: true,
          workflow: 'daily',
          message: 'Daily tasks completed',
        })

      case 'weekly':
        await buyingAgentController.runWeeklyTasks()
        return NextResponse.json({
          success: true,
          workflow: 'weekly',
          message: 'Weekly tasks completed',
        })

      case 'monthly':
        await buyingAgentController.runMonthlyTasks()
        return NextResponse.json({
          success: true,
          workflow: 'monthly',
          message: 'Monthly tasks completed',
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid workflow. Use: daily, weekly, or monthly',
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error(`Cron workflow ${workflow} failed:`, error)
    return NextResponse.json(
      {
        success: false,
        workflow,
        error: error instanceof Error ? error.message : 'Workflow failed',
      },
      { status: 500 }
    )
  }
}
```

**Vercel Cron Configuration:**

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/buying-agent?workflow=daily",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/buying-agent?workflow=weekly",
      "schedule": "0 3 * * 0"
    },
    {
      "path": "/api/cron/buying-agent?workflow=monthly",
      "schedule": "0 4 1 * *"
    }
  ]
}
```

---

## Testing Strategy

### Unit Tests

**File:** `__tests__/agent/catalog-analyzer.test.ts`

```typescript
import { catalogAnalyzer } from '@/lib/agent/catalog-analyzer'

describe('CatalogAnalyzer', () => {
  describe('Product Scoring', () => {
    it('should give high scores to premium brands', async () => {
      const product = {
        id: 71,
        brand: 'Bella+Canvas',
        title: 'Unisex T-Shirt',
        type: 'apparel',
      }

      // Mock variant pricing
      jest.spyOn(catalogAnalyzer as any, 'getVariantPricing').mockResolvedValue({
        cost: 9.95,
        luxuryPrice: 49,
        profitMargin: 79.7,
      })

      const score = await (catalogAnalyzer as any).scoreVariant(product, {}, 'apparel')

      expect(score.score).toBeGreaterThanOrEqual(60) // Should be recommended
    })

    it('should give low scores to economy brands', async () => {
      const product = {
        id: 123,
        brand: 'Generic Brand',
        title: 'Basic T-Shirt',
        type: 'apparel',
      }

      jest.spyOn(catalogAnalyzer as any, 'getVariantPricing').mockResolvedValue({
        cost: 5.00,
        luxuryPrice: 15,
        profitMargin: 66.7,
      })

      const score = await (catalogAnalyzer as any).scoreVariant(product, {}, 'apparel')

      expect(score.score).toBeLessThan(60) // Should NOT be recommended
    })
  })

  describe('Luxury Pricing', () => {
    it('should round to luxury price points', () => {
      expect((catalogAnalyzer as any).roundToLuxuryPrice(42.5)).toBe(39)
      expect((catalogAnalyzer as any).roundToLuxuryPrice(67.3)).toBe(69)
      expect((catalogAnalyzer as any).roundToLuxuryPrice(125.0)).toBe(149)
    })
  })
})
```

### Integration Tests

**File:** `__tests__/agent/integration.test.ts`

```typescript
import { buyingAgentController } from '@/lib/agent/controller'
import { db } from '@/lib/db'
import { catalogAnalysis, agentProducts } from '@/lib/db/schema/buying-agent'

describe('Buying Agent Integration', () => {
  beforeAll(async () => {
    // Set up test database
    await db.execute(sql`TRUNCATE TABLE ${catalogAnalysis} CASCADE`)
    await db.execute(sql`TRUNCATE TABLE ${agentProducts} CASCADE`)
  })

  it('should complete full workflow: analyze → recommend → add', async () => {
    // 1. Run catalog analysis
    await buyingAgentController.runWeeklyTasks()

    // 2. Check that analysis was saved
    const analyses = await db.select().from(catalogAnalysis).limit(10)
    expect(analyses.length).toBeGreaterThan(0)

    // 3. Check that recommendations were made
    const recommended = analyses.filter(a => a.recommendedForStore)
    expect(recommended.length).toBeGreaterThan(0)

    // 4. Products should be added (if auto-add enabled)
    if (process.env.AGENT_AUTO_ADD === 'true') {
      const products = await db.select().from(agentProducts)
      expect(products.length).toBeGreaterThan(0)
    }
  })
})
```

---

## Environment Setup

**Add to `.env.local`:**

```bash
# Existing
PRINTFUL_API_KEY=your_printful_api_key
PRINTFUL_STORE_ID=your_printful_store_id
OPENAI_API_KEY=your_openai_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Database
DATABASE_URL=your_postgres_connection_string

# Buying Agent Configuration
CRON_SECRET=generate_random_secret_here
AGENT_AUTO_ADD=false                # Set to 'true' to auto-add products
AGENT_AUTO_APPROVE=false            # Set to 'true' to skip manual approval
AGENT_MAX_PRODUCTS=50               # Maximum active products
AGENT_MIN_SCORE=60                  # Minimum score to recommend (0-100)
AGENT_PROFIT_TARGET=70              # Target profit margin percentage
```

---

## Deployment Checklist

### Phase 1: Database Setup
- [ ] Run database migrations
- [ ] Verify schema created successfully
- [ ] Test database connections

### Phase 2: Agent Services
- [ ] Deploy catalog analyzer
- [ ] Deploy product adder
- [ ] Deploy inventory manager
- [ ] Test all services

### Phase 3: API Routes
- [ ] Deploy agent API endpoints
- [ ] Test API authentication
- [ ] Verify cron endpoints

### Phase 4: Cron Jobs
- [ ] Configure Vercel cron jobs
- [ ] Test cron execution
- [ ] Set up monitoring

### Phase 5: Dashboard
- [ ] Deploy admin dashboard
- [ ] Test decision workflow
- [ ] Train admin user

### Phase 6: Migration
- [ ] Migrate existing products
- [ ] Deprecate old generator
- [ ] Update documentation

---

## Monitoring & Alerts

**Set up monitoring for:**

1. **Cron Job Failures**
   - Alert if daily/weekly/monthly tasks fail
   - Monitor execution time

2. **Agent Performance**
   - Track recommendation accuracy
   - Monitor profit margins
   - Alert on low conversion rates

3. **API Errors**
   - Printful API failures
   - OpenAI API failures
   - Database errors

4. **Product Performance**
   - Alert on slow movers
   - Celebrate bestsellers
   - Track inventory health

---

**Next:** See `BUYING-AGENT-STRATEGY.md` for business strategy and ROI analysis.
