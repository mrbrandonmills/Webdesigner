# Printful Integration Troubleshooting Guide

Comprehensive solutions to common issues when integrating with Printful API.

## TABLE OF CONTENTS

1. [Authentication Issues](#authentication-issues)
2. [Product Sync Problems](#product-sync-problems)
3. [Order Creation Errors](#order-creation-errors)
4. [Mockup Generation Issues](#mockup-generation-issues)
5. [Webhook Problems](#webhook-problems)
6. [Rate Limiting](#rate-limiting)
7. [File Upload Issues](#file-upload-issues)
8. [Pricing & Cost Issues](#pricing--cost-issues)
9. [Shipping Calculation Errors](#shipping-calculation-errors)
10. [Performance Issues](#performance-issues)

---

## AUTHENTICATION ISSUES

### 401 Unauthorized

**Symptoms:**
```json
{
  "code": 401,
  "result": "Unauthorized",
  "error": {
    "reason": "Unauthorized",
    "message": "Invalid API key"
  }
}
```

**Causes & Solutions:**

1. **Invalid API Key**
   ```bash
   # Check your .env file
   cat .env | grep PRINTFUL_API_KEY

   # Verify format (should be long alphanumeric string)
   # Example: pk_1234567890abcdefghijklmnopqrstuvwxyz
   ```

   **Fix:**
   - Go to Printful Dashboard > Stores > [Your Store] > Settings
   - Generate new API key
   - Update `.env.local` and Vercel environment variables
   - Restart development server

2. **Missing Authorization Header**
   ```typescript
   // ❌ WRONG
   fetch('https://api.printful.com/catalog/products')

   // ✅ CORRECT
   fetch('https://api.printful.com/catalog/products', {
     headers: {
       'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
     }
   })
   ```

3. **Using Sandbox Key in Production**
   ```env
   # Sandbox keys start with "sandbox_"
   PRINTFUL_API_KEY=sandbox_abc123...  # ❌ Wrong for production

   # Production keys start with "pk_"
   PRINTFUL_API_KEY=pk_abc123...  # ✅ Correct
   ```

4. **API Key Expired/Revoked**
   - Regenerate API key in Printful dashboard
   - Update everywhere it's used

**Test Your Fix:**
```bash
node scripts/printful/test-connection.js
```

---

## PRODUCT SYNC PROBLEMS

### Products Not Syncing

**Symptoms:**
- Empty product catalog
- Missing variants
- Outdated pricing

**Diagnostic Steps:**

1. **Check API Response**
   ```bash
   curl -X GET "https://api.printful.com/catalog/products" \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

2. **Verify Cache File**
   ```bash
   # Check if cache exists
   cat data/curated-products.json

   # Check last sync time
   jq '.lastSync' data/curated-products.json
   ```

3. **Check Logs**
   ```bash
   # Run sync with verbose output
   node scripts/printful/sync-products.js
   ```

**Solutions:**

1. **Cache Corruption**
   ```bash
   # Delete and regenerate cache
   rm data/curated-products.json
   node scripts/printful/sync-products.js --force
   ```

2. **Rate Limiting During Sync**
   ```typescript
   // Add delay between requests
   for (const product of products) {
     await fetchProduct(product.id)
     await sleep(500)  // 500ms delay
   }
   ```

3. **Category Filter Too Restrictive**
   ```bash
   # Try without category filter
   node scripts/printful/sync-products.js

   # Instead of
   node scripts/printful/sync-products.js --category=apparel
   ```

---

## ORDER CREATION ERRORS

### Error: "Product not found"

**Symptoms:**
```json
{
  "code": 404,
  "error": {
    "reason": "NotFound",
    "message": "Variant with id 999999 not found"
  }
}
```

**Causes:**

1. **Incorrect Variant ID**
   ```typescript
   // ❌ WRONG - Using internal ID
   variant_id: "printful_71_4011"

   // ✅ CORRECT - Using Printful's variant ID
   variant_id: 4011
   ```

2. **Product Discontinued**
   - Check `is_discontinued` field in product data
   - Sync catalog to remove discontinued products

3. **Variant Out of Stock**
   ```bash
   # Check stock status
   node scripts/printful/check-inventory.js --product=71
   ```

**Fix:**
```typescript
// Validate variant exists before creating order
async function validateVariant(variantId: number): Promise<boolean> {
  try {
    const response = await printful.fetchVariant(variantId)
    return response.variant.in_stock
  } catch (error) {
    return false
  }
}
```

### Error: "Invalid recipient address"

**Symptoms:**
```json
{
  "code": 400,
  "error": {
    "reason": "InvalidRequest",
    "message": "Recipient country code is required"
  }
}
```

**Required Fields:**
```typescript
interface Recipient {
  name: string              // Required
  address1: string          // Required
  city: string              // Required
  state_code: string        // Required for US/CA
  country_code: string      // Required (ISO 3166-1 alpha-2)
  zip: string               // Required
  email: string             // Required
  phone?: string            // Optional but recommended
}
```

**Common Issues:**

1. **Missing State Code**
   ```typescript
   // ❌ WRONG
   {
     country_code: "US",
     state_code: ""  // Empty!
   }

   // ✅ CORRECT
   {
     country_code: "US",
     state_code: "CA"
   }
   ```

2. **Invalid Country Code**
   ```typescript
   // ❌ WRONG
   country_code: "USA"  // 3 letters

   // ✅ CORRECT
   country_code: "US"   // 2 letters (ISO 3166-1)
   ```

3. **PO Box Issues**
   - Some shipping methods don't support PO Boxes
   - Use `address1: "123 Main St"` not `address1: "PO Box 123"`

**Validation Function:**
```typescript
function validateAddress(address: Recipient): string[] {
  const errors: string[] = []

  if (!address.name) errors.push('Name is required')
  if (!address.address1) errors.push('Address is required')
  if (!address.city) errors.push('City is required')
  if (!address.country_code) errors.push('Country is required')
  if (!address.zip) errors.push('Postal code is required')
  if (!address.email) errors.push('Email is required')

  // US/CA require state
  if (['US', 'CA'].includes(address.country_code) && !address.state_code) {
    errors.push('State/Province is required')
  }

  // Validate email
  if (address.email && !address.email.includes('@')) {
    errors.push('Invalid email address')
  }

  return errors
}
```

### Error: "File requirements not met"

**Symptoms:**
```json
{
  "code": 400,
  "error": {
    "reason": "InvalidFile",
    "message": "File resolution is too low (150 DPI, required 300 DPI)"
  }
}
```

**Requirements:**
| Property | Requirement |
|----------|-------------|
| Resolution | 300+ DPI |
| Color Space | sRGB |
| Format | PNG, JPG, PDF, AI, PSD |
| Max Size | 20 MB |
| Max Dimensions | 12000 x 12000 px |

**Check File:**
```bash
# Using ImageMagick
identify -verbose design.png | grep -E "Resolution|Colorspace|Filesize"

# Expected output:
# Resolution: 300x300
# Colorspace: sRGB
# Filesize: 2.4MB
```

**Fix:**
```bash
# Convert to sRGB and ensure 300 DPI
convert input.png \
  -colorspace sRGB \
  -density 300 \
  -units PixelsPerInch \
  output.png
```

---

## MOCKUP GENERATION ISSUES

### Mockups Not Generating

**Symptoms:**
- Task stays in "pending" status
- Timeout after 60 seconds
- No mockup URLs returned

**Debug Steps:**

1. **Check Task Status**
   ```typescript
   const task = await printful.createMockupTask(productId, variantIds, fileUrl)
   console.log('Task Key:', task.task_key)

   // Poll status
   const status = await printful.getMockupTask(task.task_key)
   console.log('Status:', status.status)
   ```

2. **Verify File URL**
   ```typescript
   // File must be publicly accessible
   const response = await fetch(fileUrl)

   if (!response.ok) {
     console.error('File not accessible:', response.status)
   }
   ```

3. **Check Print Area Position**
   ```typescript
   // Common issue: incorrect dimensions
   const position = {
     area_width: 1800,   // Printable area width
     area_height: 2400,  // Printable area height
     width: 1800,        // Design width (should fit in area)
     height: 1800,       // Design height
     top: 300,           // Y offset (must be positive)
     left: 0,            // X offset (must be positive)
   }

   // Validate
   if (position.width > position.area_width) {
     console.error('Design too wide')
   }
   if (position.height > position.area_height) {
     console.error('Design too tall')
   }
   ```

**Solutions:**

1. **Increase Timeout**
   ```typescript
   async function waitForMockups(taskKey: string, maxAttempts = 60) {
     for (let i = 0; i < maxAttempts; i++) {
       const status = await checkStatus(taskKey)

       if (status.status === 'completed') return status.mockups
       if (status.status === 'failed') throw new Error('Generation failed')

       await sleep(2000)  // Wait 2 seconds
     }

     throw new Error('Timeout after 2 minutes')
   }
   ```

2. **Use Uploaded File ID Instead of URL**
   ```typescript
   // Upload file first
   const uploadedFile = await printful.uploadFile(fileBuffer)

   // Then use file ID
   {
     files: [
       {
         id: uploadedFile.id,  // ✅ More reliable
         // url: 'https://...',  // ❌ Can fail if not accessible
       }
     ]
   }
   ```

3. **Retry Failed Tasks**
   ```typescript
   try {
     const mockups = await generateMockups(productId, variants)
   } catch (error) {
     if (error.message === 'Generation failed') {
       // Wait 5 minutes and retry
       await sleep(300000)
       return generateMockups(productId, variants)
     }
   }
   ```

---

## WEBHOOK PROBLEMS

### Webhooks Not Received

**Symptoms:**
- Order status not updating
- No shipping notifications
- Events missing

**Debug Checklist:**

1. **Verify Webhook URL**
   ```bash
   # Test your endpoint is accessible
   curl -X POST https://yourdomain.com/api/printful/webhook \
     -H "Content-Type: application/json" \
     -d '{"type":"test","data":{}}'
   ```

2. **Check Printful Dashboard**
   - Go to Stores > [Your Store] > Webhooks
   - Verify URL is correct
   - Check "Recent Deliveries" for errors

3. **Verify Signature Validation**
   ```typescript
   import crypto from 'crypto'

   function validateSignature(payload: string, signature: string): boolean {
     const hash = crypto
       .createHmac('sha256', process.env.PRINTFUL_WEBHOOK_SECRET!)
       .update(payload)
       .digest('hex')

     console.log('Expected:', hash)
     console.log('Received:', signature)

     return hash === signature
   }
   ```

**Solutions:**

1. **Invalid Signature**
   ```typescript
   // Get raw body (don't parse JSON first!)
   export async function POST(request: Request) {
     const payload = await request.text()  // ✅ Raw string
     const signature = request.headers.get('X-Printful-Signature')

     if (!validateSignature(payload, signature)) {
       return new Response('Invalid signature', { status: 401 })
     }

     const event = JSON.parse(payload)  // Parse after validation
     // ...
   }
   ```

2. **Timeout (Webhook Must Respond in 5s)**
   ```typescript
   export async function POST(request: Request) {
     const event = await request.json()

     // Queue for async processing
     await queue.add('printful-webhook', event)

     // Respond immediately
     return new Response('OK', { status: 200 })  // ✅ Fast response
   }

   // Process asynchronously
   queue.process('printful-webhook', async (job) => {
     await handleWebhookEvent(job.data)
   })
   ```

3. **Local Development (Webhooks Can't Reach Localhost)**
   ```bash
   # Use ngrok to expose local server
   ngrok http 3000

   # Use ngrok URL in Printful dashboard
   # https://abc123.ngrok.io/api/printful/webhook
   ```

---

## RATE LIMITING

### 429 Too Many Requests

**Symptoms:**
```json
{
  "code": 429,
  "result": "Too Many Requests",
  "error": {
    "reason": "RateLimitExceeded",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  }
}
```

**Rate Limits:**
- **Standard endpoints:** 120 requests/minute
- **Mockup generator:** 60 requests/minute
- **File uploads:** 10 requests/minute

**Solutions:**

1. **Implement Rate Limiter**
   ```typescript
   class RateLimiter {
     private queue: Array<() => Promise<any>> = []
     private lastRequest = 0
     private minInterval = 500  // 500ms = 120/min

     async add<T>(fn: () => Promise<T>): Promise<T> {
       return new Promise((resolve, reject) => {
         this.queue.push(async () => {
           const now = Date.now()
           const timeSinceLastRequest = now - this.lastRequest

           if (timeSinceLastRequest < this.minInterval) {
             await sleep(this.minInterval - timeSinceLastRequest)
           }

           this.lastRequest = Date.now()

           try {
             const result = await fn()
             resolve(result)
           } catch (error) {
             reject(error)
           }
         })

         this.processQueue()
       })
     }

     private async processQueue() {
       while (this.queue.length > 0) {
         const task = this.queue.shift()!
         await task()
       }
     }
   }

   // Usage
   const limiter = new RateLimiter()
   const product = await limiter.add(() => printful.fetchProduct(id))
   ```

2. **Exponential Backoff**
   ```typescript
   async function apiCallWithRetry<T>(
     fn: () => Promise<T>,
     maxRetries = 3
   ): Promise<T> {
     for (let attempt = 1; attempt <= maxRetries; attempt++) {
       try {
         return await fn()
       } catch (error: any) {
         if (error.code === 429 && attempt < maxRetries) {
           const delay = Math.pow(2, attempt) * 1000  // 2s, 4s, 8s
           await sleep(delay)
           continue
         }
         throw error
       }
     }
   }
   ```

3. **Batch Requests**
   ```typescript
   // ❌ BAD: Individual requests
   for (const id of productIds) {
     await printful.fetchProduct(id)  // 100 requests!
   }

   // ✅ GOOD: Batch requests
   const products = await printful.fetchProducts()
   const filtered = products.filter(p => productIds.includes(p.id))
   ```

4. **Cache Aggressively**
   ```typescript
   const cache = new Map<string, { data: any; expires: number }>()

   async function fetchWithCache(key: string, fn: () => Promise<any>, ttl = 3600) {
     const cached = cache.get(key)

     if (cached && cached.expires > Date.now()) {
       return cached.data
     }

     const data = await fn()
     cache.set(key, { data, expires: Date.now() + ttl * 1000 })

     return data
   }

   // Usage
   const product = await fetchWithCache(
     `product-${id}`,
     () => printful.fetchProduct(id),
     3600  // 1 hour
   )
   ```

---

## FILE UPLOAD ISSUES

### Upload Fails Silently

**Debug:**
```typescript
async function uploadFile(filePath: string) {
  const formData = new FormData()
  formData.append('file', fs.createReadStream(filePath))
  formData.append('type', 'default')

  try {
    const response = await fetch('https://api.printful.com/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    const data = await response.json()

    console.log('Upload response:', {
      status: response.status,
      data,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${JSON.stringify(data)}`)
    }

    return data.result
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}
```

**Common Issues:**

1. **File Too Large (>20MB)**
   ```bash
   # Compress image
   convert large.png -quality 85 -resize 50% compressed.png
   ```

2. **Incorrect Content-Type**
   ```typescript
   // Let the library handle Content-Type
   // Don't set it manually with multipart/form-data
   ```

3. **File Not Readable**
   ```typescript
   if (!fs.existsSync(filePath)) {
     throw new Error('File not found')
   }

   const stats = fs.statSync(filePath)
   console.log('File size:', stats.size, 'bytes')
   ```

---

## PRICING & COST ISSUES

### Prices Don't Match Printful Dashboard

**Causes:**

1. **Using Cached Pricing**
   ```bash
   # Refresh pricing
   node scripts/printful/update-pricing.js
   ```

2. **Printful Changed Costs**
   - Printful occasionally updates product costs
   - Set up webhook for `product_updated` events
   - Run pricing update weekly

3. **Multi-Currency Issues**
   ```typescript
   // Always use USD for consistency
   const price = parseFloat(variant.price)  // Already in USD

   // Don't convert manually
   const priceEUR = price * exchangeRate  // ❌ Unreliable
   ```

**Fix:**
```typescript
// Listen for price changes
webhook.on('product_updated', async (event) => {
  const productId = event.data.product.id
  await updateProductPricing(productId)
})
```

---

## SHIPPING CALCULATION ERRORS

### Shipping Cost Zero or Incorrect

**Debug:**
```typescript
async function estimateShipping(order: Order) {
  console.log('Estimating shipping for:', {
    items: order.items.length,
    destination: order.recipient.country_code,
  })

  const result = await printful.estimateShipping({
    recipient: order.recipient,
    items: order.items,
  })

  console.log('Shipping estimate:', {
    methods: result.length,
    costs: result.map(m => ({ id: m.id, rate: m.rate })),
  })

  return result
}
```

**Solutions:**

1. **Invalid Destination**
   - Verify country code is supported
   - Check Printful's shipping countries list

2. **Missing Item Dimensions**
   - Some items need size/weight info
   - Use Printful's default dimensions

---

## PERFORMANCE ISSUES

### Slow Product Loading

**Optimize:**
```typescript
// ❌ BAD: Sequential loading
for (const product of products) {
  const details = await fetchProductDetails(product.id)
  const mockups = await generateMockups(product.id)
}

// ✅ GOOD: Parallel loading
await Promise.all(
  products.map(async (product) => {
    const [details, mockups] = await Promise.all([
      fetchProductDetails(product.id),
      generateMockups(product.id),
    ])
  })
)
```

### Large Cache Files

**Solution:**
```bash
# Compress cache
gzip data/curated-products.json

# Serve compressed version
# Next.js handles this automatically
```

---

## GETTING HELP

### Still Stuck?

1. **Check Printful Status**
   - https://status.printful.com

2. **Review API Docs**
   - https://developers.printful.com

3. **Contact Support**
   - Email: support@printful.com
   - Include: Error message, API endpoint, request payload

4. **Community Forum**
   - https://forum.printful.com

### Useful Debugging Commands

```bash
# Test connection
node scripts/printful/test-connection.js

# Check inventory
node scripts/printful/check-inventory.js

# Sync products with verbose logging
DEBUG=printful:* node scripts/printful/sync-products.js

# Check webhook logs
tail -f logs/webhooks.log
```

---

**Last Updated:** November 5, 2025
**Version:** 1.0
**Maintained By:** Printful Integration Specialist