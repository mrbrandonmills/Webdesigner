# Printful Buying Agent Strategy
## Brandon Mills Luxury Modeling Portfolio Merchandise

**Date:** November 5, 2025
**Status:** Strategic Blueprint
**Purpose:** Replace manual AI generator with intelligent autonomous buying agent

---

## Executive Summary

Transform Brandon Mills' e-commerce platform from a **manual product generator** to an **intelligent buying agent** that:

1. **Autonomously curates** high-margin luxury products from Printful catalog
2. **Analyzes trends** to select best-selling product types
3. **Optimizes pricing** for luxury positioning ($49-$399 range)
4. **Automates design matching** to portfolio aesthetic
5. **Manages inventory** with seasonal collection planning
6. **Maximizes profit** through data-driven product selection

**Key Innovation:** Instead of manually selecting themes and products, the agent continuously learns what sells, monitors Printful catalog updates, and automatically stocks the store with optimized products.

---

## Current State Analysis

### What Exists Now

**File:** `/app/admin/products/generate/page.tsx`

**Current Workflow:**
1. Admin manually selects design themes (6 options)
2. Admin manually selects product types (5 options)
3. Click "Generate" button
4. AI generates designs via DALL-E 3
5. Products saved to `data/curated-products.json`
6. Manual mockup generation (placeholder)

**Problems:**
- ❌ Requires manual intervention for every batch
- ❌ No market analysis or trend awareness
- ❌ No pricing optimization based on costs
- ❌ No seasonal planning or collection strategy
- ❌ No automatic restocking of sold-out items
- ❌ No profit margin analysis
- ❌ Generic AI designs not personalized to brand
- ❌ No quality tier selection (all products treated equally)

### What We Need

**Intelligent Buying Agent:**
- ✅ Analyzes Printful catalog automatically
- ✅ Identifies high-margin products (>60% profit)
- ✅ Curates premium products matching brand aesthetic
- ✅ Creates seasonal collections automatically
- ✅ Monitors sales data and restocks winners
- ✅ Deprecates low-performers
- ✅ Optimizes pricing for luxury market
- ✅ Generates portfolio-specific mockups
- ✅ Schedules limited edition drops
- ✅ Maintains brand coherence across all products

---

## Buying Agent Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    BUYING AGENT SYSTEM                       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   CATALOG    │      │   CURATION   │     │  INVENTORY   │
│   ANALYZER   │      │    ENGINE    │     │   MANAGER    │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   PRICING    │      │   MOCKUP     │     │  MARKETING   │
│  OPTIMIZER   │      │  GENERATOR   │     │  AUTOMATION  │
└──────────────┘      └──────────────┘     └──────────────┘
```

### 1. Catalog Analyzer

**Purpose:** Continuously monitor Printful catalog for opportunities

**Responsibilities:**
- Fetch all Printful catalog products weekly
- Identify new products/variants added to catalog
- Extract pricing data (cost vs. suggested retail)
- Calculate profit margins for each variant
- Filter by quality tier (premium brands only)
- Categorize by product type (apparel, home, accessories)
- Track availability status changes
- Detect seasonal product releases

**Data Structure:**
```typescript
interface CatalogProduct {
  printfulId: number
  title: string
  brand: string
  model: string
  category: string
  qualityTier: 'premium' | 'standard' | 'economy'
  variants: CatalogVariant[]
  profitMargin: number // Percentage
  trending: boolean
  seasonal: boolean
  lastAnalyzed: Date
}

interface CatalogVariant {
  variantId: number
  size: string
  color: string
  colorCode: string
  printfulCost: number // What we pay
  suggestedRetail: number // Printful suggestion
  luxuryPrice: number // Our calculated luxury price
  profitAmount: number // Dollar profit per unit
  profitMargin: number // Percentage
  inStock: boolean
  image: string
}
```

**Algorithm:**
```typescript
// Scoring algorithm for product selection
function calculateProductScore(product: CatalogProduct): number {
  let score = 0

  // Quality tier (40% weight)
  if (product.qualityTier === 'premium') score += 40
  else if (product.qualityTier === 'standard') score += 20

  // Profit margin (30% weight)
  if (product.profitMargin >= 70) score += 30
  else if (product.profitMargin >= 60) score += 20
  else if (product.profitMargin >= 50) score += 10

  // Brand alignment (20% weight)
  const luxuryBrands = ['Bella+Canvas', 'Next Level', 'American Apparel']
  if (luxuryBrands.includes(product.brand)) score += 20

  // Trending status (10% weight)
  if (product.trending) score += 10

  return score
}

// Only products scoring 60+ are added to store
```

### 2. Curation Engine

**Purpose:** Select products that align with Brandon Mills luxury brand

**Curation Criteria:**

**Product Categories (Priority Order):**
1. **Fine Art Prints** (Posters, Canvas) - 80% profit margin
2. **Premium Apparel** (Bella+Canvas, Next Level) - 60-70% margin
3. **Home & Living** (Throw pillows, blankets) - 65% margin
4. **Accessories** (Tote bags, phone cases) - 55% margin

**Brand Alignment Filters:**
- ✅ Minimalist aesthetic (no busy designs)
- ✅ Neutral color palettes (black, white, beige, gray, gold)
- ✅ Premium materials only
- ✅ High-quality printing (DTG, sublimation, embroidery)
- ✅ Museum-quality paper for prints
- ✅ Eco-friendly options preferred
- ❌ No novelty/gimmicky products
- ❌ No neon colors or loud designs
- ❌ No economy-tier products

**Curated Product List (Recommended):**

```typescript
const LUXURY_PRODUCT_CATALOG = [
  // Fine Art Prints (Highest Margin)
  {
    category: 'Fine Art Prints',
    products: [
      {
        printfulId: 1,
        name: '18×24" Museum-Quality Poster',
        brand: 'Printful',
        cost: 11.95,
        retailPrice: 79.00,
        luxuryPrice: 89.00,
        margin: 86.6%
      },
      {
        printfulId: 1,
        name: '24×36" Statement Poster',
        cost: 15.95,
        retailPrice: 99.00,
        luxuryPrice: 119.00,
        margin: 86.6%
      },
      {
        printfulId: 29,
        name: '16×20" Premium Canvas',
        cost: 29.95,
        retailPrice: 149.00,
        luxuryPrice: 199.00,
        margin: 84.9%
      },
      {
        printfulId: 29,
        name: '24×36" Gallery Canvas',
        cost: 49.95,
        retailPrice: 249.00,
        luxuryPrice: 299.00,
        margin: 83.3%
      },
    ]
  },

  // Premium Apparel (High Margin + Brand Visibility)
  {
    category: 'Premium Apparel',
    products: [
      {
        printfulId: 71,
        name: 'Bella+Canvas 3001 Unisex T-Shirt',
        brand: 'Bella+Canvas',
        cost: 9.95,
        retailPrice: 29.99,
        luxuryPrice: 49.00,
        margin: 79.7%
      },
      {
        printfulId: 231,
        name: 'Bella+Canvas Premium Hoodie',
        brand: 'Bella+Canvas',
        cost: 24.95,
        retailPrice: 54.99,
        luxuryPrice: 79.00,
        margin: 68.4%
      },
      {
        printfulId: 389,
        name: 'Next Level Long Sleeve',
        brand: 'Next Level',
        cost: 12.95,
        retailPrice: 34.99,
        luxuryPrice: 54.00,
        margin: 76.0%
      },
    ]
  },

  // Home & Living (Lifestyle Products)
  {
    category: 'Home & Living',
    products: [
      {
        printfulId: 26,
        name: '18×18" Premium Throw Pillow',
        cost: 14.95,
        retailPrice: 39.99,
        luxuryPrice: 59.00,
        margin: 74.7%
      },
      {
        printfulId: 133,
        name: '50×60" Plush Blanket',
        cost: 29.95,
        retailPrice: 74.99,
        luxuryPrice: 99.00,
        margin: 69.7%
      },
    ]
  },

  // Accessories (Entry Price Point)
  {
    category: 'Accessories',
    products: [
      {
        printfulId: 261,
        name: 'Premium Tote Bag',
        cost: 9.95,
        retailPrice: 24.99,
        luxuryPrice: 39.00,
        margin: 74.5%
      },
      {
        printfulId: 19,
        name: 'White Ceramic Mug',
        cost: 7.95,
        retailPrice: 19.99,
        luxuryPrice: 29.00,
        margin: 72.6%
      },
    ]
  },
]
```

### 3. Pricing Optimizer

**Purpose:** Calculate luxury pricing that maximizes profit while maintaining brand positioning

**Pricing Strategy:**

**Luxury Pricing Formula:**
```typescript
function calculateLuxuryPrice(printfulCost: number, productType: string): number {
  // Base multipliers by category
  const multipliers = {
    'fine-art': 7.0,      // 7x cost (e.g., $11.95 → $89)
    'apparel': 4.5,        // 4.5x cost (e.g., $9.95 → $49)
    'home': 4.0,           // 4x cost (e.g., $14.95 → $59)
    'accessories': 3.5,    // 3.5x cost (e.g., $9.95 → $39)
  }

  const basePrice = printfulCost * (multipliers[productType] || 3.0)

  // Round to psychological pricing points
  return roundToLuxuryPrice(basePrice)
}

function roundToLuxuryPrice(price: number): number {
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
```

**Pricing Tiers:**
```
Entry Level (Accessories):     $29 - $49
Mid-Range (Apparel):           $49 - $89
Premium (Home/Small Prints):   $79 - $149
Luxury (Large Prints/Canvas):  $149 - $299
Statement Pieces:              $299 - $399
```

**Dynamic Pricing Rules:**
- Limited editions: +20% premium
- Seasonal collections: +15% premium
- First week of launch: -10% early access discount
- Best-sellers: Can increase by $10-20
- Slow movers: -15% sale price after 60 days

### 4. Inventory Manager

**Purpose:** Maintain optimal product mix and automate restocking

**Inventory Strategy:**

**Product Lifecycle Management:**
```typescript
interface ProductLifecycle {
  status: 'new' | 'active' | 'bestseller' | 'slow' | 'deprecated'
  launchDate: Date
  salesCount: number
  viewCount: number
  conversionRate: number
  daysActive: number
  lastSale: Date
}

// Lifecycle rules
const LIFECYCLE_RULES = {
  // New products get 30 days to prove themselves
  NEW_PRODUCT_PERIOD: 30,

  // Bestseller criteria: 10+ sales in 30 days
  BESTSELLER_THRESHOLD: 10,

  // Slow mover: <3 sales in 60 days
  SLOW_MOVER_THRESHOLD: 3,

  // Deprecate: 0 sales in 90 days
  DEPRECATION_PERIOD: 90,

  // Maximum active products
  MAX_ACTIVE_PRODUCTS: 50,

  // Minimum active products
  MIN_ACTIVE_PRODUCTS: 20,
}

function manageInventory(products: ProductLifecycle[]): {
  restock: string[]
  deprecate: string[]
  promote: string[]
} {
  const actions = {
    restock: [],
    deprecate: [],
    promote: [],
  }

  products.forEach(product => {
    const daysSinceLastSale = daysSince(product.lastSale)

    // Restock bestsellers with new designs
    if (product.status === 'bestseller' && product.salesCount >= LIFECYCLE_RULES.BESTSELLER_THRESHOLD) {
      actions.restock.push(product.id)
    }

    // Deprecate slow movers
    if (daysSinceLastSale > LIFECYCLE_RULES.DEPRECATION_PERIOD && product.salesCount < LIFECYCLE_RULES.SLOW_MOVER_THRESHOLD) {
      actions.deprecate.push(product.id)
    }

    // Promote new products performing well
    if (product.daysActive < LIFECYCLE_RULES.NEW_PRODUCT_PERIOD && product.conversionRate > 0.03) {
      actions.promote.push(product.id)
    }
  })

  return actions
}
```

**Collection Planning:**

**Seasonal Collections:**
```typescript
const SEASONAL_COLLECTIONS = {
  winter: {
    months: [11, 12, 1, 2],
    themes: ['cozy', 'introspection', 'minimalism'],
    products: ['hoodies', 'blankets', 'long-sleeve'],
    colors: ['charcoal', 'cream', 'deep-navy'],
    launch: 'November 1',
  },
  spring: {
    months: [3, 4, 5],
    themes: ['renewal', 'movement', 'nature'],
    products: ['t-shirts', 'tote-bags', 'prints'],
    colors: ['beige', 'sage', 'soft-white'],
    launch: 'March 1',
  },
  summer: {
    months: [6, 7, 8],
    themes: ['embodiment', 'freedom', 'expression'],
    products: ['t-shirts', 'tank-tops', 'lightweight'],
    colors: ['white', 'sand', 'light-gray'],
    launch: 'June 1',
  },
  fall: {
    months: [9, 10],
    themes: ['philosophy', 'reflection', 'transition'],
    products: ['hoodies', 'prints', 'notebooks'],
    colors: ['black', 'rust', 'olive'],
    launch: 'September 1',
  },
}

// Quarterly limited editions
const LIMITED_EDITIONS = [
  {
    name: 'Consciousness Series',
    quarter: 'Q1',
    products: 5,
    productionLimit: 50, // Only 50 of each design
    pricing: '+20% premium',
    duration: '30 days',
  },
  {
    name: 'Embodiment Series',
    quarter: 'Q2',
    products: 5,
    productionLimit: 50,
    pricing: '+20% premium',
    duration: '30 days',
  },
  {
    name: 'Philosophy Series',
    quarter: 'Q3',
    products: 5,
    productionLimit: 50,
    pricing: '+20% premium',
    duration: '30 days',
  },
  {
    name: 'Nature Series',
    quarter: 'Q4',
    products: 5,
    productionLimit: 50,
    pricing: '+20% premium',
    duration: '30 days',
  },
]
```

### 5. Mockup Generator

**Purpose:** Automatically generate high-quality product mockups with portfolio imagery

**Strategy:**

**Design Sources (Priority Order):**
1. **Portfolio Photography** (First choice - use Brandon's actual modeling photos)
2. **AI-Generated Designs** (Secondary - aligned with brand aesthetic)
3. **Hybrid Approach** (Portfolio + AI enhancement)

**Mockup Workflow:**
```typescript
async function generateProductMockups(product: CatalogProduct): Promise<Mockup[]> {
  // 1. Select design source
  const designSource = await selectDesignSource(product)

  // 2. Upload design to Printful Files API
  const fileId = await uploadDesignToPrintful(designSource.imageUrl)

  // 3. Request mockup generation
  const mockupTask = await printfulClient.createMockupTask({
    variant_ids: product.variants.map(v => v.variantId),
    format: 'jpg',
    files: [{
      placement: getPlacement(product.category),
      image_url: fileId,
    }],
  })

  // 4. Poll for completion
  const mockups = await pollMockupTask(mockupTask.task_key)

  // 5. Save mockups to Vercel Blob
  return await saveMockupsToStorage(mockups)
}

function selectDesignSource(product: CatalogProduct): DesignSource {
  // For apparel: Use portfolio photography
  if (product.category === 'apparel') {
    return {
      type: 'portfolio',
      imageUrl: selectPortfolioImage('editorial', 'black-and-white'),
      treatment: 'high-contrast', // Make it pop on fabric
    }
  }

  // For fine art: Use AI-generated abstract designs
  if (product.category === 'fine-art') {
    return {
      type: 'ai-generated',
      prompt: generateLuxuryArtPrompt(),
      style: 'minimalist-abstract',
    }
  }

  // For home: Use hybrid approach
  return {
    type: 'hybrid',
    base: selectPortfolioImage('artistic', 'neutral-tones'),
    aiEnhancement: 'subtle-abstract-overlay',
  }
}
```

**Design Quality Standards:**
- Minimum resolution: 4500x5400px (300 DPI)
- Color space: RGB (for digital printing)
- File format: PNG with transparency or high-quality JPG
- Composition: Center-weighted for most products
- Bleed area: Account for Printful's print area specs

### 6. Marketing Automation

**Purpose:** Automatically promote products and drive sales

**Automated Marketing Workflows:**

```typescript
const MARKETING_AUTOMATION = {
  // 1. New Product Launch
  newProductLaunch: {
    trigger: 'Product added to store',
    actions: [
      { day: 0, action: 'Send email to VIP list', subject: 'Exclusive First Look' },
      { day: 1, action: 'Instagram post', content: 'Product reveal' },
      { day: 3, action: 'Email to full list', subject: 'New Release' },
      { day: 7, action: 'Instagram story', content: 'Last chance early access' },
    ],
  },

  // 2. Bestseller Promotion
  bestseller: {
    trigger: 'Product reaches 10 sales',
    actions: [
      { immediate: true, action: 'Add "Bestseller" badge' },
      { day: 0, action: 'Feature on homepage' },
      { day: 1, action: 'Email segment: "Trending Now"' },
      { day: 3, action: 'Create lookalike products' },
    ],
  },

  // 3. Slow Mover Clearance
  slowMover: {
    trigger: 'No sales in 60 days',
    actions: [
      { day: 60, action: 'Add to sale section', discount: '15%' },
      { day: 65, action: 'Email: "Limited Time Sale"' },
      { day: 75, action: 'Increase discount to 25%' },
      { day: 90, action: 'Remove from store' },
    ],
  },

  // 4. Seasonal Collection
  seasonalCollection: {
    trigger: 'Season start date',
    actions: [
      { day: -7, action: 'Teaser email: "Coming Soon"' },
      { day: 0, action: 'Collection launch email' },
      { day: 0, action: 'Instagram campaign' },
      { day: 7, action: 'Reminder email' },
      { day: 30, action: 'Last chance email' },
      { day: 45, action: 'End of season sale' },
    ],
  },

  // 5. Limited Edition Drop
  limitedEdition: {
    trigger: 'Limited edition launch',
    actions: [
      { day: -3, action: 'Countdown emails (daily)' },
      { day: 0, action: 'Drop announcement (email + social)' },
      { day: 1, action: 'Scarcity email: "X remaining"' },
      { day: 7, action: 'Final units email' },
      { day: 30, action: 'Sold out announcement' },
    ],
  },
}
```

**Cross-Sell/Upsell Logic:**
```typescript
function generateRecommendations(cart: CartItem[]): Recommendation[] {
  const recommendations = []

  // Bundle recommendations
  if (cart.some(item => item.category === 'fine-art')) {
    recommendations.push({
      type: 'bundle',
      products: ['matching-pillow', 'coordinating-print'],
      discount: '15% off bundle',
      message: 'Complete the look',
    })
  }

  // Upsell to larger size
  if (cart.some(item => item.size === '12x16')) {
    recommendations.push({
      type: 'upsell',
      product: 'same-design-18x24',
      message: 'Upgrade to larger size for just $30 more',
      savings: 'Save vs buying separately',
    })
  }

  // Cross-sell apparel with prints
  if (cart.some(item => item.category === 'fine-art') && !cart.some(item => item.category === 'apparel')) {
    recommendations.push({
      type: 'cross-sell',
      products: ['matching-tshirt', 'matching-tote'],
      message: 'Wear the art',
    })
  }

  return recommendations
}
```

---

## Implementation Roadmap

### Phase 1: Agent Foundation (Week 1)

**Goal:** Build core agent infrastructure

**Tasks:**
1. **Create Agent Database Schema**
   ```typescript
   // lib/db/schema/buying-agent.ts

   export const agentProducts = pgTable('agent_products', {
     id: uuid('id').defaultRandom().primaryKey(),
     printfulProductId: integer('printful_product_id').notNull(),
     printfulVariantId: integer('printful_variant_id').notNull(),
     title: text('title').notNull(),
     description: text('description'),
     category: text('category').notNull(),
     qualityTier: text('quality_tier').notNull(), // premium, standard, economy
     printfulCost: decimal('printful_cost', { precision: 10, scale: 2 }),
     luxuryPrice: decimal('luxury_price', { precision: 10, scale: 2 }),
     profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }),
     status: text('status').default('active'), // active, bestseller, slow, deprecated
     salesCount: integer('sales_count').default(0),
     viewCount: integer('view_count').default(0),
     conversionRate: decimal('conversion_rate', { precision: 5, scale: 4 }),
     designUrl: text('design_url'),
     mockupUrls: json('mockup_urls'),
     tags: json('tags'),
     launchDate: timestamp('launch_date').defaultNow(),
     lastSale: timestamp('last_sale'),
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow(),
   })

   export const catalogAnalysis = pgTable('catalog_analysis', {
     id: uuid('id').defaultRandom().primaryKey(),
     printfulProductId: integer('printful_product_id').notNull(),
     agentScore: integer('agent_score'), // 0-100
     qualityTier: text('quality_tier'),
     profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }),
     trending: boolean('trending').default(false),
     seasonal: boolean('seasonal').default(false),
     recommendedForStore: boolean('recommended_for_store').default(false),
     analyzedAt: timestamp('analyzed_at').defaultNow(),
   })

   export const seasonalCollections = pgTable('seasonal_collections', {
     id: uuid('id').defaultRandom().primaryKey(),
     name: text('name').notNull(),
     season: text('season').notNull(), // winter, spring, summer, fall
     year: integer('year').notNull(),
     launchDate: timestamp('launch_date'),
     endDate: timestamp('end_date'),
     theme: text('theme'),
     status: text('status').default('planned'), // planned, active, ended
     products: json('products'), // Array of product IDs
     salesTotal: decimal('sales_total', { precision: 10, scale: 2 }).default('0'),
     createdAt: timestamp('created_at').defaultNow(),
   })
   ```

2. **Build Catalog Analyzer Service**
   ```typescript
   // lib/agent/catalog-analyzer.ts

   export class CatalogAnalyzer {
     async analyzePrintfulCatalog(): Promise<AnalysisReport> {
       // Fetch all catalog products
       const products = await this.fetchAllCatalogProducts()

       // Analyze each product
       const analysis = await Promise.all(
         products.map(product => this.analyzeProduct(product))
       )

       // Save to database
       await this.saveAnalysis(analysis)

       return this.generateReport(analysis)
     }

     private async analyzeProduct(product: CatalogProduct): Promise<ProductAnalysis> {
       const variants = await printfulClient.getCatalogVariants(product.id)
       const scores = await Promise.all(
         variants.map(v => this.scoreVariant(product, v))
       )

       return {
         productId: product.id,
         agentScore: Math.max(...scores.map(s => s.score)),
         qualityTier: this.determineQualityTier(product),
         profitMargin: this.calculateProfitMargin(variants),
         trending: await this.checkTrending(product),
         seasonal: this.isSeasonal(product),
         recommendedForStore: Math.max(...scores.map(s => s.score)) >= 60,
       }
     }

     private scoreVariant(product: CatalogProduct, variant: CatalogVariant): VariantScore {
       let score = 0

       // Quality tier (40 points max)
       score += this.scoreQualityTier(product.brand)

       // Profit margin (30 points max)
       score += this.scoreProfitMargin(variant)

       // Brand alignment (20 points max)
       score += this.scoreBrandAlignment(product)

       // Market trends (10 points max)
       score += this.scoreTrending(product)

       return { score, variant }
     }
   }
   ```

3. **Create Agent Controller**
   ```typescript
   // lib/agent/controller.ts

   export class BuyingAgentController {
     private analyzer: CatalogAnalyzer
     private curator: CurationEngine
     private pricer: PricingOptimizer
     private inventory: InventoryManager

     async runDailyTasks() {
       console.log('🤖 Running daily buying agent tasks...')

       // 1. Analyze catalog for changes
       await this.analyzer.analyzePrintfulCatalog()

       // 2. Identify new opportunities
       const opportunities = await this.curator.findNewOpportunities()

       // 3. Add recommended products
       if (opportunities.length > 0) {
         await this.addProducts(opportunities)
       }

       // 4. Manage existing inventory
       await this.inventory.manageLifecycle()

       // 5. Update pricing based on performance
       await this.pricer.optimizePricing()

       console.log('✅ Daily tasks complete')
     }

     async runWeeklyTasks() {
       console.log('🤖 Running weekly buying agent tasks...')

       // 1. Full catalog re-analysis
       await this.analyzer.analyzePrintfulCatalog()

       // 2. Generate performance reports
       const report = await this.generatePerformanceReport()

       // 3. Plan next collection
       await this.planNextCollection()

       // 4. Deprecate slow movers
       await this.inventory.deprecateSlowMovers()

       console.log('✅ Weekly tasks complete')
     }
   }
   ```

**Deliverables:**
- Database schema for agent system
- Catalog analyzer service
- Agent controller with scheduling
- API endpoints for agent operations

### Phase 2: Product Curation (Week 2)

**Goal:** Implement intelligent product selection and pricing

**Tasks:**
1. **Build Curation Engine**
   - Implement scoring algorithm
   - Create brand alignment filters
   - Build quality tier detection
   - Develop trend analysis

2. **Build Pricing Optimizer**
   - Implement luxury pricing formula
   - Create dynamic pricing rules
   - Build profit margin calculator
   - Develop competitive analysis

3. **Create Product Addition Workflow**
   ```typescript
   // app/api/agent/add-products/route.ts

   export async function POST(request: Request) {
     const { productIds, auto = true } = await request.json()

     const results = []

     for (const productId of productIds) {
       // 1. Fetch product from Printful
       const product = await printfulClient.getCatalogProduct(productId)
       const variants = await printfulClient.getCatalogVariants(productId)

       // 2. Select best variants (colors/sizes)
       const selectedVariants = selectLuxuryVariants(variants)

       // 3. Calculate pricing
       const pricing = calculateLuxuryPricing(selectedVariants)

       // 4. Generate or select design
       const design = auto
         ? await generateDesignForProduct(product)
         : await promptForDesignSelection(product)

       // 5. Upload design to Printful
       const fileId = await uploadToPrintfulFiles(design)

       // 6. Generate mockups
       const mockups = await generateMockups(selectedVariants, fileId)

       // 7. Save to database
       const dbProduct = await db.insert(agentProducts).values({
         printfulProductId: product.id,
         title: generateProductTitle(product),
         description: generateProductDescription(product),
         category: categorizeProduct(product),
         qualityTier: determineQualityTier(product),
         luxuryPrice: pricing.luxuryPrice,
         profitMargin: pricing.margin,
         designUrl: design.url,
         mockupUrls: mockups.map(m => m.url),
         tags: generateTags(product),
       })

       results.push(dbProduct)
     }

     return NextResponse.json({
       success: true,
       count: results.length,
       products: results,
     })
   }
   ```

**Deliverables:**
- Curation engine with scoring
- Pricing optimizer
- Automated product addition workflow
- Admin UI for reviewing agent decisions

### Phase 3: Automation & Intelligence (Week 3)

**Goal:** Fully automate product management

**Tasks:**
1. **Implement Mockup Generator**
   - Portfolio image selector
   - AI design generator (DALL-E 3)
   - Printful mockup task manager
   - Image optimization pipeline

2. **Build Inventory Manager**
   - Product lifecycle tracking
   - Automatic restocking logic
   - Slow mover deprecation
   - Bestseller identification

3. **Create Seasonal Collection Planner**
   - Collection templates
   - Automated scheduling
   - Theme-based product selection
   - Limited edition management

4. **Set Up Automated Workflows**
   ```typescript
   // lib/agent/workflows.ts

   export const agentWorkflows = {
     // Daily at 2am UTC
     daily: async () => {
       await buyingAgent.runDailyTasks()
     },

     // Weekly on Sunday at 3am UTC
     weekly: async () => {
       await buyingAgent.runWeeklyTasks()
     },

     // Monthly on 1st at 4am UTC
     monthly: async () => {
       await buyingAgent.planNextSeasonalCollection()
       await buyingAgent.generateMonthlyReport()
     },

     // Quarterly limited edition launches
     quarterly: async () => {
       await buyingAgent.launchLimitedEdition()
     },
   }
   ```

5. **Deploy Cron Jobs**
   ```typescript
   // app/api/cron/buying-agent/route.ts

   import { agentWorkflows } from '@/lib/agent/workflows'

   export async function GET(request: Request) {
     // Verify cron secret
     const authHeader = request.headers.get('authorization')
     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       return new Response('Unauthorized', { status: 401 })
     }

     const { searchParams } = new URL(request.url)
     const workflow = searchParams.get('workflow')

     if (workflow && agentWorkflows[workflow]) {
       await agentWorkflows[workflow]()
       return NextResponse.json({ success: true, workflow })
     }

     return NextResponse.json({ error: 'Invalid workflow' }, { status: 400 })
   }
   ```

**Deliverables:**
- Automated mockup generation
- Inventory lifecycle management
- Seasonal collection planning
- Cron jobs for automation

### Phase 4: Admin Dashboard (Week 4)

**Goal:** Replace generator page with agent dashboard

**Tasks:**
1. **Build Agent Dashboard**
   ```tsx
   // app/admin/buying-agent/page.tsx

   export default function BuyingAgentDashboard() {
     return (
       <div className="agent-dashboard">
         {/* Overview Stats */}
         <AgentStats
           activeProducts={42}
           bestsellers={8}
           revenue30Days={5420}
           profitMargin={72}
         />

         {/* Pending Agent Decisions */}
         <PendingDecisions
           newOpportunities={12}
           restockRecommendations={5}
           deprecationCandidates={3}
         />

         {/* Current Collections */}
         <ActiveCollections
           current="Winter Introspection"
           upcoming="Spring Renewal"
           limitedEdition="Consciousness Series Q1"
         />

         {/* Performance Analytics */}
         <PerformanceCharts
           salesTrend={salesData}
           topProducts={topProducts}
           categoryMix={categoryBreakdown}
         />

         {/* Agent Controls */}
         <AgentControls
           onRunAnalysis={() => triggerCatalogAnalysis()}
           onApproveDecisions={() => approveAgentDecisions()}
           onPlanCollection={() => openCollectionPlanner()}
         />
       </div>
     )
   }
   ```

2. **Create Decision Review UI**
   - Product recommendations list
   - One-click approve/reject
   - Bulk actions
   - Override controls

3. **Build Collection Planner UI**
   - Theme selector
   - Product type selector
   - Date picker
   - Preview mockups

4. **Add Performance Monitoring**
   - Real-time sales tracking
   - Profit margin by product
   - Conversion rate trends
   - Inventory health score

**Deliverables:**
- Complete agent dashboard
- Decision review interface
- Collection planning tools
- Performance analytics

---

## E-Commerce Marketing Strategies

### Strategy 1: Bundle Recommendations

**Product Bundles:**
```typescript
const LUXURY_BUNDLES = [
  {
    id: 'gallery-wall',
    name: 'The Gallery Wall Collection',
    products: [
      '18x24-poster-consciousness',
      '18x24-poster-embodiment',
      '12x16-poster-philosophy',
    ],
    regularPrice: 267,
    bundlePrice: 219, // Save $48 (18%)
    description: 'Curate your own gallery wall with three coordinated prints',
    mockup: 'gallery-wall-lifestyle.jpg',
  },
  {
    id: 'complete-philosophy',
    name: 'The Philosophy Collection',
    products: [
      '24x36-canvas-philosophy',
      'premium-tshirt-philosophy',
      'throw-pillow-philosophy',
    ],
    regularPrice: 397,
    bundlePrice: 329, // Save $68 (17%)
    description: 'Live the philosophy with art, apparel, and home',
    mockup: 'philosophy-bundle-lifestyle.jpg',
  },
  {
    id: 'starter-collection',
    name: 'The Essentials',
    products: [
      '18x24-poster',
      'premium-tshirt',
      'tote-bag',
    ],
    regularPrice: 167,
    bundlePrice: 139, // Save $28 (17%)
    description: 'Start your Brandon Mills collection',
    mockup: 'essentials-bundle.jpg',
  },
]
```

**Bundle Logic:**
```typescript
function recommendBundles(viewedProducts: Product[]): Bundle[] {
  const recommendations = []

  // If viewing print, suggest gallery wall
  if (viewedProducts.some(p => p.category === 'fine-art')) {
    recommendations.push(LUXURY_BUNDLES.find(b => b.id === 'gallery-wall'))
  }

  // If viewing apparel, suggest complete collection
  if (viewedProducts.some(p => p.category === 'apparel')) {
    recommendations.push(LUXURY_BUNDLES.find(b => b.id === 'complete-philosophy'))
  }

  // Always show starter collection
  recommendations.push(LUXURY_BUNDLES.find(b => b.id === 'starter-collection'))

  return recommendations.filter(Boolean)
}
```

### Strategy 2: Limited Edition Drops

**Drop Strategy:**
```typescript
const LIMITED_EDITION_STRATEGY = {
  frequency: 'Quarterly',
  quantity: 50, // Only 50 of each design
  duration: 30, // 30-day availability
  pricing: '+20%', // Premium pricing
  marketing: {
    prelaunch: {
      day: -7,
      tactics: ['Teaser email', 'Instagram countdown', 'VIP early access'],
    },
    launch: {
      day: 0,
      tactics: ['Email blast', 'Social media blitz', 'Homepage takeover'],
    },
    scarcity: {
      day: 1,
      tactics: ['Daily stock updates', 'Scarcity emails', 'Social proof'],
    },
    finale: {
      day: 28,
      tactics: ['Last chance email', 'Final units countdown', 'Sold out announcement'],
    },
  },
  postDrop: {
    tactics: ['Collector showcase', 'Behind-the-scenes', 'Next drop teaser'],
  },
}
```

**Example Drop:**
```typescript
{
  name: 'Consciousness Series - Q1 2025',
  theme: 'Sacred Geometry & Mindfulness',
  products: [
    {
      title: 'Sacred Spiral - 24×36" Canvas',
      design: 'sacred-spiral-gold.png',
      price: 359, // Premium pricing
      quantity: 50,
      numbered: true, // "1 of 50"
    },
    {
      title: 'Mandala of Awareness - 18×24" Poster',
      design: 'mandala-consciousness.png',
      price: 107, // +20% from $89
      quantity: 50,
      numbered: true,
    },
    {
      title: 'Meditation Symbol - Premium Hoodie',
      design: 'meditation-symbol.png',
      price: 95, // +20% from $79
      quantity: 50,
      numbered: true,
    },
  ],
  totalRevenue: 28050, // If all sell out
  totalProfit: 23150, // ~82% margin
}
```

### Strategy 3: Social Proof & UGC

**User-Generated Content Strategy:**
```typescript
const UGC_STRATEGY = {
  incentives: {
    // Customer posts product photo
    photoPost: {
      reward: '$10 store credit',
      hashtag: '#BrandonMillsCollection',
      requirement: 'Tag @brandonmills and use hashtag',
    },

    // Customer writes review
    review: {
      reward: '$5 store credit',
      requirement: 'Write detailed review with photo',
    },

    // Customer refers friend
    referral: {
      reward: '$15 for you, $10 for friend',
      requirement: 'Friend makes first purchase',
    },
  },

  showcase: {
    // Feature customer photos on product pages
    productGallery: true,

    // Weekly customer spotlight on Instagram
    weeklySpotlight: true,

    // "As seen on" section on homepage
    homepage: true,

    // Collector interviews
    collectorStories: 'Monthly',
  },
}
```

### Strategy 4: Email Segmentation

**Segment Strategy:**
```typescript
const EMAIL_SEGMENTS = {
  vip: {
    criteria: 'Total spend > $300 OR 3+ purchases',
    benefits: [
      'Early access to drops (24 hours)',
      'Exclusive discounts (20%)',
      'Free shipping always',
      'First to know new collections',
    ],
    emails: [
      'VIP exclusive previews',
      'Private sale invitations',
      'Limited edition early access',
    ],
  },

  collectors: {
    criteria: '5+ items purchased OR owns limited edition',
    benefits: [
      'Collector newsletter',
      'Behind-the-scenes content',
      'Input on new designs',
      'Signed prints option',
    ],
    emails: [
      'New collection deep dives',
      'Artist inspiration stories',
      'Collector community highlights',
    ],
  },

  artLovers: {
    criteria: '2+ fine art purchases',
    benefits: [
      'Art-focused content',
      'Gallery wall ideas',
      'Print care guides',
    ],
    emails: [
      'New print releases',
      'Gallery wall inspiration',
      'Limited edition art drops',
    ],
  },

  apparelFans: {
    criteria: '2+ apparel purchases',
    benefits: [
      'Apparel-first notifications',
      'Styling guides',
      'New design previews',
    ],
    emails: [
      'New apparel drops',
      'Styling inspiration',
      'Seasonal apparel collections',
    ],
  },

  browsers: {
    criteria: 'Email subscriber but no purchases',
    benefits: [
      'Welcome series',
      'First purchase discount',
      'Educational content',
    ],
    emails: [
      'Story of Brandon Mills',
      'Philosophy of the brand',
      '10% off first order',
    ],
  },
}
```

### Strategy 5: Scarcity & Urgency

**Scarcity Tactics:**
```typescript
const SCARCITY_TACTICS = {
  // Low stock indicators
  lowStock: {
    threshold: 5, // Show "Only 5 left" when stock <= 5
    message: 'Only {count} left in stock',
    color: 'red',
  },

  // Limited time offers
  flash: {
    duration: '48 hours',
    discount: '20%',
    frequency: 'Monthly',
    message: '48-Hour Flash Sale - 20% Off',
  },

  // Countdown timers
  countdown: {
    limitedEdition: 'Ends in {days}d {hours}h {minutes}m',
    flash: 'Sale ends in {hours}:{minutes}:{seconds}',
    seasonal: 'Collection ends {date}',
  },

  // Social proof
  socialProof: {
    recentPurchase: '{count} people bought this in the last 24 hours',
    viewing: '{count} people viewing this right now',
    bestseller: 'Bestseller - Over {count} sold',
  },

  // One-time offers
  oneTime: {
    trigger: 'First visit or exit intent',
    offer: '10% off your first order',
    expiry: '24 hours',
    code: 'WELCOME10',
  },
}
```

### Strategy 6: Influencer & Ambassador Program

**Ambassador Strategy:**
```typescript
const AMBASSADOR_PROGRAM = {
  tiers: {
    micro: {
      criteria: '1K-10K followers',
      commission: '15%',
      perks: [
        'Free product ($100 value)',
        'Unique discount code',
        'Monthly exclusive content',
      ],
    },

    macro: {
      criteria: '10K-100K followers',
      commission: '20%',
      perks: [
        'Free product ($300 value)',
        'Custom discount code',
        'Feature in brand content',
        'Early access to all drops',
      ],
    },

    celebrity: {
      criteria: '100K+ followers',
      commission: 'Negotiable',
      perks: [
        'Free collection',
        'Co-designed limited edition',
        'Revenue share',
        'Brand partnership',
      ],
    },
  },

  recruitment: {
    target: [
      'Philosophy content creators',
      'Mindfulness influencers',
      'Yoga/fitness influencers',
      'Minimalist lifestyle creators',
      'Art enthusiasts',
    ],
    outreach: 'DM + personalized email',
    pitch: 'Align with brand values + quality products',
  },
}
```

---

## ROI Projections

### Revenue Forecast

**Year 1 Projections:**

```typescript
const YEAR_1_FORECAST = {
  // Conservative estimate
  conservative: {
    activeProducts: 30,
    averagePrice: 89,
    salesPerMonth: 50,
    revenue: {
      month1: 4450,   // 50 sales × $89
      month3: 8010,   // 90 sales × $89 (80% growth)
      month6: 12460,  // 140 sales × $89
      month12: 17790, // 200 sales × $89
      year1Total: 133900,
    },
    costs: {
      printful: 35840,      // ~27% of revenue
      marketing: 13390,     // 10% of revenue
      infrastructure: 516,  // Vercel Pro + services
      total: 49746,
    },
    profit: {
      gross: 98060,         // 73% margin
      net: 84154,           // 63% net margin
    },
  },

  // Moderate estimate
  moderate: {
    activeProducts: 50,
    averagePrice: 109,
    salesPerMonth: 100,
    revenue: {
      month1: 10900,
      month3: 19620,
      month6: 32700,
      month12: 54500,
      year1Total: 392400,
    },
    costs: {
      printful: 105648,     // ~27% of revenue
      marketing: 39240,     // 10% of revenue
      infrastructure: 1200, // Scaled services
      total: 146088,
    },
    profit: {
      gross: 286752,        // 73% margin
      net: 246312,          // 63% net margin
    },
  },

  // Aggressive estimate
  aggressive: {
    activeProducts: 75,
    averagePrice: 129,
    salesPerMonth: 250,
    revenue: {
      month1: 32250,
      month3: 58050,
      month6: 96750,
      month12: 161250,
      year1Total: 1161000,
    },
    costs: {
      printful: 313470,     // ~27% of revenue
      marketing: 116100,    // 10% of revenue
      infrastructure: 2400, // Full stack
      total: 431970,
    },
    profit: {
      gross: 847530,        // 73% margin
      net: 729030,          // 63% net margin
    },
  },
}
```

**Key Assumptions:**
- Average profit margin: 73% (73% of revenue after Printful costs)
- Marketing spend: 10% of revenue
- Infrastructure: $43/mo base + scaling costs
- Sales growth: 80% quarter-over-quarter in first year
- Average order value: $89-129 (1.2-1.5 items per order)

### Break-Even Analysis

```typescript
const BREAK_EVEN = {
  fixedCosts: {
    infrastructure: 516,    // Annual
    domain: 15,             // Annual
    tools: 240,             // Annual (Klaviyo, etc.)
    total: 771,
  },

  variableCosts: {
    printfulPercentage: 0.27, // 27% of revenue
    marketingPercentage: 0.10, // 10% of revenue
    total: 0.37, // 37% of revenue
  },

  contributionMargin: 0.63, // 63% of revenue goes to profit

  breakEvenRevenue: 771 / 0.63, // $1,224 monthly
  breakEvenUnits: 1224 / 89,   // ~14 units per month at $89 avg

  // With buying agent reducing manual work
  timeToBreakEven: '2-3 weeks',

  // Without agent (manual work)
  timeToBreakEvenManual: '6-8 weeks',
}
```

### ROI of Buying Agent vs Manual

**Comparison:**

| Metric | Manual Generator | Buying Agent | Improvement |
|--------|------------------|--------------|-------------|
| **Time Investment** |
| Product selection | 2 hours/week | 0 hours/week | -2 hours |
| Design generation | 1 hour/week | 0 hours/week | -1 hour |
| Mockup creation | 3 hours/week | 0 hours/week | -3 hours |
| Pricing optimization | 1 hour/week | 0 hours/week | -1 hour |
| Inventory management | 2 hours/week | 0 hours/week | -2 hours |
| **Total Time Saved** | 9 hours/week | Automated | **-9 hrs/wk** |
| **Revenue Impact** |
| Products added/month | 10-15 | 30-50 | +200% |
| Avg profit margin | 60-65% | 70-75% | +10-15% |
| Collection launches/year | 2-3 | 4 seasonal + 4 LE | +4x |
| **Financial** |
| Annual time cost ($50/hr) | $23,400 | $2,000 dev time | **-$21,400** |
| Revenue (Year 1) | $133,900 | $392,400 | **+$258,500** |
| Net profit (Year 1) | $84,154 | $246,312 | **+$162,158** |
| **ROI** | 360% | 12,216% | **+3,290%** |

**Agent Development Cost:**
- Week 1-2: 40 hours development @ $50/hr = $2,000
- Ongoing: $0 (automated)

**Agent Payback Period:**
- Development cost: $2,000
- Time savings: $450/week ($50/hr × 9 hrs)
- Payback: **4.4 weeks**

**5-Year Projection:**
- Manual approach: $420,770 profit
- Agent approach: $1,231,560 profit
- **Difference: $810,790** (193% increase)

---

## Success Metrics & KPIs

### Product Performance Metrics

```typescript
const PRODUCT_KPIS = {
  // Individual product health
  productHealth: {
    excellent: {
      salesPerMonth: '>10',
      conversionRate: '>5%',
      profitMargin: '>70%',
      viewToSale: '<20 views per sale',
    },
    good: {
      salesPerMonth: '5-10',
      conversionRate: '3-5%',
      profitMargin: '60-70%',
      viewToSale: '20-40 views per sale',
    },
    poor: {
      salesPerMonth: '<5',
      conversionRate: '<3%',
      profitMargin: '<60%',
      viewToSale: '>40 views per sale',
    },
  },

  // Portfolio-wide metrics
  portfolio: {
    targets: {
      activeProducts: '30-50',
      bestsellers: '>20% of products',
      profitMargin: '>70% average',
      inventoryTurnover: '60 days average',
      newProductSuccess: '>50% become active',
    },
  },
}
```

### Agent Performance Metrics

```typescript
const AGENT_KPIS = {
  accuracy: {
    // How often agent recommendations become bestsellers
    predictionAccuracy: '>60%',

    // Percentage of agent-selected products that succeed
    successRate: '>70%',

    // How well agent prices products
    pricingOptimization: '>90% within 10% of optimal',
  },

  efficiency: {
    // Time from catalog analysis to product launch
    timeToMarket: '<7 days',

    // Percentage of decisions requiring manual override
    autonomyRate: '>80%',

    // Products added per week
    throughput: '5-10 products/week',
  },

  revenue: {
    // Revenue from agent-selected products vs manual
    revenueIncrease: '>50% vs manual',

    // Profit margin improvement
    marginIncrease: '>10% vs manual',

    // Inventory efficiency
    inventoryTurnover: '<60 days',
  },
}
```

### Marketing Performance Metrics

```typescript
const MARKETING_KPIS = {
  collections: {
    // Seasonal collection performance
    collectionSales: '>$10K per collection',
    collectionConversion: '>4%',
    emailOpenRate: '>30%',
    emailClickRate: '>5%',
  },

  limitedEditions: {
    // Limited edition performance
    sellOutRate: '>80% in 30 days',
    premiumPricing: '+20% vs regular',
    emailConversion: '>8%',
    socialEngagement: '>500 interactions per drop',
  },

  bundles: {
    // Bundle performance
    bundleAttachRate: '>15% of orders',
    bundleAOV: '>2x single item',
    bundleMargin: '>75%',
  },
}
```

---

## Technical Implementation Details

### File Structure

```
/Users/brandon/Webdesigner/
├── app/
│   ├── admin/
│   │   ├── buying-agent/
│   │   │   ├── page.tsx                 # Main dashboard (REPLACES /generate)
│   │   │   ├── decisions/page.tsx       # Review agent decisions
│   │   │   ├── collections/page.tsx     # Plan collections
│   │   │   ├── analytics/page.tsx       # Performance analytics
│   │   │   └── settings/page.tsx        # Agent configuration
│   │   └── products/
│   │       └── generate/                # DEPRECATED - redirect to /buying-agent
│   └── api/
│       ├── agent/
│       │   ├── analyze-catalog/route.ts # Trigger catalog analysis
│       │   ├── add-products/route.ts    # Add products to store
│       │   ├── manage-inventory/route.ts # Lifecycle management
│       │   ├── plan-collection/route.ts  # Plan seasonal collection
│       │   └── generate-report/route.ts  # Performance reports
│       └── cron/
│           └── buying-agent/route.ts     # Scheduled tasks
│
├── lib/
│   ├── agent/
│   │   ├── controller.ts                 # Main agent controller
│   │   ├── catalog-analyzer.ts           # Catalog analysis
│   │   ├── curation-engine.ts            # Product curation
│   │   ├── pricing-optimizer.ts          # Pricing calculations
│   │   ├── inventory-manager.ts          # Lifecycle management
│   │   ├── mockup-generator.ts           # Mockup automation
│   │   ├── marketing-automation.ts       # Marketing workflows
│   │   └── workflows.ts                  # Automated tasks
│   ├── db/
│   │   └── schema/
│   │       └── buying-agent.ts           # Database schema
│   └── printful-client.ts                # Existing Printful API
│
├── docs/
│   └── printful/
│       ├── BUYING-AGENT-STRATEGY.md      # This document
│       ├── AGENT-IMPLEMENTATION.md       # Technical implementation
│       ├── MARKETING-PLAYBOOK.md         # Marketing strategies
│       └── PERFORMANCE-METRICS.md        # KPIs and analytics
│
└── data/
    ├── curated-products.json             # DEPRECATED
    └── agent-products.json               # Agent-managed products
```

### Environment Variables Needed

```bash
# Existing
PRINTFUL_API_KEY=your_api_key
PRINTFUL_STORE_ID=your_store_id
OPENAI_API_KEY=your_openai_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# New for Agent
CRON_SECRET=your_cron_secret_for_scheduled_tasks
AGENT_AUTO_APPROVE=false  # Manual approval required by default
AGENT_MAX_PRODUCTS=50     # Maximum active products
AGENT_MIN_SCORE=60        # Minimum score to recommend product
AGENT_PROFIT_TARGET=70    # Target profit margin percentage
```

### API Endpoints

```typescript
// Agent Control
GET  /api/agent/status              // Agent health and stats
POST /api/agent/analyze-catalog     // Trigger catalog analysis
POST /api/agent/add-products        // Add products to store
POST /api/agent/manage-inventory    // Run inventory management
POST /api/agent/plan-collection     // Plan seasonal collection
GET  /api/agent/generate-report     // Get performance report

// Agent Decisions (Admin Review)
GET  /api/agent/decisions/pending   // Get pending decisions
POST /api/agent/decisions/approve   // Approve decisions
POST /api/agent/decisions/reject    // Reject decisions

// Scheduled Tasks (Cron)
GET /api/cron/buying-agent?workflow=daily
GET /api/cron/buying-agent?workflow=weekly
GET /api/cron/buying-agent?workflow=monthly
```

### Database Schema

```sql
-- Agent Products (replaces curated-products.json)
CREATE TABLE agent_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  printful_product_id INTEGER NOT NULL,
  printful_variant_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  quality_tier TEXT NOT NULL,
  printful_cost DECIMAL(10,2),
  luxury_price DECIMAL(10,2),
  profit_margin DECIMAL(5,2),
  status TEXT DEFAULT 'active',
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  design_url TEXT,
  mockup_urls JSONB,
  tags JSONB,
  launch_date TIMESTAMP DEFAULT NOW(),
  last_sale TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Catalog Analysis (agent decision log)
CREATE TABLE catalog_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  printful_product_id INTEGER NOT NULL,
  agent_score INTEGER,
  quality_tier TEXT,
  profit_margin DECIMAL(5,2),
  trending BOOLEAN DEFAULT FALSE,
  seasonal BOOLEAN DEFAULT FALSE,
  recommended_for_store BOOLEAN DEFAULT FALSE,
  analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Seasonal Collections
CREATE TABLE seasonal_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  year INTEGER NOT NULL,
  launch_date TIMESTAMP,
  end_date TIMESTAMP,
  theme TEXT,
  status TEXT DEFAULT 'planned',
  products JSONB,
  sales_total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Performance Metrics
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,2),
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Migration Plan

### From Current Generator to Buying Agent

**Step 1: Deploy Agent Infrastructure (Day 1)**
- Create database schema
- Deploy agent services
- Set up cron jobs
- Configure environment variables

**Step 2: Run Initial Catalog Analysis (Day 2)**
- Analyze entire Printful catalog
- Score all products
- Generate recommendations
- Save to database

**Step 3: Migrate Existing Products (Day 3)**
- Import products from `curated-products.json`
- Associate with Printful IDs
- Calculate metrics
- Populate agent database

**Step 4: Launch Agent Dashboard (Day 4)**
- Deploy new admin interface
- Set up decision review workflow
- Configure notifications
- Train admin user

**Step 5: Deprecate Old Generator (Day 5)**
- Redirect `/admin/products/generate` to `/admin/buying-agent`
- Archive old code
- Update documentation
- Announce to stakeholders

**Step 6: Enable Automation (Day 6-7)**
- Turn on daily tasks
- Enable weekly analysis
- Set up monthly collections
- Monitor and optimize

---

## Next Steps

### Immediate Actions (This Week)

1. **Review & Approve Strategy**
   - Review this document
   - Approve approach
   - Set budget and timeline

2. **Set Up Development Environment**
   - Create agent directory structure
   - Set up database schema
   - Configure environment variables

3. **Build MVP (Minimum Viable Agent)**
   - Catalog analyzer only
   - Manual product addition
   - Basic dashboard

### Phase 1 Goals (Week 1-2)

1. **Working Catalog Analyzer**
   - Fetch Printful catalog
   - Score products
   - Generate recommendations

2. **Product Addition Workflow**
   - Add products from recommendations
   - Generate mockups
   - Calculate pricing

3. **Basic Dashboard**
   - View recommendations
   - Approve/reject products
   - See performance stats

### Phase 2 Goals (Week 3-4)

1. **Full Automation**
   - Daily/weekly tasks
   - Inventory management
   - Seasonal planning

2. **Marketing Integration**
   - Email workflows
   - Collection launches
   - Limited edition drops

3. **Performance Tracking**
   - Analytics dashboard
   - KPI monitoring
   - ROI reporting

---

## Conclusion

The **Printful Buying Agent** transforms Brandon Mills' e-commerce platform from a manual, time-intensive operation into an intelligent, self-optimizing revenue engine.

**Key Benefits:**

1. **Time Savings**: 9 hours/week freed up for creative work
2. **Revenue Growth**: 3x revenue potential in Year 1
3. **Profit Optimization**: 10-15% higher margins through intelligent pricing
4. **Brand Coherence**: Automated curation maintains luxury positioning
5. **Scalability**: System can handle 10x growth without additional labor

**Investment vs Return:**

- Development cost: $2,000 (one-time)
- Time saved: $23,400/year
- Additional profit: $162,158/year (Year 1)
- **ROI: 8,008% in Year 1**

**The agent doesn't just replace the manual generator—it creates an entirely new capability: a continuously learning, market-aware, profit-optimizing system that works 24/7 to build Brandon Mills' luxury merchandise empire.**

---

**Ready to build the future of luxury e-commerce automation?**

Let's replace that generator. 🚀

---

**Document Prepared By:** Agent 4 - Growth Marketer (E-commerce Integration Architect)
**Date:** November 5, 2025
**Version:** 1.0
**Status:** Strategic Blueprint - Awaiting Approval
