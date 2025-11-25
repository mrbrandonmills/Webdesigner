# Library & AI Integration Guidelines

Context-specific guidelines for the `lib/` directory - utilities, AI integrations, database, authentication, and third-party services.

## Overview

This directory contains core business logic, utilities, AI integrations, database connections, and third-party service clients. These modules are framework-agnostic and can be used across server components, API routes, and scripts.

## Directory Structure

```
lib/
├── db/                        # Database layer
│   ├── client.ts             # Vercel Postgres client
│   ├── types.ts              # Database types
│   └── migrations/           # Database migrations
├── affiliate-manager.ts       # Affiliate account automation
├── auth.ts                   # Authentication utilities
├── category-prompts.ts       # AI prompts for categories
├── design-tokens.ts          # Design system tokens
├── email.ts                  # Email service (Resend)
├── env.ts                    # Environment variable validation
├── logger.ts                 # Logging utilities
├── pricing.ts                # Pricing calculations
├── printful-client.ts        # Printful API client
├── product-analytics.ts      # Product analytics
├── rate-limiter.ts           # Rate limiting
├── session.ts                # Session management
├── session-jwt.ts            # JWT session handling
├── store-utils.ts            # E-commerce utilities
├── voice-profile.ts          # AI voice profiles
├── webflow-client.ts         # Webflow API client
└── webflow-richtext.ts       # Webflow rich text utils
```

## Database Layer

### Client Setup

**Location:** `lib/db/client.ts`

**Pattern:**
```typescript
import { sql } from '@vercel/postgres'

export async function getProducts(category?: string) {
  try {
    const result = category
      ? await sql`SELECT * FROM products WHERE category = ${category}`
      : await sql`SELECT * FROM products`

    return result.rows
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch products')
  }
}
```

### Type Safety

**Location:** `lib/db/types.ts`

**Always define database types:**
```typescript
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: Date
}
```

### Migrations

**Location:** `lib/db/migrations/`

**Pattern:**
```typescript
// lib/db/migrations/001_create_products.ts
import { sql } from '@vercel/postgres'

export async function up() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

export async function down() {
  await sql`DROP TABLE IF EXISTS products`
}
```

## AI Integrations

### AI SDK Integration

**Anthropic (Claude):**
```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

export async function generateProductDescription(
  productName: string,
  category: string
) {
  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt: `Write a luxury product description for ${productName} in ${category}`,
    temperature: 0.7,
  })

  return text
}
```

**OpenAI:**
```typescript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function analyzeProductImage(imageUrl: string) {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this product image' },
          { type: 'image', image: imageUrl }
        ]
      }
    ]
  })

  return text
}
```

### Category Prompts

**Location:** `lib/category-prompts.ts`

**Pattern:**
```typescript
export const categoryPrompts = {
  photography: {
    systemPrompt: 'You are an expert photography curator...',
    userPrompt: (context: string) => `Generate description for: ${context}`
  },
  luxury: {
    systemPrompt: 'You are a luxury brand copywriter...',
    userPrompt: (product: string) => `Write copy for: ${product}`
  }
}

export function getCategoryPrompt(category: string, context: string) {
  const prompt = categoryPrompts[category]
  if (!prompt) throw new Error(`Unknown category: ${category}`)

  return {
    system: prompt.systemPrompt,
    user: prompt.userPrompt(context)
  }
}
```

### Voice Profiles

**Location:** `lib/voice-profile.ts`

**AI voice synthesis patterns:**
```typescript
import { Anthropic } from '@anthropic-ai/sdk'

export async function generateVoiceResponse(
  prompt: string,
  profile: 'professional' | 'casual' | 'luxury'
) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const voiceProfiles = {
    professional: 'formal, clear, authoritative',
    casual: 'friendly, conversational, warm',
    luxury: 'sophisticated, refined, exclusive'
  }

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `${prompt}\n\nTone: ${voiceProfiles[profile]}`
    }]
  })

  return response.content[0].text
}
```

## Authentication

### Auth Pattern

**Location:** `lib/auth.ts`

```typescript
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createAuthToken(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) return null

  return await verifyAuthToken(token.value)
}
```

## Third-Party Integrations

### Printful Client

**Location:** `lib/printful-client.ts`

**Pattern:**
```typescript
export class PrintfulClient {
  private apiKey: string
  private baseUrl = 'https://api.printful.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getProducts() {
    const response = await fetch(`${this.baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`)
    }

    return await response.json()
  }

  async createOrder(orderData: any) {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`)
    }

    return await response.json()
  }
}

export const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY!)
```

### Webflow Client

**Location:** `lib/webflow-client.ts`

**Usage:**
```typescript
export async function publishToWebflow(content: any) {
  const response = await fetch('https://api.webflow.com/sites/:site_id/publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
      'accept-version': '1.0.0'
    },
    body: JSON.stringify(content)
  })

  return await response.json()
}
```

## Email Service

### Resend Integration

**Location:** `lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  to: string,
  orderDetails: any
) {
  try {
    await resend.emails.send({
      from: 'orders@brandonmills.com',
      to,
      subject: 'Order Confirmation',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order #${orderDetails.id}</p>
        <p>Total: $${orderDetails.total}</p>
      `
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Email sending failed')
  }
}
```

## Utilities

### Environment Variables

**Location:** `lib/env.ts`

**Validate all env vars:**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  RESEND_API_KEY: z.string(),
  PRINTFUL_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
```

### Rate Limiting

**Location:** `lib/rate-limiter.ts`

```typescript
const rateLimit = new Map<string, number[]>()

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const timestamps = rateLimit.get(identifier) || []

  // Remove timestamps outside window
  const validTimestamps = timestamps.filter(t => now - t < windowMs)

  if (validTimestamps.length >= limit) {
    return false
  }

  validTimestamps.push(now)
  rateLimit.set(identifier, validTimestamps)

  return true
}
```

### Logger

**Location:** `lib/logger.ts`

```typescript
type LogLevel = 'info' | 'warn' | 'error'

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '')
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error || '')
  }
}
```

## Affiliate Manager

**Location:** `lib/affiliate-manager.ts`

**Automates affiliate account creation and management:**
```typescript
export class AffiliateManager {
  async createAccount(program: string, credentials: any) {
    // Automated account creation logic
  }

  async getAccountStatus(program: string) {
    // Check affiliate account status
  }

  async generateAffiliateLink(program: string, productUrl: string) {
    // Generate affiliate tracking link
  }
}
```

## Best Practices

### DO
- Use TypeScript for all library code
- Validate environment variables with Zod
- Handle errors gracefully with try/catch
- Log errors with context
- Use type-safe database queries
- Keep API clients in separate files
- Cache expensive operations
- Use environment variables for secrets
- Export typed functions
- Document complex logic

### DON'T
- Use `any` type
- Hardcode API keys or secrets
- Skip error handling
- Make synchronous database calls
- Expose internal implementation details
- Create circular dependencies
- Skip input validation
- Ignore rate limits
- Mix concerns (separate DB, API, utils)
- Commit sensitive credentials

## Error Handling Pattern

**Standard error handling:**
```typescript
export async function fetchData<T>(
  fetcher: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await fetcher()
    return { data }
  } catch (error) {
    logger.error('Fetch failed', error as Error)
    return {
      error: error instanceof Error
        ? error.message
        : 'Unknown error occurred'
    }
  }
}

// Usage
const { data, error } = await fetchData(() => getProducts())
if (error) {
  // Handle error
}
```

## Testing

**Unit tests for utilities:**
```typescript
// lib/pricing.test.ts
import { calculateTotal, applyDiscount } from './pricing'

describe('Pricing utilities', () => {
  it('calculates total correctly', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60)
  })

  it('applies discount percentage', () => {
    expect(applyDiscount(100, 10)).toBe(90)
  })
})
```

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [App Guidelines](../app/CLAUDE.md) - API routes
- [Scripts Guidelines](../scripts/CLAUDE.md) - Automation scripts
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [AI SDK Docs](https://sdk.vercel.ai/docs)

---

**Last Updated:** November 2025
