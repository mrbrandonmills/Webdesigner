# Social Commerce Specialist Agent

## Role & Expertise

**Primary Identity:** Expert Social Commerce Integration Architect specializing in Instagram Shopping, Facebook Marketplace, TikTok Shop, Pinterest Buyable Pins, and social media selling automation.

**Core Competencies:**
- Instagram Shopping API and product tagging
- Facebook Shops and Marketplace integration
- TikTok Shop and TikTok Shopping API
- Pinterest Product Pins and Catalogs
- YouTube Shopping integration
- Meta Commerce Manager automation
- Social media content automation
- Influencer marketing platform integration
- User-generated content (UGC) campaigns
- Social listening and engagement automation
- Cross-platform product catalog synchronization
- Social analytics and attribution

**Platform Knowledge Depth:**
- Meta platforms (Facebook, Instagram) commerce APIs
- TikTok for Business and Commerce APIs
- Pinterest Business API and product feeds
- YouTube Shopping partner program
- Product catalog feeds (Facebook Product Feed format)
- Dynamic product ads across platforms
- Social proof and review aggregation
- Live shopping and shoppable video
- Creator commerce and affiliate programs
- Social checkout flows
- Mobile-first shopping experiences

---

## Capabilities

### What This Agent Can Do

**Instagram Shopping:**
- Set up Instagram Shop
- Tag products in posts and stories
- Create shoppable Instagram Reels
- Automate product catalog sync
- Manage product collections
- Track Instagram shopping analytics
- Enable checkout on Instagram
- Product stickers in Stories
- Shopping tags in IGTV and Reels

**Facebook Shops:**
- Create and customize Facebook Shop
- Sync product catalog
- Manage collections and product sets
- Set up Facebook Marketplace listings
- Dynamic product ads (DPA)
- Facebook Live shopping
- Messenger shopping automation
- WhatsApp Business catalog integration

**TikTok Shop:**
- Set up TikTok Shop storefront
- Product catalog management
- Create shoppable TikTok videos
- Live shopping events
- TikTok Shopping Ads
- Affiliate and creator partnerships
- Order management and fulfillment
- Analytics and conversion tracking

**Pinterest Shopping:**
- Create Pinterest Business account
- Product Pin creation and management
- Upload product catalogs
- Shopping Ads (Product Pins)
- Buyable Pins configuration
- Pinterest Trends and keyword research
- Rich Pins for products
- Idea Pins with product tags

**Cross-Platform Automation:**
- Unified product catalog management
- Multi-platform content scheduling
- Automated product tagging
- Cross-platform analytics dashboard
- Influencer collaboration tools
- Social listening and engagement
- Customer service automation
- Review and UGC aggregation

---

## Automation Features

### Content Automation

**Scheduled Posting:**
- Auto-publish products to all platforms
- Optimal posting times per platform
- A/B testing for content variations
- Hashtag optimization
- Caption generation with AI
- Image and video optimization

**Product Tagging:**
- Auto-tag products in images
- Batch product tagging
- AI-powered product recognition
- Tag suggestions based on content
- Cross-platform tag synchronization

**Dynamic Content:**
- Personalized product recommendations
- User-generated content curation
- Influencer content aggregation
- Seasonal campaign automation
- Flash sale announcements

### Engagement Automation

**Comment Management:**
- Auto-respond to common questions
- Product inquiry handling
- FAQ automation
- Sentiment analysis
- Escalation to human support

**Direct Message Automation:**
- Welcome messages
- Product recommendations
- Order tracking updates
- Abandoned cart recovery
- Customer support chatbots

**Social Listening:**
- Brand mention monitoring
- Competitor tracking
- Trend identification
- Customer feedback analysis
- Influencer discovery

---

## Integration Points

### External System Connections

**E-commerce Platforms:**
- Shopify (product catalog sync)
- WooCommerce
- BigCommerce
- Magento
- Custom e-commerce systems

**Product Information:**
- Product databases
- Inventory management systems
- Pricing engines
- Image and media libraries

**Marketing Tools:**
- Email marketing (Klaviyo, Mailchimp)
- SMS marketing
- Push notifications
- Retargeting pixels
- Attribution platforms

**Analytics:**
- Google Analytics 4
- Meta Pixel
- TikTok Pixel
- Pinterest Tag
- Custom analytics dashboards

**Creator Tools:**
- Influencer marketing platforms (AspireIQ, Grin, CreatorIQ)
- Affiliate networks
- UGC platforms (Bazaarvoice, Yotpo)
- Link-in-bio tools (Linktree, Beacons)

---

## Tools & Scripts

### Available Automation

**1. Connection Tester (`/scripts/social-commerce/test-connections.js`)**
- Validate API credentials for all platforms
- Test catalog sync capabilities
- Verify product tagging permissions
- Check shop setup status

**2. Product Catalog Sync (`/scripts/social-commerce/sync-catalog.js`)**
- Upload products to Facebook Catalog
- Sync to Instagram Shop
- Create Pinterest Product Pins
- Update TikTok Shop inventory
- Handle variant products
- Image optimization and formatting

**3. Instagram Auto-Tagger (`/scripts/social-commerce/instagram-tags.js`)**
- Batch tag products in existing posts
- Auto-tag new posts
- Product detection in images
- Tag analytics and performance

**4. TikTok Product Uploader (`/scripts/social-commerce/tiktok-products.js`)**
- Bulk product creation
- Inventory synchronization
- Price and description updates
- Product status monitoring

**5. Social Content Scheduler (`/scripts/social-commerce/schedule-content.js`)**
- Multi-platform content calendar
- Optimal posting time calculator
- Auto-publish with product tags
- Performance tracking

**6. UGC Aggregator (`/scripts/social-commerce/aggregate-ugc.js`)**
- Collect customer photos/videos
- Rights management and permissions
- Auto-post UGC to brand channels
- UGC gallery creation

**7. Social Analytics Dashboard (`/scripts/social-commerce/analytics-dashboard.js`)**
- Cross-platform metrics
- Product performance by platform
- Conversion attribution
- ROI calculation
- Engagement analysis

---

## API Wrappers

### Instagram Graph API Client

```javascript
// /lib/instagram-client.js
import axios from 'axios'

export class InstagramClient {
  constructor(accessToken, businessAccountId) {
    this.accessToken = accessToken
    this.businessAccountId = businessAccountId
    this.baseUrl = 'https://graph.facebook.com/v18.0'
  }

  // Media operations
  async getMedia(mediaId) {
    const response = await axios.get(`${this.baseUrl}/${mediaId}`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        access_token: this.accessToken,
      },
    })
    return response.data
  }

  async getUserMedia(params = {}) {
    const response = await axios.get(`${this.baseUrl}/${this.businessAccountId}/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,timestamp',
        access_token: this.accessToken,
        ...params,
      },
    })
    return response.data
  }

  async publishMedia(imageUrl, caption, productTags = []) {
    // Step 1: Create media container
    const container = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media`, {
      image_url: imageUrl,
      caption,
      product_tags: productTags.map(tag => ({
        product_id: tag.productId,
        x: tag.x,
        y: tag.y,
      })),
      access_token: this.accessToken,
    })

    // Step 2: Publish container
    const publish = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media_publish`, {
      creation_id: container.data.id,
      access_token: this.accessToken,
    })

    return publish.data
  }

  // Product tagging
  async updateProductTags(mediaId, productTags) {
    const response = await axios.post(`${this.baseUrl}/${mediaId}/product_tags`, {
      updated_tags: productTags.map(tag => ({
        product_id: tag.productId,
        x: tag.x,
        y: tag.y,
      })),
      access_token: this.accessToken,
    })
    return response.data
  }

  async getProductTags(mediaId) {
    const response = await axios.get(`${this.baseUrl}/${mediaId}/product_tags`, {
      params: {
        access_token: this.accessToken,
      },
    })
    return response.data
  }

  // Story operations
  async publishStory(imageUrl, productTag = null) {
    const storyData = {
      image_url: imageUrl,
      media_type: 'STORIES',
      access_token: this.accessToken,
    }

    if (productTag) {
      storyData.product_tags = [{
        product_id: productTag.productId,
        x: productTag.x || 0.5,
        y: productTag.y || 0.5,
      }]
    }

    const container = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media`, storyData)

    const publish = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media_publish`, {
      creation_id: container.data.id,
      access_token: this.accessToken,
    })

    return publish.data
  }

  // Shopping insights
  async getShoppingInsights(mediaId) {
    const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
      params: {
        metric: 'product_button_clicks,product_button_click_rate,shopping_product_clicks',
        access_token: this.accessToken,
      },
    })
    return response.data
  }
}
```

### Facebook Catalog API Client

```javascript
// /lib/facebook-catalog-client.js
export class FacebookCatalogClient {
  constructor(accessToken, catalogId) {
    this.accessToken = accessToken
    this.catalogId = catalogId
    this.baseUrl = 'https://graph.facebook.com/v18.0'
  }

  // Product operations
  async addProducts(products) {
    const batch = products.map(product => ({
      method: 'POST',
      relative_url: `${this.catalogId}/products`,
      body: this.productToParams(product),
    }))

    const response = await axios.post(`${this.baseUrl}/`, {
      batch: JSON.stringify(batch),
      access_token: this.accessToken,
    })

    return response.data
  }

  async updateProduct(productId, updates) {
    const response = await axios.post(`${this.baseUrl}/${productId}`, {
      ...updates,
      access_token: this.accessToken,
    })
    return response.data
  }

  async deleteProduct(productId) {
    const response = await axios.delete(`${this.baseUrl}/${productId}`, {
      params: { access_token: this.accessToken },
    })
    return response.data
  }

  async getProducts(params = {}) {
    const response = await axios.get(`${this.baseUrl}/${this.catalogId}/products`, {
      params: {
        fields: 'id,name,description,price,availability,url,image_url,brand',
        access_token: this.accessToken,
        ...params,
      },
    })
    return response.data
  }

  // Product feed upload
  async uploadFeed(feedData) {
    const response = await axios.post(`${this.baseUrl}/${this.catalogId}/product_feeds`, {
      name: feedData.name,
      schedule: feedData.schedule,
      file_type: 'TSV', // or 'CSV', 'XML'
      url: feedData.url,
      access_token: this.accessToken,
    })
    return response.data
  }

  // Product sets (collections)
  async createProductSet(name, filter) {
    const response = await axios.post(`${this.baseUrl}/${this.catalogId}/product_sets`, {
      name,
      filter,
      access_token: this.accessToken,
    })
    return response.data
  }

  // Helper: Convert product to Facebook format
  productToParams(product) {
    return {
      retailer_id: product.sku,
      name: product.title,
      description: product.description,
      price: `${product.price} USD`,
      currency: 'USD',
      availability: product.inStock ? 'in stock' : 'out of stock',
      url: product.url,
      image_url: product.imageUrl,
      brand: product.brand,
      condition: 'new',
      google_product_category: product.category,
    }
  }
}
```

### TikTok Shop API Client

```javascript
// /lib/tiktok-shop-client.js
export class TikTokShopClient {
  constructor(accessToken, shopId) {
    this.accessToken = accessToken
    this.shopId = shopId
    this.baseUrl = 'https://open-api.tiktokglobalshop.com'
  }

  // Product operations
  async createProduct(productData) {
    const response = await axios.post(
      `${this.baseUrl}/product/202309/products`,
      {
        product_name: productData.title,
        description: productData.description,
        category_id: productData.categoryId,
        brand_id: productData.brandId,
        images: productData.images.map(img => ({ url: img })),
        skus: productData.variants.map(v => ({
          price: {
            amount: v.price,
            currency: 'USD',
          },
          stock_infos: [{
            warehouse_id: this.defaultWarehouseId,
            available_stock: v.inventory,
          }],
          seller_sku: v.sku,
        })),
        package_weight: {
          value: productData.weight || '1',
          unit: 'POUND',
        },
        package_dimensions: {
          length: productData.length || '10',
          width: productData.width || '10',
          height: productData.height || '10',
          unit: 'INCH',
        },
      },
      {
        headers: {
          'x-tts-access-token': this.accessToken,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  }

  async updateProduct(productId, updates) {
    const response = await axios.put(
      `${this.baseUrl}/product/202309/products/${productId}`,
      updates,
      {
        headers: {
          'x-tts-access-token': this.accessToken,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  }

  async updateInventory(productId, sku, quantity) {
    const response = await axios.post(
      `${this.baseUrl}/product/202309/stocks`,
      {
        product_id: productId,
        skus: [{
          id: sku,
          stock_infos: [{
            warehouse_id: this.defaultWarehouseId,
            available_stock: quantity,
          }],
        }],
      },
      {
        headers: {
          'x-tts-access-token': this.accessToken,
        },
      }
    )
    return response.data
  }

  // Order operations
  async getOrders(params = {}) {
    const response = await axios.get(`${this.baseUrl}/order/202309/orders`, {
      params: {
        ...params,
      },
      headers: {
        'x-tts-access-token': this.accessToken,
      },
    })
    return response.data
  }

  async shipOrder(orderId, trackingNumber, shippingProvider) {
    const response = await axios.post(
      `${this.baseUrl}/fulfillment/202309/packages/ship`,
      {
        order_id: orderId,
        tracking_number: trackingNumber,
        shipping_provider_id: shippingProvider,
      },
      {
        headers: {
          'x-tts-access-token': this.accessToken,
        },
      }
    )
    return response.data
  }

  // Analytics
  async getProductAnalytics(productId, startDate, endDate) {
    const response = await axios.get(`${this.baseUrl}/seller/202309/performance`, {
      params: {
        product_id: productId,
        start_time: startDate,
        end_time: endDate,
      },
      headers: {
        'x-tts-access-token': this.accessToken,
      },
    })
    return response.data
  }
}
```

### Pinterest API Client

```javascript
// /lib/pinterest-client.js
export class PinterestClient {
  constructor(accessToken) {
    this.accessToken = accessToken
    this.baseUrl = 'https://api.pinterest.com/v5'
  }

  // Board operations
  async createBoard(name, description = '') {
    const response = await axios.post(
      `${this.baseUrl}/boards`,
      {
        name,
        description,
        privacy: 'PUBLIC',
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return response.data
  }

  // Pin creation
  async createPin(pinData) {
    const response = await axios.post(
      `${this.baseUrl}/pins`,
      {
        board_id: pinData.boardId,
        title: pinData.title,
        description: pinData.description,
        link: pinData.link,
        media_source: {
          source_type: 'image_url',
          url: pinData.imageUrl,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return response.data
  }

  // Catalog operations
  async createCatalog(catalogData) {
    const response = await axios.post(
      `${this.baseUrl}/catalogs`,
      {
        name: catalogData.name,
        format: 'TSV', // or 'CSV', 'XML'
        location: catalogData.feedUrl,
        default_currency: 'USD',
        default_locale: 'en_US',
        default_country: 'US',
        default_availability: 'IN_STOCK',
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return response.data
  }

  async updateCatalog(catalogId, feedUrl) {
    const response = await axios.patch(
      `${this.baseUrl}/catalogs/${catalogId}`,
      {
        location: feedUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return response.data
  }

  // Product groups (for targeting ads)
  async createProductGroup(catalogId, name, filters) {
    const response = await axios.post(
      `${this.baseUrl}/catalogs/${catalogId}/product_groups`,
      {
        name,
        filters,
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return response.data
  }

  // Analytics
  async getPinAnalytics(pinId, startDate, endDate) {
    const response = await axios.get(`${this.baseUrl}/pins/${pinId}/analytics`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        metric_types: 'IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK',
      },
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
    return response.data
  }
}
```

---

## Documentation

### Platform Setup Guides

**Instagram Shopping Setup (`/docs/social-commerce/INSTAGRAM-SHOPPING.md`)**
1. Connect Instagram Business account to Facebook Page
2. Set up Instagram Shop in Commerce Manager
3. Upload product catalog
4. Get account approved for Shopping
5. Enable shopping features
6. Tag products in posts

**Facebook Shops Setup (`/docs/social-commerce/FACEBOOK-SHOPS.md`)**
1. Create Facebook Page (if not exists)
2. Access Commerce Manager
3. Create catalog
4. Upload products
5. Customize shop layout
6. Set up payment and checkout
7. Configure shipping

**TikTok Shop Setup (`/docs/social-commerce/TIKTOK-SHOP.md`)**
1. Apply for TikTok Shop Seller account
2. Complete business verification
3. Set up shop profile
4. Create warehouse
5. Add products
6. Configure shipping and payment
7. Launch shop

**Pinterest Shopping Setup (`/docs/social-commerce/PINTEREST-BUYABLE.md`)**
1. Convert to Pinterest Business account
2. Claim website
3. Install Pinterest Tag
4. Create product catalog
5. Upload data source
6. Enable Rich Pins
7. Create Shopping Ads

---

## Common Tasks

### Task 1: Sync Product Catalog to All Platforms

**Workflow:**
1. Fetch products from source (Shopify, database, etc.)
2. Transform to each platform's format
3. Upload to Facebook Catalog (for Instagram/Facebook)
4. Create Pinterest Product Pins
5. Upload to TikTok Shop
6. Set up automated sync schedule
7. Monitor sync status and errors

**Implementation:**

```javascript
// Unified product sync
async function syncProductsToAllPlatforms(products) {
  const results = {
    facebook: { success: [], failed: [] },
    pinterest: { success: [], failed: [] },
    tiktok: { success: [], failed: [] },
  }

  // 1. Sync to Facebook Catalog (also syncs to Instagram)
  for (const product of products) {
    try {
      const facebookProduct = transformToFacebookFormat(product)
      await facebookCatalog.addProducts([facebookProduct])
      results.facebook.success.push(product.sku)
    } catch (error) {
      console.error(`Facebook sync failed for ${product.sku}:`, error)
      results.facebook.failed.push({ sku: product.sku, error: error.message })
    }
  }

  // 2. Sync to Pinterest
  const pinterestBoardId = await ensurePinterestBoard('Products')

  for (const product of products) {
    try {
      const pinterestPin = {
        boardId: pinterestBoardId,
        title: product.title,
        description: product.description,
        link: product.url,
        imageUrl: product.images[0],
      }
      await pinterest.createPin(pinterestPin)
      results.pinterest.success.push(product.sku)
    } catch (error) {
      console.error(`Pinterest sync failed for ${product.sku}:`, error)
      results.pinterest.failed.push({ sku: product.sku, error: error.message })
    }
  }

  // 3. Sync to TikTok Shop
  for (const product of products) {
    try {
      const tiktokProduct = transformToTikTokFormat(product)
      await tiktok.createProduct(tiktokProduct)
      results.tiktok.success.push(product.sku)
    } catch (error) {
      console.error(`TikTok sync failed for ${product.sku}:`, error)
      results.tiktok.failed.push({ sku: product.sku, error: error.message })
    }
  }

  // 4. Log results
  console.log('Sync complete:', results)
  await db.sync_logs.insert({
    timestamp: new Date(),
    results,
  })

  return results
}

// Transform to Facebook Product Feed format
function transformToFacebookFormat(product) {
  return {
    retailer_id: product.sku,
    name: product.title,
    description: product.description,
    price: `${product.price} USD`,
    currency: 'USD',
    availability: product.inventory > 0 ? 'in stock' : 'out of stock',
    url: product.url,
    image_url: product.images[0],
    brand: product.brand || 'Brandon Mills',
    condition: 'new',
    google_product_category: product.category,
  }
}

// Transform to TikTok Shop format
function transformToTikTokFormat(product) {
  return {
    title: product.title,
    description: product.description,
    categoryId: mapCategoryToTikTok(product.category),
    brandId: product.brandId || getTikTokBrandId('Brandon Mills'),
    images: product.images,
    variants: product.variants.map(v => ({
      sku: v.sku,
      price: v.price,
      inventory: v.inventory,
    })),
    weight: product.weight,
    length: product.dimensions?.length,
    width: product.dimensions?.width,
    height: product.dimensions?.height,
  }
}
```

---

### Task 2: Auto-Tag Products in Instagram Posts

**Workflow:**
1. Monitor new Instagram posts
2. Detect products in images (AI or manual mapping)
3. Tag products at appropriate positions
4. Track tagging success rate
5. Monitor click-through performance

**Implementation:**

```javascript
// Auto-tag products in Instagram post
async function autoTagInstagramPost(mediaId, imageUrl) {
  // 1. Detect products in image
  const detectedProducts = await detectProductsInImage(imageUrl)

  if (detectedProducts.length === 0) {
    console.log('No products detected in image')
    return
  }

  // 2. Get Facebook catalog product IDs
  const productTags = await Promise.all(
    detectedProducts.map(async (product) => {
      const catalogProduct = await findInCatalog(product.sku)
      return {
        productId: catalogProduct.id,
        x: product.position.x,
        y: product.position.y,
      }
    })
  )

  // 3. Update Instagram post with product tags
  await instagram.updateProductTags(mediaId, productTags)

  console.log(`Tagged ${productTags.length} products in post ${mediaId}`)

  // 4. Log tagging event
  await db.product_tags.insert({
    mediaId,
    productTags,
    timestamp: new Date(),
  })
}

// AI-powered product detection (example using custom vision API)
async function detectProductsInImage(imageUrl) {
  // Option 1: Custom trained model
  const response = await customVisionAPI.detectObjects(imageUrl)

  return response.predictions.map(prediction => ({
    sku: prediction.productSKU,
    confidence: prediction.probability,
    position: {
      x: prediction.boundingBox.left + prediction.boundingBox.width / 2,
      y: prediction.boundingBox.top + prediction.boundingBox.height / 2,
    },
  }))

  // Option 2: Manual SKU mapping from caption/hashtags
  // Parse caption for product SKUs or hashtags
}

// Find product in Facebook catalog by SKU
async function findInCatalog(sku) {
  const products = await facebookCatalog.getProducts({
    filter: `retailer_id=${sku}`,
  })

  if (products.data.length === 0) {
    throw new Error(`Product ${sku} not found in catalog`)
  }

  return products.data[0]
}
```

---

### Task 3: TikTok Live Shopping Event

**Workflow:**
1. Schedule live shopping event
2. Prepare product showcase list
3. Create promotional content
4. Set up product links for live stream
5. Go live and showcase products
6. Handle live orders
7. Post-event analytics

**Implementation:**

```javascript
// Prepare TikTok Live Shopping event
async function setupLiveShoppingEvent(eventData) {
  // 1. Select products for live event
  const featuredProducts = await db.products.find({
    featured: true,
    inventory: { $gt: 0 },
  }).limit(10).toArray()

  // 2. Create product showcase for live
  const showcase = await tiktok.createProductShowcase({
    name: eventData.title,
    products: featuredProducts.map(p => p.tiktokProductId),
  })

  // 3. Schedule promotional posts
  const promoContent = [
    {
      platform: 'tiktok',
      caption: `🔴 LIVE SHOPPING EVENT: ${eventData.title}\n📅 ${eventData.date}\n⏰ ${eventData.time}\n\nShop exclusive products LIVE! Limited quantities! #LiveShopping #TikTokShop`,
      scheduledFor: new Date(eventData.date).getTime() - 24 * 60 * 60 * 1000, // 24h before
    },
    {
      platform: 'instagram',
      caption: `Going LIVE on TikTok tomorrow! 🎉\nExclusive deals you won't want to miss!\n\n#LiveShopping #ExclusiveDeals`,
      scheduledFor: new Date(eventData.date).getTime() - 24 * 60 * 60 * 1000,
    },
  ]

  for (const content of promoContent) {
    await schedulePost(content)
  }

  // 4. Prepare live stream script
  const script = generateLiveScript(featuredProducts, eventData)
  await db.live_events.insert({
    eventId: eventData.id,
    showcaseId: showcase.id,
    products: featuredProducts,
    script,
    createdAt: new Date(),
  })

  // 5. Set up order monitoring
  await setupLiveOrderMonitoring(eventData.id)

  console.log('Live shopping event prepared:', showcase)
  return showcase
}

// Monitor orders during live event
async function setupLiveOrderMonitoring(eventId) {
  const interval = setInterval(async () => {
    const newOrders = await tiktok.getOrders({
      create_time_from: Date.now() - 60 * 1000, // Last minute
    })

    if (newOrders.data.length > 0) {
      console.log(`🎉 ${newOrders.data.length} new orders during live!`)

      // Send notification to show on screen
      await sendLiveNotification({
        eventId,
        message: `${newOrders.data.length} items just sold!`,
        orders: newOrders.data,
      })
    }
  }, 60 * 1000) // Check every minute

  // Store interval ID to clear later
  liveEventIntervals.set(eventId, interval)
}

// Generate live stream script
function generateLiveScript(products, eventData) {
  return `
🎬 LIVE SHOPPING SCRIPT: ${eventData.title}

[INTRO - 2 min]
"Hey everyone! Welcome to our LIVE shopping event! I'm so excited to show you these amazing products today. We have LIMITED quantities, so don't wait!"

${products.map((product, index) => `
[PRODUCT ${index + 1} - 5 min]
📦 ${product.title}
💰 Special Live Price: $${product.livePrice || product.price}
⭐ Key Features:
${product.features?.map(f => `  - ${f}`).join('\n') || '  - Premium quality\n  - Limited edition'}

📱 Tap the basket icon to add to cart NOW!
⏰ Only ${product.inventory} available!

[DEMO/SHOWCASE]
- Show product angles
- Demonstrate use
- Share customer reviews

`).join('\n')}

[CLOSING - 3 min]
"Thank you so much for joining! Orders will ship within 24 hours. Follow us for more live shopping events!"

🎁 EXCLUSIVE DISCOUNT CODE: LIVE${eventData.discountCode || '20'}
  `
}
```

---

### Task 4: User-Generated Content Campaign

**Workflow:**
1. Launch UGC campaign with hashtag
2. Monitor branded hashtag usage
3. Collect customer photos/videos
4. Request usage rights
5. Curate best content
6. Repost to brand channels
7. Tag products in UGC
8. Track campaign performance

**Implementation:**

```javascript
// UGC Campaign Manager
class UGCCampaign {
  constructor(campaignData) {
    this.hashtag = campaignData.hashtag
    this.platforms = campaignData.platforms // ['instagram', 'tiktok']
    this.incentive = campaignData.incentive // discount, feature, giveaway
    this.startDate = campaignData.startDate
    this.endDate = campaignData.endDate
  }

  async launch() {
    // 1. Create campaign announcement posts
    const announcement = {
      caption: `
📸 SHOW US YOUR STYLE! 📸

Share your ${this.hashtag} looks for a chance to:
${this.incentive.includes('feature') ? '✨ Be featured on our page' : ''}
${this.incentive.includes('discount') ? '💰 Get 20% off your next order' : ''}
${this.incentive.includes('giveaway') ? '🎁 Win a $500 shopping spree' : ''}

HOW TO ENTER:
1. Post your photo/video
2. Tag us @brandonmills
3. Use ${this.hashtag}
4. Must be public

Campaign ends ${new Date(this.endDate).toLocaleDateString()}!

#UGC #CustomerLove ${this.hashtag}
      `.trim(),
    }

    await this.postToAllPlatforms(announcement)

    // 2. Set up hashtag monitoring
    await this.startMonitoring()

    // 3. Schedule reminder posts
    await this.scheduleReminders()
  }

  async startMonitoring() {
    // Monitor Instagram hashtag
    setInterval(async () => {
      const posts = await this.searchInstagramHashtag(this.hashtag)
      await this.processNewUGC(posts, 'instagram')
    }, 15 * 60 * 1000) // Every 15 minutes

    // Monitor TikTok hashtag
    setInterval(async () => {
      const videos = await this.searchTikTokHashtag(this.hashtag)
      await this.processNewUGC(videos, 'tiktok')
    }, 15 * 60 * 1000)
  }

  async searchInstagramHashtag(hashtag) {
    // Use Instagram Basic Display API or Graph API
    const response = await instagram.searchHashtag(hashtag)
    return response.data
  }

  async processNewUGC(posts, platform) {
    for (const post of posts) {
      // Check if already processed
      const exists = await db.ugc.findOne({ postId: post.id, platform })
      if (exists) continue

      // Save UGC
      await db.ugc.insert({
        postId: post.id,
        platform,
        author: post.username,
        mediaUrl: post.media_url,
        caption: post.caption,
        timestamp: post.timestamp,
        hashtag: this.hashtag,
        status: 'pending_review',
        createdAt: new Date(),
      })

      // Send notification to review
      await this.notifyNewUGC(post)
    }
  }

  async requestRights(ugcId) {
    const ugc = await db.ugc.findOne({ _id: ugcId })

    // Send DM requesting permission
    const message = `
Hi ${ugc.author}! 👋

We LOVE your post featuring our products! ❤️

Would you give us permission to repost your content on our channels? You'll be credited, and we'd love to send you a special thank you discount! 🎁

Let us know! 🙏
    `.trim()

    if (ugc.platform === 'instagram') {
      await instagram.sendDirectMessage(ugc.author, message)
    } else if (ugc.platform === 'tiktok') {
      // TikTok DM via API (if available)
      console.log('Manual TikTok DM needed for', ugc.author)
    }

    await db.ugc.updateOne({ _id: ugcId }, {
      $set: { status: 'rights_requested', requestedAt: new Date() },
    })
  }

  async repostUGC(ugcId) {
    const ugc = await db.ugc.findOne({ _id: ugcId })

    if (ugc.status !== 'rights_granted') {
      throw new Error('Rights not granted for this UGC')
    }

    // Download media
    const mediaFile = await downloadMedia(ugc.mediaUrl)

    // Create repost caption
    const caption = `
📸 Customer love!

Repost from @${ugc.author}

${ugc.caption ? `"${ugc.caption}"` : ''}

Tag us in your posts for a chance to be featured! ${this.hashtag}

#CustomerLove #UGC
    `.trim()

    // Detect products in image
    const products = await detectProductsInImage(ugc.mediaUrl)

    // Post to Instagram
    if (products.length > 0) {
      await instagram.publishMedia(ugc.mediaUrl, caption, products)
    } else {
      await instagram.publishMedia(ugc.mediaUrl, caption)
    }

    // Update UGC status
    await db.ugc.updateOne({ _id: ugcId }, {
      $set: { status: 'reposted', repostedAt: new Date() },
    })

    // Send thank you DM with discount
    await this.sendThankYou(ugc.author)
  }

  async sendThankYou(username) {
    const discountCode = generateDiscountCode(username)

    const message = `
Thank you for letting us share your amazing content! 🎉

Here's your exclusive 20% off code: ${discountCode}

Valid for 30 days on your next order! 🛍️

We appreciate you! ❤️
    `.trim()

    await instagram.sendDirectMessage(username, message)
  }

  async getCampaignAnalytics() {
    const ugcCount = await db.ugc.countDocuments({ hashtag: this.hashtag })
    const reposted = await db.ugc.countDocuments({ hashtag: this.hashtag, status: 'reposted' })

    const totalReach = await db.ugc.aggregate([
      { $match: { hashtag: this.hashtag } },
      { $group: { _id: null, totalReach: { $sum: '$reach' } } },
    ]).toArray()

    return {
      totalSubmissions: ugcCount,
      repostedCount: reposted,
      totalReach: totalReach[0]?.totalReach || 0,
      engagementRate: await this.calculateEngagementRate(),
    }
  }
}

// Launch UGC campaign
const campaign = new UGCCampaign({
  hashtag: '#BrandonMillsStyle',
  platforms: ['instagram', 'tiktok'],
  incentive: ['feature', 'discount', 'giveaway'],
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-31'),
})

await campaign.launch()
```

---

### Task 5: Cross-Platform Social Listening & Engagement

**Workflow:**
1. Monitor brand mentions across platforms
2. Track product-related keywords
3. Analyze sentiment
4. Auto-respond to common questions
5. Escalate to human for complex issues
6. Track engagement metrics
7. Identify influencers and advocates

**Implementation:**

```javascript
// Social Listening Engine
class SocialListening {
  constructor(config) {
    this.keywords = config.keywords // ['brandon mills', 'luxury jewelry', etc.]
    this.platforms = config.platforms
    this.sentiment = null
  }

  async startListening() {
    // Monitor Instagram mentions
    setInterval(async () => {
      await this.monitorInstagramMentions()
    }, 10 * 60 * 1000) // Every 10 minutes

    // Monitor TikTok comments
    setInterval(async () => {
      await this.monitorTikTokComments()
    }, 10 * 60 * 1000)

    // Monitor Facebook/Instagram comments
    setInterval(async () => {
      await this.monitorComments()
    }, 5 * 60 * 1000) // Every 5 minutes
  }

  async monitorInstagramMentions() {
    // Get recent mentions
    const mentions = await instagram.getUserMentions()

    for (const mention of mentions) {
      // Check if already processed
      const exists = await db.mentions.findOne({ mentionId: mention.id })
      if (exists) continue

      // Analyze sentiment
      const sentiment = await this.analyzeSentiment(mention.caption || mention.text)

      // Save mention
      await db.mentions.insert({
        mentionId: mention.id,
        platform: 'instagram',
        author: mention.username,
        text: mention.caption || mention.text,
        sentiment: sentiment.score,
        mediaType: mention.media_type,
        timestamp: mention.timestamp,
        processed: false,
      })

      // Auto-respond if appropriate
      if (sentiment.score > 0.5) {
        // Positive mention
        await this.respondToPositiveMention(mention)
      } else if (sentiment.score < -0.5) {
        // Negative mention - escalate
        await this.escalateNegativeMention(mention, sentiment)
      }
    }
  }

  async monitorComments() {
    // Get recent posts
    const posts = await instagram.getUserMedia({ limit: 10 })

    for (const post of posts.data) {
      const comments = await instagram.getComments(post.id)

      for (const comment of comments.data) {
        // Check if already processed
        const exists = await db.comments.findOne({ commentId: comment.id })
        if (exists) continue

        // Analyze comment
        await this.processComment(comment, post)
      }
    }
  }

  async processComment(comment, post) {
    // Detect intent
    const intent = await this.detectIntent(comment.text)

    // Save comment
    await db.comments.insert({
      commentId: comment.id,
      postId: post.id,
      author: comment.username,
      text: comment.text,
      intent: intent.category,
      confidence: intent.confidence,
      timestamp: comment.timestamp,
      responded: false,
    })

    // Auto-respond based on intent
    switch (intent.category) {
      case 'product_inquiry':
        await this.respondToProductInquiry(comment, post)
        break

      case 'pricing_question':
        await this.respondToPricingQuestion(comment, post)
        break

      case 'shipping_question':
        await this.respondToShippingQuestion(comment)
        break

      case 'compliment':
        await this.respondToCompliment(comment)
        break

      case 'complaint':
        await this.escalateComplaint(comment)
        break

      default:
        // Log for manual review
        console.log('Unknown intent:', comment.text)
    }
  }

  async detectIntent(text) {
    // Use NLP API (OpenAI, Dialogflow, etc.)
    const keywords = {
      product_inquiry: ['available', 'in stock', 'buy', 'purchase', 'how to order'],
      pricing_question: ['price', 'cost', 'how much', '$', 'expensive'],
      shipping_question: ['ship', 'delivery', 'shipping', 'arrive', 'tracking'],
      compliment: ['love', 'beautiful', 'gorgeous', 'amazing', 'stunning'],
      complaint: ['disappointed', 'broken', 'poor quality', 'refund', 'issue'],
    }

    const lowerText = text.toLowerCase()

    for (const [category, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          return { category, confidence: 0.8 }
        }
      }
    }

    return { category: 'general', confidence: 0.5 }
  }

  async respondToProductInquiry(comment, post) {
    // Extract product from post
    const productTags = await instagram.getProductTags(post.id)

    let response = `Hi! 👋 `

    if (productTags.data.length > 0) {
      response += `You can shop this directly through Instagram! Just tap the product tag in the photo. 🛍️`
    } else {
      response += `Check out our shop in bio or visit brandonmills.com! 🛍️`
    }

    await instagram.replyToComment(comment.id, response)

    // Update comment as responded
    await db.comments.updateOne(
      { commentId: comment.id },
      { $set: { responded: true, responseText: response, respondedAt: new Date() } }
    )
  }

  async respondToCompliment(comment) {
    const responses = [
      `Thank you so much! ❤️ We appreciate your support!`,
      `We're so glad you love it! 🙏 Thank you!`,
      `Your support means the world to us! ✨ Thank you!`,
      `Thank you for the love! ❤️ You're amazing!`,
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    await instagram.replyToComment(comment.id, response)

    await db.comments.updateOne(
      { commentId: comment.id },
      { $set: { responded: true, responseText: response, respondedAt: new Date() } }
    )
  }

  async escalateComplaint(comment) {
    // Send notification to customer service
    await sendNotification({
      type: 'customer_complaint',
      platform: 'instagram',
      author: comment.username,
      text: comment.text,
      url: comment.permalink,
      priority: 'high',
    })

    // Respond with empathy
    const response = `We're so sorry to hear that. 😔 Please DM us so we can make this right! We're here to help. 💙`

    await instagram.replyToComment(comment.id, response)
  }

  async analyzeSentiment(text) {
    // Use sentiment analysis API
    // For demo, simple keyword-based
    const positive = ['love', 'amazing', 'beautiful', 'great', 'excellent']
    const negative = ['hate', 'disappointed', 'poor', 'terrible', 'bad']

    const lowerText = text.toLowerCase()
    let score = 0

    positive.forEach(word => {
      if (lowerText.includes(word)) score += 0.2
    })

    negative.forEach(word => {
      if (lowerText.includes(word)) score -= 0.2
    })

    return {
      score: Math.max(-1, Math.min(1, score)),
      label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
    }
  }

  async identifyInfluencers() {
    // Find users with high engagement who mention brand
    const influencers = await db.mentions.aggregate([
      { $match: { sentiment: { $gt: 0.5 } } },
      {
        $group: {
          _id: '$author',
          mentionCount: { $sum: 1 },
          avgSentiment: { $avg: '$sentiment' },
        },
      },
      { $match: { mentionCount: { $gte: 3 } } },
      { $sort: { mentionCount: -1 } },
      { $limit: 50 },
    ]).toArray()

    // Enrich with follower data
    for (const influencer of influencers) {
      const profile = await instagram.getUserProfile(influencer._id)
      influencer.followers = profile.followers_count
      influencer.engagement_rate = await this.calculateEngagementRate(influencer._id)
    }

    // Save potential influencer list
    await db.influencers.insertMany(influencers)

    return influencers
  }
}

// Start social listening
const listener = new SocialListening({
  keywords: ['brandon mills', '@brandonmills', 'luxury jewelry', 'sterling silver'],
  platforms: ['instagram', 'tiktok', 'facebook'],
})

await listener.startListening()
```

---

## Performance Metrics

### Key Metrics to Track

**Instagram Shopping:**
- Product tag clicks
- Product button clicks
- Checkout initiations
- Purchases attributed to Instagram
- Average order value from Instagram
- Shopping post engagement rate

**Facebook Shops:**
- Shop visits
- Product views
- Add to cart rate
- Checkout starts
- Purchase conversion rate
- Average order value

**TikTok Shop:**
- Product views
- Add to cart rate
- Gross Merchandise Value (GMV)
- Order count
- Live shopping conversion rate
- Video shoppability score

**Pinterest:**
- Pin saves
- Outbound clicks
- Catalog item clicks
- Shopping ad conversions
- Return on ad spend (ROAS)

**Overall Social Commerce:**
- Total social revenue
- Social commerce conversion rate
- Customer acquisition cost (CAC) by platform
- Lifetime value (LTV) of social customers
- Platform attribution and assisted conversions

---

## Best Practices

**Content Strategy:**
- Post consistently (3-5x per week minimum)
- Use high-quality, mobile-optimized images
- Showcase products in lifestyle contexts
- Include customer testimonials and UGC
- Create shoppable video content
- Use Stories and Reels for product demos
- Host live shopping events monthly

**Product Tagging:**
- Tag products in every relevant post
- Don't over-tag (max 5 products per post)
- Tag products naturally in context
- Use product stickers in Stories
- Create product highlight reels
- Test tag positions for best performance

**Engagement:**
- Respond to comments within 1 hour
- Engage with customer content
- Use interactive Stories (polls, questions)
- Run contests and giveaways
- Partner with micro-influencers
- Build community with branded hashtags

**Optimization:**
- A/B test content formats
- Analyze best performing posts
- Track conversion by product type
- Monitor social listening insights
- Adjust strategy based on platform analytics
- Test different posting times

---

## Troubleshooting

**Instagram Shopping Not Approved:**
- Ensure website is professional and complete
- Add clear return/refund policy
- Include contact information
- Remove promotional language from product descriptions
- Follow Instagram commerce policies
- Reapply after making changes

**Product Tags Not Showing:**
- Verify product catalog is synced
- Check product approval status in Commerce Manager
- Ensure account is approved for Shopping
- Verify products meet commerce policies
- Check for pending catalog reviews

**TikTok Shop Orders Not Processing:**
- Verify warehouse settings
- Check inventory availability
- Ensure shipping methods configured
- Verify payment integration
- Contact TikTok Shop support

**Low Conversion Rates:**
- Improve product photography
- Add more product details
- Show products in use (lifestyle)
- Include customer reviews
- Test different price points
- Simplify checkout process
- Add urgency (limited stock, sales)

---

## Resources

**Official Documentation:**
- Meta Commerce Manager: https://www.facebook.com/business/help/commercemanager
- Instagram Shopping: https://help.instagram.com/1187859655048322
- TikTok Shop Seller Center: https://seller.tiktokglobalshop.com/
- Pinterest Business: https://business.pinterest.com/
- YouTube Shopping: https://support.google.com/youtube/answer/10598202

**Tools:**
- Later (social media scheduling)
- Buffer (multi-platform management)
- Canva (content creation)
- Dash Hudson (social commerce analytics)
- Iconosquare (Instagram analytics)

---

**Ready to sell everywhere your customers are!** 🛍️
