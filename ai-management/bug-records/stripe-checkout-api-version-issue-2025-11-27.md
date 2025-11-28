# Bug Analysis Report: Stripe Checkout API Connection Error

**Issue ID:** STRIPE-API-VERSION-001
**Date:** 2025-11-27
**Severity:** CRITICAL
**Status:** IDENTIFIED - AWAITING FIX
**Reporter:** QA Engineer (Ultra-Intelligent Quality Assurance)

---

## 1. Problem Description

### Symptoms Observed
- Stripe checkout API returns 500 error with message: "An error occurred with our connection to Stripe. Request was retried 2 times."
- Error occurs consistently when attempting to create a checkout session
- Diagnostic endpoint confirms all Stripe keys are properly configured

### Impact Assessment
- **Critical**: Users cannot complete purchases for meditation content
- **Affected Component**: `/api/stripe/create-checkout` endpoint
- **User Impact**: Complete blocking of payment flow

### Reproduction Steps
```bash
# Test the checkout API
curl -s -X POST "https://www.brandonmills.com/api/stripe/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{"meditationId":"morning-mindfulness","slug":"morning-mindfulness","voice":"female"}'

# Expected: {"url": "https://checkout.stripe.com/..."}
# Actual: {"error":"An error occurred with our connection to Stripe. Request was retried 2 times."}
```

### Affected Components
- **Primary**: `/app/api/stripe/create-checkout/route.ts`
- **Secondary**: User-facing meditation purchase flow at `/meditations/[slug]`

---

## 2. Investigation Process

### Initial Hypothesis
Based on the error message mentioning "connection to Stripe," initially suspected:
1. Invalid API keys
2. Network connectivity issues
3. Stripe service outage

### Debugging Steps Taken

#### Step 1: Verify Stripe Configuration
```bash
curl -s "https://www.brandonmills.com/api/diagnostic/stripe" | python3 -m json.tool
```

**Result:**
```json
{
    "stripeSecretKey": {
        "exists": true,
        "isLive": true,
        "isTest": false,
        "length": 108,
        "prefix": "sk_live_51STrQW"
    },
    "webhookSecret": {
        "exists": true,
        "isValid": true,
        "length": 39
    },
    "publishableKey": {
        "exists": true,
        "isLive": true,
        "isTest": false
    },
    "baseUrl": {
        "exists": true,
        "value": "https://brandonmills.com\n"
    }
}
```

**Finding**: All keys are properly configured. Note: baseUrl has trailing newline (minor issue).

#### Step 2: Test API with Valid Meditation
```bash
curl -v -X POST "https://www.brandonmills.com/api/stripe/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{"meditationId":"morning-mindfulness","slug":"morning-mindfulness","voice":"female"}'
```

**Result**: HTTP 500 with retry error message

#### Step 3: Code Analysis
Examined `/app/api/stripe/create-checkout/route.ts` and compared with working Stripe endpoints:

**Problematic Code** (lines 10-17):
```typescript
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  // Using the default API version from the Stripe package
  // The package types expect '2025-10-29.clover' but we use the stable version
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
```

**Working Code** (from `/app/api/stripe/verify-purchase/route.ts`):
```typescript
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}
```

### Evidence Collected
1. API returns 500 status code
2. Diagnostic endpoint confirms environment variables are set correctly
3. Error message doesn't match any custom error messages in the code (likely from Stripe SDK)
4. Code comparison shows missing API version configuration
5. Comment in code suggests awareness of API version requirement but doesn't implement it

---

## 3. Root Cause Analysis

### Primary Cause Identified
**Missing Stripe API Version Configuration**

The `create-checkout` route initializes Stripe without specifying an API version:
```typescript
return new Stripe(process.env.STRIPE_SECRET_KEY)
```

While other Stripe routes correctly specify:
```typescript
return new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
})
```

### Contributing Factors

1. **Inconsistent Pattern**: Different Stripe initialization patterns across the codebase
2. **Misleading Comment**: Code includes comment "Using the default API version" but Stripe SDK requires explicit version
3. **Incomplete Fix**: Comment mentions the requirement but implementation doesn't follow through

### Why It Wasn't Caught Earlier

1. **No API Version Validation**: Build process doesn't validate Stripe configuration
2. **Testing Gap**: No automated tests for Stripe checkout creation
3. **Environment Difference**: Issue only manifests in production with live Stripe keys

### Related Issues Found

1. **NEXT_PUBLIC_BASE_URL Trailing Newline**: The baseUrl has a trailing newline character which could cause issues with redirect URLs:
   ```json
   "value": "https://brandonmills.com\n"
   ```

2. **Inconsistent Error Handling**: The error message from Stripe SDK ("An error occurred with our connection to Stripe. Request was retried 2 times.") doesn't match the custom error handling in the catch block

---

## 4. Solution Design

### Proposed Fix Approach

**Primary Fix**: Update Stripe initialization to include API version

**File**: `/app/api/stripe/create-checkout/route.ts`

**Changes Required**:
```typescript
// BEFORE (lines 10-17)
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  // Using the default API version from the Stripe package
  // The package types expect '2025-10-29.clover' but we use the stable version
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

// AFTER
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}
```

### Code Changes Required

1. **Update `getStripe()` function** in `/app/api/stripe/create-checkout/route.ts`
2. **Remove misleading comment** about default API version
3. **Optional**: Fix baseUrl trailing newline in environment configuration

### Testing Requirements

1. **Unit Test**: Verify Stripe initialization includes API version
2. **Integration Test**:
   ```bash
   curl -X POST "https://www.brandonmills.com/api/stripe/create-checkout" \
     -H "Content-Type: application/json" \
     -d '{"meditationId":"morning-mindfulness","slug":"morning-mindfulness","voice":"female"}'
   ```
   Expected: `{"url": "https://checkout.stripe.com/..."}`

3. **E2E Test**: Complete purchase flow from meditation page to success page

### Rollback Plan

If the fix causes issues:
1. Revert the commit
2. Redeploy previous version
3. Investigate Stripe SDK version compatibility

---

## 5. Implementation Details

### Files Modified
- `/app/api/stripe/create-checkout/route.ts` (lines 10-17)

### Step-by-Step Fix Process

1. **Code Update**:
   - Remove lines 15-16 (misleading comment)
   - Update line 17 to include apiVersion configuration

2. **Verification**:
   - Run TypeScript compiler to check for type errors
   - Build application locally
   - Test with Stripe test keys in development

3. **Deployment**:
   - Commit changes with clear message
   - Deploy to production
   - Monitor error logs for Stripe-related issues

4. **Post-Deployment Testing**:
   - Test diagnostic endpoint
   - Test checkout API directly
   - Test full user flow on production site

### Verification Methods

**Pre-Deployment**:
```bash
# Check TypeScript compilation
npm run type-check

# Run build
npm run build
```

**Post-Deployment**:
```bash
# 1. Verify diagnostic endpoint
curl -s "https://www.brandonmills.com/api/diagnostic/stripe"

# 2. Test checkout API
curl -X POST "https://www.brandonmills.com/api/stripe/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{"meditationId":"morning-mindfulness","slug":"morning-mindfulness","voice":"female"}'

# 3. Verify response contains Stripe checkout URL
# Should return: {"url":"https://checkout.stripe.com/c/pay/..."}
```

### Performance Impact
- **Expected**: Negligible - only adds configuration parameter
- **Actual**: Will verify post-deployment

---

## 6. Preventive Measures

### Process Improvements

1. **Standardize Stripe Initialization**
   - Create shared `lib/stripe.ts` utility
   - All routes import from single source
   - Prevents inconsistencies

2. **Add Linting Rule**
   - Detect Stripe initialization without API version
   - Custom ESLint rule or TypeScript check

3. **Environment Variable Validation**
   - Add startup validation for all required env vars
   - Fail fast if configuration is incomplete
   - Trim whitespace from environment variables

### Monitoring Additions

1. **Stripe API Error Tracking**
   - Log all Stripe SDK errors with full context
   - Alert on repeated connection failures
   - Monitor API version compatibility

2. **Checkout Success Rate Metrics**
   - Track checkout session creation success/failure
   - Alert on success rate below threshold
   - Dashboard showing payment funnel health

### Code Review Focus Areas

1. **Third-Party SDK Initialization**
   - Always verify required configuration
   - Check official documentation for breaking changes
   - Ensure consistent patterns across codebase

2. **API Route Testing**
   - Require integration tests for all payment endpoints
   - Test with both test and live keys (in appropriate environments)
   - Verify error handling paths

### Testing Enhancements

**Recommended Test Suite**:
```typescript
describe('Stripe Checkout API', () => {
  it('initializes Stripe with API version', () => {
    // Verify SDK configuration
  })

  it('creates checkout session with valid data', async () => {
    // Test successful checkout creation
  })

  it('returns proper error for invalid meditation', async () => {
    // Test error handling
  })

  it('includes correct metadata in session', async () => {
    // Verify session metadata
  })
})
```

---

## 7. Lessons Learned

### What Went Well

1. **Diagnostic Endpoint**: The `/api/diagnostic/stripe` endpoint was invaluable for quickly verifying environment configuration
2. **Systematic Investigation**: Methodical testing from configuration to code analysis led to quick identification
3. **Documentation**: CLAUDE.md provided clear examples of correct Stripe initialization pattern

### What Could Improve

1. **Consistency**: Need better enforcement of patterns across similar API routes
2. **Testing Coverage**: Missing integration tests for critical payment flow
3. **Code Comments**: Misleading comments can be worse than no comments - should match implementation
4. **Pre-Deployment Validation**: Should have caught this before production deployment

### Knowledge to Share

**For Development Team**:
- Always specify Stripe API version explicitly
- Don't rely on "default" SDK behavior for production code
- Use shared utilities for third-party service initialization
- Comments should accurately reflect implementation

**For QA Team**:
- Test payment endpoints with curl before browser testing
- Verify environment configuration before blaming code
- Compare working and broken implementations to find patterns
- Document error messages that don't match source code (SDK errors)

### Future Recommendations

1. **Create Stripe Utility Library**
   ```typescript
   // lib/stripe.ts
   export function getStripeClient() {
     if (!process.env.STRIPE_SECRET_KEY) {
       throw new Error('STRIPE_SECRET_KEY is not set')
     }
     return new Stripe(process.env.STRIPE_SECRET_KEY, {
       apiVersion: '2025-10-29.clover',
     })
   }
   ```

2. **Add Integration Tests**
   - Test suite for all Stripe endpoints
   - Mock Stripe SDK for unit tests
   - Use test keys for integration tests

3. **Environment Validation Script**
   ```typescript
   // scripts/validate-env.ts
   // Run during build to verify all required vars are set correctly
   ```

4. **Monitoring Dashboard**
   - Real-time checkout success rate
   - Stripe API health metrics
   - Payment funnel drop-off points

---

## Test Results Summary

### Diagnostic Endpoint ✅
- **URL**: `https://www.brandonmills.com/api/diagnostic/stripe`
- **Status**: PASSING
- **Result**: All Stripe keys properly configured
- **Issues**: Minor - baseUrl has trailing newline

### Checkout API ❌
- **URL**: `https://www.brandonmills.com/api/stripe/create-checkout`
- **Status**: FAILING
- **Error**: "An error occurred with our connection to Stripe. Request was retried 2 times."
- **HTTP Status**: 500
- **Root Cause**: Missing Stripe API version in initialization

### User-Facing Page ⏸️
- **URL**: `https://www.brandonmills.com/meditations/morning-mindfulness`
- **Status**: NOT TESTED (blocked by API failure)
- **Next Steps**: Test after API fix is deployed

---

## Next Steps

### Immediate Actions (URGENT)

1. **Developer**: Implement the API version fix in create-checkout route
2. **DevOps**: Deploy updated code to production
3. **QA**: Re-run full test suite after deployment

### Follow-Up Actions (HIGH PRIORITY)

1. **Fix baseUrl trailing newline** in environment configuration
2. **Create shared Stripe utility** to prevent future inconsistencies
3. **Add integration tests** for all payment endpoints
4. **Update monitoring** to track checkout success rates

### Long-Term Actions (MEDIUM PRIORITY)

1. **Implement pre-deployment validation** for third-party SDK configurations
2. **Create payment flow E2E tests** with automated browser testing
3. **Build Stripe health dashboard** for real-time monitoring
4. **Document Stripe best practices** in team wiki

---

## Stakeholder Communication

### For Product Manager
- **Impact**: Critical payment flow is blocked
- **ETA for Fix**: 1-2 hours (simple code change + deployment)
- **Revenue Impact**: Potential loss of all meditation sales until fixed
- **Recommendation**: Deploy fix immediately, then add comprehensive testing

### For CTO
- **Technical Debt**: Inconsistent Stripe initialization patterns across codebase
- **Architecture Issue**: No shared utility for third-party service clients
- **Testing Gap**: Missing integration tests for critical payment infrastructure
- **Recommendation**: Prioritize payment testing infrastructure after immediate fix

### For Customer Support
- **User-Facing Impact**: "Try again later" message on checkout attempts
- **Workaround**: None available - users cannot complete purchases
- **Timeline**: Fix expected within 2 hours
- **Communication**: Consider proactive notification if many users affected

---

## Appendix: Full Test Output

### Diagnostic Endpoint Test
```bash
$ curl -s "https://www.brandonmills.com/api/diagnostic/stripe" | python3 -m json.tool

{
    "stripeSecretKey": {
        "exists": true,
        "isLive": true,
        "isTest": false,
        "length": 108,
        "prefix": "sk_live_51STrQW"
    },
    "webhookSecret": {
        "exists": true,
        "isValid": true,
        "length": 39
    },
    "publishableKey": {
        "exists": true,
        "isLive": true,
        "isTest": false
    },
    "baseUrl": {
        "exists": true,
        "value": "https://brandonmills.com\n"
    }
}
```

### Checkout API Test (Failed)
```bash
$ curl -v -X POST "https://www.brandonmills.com/api/stripe/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{"meditationId":"morning-mindfulness","slug":"morning-mindfulness","voice":"female"}'

< HTTP/2 500
< content-type: application/json
< x-vercel-cache: MISS

{"error":"An error occurred with our connection to Stripe. Request was retried 2 times."}
```

### Code Comparison

**Broken Route** (`/app/api/stripe/create-checkout/route.ts`):
```typescript
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  // Using the default API version from the Stripe package
  // The package types expect '2025-10-29.clover' but we use the stable version
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
```

**Working Route** (`/app/api/stripe/verify-purchase/route.ts`):
```typescript
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}
```

---

**Report Generated By**: Ultra-Intelligent QA Engineer
**Report Date**: 2025-11-27
**Report Location**: `/Volumes/Super Mastery/Webdesigner/ai-management/bug-records/stripe-checkout-api-version-issue-2025-11-27.md`
