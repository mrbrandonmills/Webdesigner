# Security Hardening Documentation

This document outlines the security measures implemented in this Next.js application.

## 🔒 Security Features Implemented

### 1. Rate Limiting (Brute Force Protection)

**Location:** `/lib/rate-limiter.ts`

**Implementation:**
- In-memory rate limiting to prevent brute force attacks on login endpoint
- Default: 5 attempts per 15 minutes per IP address
- Automatic cleanup of expired entries every 5 minutes
- Includes retry-after headers for client guidance

**Protected Endpoints:**
- `/api/auth/login` - Login endpoint (5 attempts / 15 min)

**Usage Example:**
```typescript
import rateLimiter, { getClientIP } from '@/lib/rate-limiter'

const clientIP = getClientIP(request)
if (rateLimiter.isRateLimited(clientIP, 5, 15 * 60 * 1000)) {
  return NextResponse.json(
    { error: 'Too many attempts. Please try again later.' },
    { status: 429 }
  )
}
```

**Testing:**
Run the test script to verify rate limiting works:
```bash
npm run dev
node test-rate-limiting.js
```

**Production Considerations:**
- Current implementation uses in-memory storage (resets on server restart)
- For production at scale, consider Redis-based rate limiting
- Current limits are suitable for small to medium traffic

---

### 2. Error Message Sanitization

**Files Updated:**
- `/lib/printful-client.ts` - Printful API client
- `/app/api/admin/generate-products/route.ts` - Product generation
- `/app/api/stripe/checkout/route.ts` - Stripe checkout
- `/app/api/auth/login/route.ts` - Authentication

**Implementation:**
- All error details logged server-side only
- Generic error messages returned to clients
- No exposure of API keys, internal paths, or stack traces
- Pattern matching for common error types

**Example Pattern:**
```typescript
try {
  // ... operation
} catch (error) {
  // Detailed logging server-side
  logger.error('Operation failed', error)

  // Sanitized message to client
  return NextResponse.json(
    { error: 'Operation failed. Please try again or contact support.' },
    { status: 500 }
  )
}
```

**What is Hidden:**
- API keys and credentials
- Internal error messages from third-party services
- Stack traces and file paths
- Database connection strings
- Detailed validation errors that reveal system internals

---

### 3. Content Security Policy (CSP) Headers

**Location:** `/next.config.ts`

**Implemented Headers:**

#### Content-Security-Policy
Prevents XSS attacks by restricting content sources:
- `default-src 'self'` - Only allow resources from same origin by default
- `script-src` - Allows scripts from self, Stripe, and Vercel analytics
- `style-src 'self' 'unsafe-inline'` - Required for Next.js styles
- `img-src` - Allows images from various sources (Cloudinary, blob storage, etc.)
- `connect-src` - Allows API calls to Stripe, OpenAI, Anthropic, Printful
- `frame-src` - Only allows Stripe iframes
- `object-src 'none'` - Disables plugins like Flash
- `frame-ancestors 'none'` - Prevents clickjacking

#### X-Frame-Options: DENY
Prevents the site from being embedded in iframes (clickjacking protection).

#### X-Content-Type-Options: nosniff
Prevents MIME type sniffing attacks.

#### Referrer-Policy: strict-origin-when-cross-origin
Controls referrer information sent to other sites.

#### X-XSS-Protection: 1; mode=block
Enables browser's XSS filter (legacy support).

#### Permissions-Policy
Controls browser feature access:
- Disables camera, microphone, geolocation
- Allows payment APIs for Stripe

**Testing CSP:**
1. Start dev server: `npm run dev`
2. Open browser DevTools
3. Check Network tab headers
4. Console should show no CSP violations

**Adjusting CSP:**
If you need to add new external services, update the appropriate directive in `next.config.ts`:
```typescript
"connect-src 'self' https://new-api.example.com",
```

---

### 4. Environment Variable Validation

**Location:** `/lib/env.ts`

**Implementation:**
- Validates all required environment variables at startup
- Uses Zod for type-safe validation
- Fails fast if critical configuration is missing
- Only enforced in production (relaxed in development)

**Required Variables:**
- `ADMIN_USERNAME` - Admin authentication username
- `ADMIN_PASSWORD_HASH` - Bcrypt hashed password
- `OPENAI_API_KEY` - Must start with `sk-`
- `ANTHROPIC_API_KEY` - Must start with `sk-ant-`
- `STRIPE_SECRET_KEY` - Must start with `sk_test_` or `sk_live_`
- `STRIPE_WEBHOOK_SECRET` - Must start with `whsec_`
- `PRINTFUL_API_KEY` - Printful API key
- `PRINTFUL_STORE_ID` - Printful store ID
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

**Optional Variables:**
See `.env.example` for complete list.

**Usage:**
```typescript
import { validateEnv, features } from '@/lib/env'

// Validate (automatically runs in production)
validateEnv()

// Check feature availability
if (features.hasDatabase()) {
  // Use database
} else {
  // Use filesystem fallback
}
```

---

## 🚨 Additional Security Recommendations

### Completed ✅
- [x] Rate limiting on login endpoint
- [x] Error message sanitization
- [x] Content Security Policy headers
- [x] Environment variable validation
- [x] Secure authentication with bcrypt
- [x] HTTPS-only cookies (handled by Next.js)

### Recommended for Production 🔄

1. **Upgrade Rate Limiting to Redis**
   - Current in-memory solution resets on server restart
   - Redis provides persistent rate limiting across server instances
   - Use `@upstash/redis` or similar

2. **Implement API Key Rotation**
   - Regularly rotate API keys for third-party services
   - Use environment-specific keys (dev, staging, prod)

3. **Add Request Signing for Webhooks**
   - Already implemented for Stripe webhooks
   - Consider for other webhook sources

4. **Enable Database Query Logging (Production)**
   - Monitor for SQL injection attempts
   - Track slow queries for optimization

5. **Implement CORS Restrictions**
   - Restrict API access to known domains
   - Add in `/middleware.ts` if needed

6. **Add Request Size Limits**
   - Already set to 50mb for file uploads
   - Consider adding per-route limits

7. **Set Up Security Monitoring**
   - Use Vercel Analytics for attack detection
   - Monitor rate limit hits
   - Track failed authentication attempts
   - Set up alerts for suspicious patterns

8. **Regular Security Audits**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Review security advisories

9. **Implement IP Allowlisting for Admin Routes**
   - Restrict admin access to known IPs if needed
   - Use middleware for enforcement

10. **Add Two-Factor Authentication**
    - Consider TOTP for admin login
    - Use libraries like `otplib`

---

## 🧪 Testing Security Features

### Test Rate Limiting
```bash
npm run dev
node test-rate-limiting.js
```

Expected behavior:
- First 5 attempts return 401 Unauthorized
- 6th attempt returns 429 Too Many Requests
- Rate limit resets after 15 minutes

### Test Error Sanitization
Try triggering errors with invalid API keys or malformed requests:
```bash
# Should return generic error, not API key details
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'
```

### Test CSP Headers
```bash
curl -I http://localhost:3000 | grep -i "content-security-policy"
```

Should return CSP header with security policies.

---

## 📋 Security Checklist

Before deploying to production:

- [ ] All environment variables properly set in Vercel/hosting platform
- [ ] API keys use production values (not test keys)
- [ ] Rate limiting tested and working
- [ ] CSP headers verified in production
- [ ] Error responses don't leak sensitive information
- [ ] HTTPS enforced on all routes
- [ ] Webhook signatures verified (Stripe)
- [ ] Admin credentials use strong passwords with bcrypt
- [ ] Database queries use parameterized statements
- [ ] File uploads validated and scanned
- [ ] CORS properly configured
- [ ] Security headers verified in production
- [ ] Monitoring and alerting set up
- [ ] Backup and recovery procedures in place

---

## 🔐 Reporting Security Issues

If you discover a security vulnerability, please email security@yourdomain.com

**Please do NOT:**
- Open a public GitHub issue
- Share vulnerability details publicly

**Please DO:**
- Provide detailed description of the issue
- Include steps to reproduce
- Suggest a fix if possible
- Allow reasonable time for patching before disclosure

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Vercel Security Documentation](https://vercel.com/docs/security)
- [Stripe Security Best Practices](https://stripe.com/docs/security)

---

Last Updated: 2025-11-05
