# Week 1 Implementation Checklist

**Goal:** Fix Printful sync and get first 10 custom products live and selling
**Timeline:** 5 business days
**Priority:** P0 (BLOCKER for all other features)

---

## Day 1: Technical Discovery & Setup

### Morning: Investigate Printful Sync Issue

- [ ] **Read Printful V2 API Documentation**
  - Focus on Sync Products vs Catalog Products
  - Understand difference: https://developers.printful.com/docs/#section/Products-API
  - Catalog products = blank templates
  - Sync products = your custom designs on templates

- [ ] **Audit Current Integration**
  - File: `/Users/brandon/Webdesigner/lib/printful-client.ts`
  - Check: Does it have `createSyncProduct()` method? (Likely missing)
  - Check: AI design system - where does it stop? (Generates but doesn't upload)
  - Check: Environment variables - `PRINTFUL_API_KEY` and `PRINTFUL_STORE_ID` set?

- [ ] **Test Printful API Connection**
  ```bash
  cd /Users/brandon/Webdesigner
  node scripts/printful/test-connection.js
  ```
  - Verify credentials work
  - Check store ID is correct

### Afternoon: Design Database Schema Updates

- [ ] **Create Migration for Sync Products Table**
  ```sql
  CREATE TABLE printful_sync_products (
    id SERIAL PRIMARY KEY,
    local_product_id VARCHAR(255) UNIQUE,
    printful_sync_product_id BIGINT UNIQUE,
    printful_file_id VARCHAR(255),
    design_url TEXT,
    sync_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    last_synced_at TIMESTAMP,
    error_message TEXT
  );
  ```

- [ ] **Test Migration Locally**
  - Run migration on local Postgres
  - Verify table created
  - Test insert/update queries

**End of Day 1 Deliverable:** Understanding of exact issue + database ready

---

## Day 2: Build Printful Sync System

### Morning: Extend Printful Client

- [ ] **Add Sync Product Methods to printful-client.ts**

  ```typescript
  // Add these methods to PrintfulClient class:

  /**
   * Upload design file to Printful
   */
  async uploadDesignFile(imageUrl: string): Promise<FileUploadResponse> {
    // Download image from imageUrl
    // Upload to Printful Files API
    // Return file ID
  }

  /**
   * Create sync product (custom design on product template)
   */
  async createSyncProduct(data: {
    name: string
    description: string
    catalogVariantId: number
    fileId: string
    retailPrice: number
  }): Promise<SyncProduct> {
    // POST to /v2/sync-products
    // Configure placement (front, back, etc.)
    // Set retail price
    // Generate mockups
  }

  /**
   * Get sync product details
   */
  async getSyncProduct(syncProductId: number): Promise<SyncProduct> {
    // GET /v2/sync-products/{id}
  }

  /**
   * List all sync products
   */
  async listSyncProducts(): Promise<SyncProduct[]> {
    // GET /v2/sync-products
  }
  ```

- [ ] **Test Upload & Sync Flow**
  ```typescript
  // Test script:
  const testImageUrl = 'https://example.com/test-design.jpg'

  // 1. Upload file
  const file = await printfulClient.uploadDesignFile(testImageUrl)
  console.log('File uploaded:', file.id)

  // 2. Create sync product (poster as test)
  const syncProduct = await printfulClient.createSyncProduct({
    name: 'Test Art Print',
    description: 'Test description',
    catalogVariantId: 1234, // Poster variant ID
    fileId: file.id,
    retailPrice: 49.99
  })
  console.log('Sync product created:', syncProduct.id)

  // 3. Verify in Printful dashboard
  ```

### Afternoon: Build Admin Interface

- [ ] **Create Admin Page: /app/admin/products/sync/page.tsx**
  - Form to select existing AI-generated design
  - Select product type (poster, canvas, t-shirt, mug)
  - Set retail price (with suggested markup calculation)
  - Preview mockup
  - Button: "Sync to Printful"

- [ ] **Create API Route: /app/api/admin/products/sync/route.ts**
  ```typescript
  POST /api/admin/products/sync

  Body: {
    designId: string,
    productType: 'poster' | 'canvas' | 'tshirt' | 'mug',
    variantIds: number[],
    retailPrice: number
  }

  Response: {
    success: boolean,
    syncProductId: number,
    mockupUrl: string
  }
  ```

**End of Day 2 Deliverable:** Working sync system that uploads 1 test product to Printful

---

## Day 3: Bulk Product Upload & Testing

### Morning: Select & Prepare 10 Designs

- [ ] **Review Existing AI-Generated Designs**
  - Browse `/app/admin/products/generate` output
  - Select 10 best designs that match luxury aesthetic
  - Ensure images are high-res (300 DPI, 4000px+)
  - Verify images meet Printful requirements

- [ ] **Define Product Mix**
  - 4x Art Prints (18x24", framed)
  - 2x Canvas Gallery Wraps (16x20")
  - 2x Premium T-shirts (Bella+Canvas, center chest print)
  - 2x Mugs (11oz, wrap-around design)

- [ ] **Price Each Product**
  ```
  Pricing Formula: Printful Cost × 4 = Retail Price

  Example:
  - Poster (18x24"): $19.95 cost → $79.95 retail
  - Canvas (16x20"): $39.95 cost → $159.95 retail
  - T-shirt: $12.95 cost → $51.95 retail
  - Mug: $8.95 cost → $35.95 retail
  ```

### Afternoon: Upload All 10 Products

- [ ] **Sync Products to Printful (one by one)**
  - Use admin interface created yesterday
  - Verify each product appears in Printful dashboard
  - Check mockup images generate correctly
  - Confirm pricing is correct

- [ ] **Test Product Display on Frontend**
  - Visit `/shop` or wherever products display
  - Verify images load
  - Check prices show correctly
  - Test "Add to Cart" functionality

**End of Day 3 Deliverable:** 10 live products synced to Printful, displaying on site

---

## Day 4: End-to-End Order Testing

### Morning: Test Order Flow

- [ ] **Place Test Order**
  - Use Stripe test mode
  - Add product to cart
  - Complete checkout
  - Use test card: 4242 4242 4242 4242

- [ ] **Verify Order Processing**
  - [ ] Order appears in admin dashboard
  - [ ] Order syncs to Printful within 5 minutes
  - [ ] Check Printful dashboard shows order as "Draft" or "Pending"
  - [ ] Customer receives order confirmation email
  - [ ] Stripe webhook fires successfully

- [ ] **Test Webhook Flow**
  ```bash
  # Use Stripe CLI to test webhooks locally
  stripe listen --forward-to localhost:3000/api/stripe/webhook

  # Trigger test events
  stripe trigger payment_intent.succeeded
  ```

### Afternoon: Fix Any Issues

- [ ] **Common Issues to Check:**
  - Stripe webhook secret configured correctly
  - Printful order creation includes all required fields
  - Email sending works (order confirmation)
  - Product variants mapping correct (size, color)

- [ ] **Add Error Handling**
  - Retry logic for failed Printful API calls
  - Admin alert if order fails to sync
  - Customer notification if payment succeeds but order fails

**End of Day 4 Deliverable:** Complete order flow working from cart → payment → Printful

---

## Day 5: Product Catalog Polish & Launch

### Morning: Luxury UX Improvements

- [ ] **Product Page Enhancements**
  - High-quality mockup images (at least 3 per product)
  - Zoom on hover functionality
  - Mobile-optimized image gallery (swipeable)
  - Related products carousel

- [ ] **Write Product Descriptions**
  - Each product needs compelling description (200-300 words)
  - Include:
    - Story behind the photograph
    - Material quality details
    - Size and dimensions
    - Care instructions
    - Limited edition number (if applicable)

  Example:
  ```
  "Captured during a misty morning in Iceland's highlands, this fine art
  photograph brings the raw beauty of Nordic landscapes into your space.
  Printed on museum-quality archival paper with a matte finish, each print
  is individually inspected and numbered as part of a limited edition of 100.

  • Printed with archival inks (100+ year lifespan)
  • Frame: Premium black wood with anti-glare acrylic
  • Ships ready to hang
  • Certificate of authenticity included
  • Free shipping within US"
  ```

- [ ] **Add Trust Signals**
  - "Free returns within 30 days"
  - "Secure checkout" badge
  - "Printed on demand - allow 5-7 days for production"
  - Social proof: "Join 200+ art collectors"

### Afternoon: Pre-Launch Checklist

- [ ] **Technical Verification**
  - [ ] All 10 products display correctly
  - [ ] Prices are accurate
  - [ ] Images load fast (< 2 seconds)
  - [ ] Mobile responsive (test on iPhone)
  - [ ] No console errors
  - [ ] Lighthouse score > 85

- [ ] **SEO Basics**
  - [ ] Product pages have meta titles
  - [ ] Meta descriptions written
  - [ ] Images have alt text
  - [ ] URLs are clean (e.g., `/products/iceland-highland-mist-print`)
  - [ ] Sitemap generated

- [ ] **Analytics Setup**
  - [ ] Google Analytics 4 installed
  - [ ] Conversion tracking configured
  - [ ] Stripe payments tracked as events
  - [ ] Product views tracked

- [ ] **Go Live**
  - [ ] Deploy to Vercel production
  - [ ] Verify all products live on brandonmills.com
  - [ ] Place 1 real test order (small item like mug)
  - [ ] Confirm order goes to Printful for fulfillment

**End of Day 5 Deliverable:** Store is LIVE with 10 products ready to sell!

---

## Success Criteria for Week 1

By end of Week 1, you should have:

- [ ] **Working Printful sync system**
  - Can upload designs via admin panel
  - Products appear in Printful dashboard as sync products
  - Mockups generate automatically

- [ ] **10 live products for sale**
  - 4 art prints
  - 2 canvas
  - 2 t-shirts
  - 2 mugs
  - All priced competitively ($40-200 range)

- [ ] **Functional order flow**
  - Customer can checkout
  - Payment processes via Stripe
  - Order syncs to Printful automatically
  - Customer receives confirmation email

- [ ] **Luxury store aesthetic**
  - Clean, minimal design
  - High-quality product images
  - Compelling product descriptions
  - Mobile-optimized

---

## Week 1 Metrics to Track

- [ ] Test order processing time (target: < 5 minutes from payment to Printful)
- [ ] Product page load time (target: < 2 seconds)
- [ ] Image load time (target: < 1 second)
- [ ] Successful sync rate (target: 100% of uploads)
- [ ] Lighthouse performance score (target: 90+)

---

## Red Flags / When to Ask for Help

**If any of these happen, escalate immediately:**

1. Printful API returns errors consistently (> 50% failure rate)
2. Orders not syncing to Printful after 10 minutes
3. Payment processing but Printful order not created
4. Product images not displaying on frontend
5. Mockup generation fails for multiple products
6. Stripe webhooks not firing

**Who to Contact:**
- Technical issues: CTO or Technical Solution Architect
- Product questions: Product Manager
- Design issues: Frontend Agent

---

## Tools & Resources

**Printful Resources:**
- API Docs: https://developers.printful.com/
- Dashboard: https://www.printful.com/dashboard
- Product Catalog: https://www.printful.com/custom-products
- Mockup Generator: https://www.printful.com/dashboard/mockup-generator

**Testing Tools:**
- Stripe Test Cards: https://stripe.com/docs/testing
- Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Lighthouse: Chrome DevTools → Lighthouse tab
- Mobile Testing: Chrome DevTools → Device Mode

**Existing Code Files:**
- Printful Client: `/Users/brandon/Webdesigner/lib/printful-client.ts`
- Product API: `/Users/brandon/Webdesigner/app/api/store/products/route.ts`
- Admin Panel: `/Users/brandon/Webdesigner/app/admin/products/`
- Stripe Webhook: `/Users/brandon/Webdesigner/app/api/stripe/webhook/route.ts`

---

## Daily Standups (End of Each Day)

**Answer these 3 questions:**
1. What did I complete today?
2. What am I working on tomorrow?
3. Any blockers or questions?

**Post in:** Project log or Slack channel

---

**Status:** Ready to Start
**Owner:** Backend Agent + Frontend Agent
**Reviewer:** CTO
**Next:** Week 2 - Affiliate Integration

---

**File Location:** `/Users/brandon/Webdesigner/ai-management/specs/WEEK-1-IMPLEMENTATION-CHECKLIST.md`
