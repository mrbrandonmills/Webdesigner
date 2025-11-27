# COMPREHENSIVE SITE FIX PLAN
Generated: 2025-11-26

## CRITICAL ISSUES IDENTIFIED

### 1. /shop - No products displaying
- Root: getAllShopProducts() returns empty
- File: lib/premium-products.ts:121-145  
- Fix: Debug affiliate product transformation

### 2. /store - Pictures not loading
- Root: Products have empty variants array
- File: app/api/store/products/route.ts:181
- Fix: ALREADY FIXED (commit 7e21271) - pending deployment

### 3. Visualizers broken
- Root: Missing GOOGLE_AI_API_KEY
- Files: /visualize, /dreams, /oracle
- Fix: Add API key to .env.local

### 4. Blog duplicate images
- Root: 4 posts using B.14.jpg, irrelevant modeling photos
- Fix: Generate unique Unsplash images per post topic

### 5. Essays 404 errors  
- Root: Essay routes not found
- Fix: Check /writing/essays paths

### 6. /recommended-gear empty
- Root: Category mismatch in API requests
- Fix: Align category strings

### 7. Payments not processing
- Root: Missing Stripe config or broken checkout
- Fix: Debug checkout flow
