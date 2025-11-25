# App Routes & Pages Guidelines

Context-specific guidelines for the `app/` directory - Next.js 15 App Router implementation.

## Overview

This directory contains all frontend routes, page components, layouts, and API endpoints using Next.js 15 App Router conventions. The app includes public-facing pages (portfolio, store), admin dashboard, and API routes for backend functionality.

## Directory Structure

```
app/
├── (public routes)
│   ├── page.tsx              # Homepage
│   ├── about/                # About page
│   ├── gallery/              # Portfolio gallery
│   ├── work/                 # Individual work pages
│   │   ├── [slug]/          # Dynamic work detail pages
│   │   └── layout.tsx       # Work section layout
│   ├── store/               # E-commerce store pages
│   ├── checkout/            # Checkout flow
│   ├── contact/             # Contact form
│   └── review/              # Review pages
├── admin/                   # Admin dashboard (protected)
│   ├── page.tsx            # Admin hub
│   ├── login/              # Admin authentication
│   ├── products/           # Product management
│   ├── orders/             # Order management
│   ├── content/            # Content management
│   ├── analytics/          # Analytics dashboard
│   ├── affiliates/         # Affiliate management
│   └── autonomous-*/       # AI automation pages
├── api/                    # API routes
│   ├── stripe/            # Stripe payment endpoints
│   ├── ai/                # AI integration endpoints
│   ├── affiliate/         # Affiliate system endpoints
│   ├── webflow/           # Webflow integration
│   └── autonomous-*/      # AI automation endpoints
├── layout.tsx             # Root layout
└── globals.css            # Global styles
```

## Routing Conventions

### Page Components

**File Naming:**
- `page.tsx` - Route page component
- `layout.tsx` - Shared layout for route segment
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI

**Example Page Structure:**
```typescript
// app/gallery/[collection]/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collection Name | Brandon Mills Photography',
  description: 'Collection description'
}

interface PageProps {
  params: { collection: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  // Server component - can fetch data directly
  const collection = await getCollection(params.collection)

  return (
    <div>
      {/* Page content */}
    </div>
  )
}
```

### Dynamic Routes

**Pattern:** `[slug]`, `[...slug]`, `[[...slug]]`

```typescript
// app/work/[slug]/page.tsx
interface WorkPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  // Pre-render static paths at build time
  const works = await getAllWorks()
  return works.map(work => ({ slug: work.slug }))
}

export default async function WorkPage({ params }: WorkPageProps) {
  const work = await getWork(params.slug)
  if (!work) notFound()

  return <WorkDetail work={work} />
}
```

### Layouts

**Root Layout (`layout.tsx`):**
- Contains `<html>` and `<body>` tags
- Global navigation and footer
- Global providers (CartProvider, etc.)
- Analytics and metadata

**Nested Layouts:**
- Wrap specific route segments
- Share UI between related pages
- Example: `app/work/layout.tsx` for work pages

### Loading & Error States

**Loading UI (`loading.tsx`):**
```typescript
export default function Loading() {
  return <div className="loading-spinner">Loading...</div>
}
```

**Error Boundary (`error.tsx`):**
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## API Routes

### Route Handler Pattern

**Location:** `app/api/[endpoint]/route.ts`

**Supported Methods:** GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

**Example:**
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const products = await getProducts(category)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await createProduct(body)

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
```

### Dynamic API Routes

```typescript
// app/api/products/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProduct(params.id)
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }
  return NextResponse.json({ product })
}
```

## Admin Routes

### Authentication

All admin routes should check authentication:

```typescript
// app/admin/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuth } from '@/lib/auth'

export default async function AdminPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token || !await verifyAuth(token.value)) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
```

### Admin Page Pattern

- Use server components for data fetching
- Separate client components for interactive UI
- Example: `admin-hub-client.tsx` for client-side logic

## Metadata

### Static Metadata

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Brandon Mills Photography',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    images: ['/og-image.jpg']
  }
}
```

### Dynamic Metadata

```typescript
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const work = await getWork(params.slug)

  return {
    title: `${work.title} | Brandon Mills Photography`,
    description: work.description,
    openGraph: {
      images: [work.coverImage]
    }
  }
}
```

## Data Fetching

### Server Components (Default)

```typescript
// Direct database access in server components
export default async function ProductsPage() {
  const products = await db.query.products.findMany()

  return <ProductGrid products={products} />
}
```

### Client Components

```typescript
'use client'

import useSWR from 'swr'

export default function ProductsClient() {
  const { data, error } = useSWR('/api/products', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return <ProductGrid products={data.products} />
}
```

## Important Patterns

### DO
- Use server components by default
- Add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Fetch data in server components when possible
- Use proper TypeScript types for params and props
- Handle loading and error states
- Validate API request bodies with Zod
- Return proper HTTP status codes
- Use environment variables for secrets

### DON'T
- Make client components unless necessary
- Fetch data in client components when server components can do it
- Hardcode API URLs (use relative paths)
- Skip error handling in API routes
- Return sensitive data in API responses
- Use `any` type for route params
- Commit API keys or secrets

## Common Tasks

### Adding a New Page

1. Create directory: `app/new-page/`
2. Add `page.tsx` with metadata
3. Implement page component
4. Add navigation link if needed

### Creating an API Endpoint

1. Create `app/api/endpoint/route.ts`
2. Implement HTTP methods (GET, POST, etc.)
3. Add error handling and validation
4. Test with API client

### Adding Dynamic Route

1. Create `[param]/page.tsx`
2. Add `generateStaticParams()` for SSG
3. Implement page with typed params
4. Add `not-found.tsx` if needed

## Best Practices

1. **Server First** - Default to server components, use client components sparingly
2. **Type Safety** - Always type params, props, API responses
3. **Error Handling** - Use error boundaries and loading states
4. **Metadata** - Add SEO metadata to all public pages
5. **Performance** - Use static generation when possible
6. **Security** - Validate inputs, protect admin routes

## API Documentation

### Authentication

**Admin Authentication Flow:**
```
POST /api/auth/login
├── Validate credentials
├── Generate JWT token
├── Set HTTP-only cookie
└── Return success response
```

**Token Format:**
```typescript
interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
  iat: number  // Issued at
  exp: number  // Expiration (7 days)
}
```

**Protected Route Pattern:**
```typescript
// app/api/admin/[endpoint]/route.ts
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await verifyAuth(request)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Proceed with authenticated request
}
```

### API Endpoints Reference

#### Stripe Endpoints

**POST /api/stripe/checkout**
```typescript
// Request
{
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  customerEmail?: string
}

// Response (200)
{
  sessionId: string
  url: string
}

// Error (400)
{
  error: 'Invalid cart items'
}
```

**POST /api/stripe/webhook**
```typescript
// Stripe sends raw body with signature header
// Events handled:
// - checkout.session.completed
// - payment_intent.succeeded
// - payment_intent.payment_failed
// - customer.subscription.updated

// Response (200)
{ received: true }
```

#### Product Endpoints

**GET /api/products**
```typescript
// Query params
?category=string    // Filter by category
&limit=number       // Pagination limit (default: 20)
&offset=number      // Pagination offset
&sort=string        // Sort field (price, name, created_at)
&order=asc|desc     // Sort order

// Response (200)
{
  products: Product[]
  total: number
  limit: number
  offset: number
}
```

**GET /api/products/[id]**
```typescript
// Response (200)
{
  product: Product
}

// Response (404)
{
  error: 'Product not found'
}
```

**POST /api/products** (Admin)
```typescript
// Request
{
  name: string
  description: string
  price: number
  category: string
  images: string[]
  printfulId?: string
  variants?: ProductVariant[]
}

// Response (201)
{
  product: Product
}
```

#### AI Endpoints

**POST /api/ai/generate**
```typescript
// Request
{
  prompt: string
  type: 'product-description' | 'seo-meta' | 'social-caption'
  context?: {
    productName?: string
    category?: string
    tone?: 'luxury' | 'casual' | 'professional'
  }
}

// Response (200)
{
  content: string
  model: string
  tokens: number
}

// Response (429) - Rate limited
{
  error: 'Rate limit exceeded',
  retryAfter: number
}
```

**POST /api/ai/analyze-image**
```typescript
// Request
{
  imageUrl: string
  analysisType: 'product' | 'quality' | 'composition'
}

// Response (200)
{
  analysis: {
    description: string
    tags: string[]
    quality: number
    suggestions?: string[]
  }
}
```

#### Affiliate Endpoints

**GET /api/affiliate/stats** (Admin)
```typescript
// Response (200)
{
  programs: Array<{
    name: string
    clicks: number
    conversions: number
    revenue: number
    status: 'active' | 'pending' | 'suspended'
  }>
  totals: {
    clicks: number
    conversions: number
    revenue: number
  }
}
```

**POST /api/affiliate/link**
```typescript
// Request
{
  url: string
  program: string
}

// Response (200)
{
  affiliateUrl: string
  trackingId: string
}
```

#### Order Endpoints

**GET /api/orders** (Admin)
```typescript
// Query params
?status=pending|processing|completed|cancelled
&from=ISO-date
&to=ISO-date

// Response (200)
{
  orders: Order[]
  total: number
}
```

**GET /api/orders/[id]**
```typescript
// Response (200)
{
  order: {
    id: string
    orderNumber: string
    customer: {
      email: string
      name: string
    }
    items: OrderItem[]
    total: number
    status: string
    shippingAddress: Address
    tracking?: {
      carrier: string
      number: string
      url: string
    }
    createdAt: string
    updatedAt: string
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `STRIPE_ERROR` | 402 | Payment failed |
| `PRINTFUL_ERROR` | 503 | Printful API unavailable |

### Rate Limiting

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Public API | 100 | 1 minute |
| Auth endpoints | 10 | 1 minute |
| AI generation | 20 | 1 minute |
| Webhooks | Unlimited | - |
| Admin API | 500 | 1 minute |

**Rate limit headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699123456
```

### Request Validation

**Using Zod for all API routes:**
```typescript
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  images: z.array(z.string().url()).min(1)
})

export async function POST(request: NextRequest) {
  const body = await request.json()

  const result = createProductSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: result.error.flatten()
      },
      { status: 400 }
    )
  }

  // Proceed with validated data
  const validatedData = result.data
}
```

### Webhook Security

**Stripe Webhook Verification:**
```typescript
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()  // Raw body required
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Process event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object)
        break
      // ... other cases
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }
}
```

### CORS Configuration

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://brandonmills.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
      ]
    }
  ]
}
```

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [Components Guidelines](../components/CLAUDE.md) - Component patterns
- [Library Guidelines](../lib/CLAUDE.md) - Utilities and AI
- [Next.js App Router Docs](https://nextjs.org/docs/app)

---

**Last Updated:** November 2025
