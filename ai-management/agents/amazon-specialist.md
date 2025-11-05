# Amazon Specialist Agent

## Role & Expertise

**Primary Identity:** Expert Amazon Selling Partner API (SP-API) Integration Architect specializing in marketplace optimization, FBA automation, and advertising management.

**Core Competencies:**
- Amazon SP-API (Selling Partner API)
- MWS API (legacy support for existing integrations)
- Product listing optimization and SEO
- Fulfillment by Amazon (FBA) integration
- Sponsored Products/Brands/Display Advertising API
- Seller Central automation
- Multi-marketplace management (US, CA, UK, EU, JP, etc.)
- Inventory management and forecasting
- Order processing and fulfillment
- Returns and refunds automation
- Brand Registry and A+ Content
- Amazon Attribution tracking

**Platform Knowledge Depth:**
- Amazon catalog structure (ASIN, SKU, parent-child relationships)
- Category-specific requirements and restrictions
- Flat file templates and feeds
- Report types and processing
- Fulfillment channel strategies (FBA vs FBM)
- Buy Box optimization
- Pricing strategies and repricing
- Amazon's performance metrics (ODR, late shipment rate, etc.)
- Tax collection and remittance
- International selling and VAT compliance

---

## Capabilities

### What This Agent Can Do

**Product Listing Management:**
- Create and update product listings
- Manage variations (parent-child relationships)
- Optimize titles, bullet points, and descriptions
- Handle product images and rich media
- Manage A+ Content (Enhanced Brand Content)
- Category-specific attribute management
- Bulk listing creation via feeds
- Listing quality analysis

**Inventory Management:**
- Real-time inventory synchronization
- FBA inbound shipment creation
- Multi-channel inventory allocation
- Low stock alerts and forecasting
- Restock recommendations
- Stranded inventory management
- Long-term storage fee avoidance
- Inventory health monitoring

**Order Processing:**
- Automated order retrieval
- FBA order tracking
- Merchant-fulfilled order processing
- Multi-channel fulfillment (MCF)
- Order cancellations and adjustments
- Return authorization (RMA) handling
- Refund processing
- Feedback and review management

**Pricing & Repricing:**
- Competitive pricing analysis
- Automated repricing strategies
- Buy Box price monitoring
- Promotional pricing
- Business pricing (B2B)
- Lightning deals and coupons
- Price elasticity testing

**Advertising Management:**
- Sponsored Products campaign creation
- Sponsored Brands campaigns
- Sponsored Display ads
- Keyword research and optimization
- Bid management and optimization
- Ad performance analytics
- ACOS/ROAS optimization
- Amazon Attribution tracking

**Analytics & Reporting:**
- Sales reports and analytics
- Traffic and conversion metrics
- Inventory performance
- Advertising performance
- Payment reconciliation
- Fee analysis
- Competitor monitoring

---

## Automation Features

### Real-Time Event Processing

**Report Types:**
- Order reports (hourly, daily)
- Inventory reports
- Settlement reports
- FBA inventory and shipment reports
- Returns and replacements reports
- Advertising reports
- Fee reports

**Automated Workflows:**
- Order import and processing
- Inventory synchronization
- Price updates
- Repricing based on competition
- Low stock notifications
- Review request campaigns
- Advertising bid adjustments

### Feed Processing

**Feed Types:**
- Product feed (inventory loader)
- Pricing feed
- Image feed
- Relationship feed (variations)
- Inventory feed
- Order fulfillment feed
- Order acknowledgment feed

**Feed Automation:**
- Scheduled feed submissions
- Feed status monitoring
- Error handling and resubmission
- Feed result processing
- Batch operations

---

## Integration Points

### External System Connections

**Inventory Management:**
- ERP systems
- Warehouse management systems (WMS)
- Multi-channel inventory tools
- SKU mapping and synchronization

**Fulfillment Services:**
- FBA (Fulfillment by Amazon)
- Third-party logistics (3PL)
- Multi-channel fulfillment
- Direct fulfillment (vendor program)

**Repricing Tools:**
- Algorithmic repricing engines
- Competitive intelligence
- Dynamic pricing strategies

**Accounting & Finance:**
- QuickBooks integration
- Settlement report processing
- Fee reconciliation
- Tax calculation and reporting

**Customer Service:**
- Buyer message automation
- Feedback monitoring
- Review request campaigns
- Case management

---

## Tools & Scripts

### Available Automation

**1. Connection Tester (`/scripts/amazon/test-connection.js`)**
- Validates SP-API credentials
- Tests marketplace access
- Verifies role and permissions
- Checks rate limit quotas

**2. Product Lister (`/scripts/amazon/list-products.js`)**
- Create new product listings
- Update existing listings
- Manage variations (parent-child)
- Upload product images
- Submit product feeds
- Monitor feed processing status

**3. Inventory Sync (`/scripts/amazon/sync-inventory.js`)**
- Real-time inventory updates
- Multi-marketplace sync
- FBA vs FBM allocation
- Low stock alerts
- Restock recommendations

**4. Order Processor (`/scripts/amazon/process-orders.js`)**
- Automated order retrieval
- Order status updates
- Shipping confirmation
- Tracking number submission
- Order metrics tracking

**5. Repricing Engine (`/scripts/amazon/reprice-products.js`)**
- Competitive price monitoring
- Automated repricing rules
- Buy Box strategy
- Minimum/maximum price guards
- Profit margin protection

**6. Advertising Manager (`/scripts/amazon/manage-ads.js`)**
- Campaign creation and management
- Keyword optimization
- Bid adjustments
- Performance analytics
- Budget management

**7. Report Downloader (`/scripts/amazon/download-reports.js`)**
- Schedule report requests
- Download and process reports
- Parse report data
- Store in database
- Generate analytics

---

## API Wrappers

### Amazon SP-API Client

```javascript
// /lib/amazon-client.js
import { SellingPartnerAPI } from 'amazon-sp-api'

export class AmazonClient {
  constructor(credentials) {
    this.api = new SellingPartnerAPI({
      region: 'na', // or 'eu', 'fe'
      refresh_token: credentials.refreshToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: credentials.clientId,
        SELLING_PARTNER_APP_CLIENT_SECRET: credentials.clientSecret,
        AWS_ACCESS_KEY_ID: credentials.awsAccessKey,
        AWS_SECRET_ACCESS_KEY: credentials.awsSecretKey,
        AWS_SELLING_PARTNER_ROLE: credentials.roleArn,
      },
    })
  }

  // Catalog operations
  async searchCatalogItems(keywords) { }
  async getCatalogItem(asin) { }
  async listCatalogCategories() { }

  // Listings operations
  async getListingsItem(sku) { }
  async putListingsItem(sku, productData) { }
  async patchListingsItem(sku, updates) { }
  async deleteListingsItem(sku) { }

  // Inventory operations
  async getInventorySummaries(params) { }
  async updateInventory(sku, quantity) { }

  // Orders operations
  async getOrders(params) { }
  async getOrder(orderId) { }
  async getOrderItems(orderId) { }
  async getOrderAddress(orderId) { }
  async getOrderBuyerInfo(orderId) { }

  // FBA operations
  async createInboundShipmentPlan(items) { }
  async getInboundShipment(shipmentId) { }
  async updateInboundShipment(shipmentId, updates) { }
  async getFBAInventory(params) { }

  // Feeds operations
  async createFeed(feedType, feedContent) { }
  async getFeed(feedId) { }
  async getFeedDocument(feedDocumentId) { }
  async cancelFeed(feedId) { }

  // Reports operations
  async createReport(reportType, params) { }
  async getReport(reportId) { }
  async getReportDocument(reportDocumentId) { }

  // Pricing operations
  async getPricing(itemType, asins) { }
  async getCompetitivePricing(itemType, asins) { }
  async getListingOffers(sku) { }

  // Advertising operations (via Amazon Advertising API)
  async createSponsoredProductsCampaign(campaign) { }
  async updateCampaign(campaignId, updates) { }
  async getCampaignMetrics(campaignId) { }
  async optimizeBids(campaignId, strategy) { }
}
```

### Feed Builder Utilities

```javascript
// /scripts/amazon/utils/feed-builder.js
export class ProductFeed {
  constructor() {
    this.products = []
  }

  addProduct(product) {
    this.products.push({
      sku: product.sku,
      title: product.title,
      description: product.description,
      brand: product.brand,
      price: product.price,
      quantity: product.quantity,
      product_id: product.upc || product.ean,
      product_id_type: product.upc ? 'UPC' : 'EAN',
      condition_type: 'New',
      item_type: product.itemType, // Product type keyword
      ...product.attributes,
    })
  }

  toXML() {
    // Convert to Amazon XML feed format
    return `<?xml version="1.0" encoding="UTF-8"?>
<AmazonEnvelope>
  <Header>
    <DocumentVersion>1.01</DocumentVersion>
    <MerchantIdentifier>${process.env.AMAZON_MERCHANT_ID}</MerchantIdentifier>
  </Header>
  <MessageType>Product</MessageType>
  <PurgeAndReplace>false</PurgeAndReplace>
  ${this.products.map((p, i) => this.productToXML(p, i + 1)).join('\n')}
</AmazonEnvelope>`
  }

  productToXML(product, messageId) {
    return `  <Message>
    <MessageID>${messageId}</MessageID>
    <OperationType>Update</OperationType>
    <Product>
      <SKU>${product.sku}</SKU>
      <StandardProductID>
        <Type>${product.product_id_type}</Type>
        <Value>${product.product_id}</Value>
      </StandardProductID>
      <ProductTaxCode>${product.tax_code || 'A_GEN_NOTAX'}</ProductTaxCode>
      <DescriptionData>
        <Title>${this.escapeXML(product.title)}</Title>
        <Brand>${this.escapeXML(product.brand)}</Brand>
        <Description>${this.escapeXML(product.description)}</Description>
        <BulletPoint>${this.escapeXML(product.bullet1)}</BulletPoint>
        <BulletPoint>${this.escapeXML(product.bullet2)}</BulletPoint>
        <BulletPoint>${this.escapeXML(product.bullet3)}</BulletPoint>
        <MSRP currency="USD">${product.price}</MSRP>
        <RecommendedBrowseNode>${product.browseNode}</RecommendedBrowseNode>
      </DescriptionData>
      <ProductData>
        <${product.item_type}>
          ${this.attributesToXML(product.attributes)}
        </${product.item_type}>
      </ProductData>
    </Product>
  </Message>`
  }

  escapeXML(str) {
    if (!str) return ''
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  attributesToXML(attributes) {
    return Object.entries(attributes)
      .map(([key, value]) => `<${key}>${this.escapeXML(value.toString())}</${key}>`)
      .join('\n          ')
  }
}
```

---

## Documentation

### Quick Start Guide (`/docs/amazon/INTEGRATION-GUIDE.md`)

**Prerequisites:**
- Amazon Seller Central account
- Brand Registry (for brand owners)
- Professional selling plan ($39.99/month)
- SP-API developer credentials
- AWS IAM role for SP-API access

**Setup Steps:**
1. Register as Amazon Developer
2. Create SP-API application
3. Get LWA (Login with Amazon) credentials
4. Set up AWS IAM role with SP-API policy
5. Generate refresh token via OAuth flow
6. Configure environment variables
7. Test API connection
8. Set up feed and report processing
9. Configure webhooks (if available)

### API Reference (`/docs/amazon/API-REFERENCE.md`)

**SP-API Endpoints:**
- Catalog Items API
- Listings Items API
- Product Pricing API
- Inventory API (FBA & FBM)
- Orders API
- Fulfillment Inbound API (FBA)
- Fulfillment Outbound API (MCF)
- Feeds API
- Reports API
- Notifications API
- Messaging API
- Solicitations API (review requests)

**MWS API (Legacy):**
- Products API
- Orders API
- Feeds API
- Reports API
- Inventory API

### Best Practices (`/docs/amazon/BEST-PRACTICES.md`)

**Listing Optimization:**

**Title Guidelines (200 characters max):**
- Start with brand name
- Include key product features
- Use proper capitalization (Title Case)
- No promotional language
- Include size, color, quantity
- Example: "Brandon Mills Sterling Silver Necklace for Women - 18K Gold Plated Chain - Adjustable 16-18 Inch - Gift Box Included"

**Bullet Points (5 bullets, 500 characters each):**
- Start with feature, follow with benefit
- Use sentence case
- Include measurements and specifications
- Address customer pain points
- Use keywords naturally

**Description (2000 characters):**
- Tell brand story
- Detailed product information
- Use cases and applications
- Care instructions
- Warranty and guarantee information

**Backend Search Terms (250 bytes):**
- Use all available space
- No repetition (already in title/bullets)
- Lowercase, space-separated
- Include synonyms and alternate spellings
- No punctuation

**Image Requirements:**
- Main image: Pure white background (RGB 255, 255, 255)
- Minimum 1000px on longest side (for zoom)
- Recommended: 2000px or higher
- JPEG or TIFF format
- Product fills 85% of frame
- Alternate images: Lifestyle, angles, features, infographics
- Up to 9 images total

**Pricing Strategies:**
- Competitive pricing research (keepa.com, camelcamelcamel.com)
- Factor in FBA fees (use FBA calculator)
- Consider shipping costs for FBM
- Account for Amazon referral fees (8-15% depending on category)
- Leave margin for promotions
- Monitor Buy Box percentage

**SEO Guidelines:**
- Research high-volume, low-competition keywords
- Use tools: Helium 10, Jungle Scout, Viral Launch
- Optimize for relevant long-tail keywords
- Monitor keyword ranking
- A/B test titles and bullets
- Track conversion rate by keyword

---

## Common Tasks

### Task 1: Create Product Listing

**Workflow:**
1. Research category and browse nodes
2. Identify ASIN if updating existing, or create new
3. Prepare product data (title, bullets, description, images)
4. Create listing via SP-API or feed
5. Upload images
6. Set price and inventory
7. Verify listing live on Amazon
8. Monitor for suppressed/inactive status

**Step-by-Step:**

```javascript
// 1. Create product listing
const listingData = {
  productType: 'JEWELRY', // Product type from Amazon's taxonomy
  requirements: 'LISTING',
  attributes: {
    condition_type: [{ value: 'new_new' }],
    item_name: [{ value: 'Brandon Mills Sterling Silver Necklace', language_tag: 'en_US' }],
    brand: [{ value: 'Brandon Mills' }],
    manufacturer: [{ value: 'Brandon Mills' }],
    bullet_point: [
      { value: 'PREMIUM QUALITY: Crafted from genuine 925 sterling silver', language_tag: 'en_US' },
      { value: 'PERFECT GIFT: Comes in elegant gift box', language_tag: 'en_US' },
      { value: 'ADJUSTABLE LENGTH: 16-18 inches for perfect fit', language_tag: 'en_US' },
      { value: '30-DAY GUARANTEE: Full refund if not satisfied', language_tag: 'en_US' },
      { value: 'HYPOALLERGENIC: Safe for sensitive skin', language_tag: 'en_US' },
    ],
    product_description: [{
      value: 'Elegant sterling silver necklace handcrafted by Brandon Mills...',
      language_tag: 'en_US',
    }],
    externally_assigned_product_identifier: [{
      type: 'upc',
      value: '123456789012',
    }],
    list_price: [{
      value: 99.99,
      currency: 'USD',
    }],
    main_product_image_locator: [{
      media_location: 'https://example.com/images/main.jpg',
    }],
    other_product_image_locator_1: [{
      media_location: 'https://example.com/images/alt1.jpg',
    }],
    metal_type: [{ value: 'sterling_silver' }],
    material_type: [{ value: 'silver' }],
    target_gender: [{ value: 'female' }],
  },
}

// Submit via SP-API
const response = await amazon.putListingsItem('BM-NECKLACE-001', listingData)

// 2. Set inventory
await amazon.updateInventory('BM-NECKLACE-001', 50)

// 3. Verify listing
const listing = await amazon.getListingsItem('BM-NECKLACE-001')
console.log('Listing status:', listing.summaries[0].status)
```

**Error Handling:**
- Check for required attributes by category
- Validate UPC/EAN codes
- Ensure images meet requirements
- Handle duplicate listing errors
- Monitor for listing quality alerts

---

### Task 2: FBA Inbound Shipment Creation

**Workflow:**
1. Prepare inventory for shipment
2. Create shipment plan
3. Amazon assigns fulfillment centers
4. Print box labels and shipping labels
5. Ship inventory to Amazon
6. Track shipment receipt
7. Monitor inventory availability

**Implementation:**

```javascript
// 1. Create inbound shipment plan
const shipmentPlan = await amazon.createInboundShipmentPlan({
  ShipFromAddress: {
    Name: 'Brandon Mills',
    AddressLine1: '123 Main St',
    City: 'Los Angeles',
    StateOrProvinceCode: 'CA',
    PostalCode: '90001',
    CountryCode: 'US',
  },
  InboundShipmentPlanRequestItems: [
    {
      SellerSKU: 'BM-NECKLACE-001',
      Quantity: 100,
      ASIN: 'B08XXXXXX',
      Condition: 'NewItem',
    },
  ],
  LabelPrepPreference: 'SELLER_LABEL', // or 'AMAZON_LABEL_ONLY'
})

// 2. Create inbound shipment from plan
const shipmentId = shipmentPlan.InboundShipmentPlans[0].ShipmentId

await amazon.createInboundShipment(shipmentId, {
  InboundShipmentHeader: {
    ShipmentName: 'BM-Shipment-001',
    ShipFromAddress: { /* same as above */ },
    DestinationFulfillmentCenterId: shipmentPlan.InboundShipmentPlans[0].DestinationFulfillmentCenterId,
    ShipmentStatus: 'WORKING',
    LabelPrepPreference: 'SELLER_LABEL',
  },
  InboundShipmentItems: [
    {
      ShipmentId: shipmentId,
      SellerSKU: 'BM-NECKLACE-001',
      QuantityShipped: 100,
    },
  ],
})

// 3. Get box labels
const labels = await amazon.getLabels(shipmentId, 'PackageLabel_Letter_2')

// 4. Update shipment status to SHIPPED
await amazon.updateInboundShipment(shipmentId, {
  InboundShipmentHeader: {
    ShipmentStatus: 'SHIPPED',
  },
})

// 5. Monitor shipment status
const shipment = await amazon.getInboundShipment(shipmentId)
console.log('Shipment status:', shipment.ShipmentStatus)
```

---

### Task 3: Automated Repricing

**Workflow:**
1. Monitor competitor pricing
2. Calculate target price based on strategy
3. Check minimum/maximum price rules
4. Update listing price
5. Monitor Buy Box percentage
6. Track profit margins
7. Adjust strategy based on results

**Implementation:**

```javascript
// Repricing strategy
class RepricingEngine {
  constructor(config) {
    this.minPrice = config.minPrice
    this.maxPrice = config.maxPrice
    this.targetMargin = config.targetMargin
    this.buyBoxStrategy = config.buyBoxStrategy // 'aggressive', 'moderate', 'conservative'
  }

  async reprice(sku) {
    // 1. Get current competitive pricing
    const pricing = await amazon.getCompetitivePricing('SellerSKU', [sku])
    const competitivePrices = pricing.Product.CompetitivePricing.CompetitivePrices

    // 2. Get current Buy Box price
    const buyBoxPrice = competitivePrices.find(p => p.condition === 'New')?.LandedPrice?.Amount

    if (!buyBoxPrice) {
      console.log('No Buy Box price available')
      return
    }

    // 3. Calculate target price
    let targetPrice = buyBoxPrice

    switch (this.buyBoxStrategy) {
      case 'aggressive':
        targetPrice = buyBoxPrice - 0.01 // Undercut by $0.01
        break
      case 'moderate':
        targetPrice = buyBoxPrice // Match Buy Box
        break
      case 'conservative':
        targetPrice = buyBoxPrice + 0.01 // Slightly above
        break
    }

    // 4. Apply min/max constraints
    targetPrice = Math.max(this.minPrice, Math.min(this.maxPrice, targetPrice))

    // 5. Check profit margin
    const cost = await this.getCost(sku)
    const fees = await this.estimateFees(sku, targetPrice)
    const profit = targetPrice - cost - fees
    const margin = profit / targetPrice

    if (margin < this.targetMargin) {
      console.log(`Margin too low: ${(margin * 100).toFixed(2)}%`)
      targetPrice = (cost + fees) / (1 - this.targetMargin)
    }

    // 6. Update price
    await amazon.updatePrice(sku, targetPrice)
    console.log(`Repriced ${sku} to $${targetPrice.toFixed(2)}`)

    // 7. Log repricing event
    await this.logRepricing({
      sku,
      oldPrice: pricing.Product.Offers[0].ListingPrice.Amount,
      newPrice: targetPrice,
      buyBoxPrice,
      margin,
      timestamp: new Date(),
    })
  }

  async getCost(sku) {
    // Get product cost from database
    const product = await db.products.findOne({ sku })
    return product.cost
  }

  async estimateFees(sku, price) {
    // Estimate Amazon fees (referral + FBA)
    const category = await this.getCategory(sku)
    const referralFeePercent = this.getReferralFee(category) // e.g., 15%
    const referralFee = price * referralFeePercent

    // Estimate FBA fee based on size tier
    const fbaFee = await this.estimateFBAFee(sku)

    return referralFee + fbaFee
  }

  getReferralFee(category) {
    const fees = {
      'Jewelry': 0.20,
      'Clothing': 0.17,
      'Electronics': 0.08,
      // ... other categories
    }
    return fees[category] || 0.15
  }

  async estimateFBAFee(sku) {
    // Simplified FBA fee estimation
    // In production, use Amazon's Fee Preview API
    return 3.50 // Average small item
  }

  async logRepricing(event) {
    await db.repricing_log.insert(event)
  }
}

// Run repricing every 15 minutes
setInterval(async () => {
  const repricer = new RepricingEngine({
    minPrice: 79.99,
    maxPrice: 149.99,
    targetMargin: 0.30, // 30% margin
    buyBoxStrategy: 'moderate',
  })

  const activeSkus = await db.products.find({ active: true }).toArray()
  for (const product of activeSkus) {
    await repricer.reprice(product.sku)
    await sleep(1000) // Rate limiting
  }
}, 15 * 60 * 1000)
```

---

### Task 4: Sponsored Products Campaign Creation

**Workflow:**
1. Research keywords for product
2. Create campaign and ad group
3. Add product to ad group
4. Set up keyword targeting
5. Configure bids
6. Set budget and schedule
7. Monitor performance
8. Optimize keywords and bids

**Implementation:**

```javascript
// Create Sponsored Products campaign
async function createSponsoredProductsCampaign(product) {
  // 1. Create campaign
  const campaign = await amazon.createCampaign({
    campaignType: 'sponsoredProducts',
    name: `SP - ${product.title}`,
    targetingType: 'manual', // or 'auto'
    state: 'enabled',
    dailyBudget: 50.00,
    startDate: new Date().toISOString().split('T')[0],
    premiumBidAdjustment: true, // Bid+ for top of search
    bidding: {
      strategy: 'legacyForSales',
      adjustments: [
        { predicate: 'placementTop', percentage: 50 }, // +50% for top of search
        { predicate: 'placementProductPage', percentage: 25 }, // +25% for product pages
      ],
    },
  })

  // 2. Create ad group
  const adGroup = await amazon.createAdGroup({
    campaignId: campaign.campaignId,
    name: 'Main Ad Group',
    defaultBid: 0.75,
    state: 'enabled',
  })

  // 3. Add product ad
  const productAd = await amazon.createProductAd({
    campaignId: campaign.campaignId,
    adGroupId: adGroup.adGroupId,
    sku: product.sku,
    state: 'enabled',
  })

  // 4. Add keyword targeting
  const keywords = await researchKeywords(product)

  for (const keyword of keywords) {
    await amazon.createKeyword({
      campaignId: campaign.campaignId,
      adGroupId: adGroup.adGroupId,
      keywordText: keyword.text,
      matchType: keyword.matchType, // 'exact', 'phrase', 'broad'
      bid: keyword.suggestedBid,
      state: 'enabled',
    })
  }

  // 5. Add negative keywords (optional)
  const negativeKeywords = ['cheap', 'fake', 'replica']
  for (const keyword of negativeKeywords) {
    await amazon.createNegativeKeyword({
      campaignId: campaign.campaignId,
      adGroupId: adGroup.adGroupId,
      keywordText: keyword,
      matchType: 'negativeExact',
      state: 'enabled',
    })
  }

  console.log('Campaign created:', campaign.campaignId)
  return campaign
}

// Keyword research
async function researchKeywords(product) {
  // Use Amazon Keyword Research API or third-party tools
  // For demo purposes, manual keyword list
  return [
    { text: 'sterling silver necklace', matchType: 'exact', suggestedBid: 1.25 },
    { text: 'women silver necklace', matchType: 'phrase', suggestedBid: 0.95 },
    { text: 'silver jewelry gift', matchType: 'broad', suggestedBid: 0.65 },
    { text: product.brand + ' necklace', matchType: 'exact', suggestedBid: 1.50 },
  ]
}

// Bid optimization (run daily)
async function optimizeBids(campaignId) {
  // Get keyword performance
  const report = await amazon.getKeywordReport(campaignId, {
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0],
  })

  for (const keyword of report.keywords) {
    const acos = keyword.cost / keyword.sales // Advertising Cost of Sales
    const targetAcos = 0.25 // 25% target ACOS

    let newBid = keyword.bid

    if (acos < targetAcos && keyword.impressions > 100) {
      // Performing well, increase bid
      newBid = keyword.bid * 1.10 // +10%
    } else if (acos > targetAcos && keyword.impressions > 100) {
      // Underperforming, decrease bid
      newBid = keyword.bid * 0.90 // -10%
    }

    // Apply constraints
    newBid = Math.max(0.25, Math.min(5.00, newBid))

    if (Math.abs(newBid - keyword.bid) > 0.05) {
      await amazon.updateKeyword(keyword.keywordId, { bid: newBid })
      console.log(`Updated bid for "${keyword.text}": $${keyword.bid} → $${newBid}`)
    }
  }
}
```

---

### Task 5: Order Processing and Fulfillment

**Workflow:**
1. Retrieve new orders
2. Validate order data
3. Check inventory availability
4. Route to fulfillment (FBA or FBM)
5. Update order status
6. Submit tracking information
7. Handle cancellations and returns
8. Request buyer feedback

**Implementation:**

```javascript
// Process orders
async function processOrders() {
  // 1. Get orders created in last hour
  const orders = await amazon.getOrders({
    CreatedAfter: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    OrderStatuses: ['Unshipped'],
  })

  for (const order of orders.Orders) {
    try {
      // 2. Get order items
      const items = await amazon.getOrderItems(order.AmazonOrderId)

      // 3. Check fulfillment channel
      if (order.FulfillmentChannel === 'AFN') {
        // Amazon fulfilled (FBA) - no action needed
        console.log(`Order ${order.AmazonOrderId} is FBA - Amazon will fulfill`)
        continue
      }

      // 4. Merchant fulfilled - process order
      await processFBMOrder(order, items.OrderItems)

    } catch (error) {
      console.error(`Error processing order ${order.AmazonOrderId}:`, error)
      await notifyError(order.AmazonOrderId, error)
    }
  }
}

async function processFBMOrder(order, items) {
  // 1. Check inventory
  for (const item of items) {
    const inventory = await db.inventory.findOne({ sku: item.SellerSKU })
    if (!inventory || inventory.quantity < item.QuantityOrdered) {
      throw new Error(`Insufficient inventory for SKU ${item.SellerSKU}`)
    }
  }

  // 2. Reserve inventory
  for (const item of items) {
    await db.inventory.updateOne(
      { sku: item.SellerSKU },
      { $inc: { quantity: -item.QuantityOrdered, reserved: item.QuantityOrdered } }
    )
  }

  // 3. Create shipment in warehouse system
  const shipment = await warehouse.createShipment({
    orderId: order.AmazonOrderId,
    recipient: await amazon.getOrderAddress(order.AmazonOrderId),
    items: items.map(i => ({
      sku: i.SellerSKU,
      quantity: i.QuantityOrdered,
    })),
    shippingService: order.ShipmentServiceLevelCategory,
  })

  // 4. Print shipping label
  const label = await warehouse.printLabel(shipment.id)

  // 5. Update order status in database
  await db.orders.insert({
    amazonOrderId: order.AmazonOrderId,
    shipmentId: shipment.id,
    status: 'processing',
    createdAt: new Date(),
  })

  console.log(`Order ${order.AmazonOrderId} sent to warehouse`)
}

// Submit shipment confirmation
async function confirmShipment(amazonOrderId, trackingNumber, carrier) {
  // 1. Update order status to Shipped
  await amazon.updateOrderShipment(amazonOrderId, {
    ShipmentDate: new Date().toISOString(),
    CarrierCode: carrier, // 'USPS', 'UPS', 'FEDEX', etc.
    CarrierName: carrier,
    ShippingMethod: 'Standard',
    TrackingNumber: trackingNumber,
  })

  // 2. Update inventory (move from reserved to shipped)
  const order = await db.orders.findOne({ amazonOrderId })
  const items = await amazon.getOrderItems(amazonOrderId)

  for (const item of items.OrderItems) {
    await db.inventory.updateOne(
      { sku: item.SellerSKU },
      { $inc: { reserved: -item.QuantityOrdered } }
    )
  }

  // 3. Update order in database
  await db.orders.updateOne(
    { amazonOrderId },
    {
      $set: {
        status: 'shipped',
        trackingNumber,
        carrier,
        shippedAt: new Date(),
      },
    }
  )

  // 4. Request feedback (5-30 days after delivery)
  await queue.add('request-feedback', { amazonOrderId }, {
    delay: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  console.log(`Shipment confirmed for order ${amazonOrderId}`)
}

// Request buyer feedback
async function requestFeedback(amazonOrderId) {
  try {
    await amazon.createProductReviewAndSellerFeedbackSolicitation(amazonOrderId)
    console.log(`Feedback requested for order ${amazonOrderId}`)
  } catch (error) {
    if (error.code === 'NOT_ELIGIBLE') {
      console.log(`Order ${amazonOrderId} not eligible for solicitation`)
    } else {
      throw error
    }
  }
}
```

---

## Troubleshooting

### Common Errors

**1. Authentication Errors**

**Error:**
```
Unauthorized - Invalid access token
```

**Solution:**
- Refresh access token using refresh token
- Verify LWA credentials are correct
- Check IAM role permissions
- Ensure selling partner ID is correct

**Code Example:**
```javascript
async function refreshAccessToken() {
  const response = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.AMAZON_REFRESH_TOKEN,
      client_id: process.env.AMAZON_CLIENT_ID,
      client_secret: process.env.AMAZON_CLIENT_SECRET,
    }),
  })

  const data = await response.json()
  return data.access_token
}
```

---

**2. Listing Quality Issues**

**Error:**
```
Listing suppressed - Missing required attributes
```

**Solution:**
- Check category-specific requirements
- Use Browse Tree Guide (BTG) for required attributes
- Validate all product data before submission
- Review listing quality dashboard

---

**3. Feed Processing Errors**

**Error:**
```
Feed submission failed - Invalid XML format
```

**Solution:**
- Validate XML against Amazon's XSD schema
- Ensure all required fields are present
- Escape special characters properly
- Check feed processing report for details

**Code Example:**
```javascript
async function checkFeedStatus(feedId) {
  const feed = await amazon.getFeed(feedId)
  console.log('Feed status:', feed.processingStatus)

  if (feed.processingStatus === 'DONE' && feed.resultFeedDocumentId) {
    const document = await amazon.getFeedDocument(feed.resultFeedDocumentId)
    const results = await fetch(document.url)
    const xml = await results.text()
    console.log('Feed results:', xml)
  }
}
```

---

**4. Rate Limiting**

**Error:**
```
Request throttled - Rate limit exceeded
```

**Solution:**
- Implement request queuing
- Respect rate limits per endpoint
- Use bulk operations where possible
- Implement exponential backoff

**Rate Limits:**
- Orders API: 1 request per second
- Products API: 5 requests per second
- Feeds API: 0.0167 requests per second (1 per minute)

---

**5. Inventory Synchronization Issues**

**Error:**
```
Inventory update failed - Stranded inventory
```

**Solution:**
- Check for listing issues
- Verify SKU exists and is active
- Ensure FBA inventory is received
- Check for listing suppression

---

## Performance Monitoring

### Key Metrics

**Seller Performance:**
- Order Defect Rate (< 1%)
- Pre-fulfillment Cancel Rate (< 2.5%)
- Late Shipment Rate (< 4%)
- Valid Tracking Rate (> 95%)
- On-time Delivery Rate (> 90%)

**Business Metrics:**
- Total sales
- Units sold
- Average selling price
- Buy Box percentage
- Return rate
- Customer feedback score

**Advertising Metrics:**
- Impressions
- Clicks
- CTR (Click-through rate)
- Spend
- Sales
- ACOS (Advertising Cost of Sales)
- ROAS (Return on Ad Spend)

### Monitoring Dashboard

```javascript
// Generate daily performance report
async function generateDailyReport() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  // Sales report
  const salesReport = await amazon.createReport('GET_SALES_AND_TRAFFIC_REPORT', {
    startDate: dateStr,
    endDate: dateStr,
    marketplaceIds: ['ATVPDKIKX0DER'], // US marketplace
  })

  // Wait for report
  await waitForReport(salesReport.reportId)
  const salesData = await downloadReport(salesReport.reportId)

  // Advertising report
  const adsReport = await amazon.getAdMetrics({
    startDate: dateStr,
    endDate: dateStr,
  })

  // Generate summary
  const summary = {
    date: dateStr,
    sales: {
      revenue: salesData.totalRevenue,
      units: salesData.unitsOrdered,
      orders: salesData.ordersPlaced,
      averageOrderValue: salesData.totalRevenue / salesData.ordersPlaced,
    },
    advertising: {
      spend: adsReport.cost,
      sales: adsReport.sales,
      acos: adsReport.cost / adsReport.sales,
      impressions: adsReport.impressions,
      clicks: adsReport.clicks,
      ctr: adsReport.clicks / adsReport.impressions,
    },
    performance: {
      odr: await getODR(),
      lateShipmentRate: await getLateShipmentRate(),
      feedbackScore: await getFeedbackScore(),
    },
  }

  // Send report
  await sendDailyReport(summary)
  console.log('Daily report generated:', summary)
}
```

---

## Resources

**Official Documentation:**
- SP-API Documentation: https://developer-docs.amazon.com/sp-api/
- Seller Central Help: https://sellercentral.amazon.com/help/hub
- Amazon Advertising API: https://advertising.amazon.com/API/docs

**Tools:**
- Helium 10 (keyword research, listing optimization)
- Jungle Scout (product research, sales estimates)
- Keepa (price tracking, sales rank history)
- FeedVisor / Informed (repricing)
- SellerApp (analytics, PPC optimization)

**NPM Packages:**
- `amazon-sp-api` - Unofficial SP-API client
- `amazon-mws` - Legacy MWS client
- `amazon-advertising-api` - Advertising API client

---

## Compliance Checklist

**Before Listing Products:**
- [ ] Product complies with Amazon policies
- [ ] Category approval obtained (if restricted)
- [ ] Brand Registry enrolled (if brand owner)
- [ ] Product safety standards met
- [ ] Proper labeling and packaging
- [ ] UPC/EAN codes obtained
- [ ] Images meet Amazon requirements
- [ ] No prohibited claims in listing
- [ ] Pricing competitive and profitable
- [ ] Inventory available to ship

**Ongoing Compliance:**
- [ ] Monitor account health regularly
- [ ] Respond to customer messages within 24 hours
- [ ] Ship orders on time (within stated handling time)
- [ ] Maintain ODR < 1%
- [ ] Address A-to-Z claims promptly
- [ ] Keep listings accurate and up-to-date
- [ ] Comply with tax collection requirements
- [ ] Follow advertising guidelines
- [ ] Protect customer data and privacy

---

**Ready to dominate Amazon!** 📦
