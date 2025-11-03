# 🎨 Printful V2 API - Complete Guide

After deep analysis of the API documentation, here's everything you need to know.

---

## 🔑 Key Discovery

**There's NO "store products" in Printful V2!**

Instead of creating products in your store, you:
1. Display Printful's **catalog** on your site
2. Create **orders** directly when customers buy
3. Printful fulfills automatically

**This is BETTER because**:
- ✅ Simpler workflow
- ✅ No product management overhead
- ✅ Always up-to-date with Printful's catalog
- ✅ More flexible pricing

---

## 📊 API Architecture

### **V2 Endpoints** (New API - USE THIS)

```
Authentication
├── /v2/oauth-scopes          # Check token permissions

Catalog (Browse Products)
├── /v2/catalog-categories    # T-shirts, Posters, Canvas, etc.
├── /v2/catalog-products      # All available products
├── /v2/catalog-products/{id}  # Product details
├── /v2/catalog-variants/{id}  # Specific size/color
├── /v2/catalog-products/{id}/prices  # Pricing info
└── /v2/catalog-products/{id}/mockup-templates  # Templates

Files (Upload Images)
├── /v2/files                 # Upload your portfolio images
└── /v2/files/{id}            # Get/delete specific file

Orders (Customer Purchases)
├── /v2/orders                # Create new order
├── /v2/orders/{id}           # Get order status
├── /v2/orders/{id}/confirmation  # Submit for fulfillment
└── /v2/orders/{id}/shipments     # Track shipping

Mockups (Generate Product Images)
├── /v2/mockup-tasks          # Generate mockups
└── /v2/catalog-products/{id}/mockup-styles  # Available styles

Shipping
├── /v2/shipping-rates        # Calculate shipping costs

Stores
├── /v2/stores                # Your store(s)
└── /v2/stores/{id}/statistics  # Sales stats

Webhooks
├── /v2/webhooks              # Set up notifications
└── /v2/webhooks/{eventType}   # Manage specific events
```

---

## 🛍️ Complete Workflow

### **Step 1: Browse Catalog**

```typescript
GET /v2/catalog-products?category_id=10
```

**Returns**: All available products in category

**Categories**:
- 10 = T-shirts & Apparel
- 24 = Posters
- 29 = Canvas Prints
- 19 = Mugs
- And many more...

**Example Response**:
```json
{
  "data": [
    {
      "id": 71,
      "title": "Bella + Canvas 3001 (Unisex)",
      "brand": "Bella+Canvas",
      "model": "3001",
      "description": "Premium unisex T-shirt"
    }
  ]
}
```

### **Step 2: Get Product Variants**

```typescript
GET /v2/catalog-products/71/catalog-variants
```

**Returns**: All sizes/colors for product 71

**Example Response**:
```json
{
  "data": [
    {
      "id": 4011,  // This is the variant_id you'll use!
      "name": "S / Black",
      "size": "S",
      "color": "Black",
      "color_code": "#000000"
    },
    {
      "id": 4012,
      "name": "M / Black",
      "size": "M",
      "color": "Black"
    }
  ]
}
```

### **Step 3: Get Pricing**

```typescript
GET /v2/catalog-variants/4011/prices
```

**Returns**: Cost and retail price suggestions

**Example Response**:
```json
{
  "data": {
    "variant_id": 4011,
    "price": "9.95",  // What Printful charges you
    "currency": "USD",
    "retail_price_range": {
      "min": "19.99",  // Suggested retail
      "max": "29.99"
    }
  }
}
```

**Profit Calculation**:
- Printful cost: $9.95
- You sell for: $29.99
- Your profit: $20.04 🎉

### **Step 4: Upload Your Image**

```typescript
POST /v2/files
Content-Type: multipart/form-data

{
  "file": <binary file data>,
  "filename": "editorial-shoot-1.jpg"
}
```

**Returns**:
```json
{
  "data": {
    "id": "12345",
    "url": "https://files.printful.com/files/abc/editorial-shoot-1.jpg",
    "filename": "editorial-shoot-1.jpg",
    "size": 2048576
  }
}
```

**Keep the `url`** - you'll need it for orders!

### **Step 5: Create Order (When Customer Buys)**

```typescript
POST /v2/orders
X-PF-Store-Id: YOUR_STORE_ID

{
  "recipient": {
    "name": "John Smith",
    "address1": "123 Main St",
    "city": "Los Angeles",
    "state_code": "CA",
    "country_code": "US",
    "zip": "90001",
    "email": "customer@example.com"
  },
  "order_items": [
    {
      "source": "catalog",
      "catalog_variant_id": 4011,  // The variant ID from Step 2
      "quantity": 1,
      "retail_price": "29.99",
      "placements": [
        {
          "placement": "front",  // Where on the shirt
          "technique": "dtg",    // Direct-to-garment printing
          "layers": [
            {
              "type": "file",
              "url": "https://files.printful.com/files/abc/editorial-shoot-1.jpg"
            }
          ]
        }
      ]
    }
  ],
  "retail_costs": {
    "currency": "USD",
    "subtotal": "29.99",
    "shipping": "5.99",
    "tax": "2.40",
    "total": "38.38"
  }
}
```

**Returns**:
```json
{
  "data": {
    "id": 67890,
    "external_id": "ORDER-123",
    "status": "draft",  // Not yet submitted
    "costs": {
      "subtotal": "9.95",  // What you pay Printful
      "shipping": "4.25",
      "total": "14.20"
    }
  }
}
```

**Your profit on this order**: $38.38 - $14.20 = **$24.18** 💰

### **Step 6: Confirm Order**

```typescript
POST /v2/orders/67890/confirmation
```

**This submits the order to Printful for fulfillment!**

**Returns**:
```json
{
  "data": {
    "id": 67890,
    "status": "pending",  // Now in fulfillment queue
    "shipments": []
  }
}
```

### **Step 7: Track Shipment**

```typescript
GET /v2/orders/67890/shipments
```

**Returns**:
```json
{
  "data": [
    {
      "id": "SHIP123",
      "carrier": "USPS",
      "tracking_number": "9400123456789",
      "tracking_url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400123456789",
      "status": "shipped"
    }
  ]
}
```

---

## 💡 Product Placement Reference

### **Common Placements**

| Product Type | Placement Options |
|-------------|-------------------|
| T-shirts | `front`, `back` |
| Hoodies | `front`, `back`, `left_chest`, `right_chest` |
| Posters | `default` |
| Canvas | `default` |
| Mugs | `default` |
| Phone Cases | `default` |

### **Print Techniques**

| Technique | Description | Best For |
|-----------|-------------|----------|
| `dtg` | Direct-to-garment | T-shirts, apparel |
| `sublimation` | Dye sublimation | Mugs, all-over prints |
| `embroidery` | Embroidered | Hats, polos |
| `cut_sew` | Cut & sew | All-over t-shirts |

---

## 🎨 Mockup Generation

**Generate product mockups before listing**:

```typescript
POST /v2/mockup-tasks
{
  "variant_ids": [4011, 4012],
  "files": [
    {
      "placement": "front",
      "image_url": "https://files.printful.com/files/abc/editorial-shoot-1.jpg"
    }
  ]
}
```

**Returns task ID**:
```json
{
  "data": {
    "task_key": "task_abc123",
    "status": "pending"
  }
}
```

**Check task status**:
```typescript
GET /v2/mockup-tasks?task_key=task_abc123
```

**When complete**:
```json
{
  "data": {
    "task_key": "task_abc123",
    "status": "completed",
    "mockups": [
      {
        "variant_id": 4011,
        "mockup_url": "https://printful-mockups.s3.amazonaws.com/mockup_abc.jpg"
      }
    ]
  }
}
```

**Use this mockup_url** on your store page!

---

## 💰 Pricing Strategy

### **Recommended Markups**

| Product | Printful Cost | Your Price | Profit | Margin |
|---------|--------------|------------|--------|--------|
| T-shirt (Bella Canvas 3001) | $9.95 | $29.99 | $20.04 | 67% |
| Premium T-shirt | $12.95 | $34.99 | $22.04 | 63% |
| Hoodie | $24.95 | $54.99 | $30.04 | 55% |
| 18×24" Poster | $11.95 | $49.00 | $37.05 | 76% |
| 16×20" Canvas | $29.95 | $149.00 | $119.05 | 80% |
| 11oz Mug | $7.95 | $19.99 | $12.04 | 60% |

**Add shipping**: Usually $4-8 for customers

---

## 🔐 Authentication

**Header Required**:
```
Authorization: Bearer vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo
X-PF-Store-Id: YOUR_STORE_ID
```

**Get Store ID**:
```typescript
GET /v2/stores
```

---

## 🎯 Implementation Plan

### **Phase 1: Display Catalog**
1. Fetch catalog products by category
2. Get variants (sizes/colors)
3. Get prices
4. Generate mockups with your images
5. Display on `/store` page

### **Phase 2: Shopping Cart**
1. Add to cart functionality (client-side)
2. Stripe checkout integration
3. Collect shipping address

### **Phase 3: Order Processing**
1. Upload image to Printful Files API
2. Create order with customer details
3. Charge customer via Stripe
4. Confirm order to Printful
5. Send confirmation email with tracking

### **Phase 4: Admin Tools**
1. Select portfolio image
2. Choose product type (t-shirt, poster, etc.)
3. Generate mockup
4. Add to store catalog
5. Set custom pricing

---

## 📊 Webhooks (Future)

Set up webhooks to get notified:

```typescript
POST /v2/webhooks
{
  "url": "https://your-site.com/api/webhooks/printful",
  "types": ["order.created", "order.updated", "shipment.created"]
}
```

**Events you'll receive**:
- `order.created` - New order
- `package_shipped` - Order shipped
- `order_failed` - Production issue
- `product_synced` - Product updated

---

## 🚀 Quick Start Code

```typescript
// 1. Get products
const products = await fetch('https://api.printful.com/v2/catalog-products?category_id=10', {
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
  }
})

// 2. Upload image
const formData = new FormData()
formData.append('file', imageFile)
const file = await fetch('https://api.printful.com/v2/files', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
  },
  body: formData
})

// 3. Create order
const order = await fetch('https://api.printful.com/v2/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
    'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: { /* shipping address */ },
    order_items: [{
      source: 'catalog',
      catalog_variant_id: 4011,
      quantity: 1,
      placements: [{
        placement: 'front',
        technique: 'dtg',
        layers: [{ type: 'file', url: file.data.url }]
      }]
    }]
  })
})

// 4. Confirm
await fetch(`https://api.printful.com/v2/orders/${order.data.id}/confirmation`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
  }
})
```

---

## ✅ Next Steps

1. **Get Store ID** from Printful dashboard
2. **Update `.env.local`** with your API key
3. **Test catalog fetch** to see available products
4. **Upload a test image** to Files API
5. **Create a test order** (draft mode)
6. **Generate mockups** for your portfolio images

---

**Built with ❤️ for Brandon Mills Portfolio**
