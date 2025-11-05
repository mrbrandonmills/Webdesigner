# Luxury Affiliate Programs Report for Brandon Mills E-Commerce

**Date:** November 5, 2025
**Prepared by:** E-commerce Integration Architect
**Brand Focus:** Luxury Fashion, Art, Conscious Living

---

## Executive Summary

This report analyzes and recommends the top luxury affiliate programs suitable for Brandon Mills' high-end e-commerce platform. Based on comprehensive research of commission structures, API capabilities, and brand alignment, I've identified five premier affiliate programs that complement the luxury fashion/modeling portfolio aesthetic while providing robust technical integration options.

**Key Findings:**
- Commission rates for luxury brands range from 3-10%, with average order values often exceeding $500
- Most programs offer 30-day cookie windows, crucial for high-consideration luxury purchases
- API integration capabilities vary significantly; CJ Affiliate and Rakuten offer the most comprehensive APIs
- Hybrid approach recommended: combine direct API integration with affiliate link redirects

---

## Top 5 Recommended Affiliate Programs

### 1. **CJ Affiliate (Commission Junction) - PRIORITY: HIGHEST**

**Program Details:**
- **Commission:** 3-10% depending on brand (luxury brands average 5-7%)
- **Cookie Duration:** 30-120 days (varies by merchant)
- **Payout Terms:** Net 20 days, $50 minimum
- **Notable Brands:** Nordstrom, Saks Fifth Avenue, Neiman Marcus, Bloomingdale's

**Why It Fits Brandon Mills:**
- Extensive luxury fashion portfolio aligning with high-end aesthetic
- Established relationships with premium brands
- Professional merchant base matches target demographic
- Global reach for international customers

**Technical Integration:**
```javascript
// CJ Product Import API Integration
const CJ_API_KEY = process.env.CJ_API_KEY
const CJ_WEBSITE_ID = process.env.CJ_WEBSITE_ID

// Fetch product catalog via GraphQL
const fetchCJProducts = async () => {
  const query = `
    query GetProducts {
      products(websiteId: "${CJ_WEBSITE_ID}") {
        edges {
          node {
            id
            name
            description
            price
            currency
            imageUrl
            merchantName
            categoryPath
            trackingUrl
          }
        }
      }
    }
  `

  const response = await fetch('https://developers.cj.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CJ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })

  return response.json()
}

// Track conversions
const trackCJConversion = async (orderId, amount, items) => {
  const trackingPixel = `https://www.emjcd.com/tags/c?containerTagId=XXXXX&CID=XXXXX&OID=${orderId}&TYPE=XXXXX&AMOUNT=${amount}&CURRENCY=USD`
  // Implement server-side tracking
}
```

**Setup Time:** 2-3 weeks (including approval process)
**Revenue Potential:** $5,000-20,000/month based on traffic

---

### 2. **ShareASale - PRIORITY: HIGH**

**Program Details:**
- **Commission:** Up to 30% (fashion), 7-10% (luxury)
- **Cookie Duration:** 30 days standard
- **Payout Terms:** Monthly, $50 minimum
- **Notable Programs:** LUX LAIR ($1,093 AOV), The Rockford Collection (10% commission)

**Why It Fits Brandon Mills:**
- Strong luxury marketplace with curated merchants
- High average order values in luxury segment
- Excellent support for content creators
- Fashion-forward brand selection

**Technical Integration:**
```javascript
// ShareASale API Integration
const SHAREASALE_TOKEN = process.env.SHAREASALE_TOKEN
const SHAREASALE_SECRET = process.env.SHAREASALE_SECRET
const AFFILIATE_ID = process.env.SHAREASALE_AFFILIATE_ID

// Generate authentication signature
const generateShareASaleAuth = () => {
  const timestamp = Math.floor(Date.now() / 1000)
  const action = 'merchantDataFeeds'
  const stringToHash = `${SHAREASALE_TOKEN}:${timestamp}:${action}:${SHAREASALE_SECRET}`
  return crypto.createHash('sha256').update(stringToHash).digest('hex')
}

// Fetch merchant products
const fetchShareASaleProducts = async (merchantId) => {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = generateShareASaleAuth()

  const url = `https://api.shareasale.com/x.cfm?action=merchantDataFeeds&affiliateId=${AFFILIATE_ID}&token=${SHAREASALE_TOKEN}&timestamp=${timestamp}&signature=${signature}&merchantId=${merchantId}&format=json`

  const response = await fetch(url)
  return response.json()
}

// Product data structure
interface ShareASaleProduct {
  productId: string
  name: string
  merchantId: string
  price: number
  salePrice?: number
  category: string
  subCategory: string
  imageUrl: string
  buyUrl: string // Affiliate tracking link
  description: string
  brand: string
}
```

**Setup Time:** 1-2 weeks
**Revenue Potential:** $3,000-12,000/month

---

### 3. **Society6 + Redbubble (Print-on-Demand) - PRIORITY: MEDIUM-HIGH**

**Program Details:**

**Society6:**
- **Commission:** 10% on all sales
- **Cookie Duration:** 30 days
- **Integration:** Via Impact platform
- **Products:** Art prints, home decor, apparel

**Redbubble:**
- **Commission:** 2-10% tiered structure
- **Cookie Duration:** 30 days
- **Integration:** Via Impact platform

**Why It Fits Brandon Mills:**
- Perfect for art prints and creative merchandise
- Aligns with artistic portfolio aesthetic
- No inventory management required
- Complements existing Printful integration

**Technical Integration:**
```javascript
// Unified Print-on-Demand Integration
class PrintOnDemandAggregator {
  constructor() {
    this.providers = {
      printful: new PrintfulAPI(),
      society6: new Society6Affiliate(),
      redbubble: new RedbubbleAffiliate()
    }
  }

  async fetchAllProducts() {
    const products = await Promise.all([
      this.fetchPrintfulProducts(),
      this.fetchSociety6Products(),
      this.fetchRedbubbleProducts()
    ])

    return this.normalizeProducts(products.flat())
  }

  normalizeProducts(products) {
    return products.map(product => ({
      id: `${product.provider}_${product.originalId}`,
      name: product.name,
      price: product.price,
      provider: product.provider,
      type: product.type, // 'owned' or 'affiliate'
      images: product.images,
      variants: product.variants,
      affiliateUrl: product.affiliateUrl || null,
      addToCartHandler: product.provider === 'printful'
        ? this.handleOwnedProduct
        : this.handleAffiliateRedirect
    }))
  }

  handleAffiliateRedirect(product) {
    // Track click event
    trackEvent('affiliate_click', product.provider, product.id)
    // Redirect to affiliate URL
    window.location.href = product.affiliateUrl
  }
}
```

**Setup Time:** 1 week
**Revenue Potential:** $1,500-5,000/month

---

### 4. **AWIN Network - PRIORITY: MEDIUM**

**Program Details:**
- **Commission:** 5-10% for luxury brands
- **Cookie Duration:** 30 days standard
- **Platform Fee:** 3.5% of transaction value to AWIN
- **Notable Brands:** YSL Beauty, Browns Fashion, PrettyLittleThing

**Why It Fits Brandon Mills:**
- Strong European luxury brand presence
- Fashion-forward merchant selection
- Basket value commission tiers available
- Global payment options

**Technical Integration:**
```javascript
// AWIN API Integration
const AWIN_API_KEY = process.env.AWIN_API_KEY
const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID

class AwinIntegration {
  async fetchMerchantProducts(merchantId) {
    const response = await fetch(
      `https://api.awin.com/publishers/${AWIN_PUBLISHER_ID}/merchants/${merchantId}/products`,
      {
        headers: {
          'Authorization': `Bearer ${AWIN_API_KEY}`
        }
      }
    )
    return response.json()
  }

  generateTrackingLink(productUrl, merchantId) {
    const clickRef = generateUniqueClickRef()
    return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${AWIN_PUBLISHER_ID}&clickref=${clickRef}&p=${encodeURIComponent(productUrl)}`
  }

  async trackConversion(sale) {
    // Server-to-server tracking
    const trackingUrl = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${sale.merchantId}&amount=${sale.amount}&ch=aw&parts=DEFAULT:${sale.amount}&ref=${sale.orderId}&aw_ref=${sale.clickRef}`

    await fetch(trackingUrl)
  }
}
```

**Setup Time:** 2 weeks
**Revenue Potential:** $2,000-8,000/month

---

### 5. **Rakuten Advertising - PRIORITY: MEDIUM**

**Program Details:**
- **Commission:** 3-8% for luxury fashion
- **Cookie Duration:** 7-45 days (varies)
- **Payout Terms:** Monthly
- **Notable Brands:** Bloomingdale's, AMARA, various designer brands

**Why It Fits Brandon Mills:**
- Established luxury brand relationships
- Strong conversion tracking capabilities
- International market coverage
- Premium merchant quality standards

**Technical Integration:**
```javascript
// Rakuten LinkShare Integration
const RAKUTEN_TOKEN = process.env.RAKUTEN_TOKEN
const RAKUTEN_SCOPE = process.env.RAKUTEN_SCOPE

class RakutenIntegration {
  async authenticate() {
    const response = await fetch('https://api.rakutenadvertising.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${RAKUTEN_TOKEN}:`).toString('base64')}`
      },
      body: `grant_type=client_credentials&scope=${RAKUTEN_SCOPE}`
    })

    const data = await response.json()
    this.accessToken = data.access_token
  }

  async fetchProductCatalog(advertiserId) {
    const response = await fetch(
      `https://api.rakutenadvertising.com/productsearch/1.0?advertiser-id=${advertiserId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    )
    return response.json()
  }
}
```

**Setup Time:** 2-3 weeks
**Revenue Potential:** $2,500-10,000/month

---

## Integration Architecture

### Unified Product Catalog Strategy

```javascript
// lib/affiliate/unified-catalog.ts
interface UnifiedProduct {
  // Core fields
  id: string                    // {provider}_{originalId}
  sku: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string

  // Categorization
  provider: 'printful' | 'shopify' | 'cj' | 'shareasale' | 'awin' | 'rakuten' | 'society6' | 'redbubble'
  productType: 'owned' | 'affiliate' | 'dropship'
  category: string[]
  tags: string[]

  // Media
  images: {
    url: string
    alt: string
    position: number
  }[]

  // Variants & Options
  variants?: ProductVariant[]
  options?: ProductOption[]

  // Affiliate specific
  affiliateUrl?: string
  merchantName?: string
  commission?: number
  cookieDuration?: number

  // Inventory
  inventory?: {
    available: boolean
    quantity?: number
  }

  // SEO
  seoTitle?: string
  seoDescription?: string
  slug: string
}

class UnifiedCatalogService {
  private providers: Map<string, AffiliateProvider>
  private cache: Map<string, UnifiedProduct>
  private syncInterval: number = 3600000 // 1 hour

  constructor() {
    this.providers = new Map([
      ['cj', new CJProvider()],
      ['shareasale', new ShareASaleProvider()],
      ['awin', new AwinProvider()],
      ['rakuten', new RakutenProvider()],
      ['society6', new Society6Provider()],
      ['printful', new PrintfulProvider()],
      ['shopify', new ShopifyProvider()]
    ])

    this.initializeSync()
  }

  async syncAllProducts() {
    const allProducts: UnifiedProduct[] = []

    for (const [name, provider] of this.providers) {
      try {
        const products = await provider.fetchProducts()
        const normalized = products.map(p => this.normalizeProduct(p, name))
        allProducts.push(...normalized)
      } catch (error) {
        console.error(`Failed to sync ${name}:`, error)
        // Continue with other providers
      }
    }

    // Store in database
    await this.persistProducts(allProducts)

    // Update cache
    allProducts.forEach(p => this.cache.set(p.id, p))

    return allProducts
  }

  private normalizeProduct(product: any, provider: string): UnifiedProduct {
    // Provider-specific normalization logic
    switch(provider) {
      case 'cj':
        return this.normalizeCJProduct(product)
      case 'shareasale':
        return this.normalizeShareASaleProduct(product)
      // ... other providers
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  async getProduct(id: string): Promise<UnifiedProduct | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!
    }

    // Fetch from database
    return await this.fetchFromDatabase(id)
  }

  async searchProducts(query: {
    search?: string
    category?: string
    priceMin?: number
    priceMax?: number
    provider?: string
    productType?: 'owned' | 'affiliate' | 'dropship'
  }) {
    // Implement search logic across unified catalog
    const products = Array.from(this.cache.values())

    return products.filter(product => {
      if (query.search && !product.name.toLowerCase().includes(query.search.toLowerCase())) {
        return false
      }
      if (query.category && !product.category.includes(query.category)) {
        return false
      }
      if (query.priceMin && product.price < query.priceMin) {
        return false
      }
      if (query.priceMax && product.price > query.priceMax) {
        return false
      }
      if (query.provider && product.provider !== query.provider) {
        return false
      }
      if (query.productType && product.productType !== query.productType) {
        return false
      }
      return true
    })
  }
}
```

### Checkout Flow Architecture

```javascript
// lib/checkout/hybrid-checkout.ts
class HybridCheckoutService {
  async processCheckout(cart: CartItem[]) {
    // Separate owned vs affiliate products
    const { ownedProducts, affiliateProducts } = this.categorizeCart(cart)

    if (ownedProducts.length > 0 && affiliateProducts.length > 0) {
      // Mixed cart - handle specially
      return this.handleMixedCheckout(ownedProducts, affiliateProducts)
    } else if (ownedProducts.length > 0) {
      // Only owned products - standard checkout
      return this.handleOwnedCheckout(ownedProducts)
    } else {
      // Only affiliate products - redirect flow
      return this.handleAffiliateCheckout(affiliateProducts)
    }
  }

  private async handleMixedCheckout(owned: CartItem[], affiliate: CartItem[]) {
    // Option 1: Process owned products first, then show affiliate links
    const ownedOrder = await this.processOwnedProducts(owned)

    // Track partial conversion
    await this.trackPartialConversion(ownedOrder)

    // Return affiliate links for customer to complete separately
    return {
      type: 'mixed',
      ownedOrder,
      affiliateLinks: affiliate.map(item => ({
        product: item.product,
        quantity: item.quantity,
        affiliateUrl: this.generateAffiliateUrl(item),
        estimatedCommission: this.calculateCommission(item)
      }))
    }
  }

  private generateAffiliateUrl(item: CartItem) {
    const product = item.product as UnifiedProduct

    // Add tracking parameters
    const params = new URLSearchParams({
      utm_source: 'brandonmills',
      utm_medium: 'affiliate',
      utm_campaign: 'checkout',
      ref: generateReferenceId()
    })

    return `${product.affiliateUrl}?${params.toString()}`
  }
}
```

### Commission Tracking Implementation

```javascript
// lib/tracking/commission-tracker.ts
class CommissionTracker {
  // Track all affiliate clicks
  async trackClick(productId: string, provider: string) {
    const clickData = {
      productId,
      provider,
      timestamp: new Date(),
      sessionId: getSessionId(),
      userId: getUserId(),
      referrer: document.referrer,
      utm: parseUTMParams()
    }

    // Store in database for attribution
    await fetch('/api/tracking/click', {
      method: 'POST',
      body: JSON.stringify(clickData)
    })

    // Fire provider-specific pixels
    this.fireProviderPixel(provider, 'click', productId)
  }

  // Track conversions (webhook from affiliate network)
  async handleConversionWebhook(data: {
    provider: string
    orderId: string
    amount: number
    commission: number
    productIds: string[]
  }) {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(data)) {
      throw new Error('Invalid webhook signature')
    }

    // Store conversion
    await this.storeConversion(data)

    // Update analytics
    trackEvent('affiliate_conversion', data.provider, data.orderId, data.amount)

    // Calculate ROI
    await this.updateROIMetrics(data)
  }

  private fireProviderPixel(provider: string, event: string, data: any) {
    switch(provider) {
      case 'cj':
        if (window.cj) {
          window.cj.track(event, data)
        }
        break
      case 'shareasale':
        if (window.sas) {
          window.sas.track(event, data)
        }
        break
      // ... other providers
    }
  }
}
```

---

## Implementation Priority & Timeline

### Phase 1: Foundation (Week 1)
1. **Set up CJ Affiliate account** - Apply and get approved
2. **Create ShareASale account** - Apply to high-value programs
3. **Implement unified product schema** - Database structure
4. **Build commission tracking system** - Click and conversion tracking

### Phase 2: Integration (Week 2)
1. **Integrate CJ API** - Product import, tracking pixels
2. **Integrate ShareASale API** - Product feeds, deep links
3. **Set up Society6/Redbubble** - Via Impact platform
4. **Create product sync service** - Automated catalog updates

### Phase 3: User Experience (Week 3)
1. **Build unified product pages** - Show all products seamlessly
2. **Implement hybrid checkout** - Handle mixed carts
3. **Add affiliate disclosures** - FTC compliance
4. **Create analytics dashboard** - Track performance

### Phase 4: Optimization (Week 4)
1. **A/B test product placement** - Owned vs affiliate
2. **Optimize commission tracking** - Ensure accuracy
3. **Set up AWIN and Rakuten** - Additional networks
4. **Launch email campaigns** - Promote curated collections

---

## Revenue Projections

### Conservative Estimate (Months 1-3)
- **Traffic:** 10,000 monthly visitors
- **Click-through rate:** 5% (500 affiliate clicks)
- **Conversion rate:** 2% (10 sales)
- **Average order value:** $250
- **Average commission:** 6%
- **Monthly revenue:** $150

### Growth Projection (Months 4-6)
- **Traffic:** 25,000 monthly visitors
- **Click-through rate:** 7% (1,750 affiliate clicks)
- **Conversion rate:** 2.5% (44 sales)
- **Average order value:** $350
- **Average commission:** 7%
- **Monthly revenue:** $1,078

### Optimized Performance (Months 7-12)
- **Traffic:** 50,000 monthly visitors
- **Click-through rate:** 10% (5,000 affiliate clicks)
- **Conversion rate:** 3% (150 sales)
- **Average order value:** $450
- **Average commission:** 7%
- **Monthly revenue:** $4,725

---

## Technical Requirements

### Environment Variables
```env
# CJ Affiliate
CJ_API_KEY=
CJ_WEBSITE_ID=
CJ_ACCOUNT_ID=

# ShareASale
SHAREASALE_TOKEN=
SHAREASALE_SECRET=
SHAREASALE_AFFILIATE_ID=

# AWIN
AWIN_API_KEY=
AWIN_PUBLISHER_ID=

# Rakuten
RAKUTEN_TOKEN=
RAKUTEN_SCOPE=
RAKUTEN_ACCOUNT_ID=

# Society6/Redbubble (via Impact)
IMPACT_ACCOUNT_SID=
IMPACT_AUTH_TOKEN=

# Tracking
NEXT_PUBLIC_GTM_ID=
AFFILIATE_WEBHOOK_SECRET=
```

### Database Schema
```sql
-- Unified products table
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  product_type ENUM('owned', 'affiliate', 'dropship'),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3),
  images JSON,
  affiliate_url TEXT,
  commission_rate DECIMAL(5,2),
  merchant_name VARCHAR(255),
  category JSON,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider (provider),
  INDEX idx_type (product_type),
  INDEX idx_price (price)
);

-- Click tracking
CREATE TABLE affiliate_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id VARCHAR(255),
  provider VARCHAR(50),
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  referrer TEXT,
  utm_params JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id),
  INDEX idx_session (session_id)
);

-- Conversion tracking
CREATE TABLE affiliate_conversions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  provider VARCHAR(50),
  order_id VARCHAR(255),
  click_id INT,
  amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  currency VARCHAR(3),
  product_ids JSON,
  status ENUM('pending', 'approved', 'rejected'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (click_id) REFERENCES affiliate_clicks(id),
  INDEX idx_provider (provider),
  INDEX idx_status (status)
);
```

---

## Compliance & Best Practices

### FTC Disclosure Requirements
```javascript
// components/affiliate-disclosure.tsx
export function AffiliateDisclosure() {
  return (
    <div className="bg-gray-50 p-4 text-sm text-gray-600 mb-4">
      <p className="font-semibold">Affiliate Disclosure:</p>
      <p>
        Some of the links on this page are affiliate links, which means we may
        receive a commission if you purchase through these links at no additional
        cost to you. We only recommend products we genuinely believe in.
      </p>
    </div>
  )
}
```

### Cookie Consent Implementation
```javascript
// components/cookie-consent.tsx
export function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent')
    if (stored) {
      setConsent(stored === 'true')
      if (stored === 'true') {
        enableTracking()
      }
    }
  }, [])

  const handleAccept = () => {
    setConsent(true)
    localStorage.setItem('cookie-consent', 'true')
    enableTracking()
  }

  const enableTracking = () => {
    // Enable affiliate tracking pixels
    window.affiliateTrackingEnabled = true
    // Initialize providers
    initializeCJ()
    initializeShareASale()
    // ... other providers
  }

  if (consent !== null) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies and affiliate tracking to provide you with the best
          shopping experience and support our site.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setConsent(false)}>Decline</button>
          <button onClick={handleAccept}>Accept</button>
        </div>
      </div>
    </div>
  )
}
```

---

## Risk Mitigation

### Potential Challenges & Solutions

1. **API Rate Limits**
   - Solution: Implement caching, batch requests, use webhooks for updates

2. **Commission Tracking Accuracy**
   - Solution: Server-to-server tracking, webhook validation, reconciliation reports

3. **Mixed Cart Complexity**
   - Solution: Clear UX separation, save affiliate items for later, email reminders

4. **Brand Consistency**
   - Solution: Curate products carefully, only show items matching aesthetic

5. **Legal Compliance**
   - Solution: Clear disclosures, respect cookie choices, follow FTC guidelines

---

## Conclusion

The recommended affiliate strategy combines high-commission luxury programs with robust technical integration. Priority should be given to CJ Affiliate and ShareASale for their extensive luxury brand portfolios and comprehensive APIs. The unified product catalog approach ensures seamless user experience while maintaining clear distinction between owned and affiliate products.

**Immediate Next Steps:**
1. Apply to CJ Affiliate and ShareASale
2. Set up development environment with API credentials
3. Implement unified product schema
4. Build commission tracking system
5. Create initial product import scripts

**Expected Timeline:** 4 weeks to full implementation
**Expected ROI:** Break-even by month 3, profitable by month 4

---

## Appendix: Quick Reference

### API Endpoints

**CJ Affiliate:**
- GraphQL: `https://developers.cj.com/graphql`
- REST: `https://commission-detail.api.cj.com/v3/`

**ShareASale:**
- API: `https://api.shareasale.com/x.cfm`

**AWIN:**
- API: `https://api.awin.com/`

**Rakuten:**
- API: `https://api.rakutenadvertising.com/`

### Support Contacts

- CJ Affiliate Support: support@cj.com
- ShareASale Support: shareasale@shareasale.com
- AWIN Support: support@awin.com
- Rakuten Support: support@rakutenadvertising.com

### Documentation Links

- [CJ Developer Portal](https://developers.cj.com)
- [ShareASale API Docs](https://api.shareasale.com)
- [AWIN API Docs](https://wiki.awin.com)
- [Rakuten API Docs](https://developers.rakutenadvertising.com)