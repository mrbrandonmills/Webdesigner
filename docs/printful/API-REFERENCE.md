# Printful API Reference

Complete API documentation for all endpoints used in Brandon Mills' e-commerce integration.

## BASE CONFIGURATION

```typescript
const PRINTFUL_API_BASE = 'https://api.printful.com'
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY

const headers = {
  'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
  'Content-Type': 'application/json',
  'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID,
}
```

## RATE LIMITING

- **Standard Endpoints:** 120 requests/minute
- **Mockup Generator:** 60 requests/minute
- **File Upload:** 10 requests/minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1636329600
```

## AUTHENTICATION

### Bearer Token (Recommended)
```bash
curl -X GET "https://api.printful.com/catalog/products" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Basic Auth (Legacy)
```bash
curl -X GET "https://api.printful.com/catalog/products" \
  -u "YOUR_API_KEY:"
```

---

## CATALOG ENDPOINTS

### GET /catalog/products
Fetch all catalog products (300+ products).

**Request:**
```bash
GET https://api.printful.com/catalog/products?limit=20&offset=0
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Items per page (default: 20, max: 100) |
| offset | integer | Pagination offset |

**Response:**
```json
{
  "code": 200,
  "result": [
    {
      "id": 71,
      "type": "T-SHIRT",
      "type_name": "T-Shirt",
      "title": "Bella + Canvas 3001 Unisex Short Sleeve Jersey T-Shirt with Tear Away Label",
      "brand": "Bella + Canvas",
      "model": "3001",
      "image": "https://files.cdn.printful.com/products/71/product_1581412596.jpg",
      "variant_count": 265,
      "currency": "USD",
      "files": [
        {
          "id": "default",
          "type": "default",
          "title": "Default",
          "additional_price": null
        },
        {
          "id": "front",
          "type": "front",
          "title": "Front print",
          "additional_price": "0.00"
        },
        {
          "id": "back",
          "type": "back",
          "title": "Back print",
          "additional_price": "5.95"
        }
      ],
      "options": [
        {
          "id": "embroidery_type",
          "title": "Embroidery type",
          "type": "select",
          "values": {
            "flat": "Flat",
            "3d": "3D puff"
          },
          "additional_price_breakdown": {
            "flat": 0,
            "3d": 2
          }
        }
      ],
      "dimensions": null,
      "is_discontinued": false,
      "description": "The unisex soft-style t-shirt puts a new spin..."
    }
  ],
  "paging": {
    "total": 312,
    "offset": 0,
    "limit": 20
  }
}
```

**TypeScript Interface:**
```typescript
interface CatalogProduct {
  id: number
  type: string
  type_name: string
  title: string
  brand: string
  model: string
  image: string
  variant_count: number
  currency: string
  files: ProductFile[]
  options: ProductOption[]
  is_discontinued: boolean
  description: string
}

interface ProductFile {
  id: string
  type: string
  title: string
  additional_price: string | null
}
```

---

### GET /catalog/products/{id}
Get detailed information about a specific product.

**Request:**
```bash
GET https://api.printful.com/catalog/products/71
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "product": {
      "id": 71,
      "title": "Bella + Canvas 3001 Unisex T-Shirt",
      "brand": "Bella + Canvas",
      "model": "3001",
      "image": "https://...",
      "variant_count": 265
    },
    "variants": [
      {
        "id": 4011,
        "product_id": 71,
        "name": "Bella + Canvas 3001 Unisex Short Sleeve Jersey T-Shirt with Tear Away Label (Black / S)",
        "size": "S",
        "color": "Black",
        "color_code": "#000000",
        "color_code2": null,
        "image": "https://files.cdn.printful.com/products/71/4011_1581410159.jpg",
        "price": "11.50",
        "in_stock": true,
        "availability_regions": {
          "US": "in_stock",
          "EU": "in_stock",
          "MX": "in_stock",
          "CA": "in_stock"
        },
        "availability_status": [
          {
            "region": "US",
            "status": "in_stock"
          }
        ]
      }
    ]
  }
}
```

**TypeScript Interface:**
```typescript
interface ProductDetails {
  product: CatalogProduct
  variants: ProductVariant[]
}

interface ProductVariant {
  id: number
  product_id: number
  name: string
  size: string
  color: string
  color_code: string
  color_code2: string | null
  image: string
  price: string
  in_stock: boolean
  availability_regions: {
    US: string
    EU: string
    MX: string
    CA: string
  }
}
```

---

### GET /catalog/variants/{id}
Get specific variant details including print areas.

**Request:**
```bash
GET https://api.printful.com/catalog/variants/4011
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "variant": {
      "id": 4011,
      "product_id": 71,
      "name": "Bella + Canvas 3001 (Black / S)",
      "size": "S",
      "color": "Black",
      "price": "11.50",
      "in_stock": true
    },
    "product": {
      "id": 71,
      "title": "Bella + Canvas 3001"
    },
    "files": [
      {
        "id": "default",
        "type": "default",
        "title": "Default",
        "additional_price": null
      },
      {
        "id": "front",
        "type": "front",
        "title": "Front print",
        "additional_price": "0.00"
      }
    ]
  }
}
```

---

### GET /catalog/categories
Get all product categories.

**Request:**
```bash
GET https://api.printful.com/catalog/categories
```

**Response:**
```json
{
  "code": 200,
  "result": [
    {
      "id": 24,
      "parent_id": 0,
      "image_url": "https://...",
      "catalog_position": 1,
      "size": 266,
      "title": "Men's Clothing"
    },
    {
      "id": 27,
      "parent_id": 0,
      "image_url": "https://...",
      "catalog_position": 4,
      "size": 148,
      "title": "Home & Living"
    }
  ]
}
```

---

## ORDER ENDPOINTS

### POST /orders
Create a new order (draft or confirmed).

**Request:**
```bash
POST https://api.printful.com/orders
Content-Type: application/json

{
  "external_id": "ORDER-12345",
  "shipping": "STANDARD",
  "recipient": {
    "name": "John Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "state_code": "NY",
    "country_code": "US",
    "zip": "10001",
    "phone": "+1 234-567-8900",
    "email": "john@example.com"
  },
  "items": [
    {
      "variant_id": 4011,
      "quantity": 1,
      "retail_price": "29.99",
      "name": "Brandon Mills Logo Tee",
      "files": [
        {
          "url": "https://example.com/designs/logo-front.png"
        }
      ]
    }
  ]
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| external_id | string | No | Your internal order ID |
| shipping | string | Yes | Shipping method code |
| recipient | object | Yes | Shipping address |
| items | array | Yes | Order items |
| retail_costs | object | No | Price breakdown |
| confirm | boolean | No | true = confirm, false = draft (default) |

**Recipient Object:**
```typescript
interface Recipient {
  name: string              // Full name
  company?: string          // Company name
  address1: string          // Street address
  address2?: string         // Apt/Suite
  city: string              // City
  state_code: string        // State (US) or province
  state_name?: string       // Full state name
  country_code: string      // ISO 3166-1 alpha-2 (US, CA, GB)
  zip: string               // Postal code
  phone?: string            // Phone number (+1234567890)
  email: string             // Email address
  tax_number?: string       // VAT/tax ID
}
```

**Item Object:**
```typescript
interface OrderItem {
  variant_id: number        // Printful variant ID
  quantity: number          // Quantity (1-999)
  retail_price?: string     // Your selling price
  name?: string             // Product name (optional)
  files: OrderFile[]        // Print files
  options?: OrderOption[]   // Embroidery, etc.
}

interface OrderFile {
  url?: string              // File URL (or id if uploaded)
  id?: number               // Uploaded file ID
  type?: string             // "default", "front", "back"
  position?: FilePosition   // Custom positioning
}

interface FilePosition {
  area_width: number        // Print area width (px)
  area_height: number       // Print area height (px)
  width: number             // Design width (px)
  height: number            // Design height (px)
  top: number               // Offset from top (px)
  left: number              // Offset from left (px)
}
```

**Response (Draft Order):**
```json
{
  "code": 200,
  "result": {
    "id": 123456789,
    "external_id": "ORDER-12345",
    "status": "draft",
    "shipping": "STANDARD",
    "created": 1636329600,
    "updated": 1636329600,
    "recipient": { ... },
    "items": [ ... ],
    "costs": {
      "currency": "USD",
      "subtotal": "11.50",
      "discount": "0.00",
      "shipping": "4.99",
      "digitization": "0.00",
      "additional_fee": "0.00",
      "fulfillment_fee": "0.00",
      "tax": "0.00",
      "vat": "0.00",
      "total": "16.49"
    },
    "retail_costs": {
      "currency": "USD",
      "subtotal": "29.99",
      "discount": "0.00",
      "shipping": "5.99",
      "tax": "2.40",
      "vat": "0.00",
      "total": "38.38"
    }
  }
}
```

---

### POST /orders/{id}/confirm
Confirm a draft order for fulfillment.

**Request:**
```bash
POST https://api.printful.com/orders/123456789/confirm
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "id": 123456789,
    "status": "pending",
    "dashboard_url": "https://www.printful.com/dashboard#/orders/123456789"
  }
}
```

---

### GET /orders/{id}
Get order details and status.

**Request:**
```bash
GET https://api.printful.com/orders/123456789
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "id": 123456789,
    "external_id": "ORDER-12345",
    "status": "fulfilled",
    "shipping": "STANDARD",
    "shipments": [
      {
        "id": 987654,
        "carrier": "USPS",
        "service": "First-Class Mail",
        "tracking_number": "9400111899223608123456",
        "tracking_url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223608123456",
        "created": 1636416000,
        "ship_date": "2021-11-09",
        "shipped_at": 1636416000,
        "reshipment": false,
        "items": [
          {
            "item_id": 123,
            "quantity": 1
          }
        ]
      }
    ]
  }
}
```

**Order Statuses:**
| Status | Description |
|--------|-------------|
| draft | Order created but not confirmed |
| pending | Confirmed, waiting for fulfillment |
| failed | Order failed (payment, file issues) |
| canceled | Order canceled |
| inprocess | Being manufactured |
| onhold | On hold (payment, address issues) |
| partial | Partially fulfilled |
| fulfilled | All items shipped |

---

### DELETE /orders/{id}
Cancel a draft or pending order.

**Request:**
```bash
DELETE https://api.printful.com/orders/123456789
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "id": 123456789,
    "status": "canceled"
  }
}
```

---

### POST /orders/estimate-costs
Estimate costs before creating order.

**Request:**
```bash
POST https://api.printful.com/orders/estimate-costs
Content-Type: application/json

{
  "recipient": {
    "country_code": "US",
    "state_code": "CA",
    "city": "Los Angeles",
    "zip": "90001"
  },
  "items": [
    {
      "variant_id": 4011,
      "quantity": 1,
      "files": [
        {
          "url": "https://example.com/design.png"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "costs": {
      "currency": "USD",
      "subtotal": "11.50",
      "discount": "0.00",
      "shipping": "4.99",
      "tax": "0.00",
      "total": "16.49"
    },
    "retail_costs": {
      "currency": "USD",
      "subtotal": "29.99",
      "shipping": "5.99",
      "tax": "2.40",
      "total": "38.38"
    },
    "items": [
      {
        "variant_id": 4011,
        "quantity": 1,
        "cost": "11.50",
        "retail_price": "29.99"
      }
    ]
  }
}
```

---

## SHIPPING ENDPOINTS

### GET /shipping/rates
Get available shipping methods for a destination.

**Request:**
```bash
POST https://api.printful.com/shipping/rates
Content-Type: application/json

{
  "recipient": {
    "country_code": "US",
    "state_code": "NY",
    "zip": "10001"
  },
  "items": [
    {
      "variant_id": 4011,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "result": [
    {
      "id": "STANDARD",
      "name": "Standard",
      "rate": "4.99",
      "currency": "USD",
      "minDeliveryDays": 5,
      "maxDeliveryDays": 7,
      "minDeliveryDate": "2021-11-15",
      "maxDeliveryDate": "2021-11-17"
    },
    {
      "id": "EXPEDITED",
      "name": "Expedited",
      "rate": "12.99",
      "currency": "USD",
      "minDeliveryDays": 2,
      "maxDeliveryDays": 5,
      "minDeliveryDate": "2021-11-12",
      "maxDeliveryDate": "2021-11-15"
    }
  ]
}
```

---

## TAX ENDPOINTS

### POST /tax/rates
Calculate tax for an order.

**Request:**
```bash
POST https://api.printful.com/tax/rates
Content-Type: application/json

{
  "recipient": {
    "country_code": "US",
    "state_code": "CA",
    "city": "Los Angeles",
    "zip": "90001"
  },
  "items": [
    {
      "variant_id": 4011,
      "quantity": 1,
      "value": "29.99"
    }
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "required": true,
    "rate": 0.0925,
    "shipping_taxable": true,
    "states": ["CA"]
  }
}
```

**Tax Calculation:**
```typescript
const taxRate = 0.0925  // 9.25% California
const subtotal = 29.99
const shipping = 5.99

const tax = (subtotal + shipping) * taxRate
// $35.98 * 0.0925 = $3.33
```

---

## FILE ENDPOINTS

### POST /files
Upload a print file.

**Request:**
```bash
POST https://api.printful.com/files
Content-Type: multipart/form-data

file: <binary>
type: default
```

**Response:**
```json
{
  "code": 200,
  "result": {
    "id": 987654321,
    "type": "default",
    "hash": "md5hash",
    "url": "https://files.printful.com/files/987/987654321.png",
    "filename": "design.png",
    "mime_type": "image/png",
    "size": 245678,
    "width": 3000,
    "height": 3000,
    "dpi": 300,
    "status": "ok",
    "created": 1636329600,
    "thumbnail_url": "https://files.printful.com/files/987/thumbnail_987654321.png",
    "preview_url": "https://files.printful.com/files/987/preview_987654321.png",
    "visible": true
  }
}
```

**File Requirements:**
| Property | Requirement |
|----------|-------------|
| Max Size | 20 MB |
| Formats | PNG, JPG, PDF, AI, PSD |
| DPI | 300+ recommended |
| Color Mode | sRGB |
| Max Dimensions | 12000 x 12000 px |

---

## MOCKUP GENERATOR ENDPOINTS

### POST /mockup-generator/create-task/{id}
Generate product mockups.

**Request:**
```bash
POST https://api.printful.com/mockup-generator/create-task/71
Content-Type: application/json

{
  "variant_ids": [4011, 4012, 4013],
  "format": "jpg",
  "files": [
    {
      "placement": "front",
      "image_url": "https://example.com/design.png",
      "position": {
        "area_width": 1800,
        "area_height": 2400,
        "width": 1800,
        "height": 1800,
        "top": 300,
        "left": 0
      }
    }
  ]
}
```

**Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| variant_ids | array | Variant IDs to generate mockups for |
| format | string | "jpg" or "png" |
| files | array | Design files with placement |
| option_groups | array | Product options (optional) |
| options | array | Specific option values (optional) |

**Response:**
```json
{
  "code": 200,
  "result": {
    "task_key": "gt-123456789",
    "status": "pending"
  }
}
```

---

### GET /mockup-generator/task
Check mockup generation status.

**Request:**
```bash
GET https://api.printful.com/mockup-generator/task?task_key=gt-123456789
```

**Response (Pending):**
```json
{
  "code": 200,
  "result": {
    "task_key": "gt-123456789",
    "status": "pending"
  }
}
```

**Response (Completed):**
```json
{
  "code": 200,
  "result": {
    "task_key": "gt-123456789",
    "status": "completed",
    "mockups": [
      {
        "variant_ids": [4011],
        "placement": "front",
        "mockup_url": "https://files.printful.com/mockups/gt-123456789/4011-front.jpg",
        "extra": [
          {
            "title": "Flat",
            "url": "https://files.printful.com/mockups/gt-123456789/4011-flat.jpg"
          },
          {
            "title": "Lifestyle",
            "url": "https://files.printful.com/mockups/gt-123456789/4011-lifestyle.jpg"
          }
        ]
      }
    ]
  }
}
```

**Polling Strategy:**
```typescript
async function waitForMockups(taskKey: string): Promise<Mockup[]> {
  let attempts = 0
  const maxAttempts = 30
  const delay = 2000  // 2 seconds

  while (attempts < maxAttempts) {
    const result = await printful.getMockupTask(taskKey)

    if (result.status === 'completed') {
      return result.mockups
    }

    if (result.status === 'failed') {
      throw new Error('Mockup generation failed')
    }

    await sleep(delay)
    attempts++
  }

  throw new Error('Mockup generation timeout')
}
```

---

## WEBHOOK ENDPOINTS

### Webhook Configuration
Set up webhooks in Printful dashboard:
1. Settings > Stores > [Your Store] > Webhooks
2. Add URL: `https://yourdomain.com/api/printful/webhook`
3. Select events to listen for
4. Save secret for signature validation

### Webhook Events

**package_shipped:**
```json
{
  "type": "package_shipped",
  "created": 1636416000,
  "retries": 0,
  "data": {
    "order": {
      "id": 123456789,
      "external_id": "ORDER-12345",
      "status": "fulfilled"
    },
    "shipment": {
      "id": 987654,
      "carrier": "USPS",
      "service": "First-Class Mail",
      "tracking_number": "9400111899223608123456",
      "tracking_url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223608123456",
      "ship_date": "2021-11-09",
      "shipped_at": 1636416000,
      "items": [...]
    }
  }
}
```

**package_returned:**
```json
{
  "type": "package_returned",
  "created": 1636502400,
  "data": {
    "order": {
      "id": 123456789,
      "external_id": "ORDER-12345"
    },
    "reason": "Undeliverable"
  }
}
```

**order_failed:**
```json
{
  "type": "order_failed",
  "created": 1636329600,
  "data": {
    "order": {
      "id": 123456789,
      "external_id": "ORDER-12345",
      "status": "failed"
    },
    "reason": "Out of stock"
  }
}
```

**order_canceled:**
```json
{
  "type": "order_canceled",
  "created": 1636329600,
  "data": {
    "order": {
      "id": 123456789,
      "external_id": "ORDER-12345",
      "status": "canceled"
    },
    "reason": "Customer request"
  }
}
```

**product_synced:**
```json
{
  "type": "product_synced",
  "created": 1636329600,
  "data": {
    "sync_product": {
      "id": 12345,
      "external_id": "PROD-789",
      "name": "Brandon Mills Logo Tee",
      "variants": 10,
      "synced": 10
    }
  }
}
```

**stock_updated:**
```json
{
  "type": "stock_updated",
  "created": 1636329600,
  "data": {
    "variant": {
      "id": 4011,
      "product_id": 71,
      "in_stock": false,
      "availability_status": [
        {
          "region": "US",
          "status": "out_of_stock"
        }
      ]
    }
  }
}
```

### Webhook Signature Validation

```typescript
import crypto from 'crypto'

function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return hash === signature
}

// Usage in API route
export async function POST(request: Request) {
  const signature = request.headers.get('X-Printful-Signature')
  const payload = await request.text()

  if (!validateWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(payload)
  await handleWebhookEvent(event)

  return new Response('OK', { status: 200 })
}
```

---

## ERROR HANDLING

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Verify API key |
| 404 | Not Found | Check resource ID |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry with exponential backoff |

### Error Response Format

```json
{
  "code": 400,
  "result": "Bad Request",
  "error": {
    "reason": "InvalidRequest",
    "message": "Recipient country code is required"
  },
  "extra": []
}
```

### Common Errors

**Invalid API Key:**
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

**Product Not Found:**
```json
{
  "code": 404,
  "result": "Not Found",
  "error": {
    "reason": "NotFound",
    "message": "Product with id 999999 not found"
  }
}
```

**Out of Stock:**
```json
{
  "code": 400,
  "result": "Bad Request",
  "error": {
    "reason": "OutOfStock",
    "message": "Variant 4011 is out of stock in US region"
  }
}
```

**Invalid File:**
```json
{
  "code": 400,
  "result": "Bad Request",
  "error": {
    "reason": "InvalidFile",
    "message": "File resolution is too low (150 DPI, required 300 DPI)"
  }
}
```

### Retry Logic

```typescript
async function apiCallWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry client errors (4xx except 429)
      if (error.code >= 400 && error.code < 500 && error.code !== 429) {
        throw error
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000
      await sleep(delay)
    }
  }

  throw lastError!
}
```

---

## TESTING

### Sandbox Mode

```env
PRINTFUL_API_KEY=sandbox_api_key_here
```

**Sandbox Features:**
- Create test orders (not fulfilled)
- Test webhooks
- Test file uploads
- No charges

**Sandbox Limitations:**
- Orders stay in "pending" status
- No actual fulfillment
- Limited to 100 test orders/month

### Test Card Numbers

For testing Printful billing (not needed for integration):
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Amex: 3782 822463 10005
```

---

## RATE LIMITING BEST PRACTICES

```typescript
class PrintfulClient {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private lastRequest = 0
  private minInterval = 500  // 500ms = 120 req/min

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          // Wait if needed
          const now = Date.now()
          const timeSinceLastRequest = now - this.lastRequest
          if (timeSinceLastRequest < this.minInterval) {
            await sleep(this.minInterval - timeSinceLastRequest)
          }

          const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              ...options?.headers,
            },
          })

          this.lastRequest = Date.now()

          if (response.status === 429) {
            // Rate limited, wait and retry
            const retryAfter = response.headers.get('Retry-After')
            await sleep(parseInt(retryAfter || '60') * 1000)
            return this.request(endpoint, options)  // Retry
          }

          const data = await response.json()
          resolve(data.result)
        } catch (error) {
          reject(error)
        }
      })

      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    this.processing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      await task()
    }

    this.processing = false
  }
}
```

---

## USEFUL CONSTANTS

### Shipping Methods
```typescript
const SHIPPING_METHODS = {
  STANDARD: 'STANDARD',       // 5-7 business days
  EXPEDITED: 'EXPEDITED',     // 2-5 business days
  OVERNIGHT: 'OVERNIGHT',     // 1-2 business days
  PRIORITY: 'PRIORITY',       // 3-4 business days (Canada)
} as const
```

### Order Statuses
```typescript
const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELED: 'canceled',
  INPROCESS: 'inprocess',
  ONHOLD: 'onhold',
  PARTIAL: 'partial',
  FULFILLED: 'fulfilled',
} as const
```

### Product Categories
```typescript
const PRODUCT_CATEGORIES = {
  MENS_CLOTHING: 24,
  WOMENS_CLOTHING: 25,
  KIDS_CLOTHING: 26,
  HOME_LIVING: 27,
  ACCESSORIES: 32,
} as const
```

---

**Official Documentation:** https://developers.printful.com
**API Status:** https://status.printful.com
**Support:** support@printful.com

**Last Updated:** November 5, 2025
**API Version:** v1
**Maintained By:** Printful Integration Specialist