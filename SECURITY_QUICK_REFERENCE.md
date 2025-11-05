# Security Quick Reference Guide

Quick reference for using the new security features.

---

## 🚨 Rate Limiting

### Adding Rate Limiting to Any Route

```typescript
import rateLimiter, { getClientIP } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Check rate limit: 10 attempts per 5 minutes
  if (rateLimiter.isRateLimited(clientIP, 10, 5 * 60 * 1000)) {
    const retryAfter = rateLimiter.getTimeUntilReset(clientIP)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) }
      }
    )
  }

  // Your route logic here...
}
```

### Rate Limiter API

```typescript
// Check if rate limited
rateLimiter.isRateLimited(identifier, maxAttempts, windowMs)

// Get remaining attempts
rateLimiter.getRemainingAttempts(identifier, maxAttempts)

// Get seconds until reset
rateLimiter.getTimeUntilReset(identifier)

// Reset rate limit (after successful action)
rateLimiter.reset(identifier)

// Get client IP from request
const ip = getClientIP(request)
```

---

## 🛡️ Error Sanitization Pattern

### DO ✅

```typescript
try {
  // Your code
} catch (error) {
  // Detailed logging (server-side only)
  logger.error('Detailed error context', error)
  console.error('Internal error details:', error)

  // Generic message to client
  return NextResponse.json(
    { error: 'Operation failed. Please try again.' },
    { status: 500 }
  )
}
```

### DON'T ❌

```typescript
try {
  // Your code
} catch (error) {
  // NEVER expose internal errors to client
  return NextResponse.json(
    { error: error.message }, // ❌ Exposes internals!
    { status: 500 }
  )
}
```

### Pattern Matching for Specific Errors

```typescript
try {
  // Your code
} catch (error) {
  logger.error('Error occurred', error)

  const errorMsg = error instanceof Error ? error.message : ''

  // Check patterns but return sanitized messages
  if (errorMsg.includes('API key')) {
    return NextResponse.json(
      { error: 'Service configuration error. Contact support.' },
      { status: 500 }
    )
  }

  if (errorMsg.includes('rate limit')) {
    return NextResponse.json(
      { error: 'Service rate limit exceeded. Try again later.' },
      { status: 429 }
    )
  }

  // Generic fallback
  return NextResponse.json(
    { error: 'Operation failed. Please try again.' },
    { status: 500 }
  )
}
```

---

## 🔐 Environment Variables

### Using Environment Validation

```typescript
import { validateEnv, getEnv, features } from '@/lib/env'

// Validate all env vars (runs automatically in production)
validateEnv()

// Check if optional features are configured
if (features.hasDatabase()) {
  // Use database
}

if (features.hasWebflow()) {
  // Use Webflow API
}

if (features.hasCloudinary()) {
  // Use Cloudinary
}
```

### Adding New Required Variables

Edit `/lib/env.ts`:

```typescript
const envSchema = z.object({
  // ... existing vars

  // Add your new required variable
  NEW_API_KEY: z
    .string()
    .min(1, 'NEW_API_KEY is required')
    .regex(/^key_/, 'Must start with key_')
    .describe('Description of the API key'),
})
```

### Adding New Optional Variables

```typescript
const envSchema = z.object({
  // ... existing vars

  // Optional variable
  OPTIONAL_API_KEY: z
    .string()
    .optional()
    .describe('Optional API key'),
})
```

---

## 🔒 Content Security Policy

### Current CSP Configuration

Location: `/next.config.ts`

```typescript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "connect-src 'self' https://api.stripe.com ...",
  "frame-src 'self' https://js.stripe.com",
  "object-src 'none'",
].join('; ')
```

### Adding New Allowed Domain

To allow API calls to a new service:

```typescript
// In next.config.ts headers section
"connect-src 'self' https://existing-api.com https://new-api.com",
```

To allow images from new domain:

```typescript
"img-src 'self' data: blob: https: http:",
// OR be specific:
"img-src 'self' data: https://new-cdn.com",
```

### Testing CSP

```bash
# Check headers
curl -I http://localhost:3000 | grep -i "content-security"

# Check for violations in browser console
# Open DevTools -> Console -> Look for CSP warnings
```

---

## 🧪 Testing Security Features

### Test Rate Limiting

```bash
npm run dev
node test-rate-limiting.js
```

### Test Security Headers

```bash
# Check all security headers
curl -I http://localhost:3000

# Specific header
curl -I http://localhost:3000 | grep "X-Frame-Options"
```

### Test Error Sanitization

```bash
# Try invalid request
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}'

# Should return generic error, not validation details
```

---

## 📊 Monitoring Rate Limits

### Get Rate Limit Stats

```typescript
import rateLimiter from '@/lib/rate-limiter'

const stats = rateLimiter.getStats()
console.log('Active blocks:', stats.activeBlocks)
console.log('Total entries:', stats.totalEntries)
```

### Custom Monitoring Route

```typescript
// /app/api/admin/rate-limit-stats/route.ts
import { NextResponse } from 'next/server'
import rateLimiter from '@/lib/rate-limiter'

export async function GET() {
  const stats = rateLimiter.getStats()
  return NextResponse.json(stats)
}
```

---

## 🚀 Common Use Cases

### Protect API Endpoint from Abuse

```typescript
// /app/api/expensive-operation/route.ts
import rateLimiter, { getClientIP } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Limit to 3 operations per hour
  if (rateLimiter.isRateLimited(clientIP, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. One operation per 20 minutes allowed.' },
      { status: 429 }
    )
  }

  // Expensive operation...
}
```

### Add Rate Limiting to Contact Form

```typescript
// /app/api/contact/route.ts
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Limit to 5 messages per hour
  if (rateLimiter.isRateLimited(clientIP, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429 }
    )
  }

  // Send email...
}
```

### Protect Admin Endpoints

```typescript
// /app/api/admin/dangerous-action/route.ts
export async function POST(request: NextRequest) {
  // Check authentication first
  const session = await getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Then check rate limit per user
  const userIdentifier = `admin_${session.userId}`
  if (rateLimiter.isRateLimited(userIdentifier, 10, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many actions. Please slow down.' },
      { status: 429 }
    )
  }

  // Perform dangerous action...
}
```

---

## 🔧 Troubleshooting

### Rate Limiting Not Working?

1. **Check IP extraction:**
   ```typescript
   console.log('Client IP:', getClientIP(request))
   ```

2. **Verify rate limiter is imported:**
   ```typescript
   import rateLimiter from '@/lib/rate-limiter'
   ```

3. **Check if server restarted** (in-memory resets on restart)

### CSP Blocking Resources?

1. **Check browser console** for CSP violation errors
2. **Add domain to appropriate directive** in `next.config.ts`
3. **Restart dev server** after config changes

### Environment Validation Failing?

1. **Check error message** for specific missing variable
2. **Verify variable is in `.env.local`**
3. **Ensure no typos** in variable names
4. **Check variable format** (e.g., API keys must match pattern)

---

## 📚 Further Reading

- Full documentation: `/SECURITY.md`
- Implementation details: `/SECURITY_CHANGES_SUMMARY.md`
- Rate limiter code: `/lib/rate-limiter.ts`
- Env validation code: `/lib/env.ts`

---

**Last Updated:** 2025-11-05
