# Performance Audit Report

**Generated:** 2025-11-18T14:59:11.073Z

## Bundle Analysis

| Metric | Value | Status |
|--------|-------|--------|
| Total JS Size | 1654.08 KB | ⚠️ Needs Optimization |
| Number of Bundles | 10 | ℹ️ |

### Top 10 Largest Bundles

| Bundle | Size (KB) | Status |
|--------|-----------|--------|
| 1. 685f7497.d7304ed59995391f.js | 387.04 | ⚠️ |
| 2. framework-bd61ec64032c2de7.js | 185.34 | ✅ |
| 3. 4bd1b696-100b9d70ed4e49c1.js | 168.97 | ✅ |
| 4. 1255-26f05d8bf86e016d.js | 168.29 | ✅ |
| 5. main-308aa289fdd06701.js | 133.99 | ✅ |
| 6. 951-ef967ec7347a9ae4.js | 114.25 | ✅ |
| 7. polyfills-42372ed130431b0a.js | 109.96 | ✅ |
| 8. 8464-a1091f3d522911d8.js | 87.38 | ✅ |
| 9. 7630-cbc570a8f4d9a7a9.js | 61.13 | ✅ |
| 10. 7792.c6833ec9341306e6.js | 56.33 | ✅ |

## Asset Analysis

| Asset Type | Count/Size | Status |
|------------|------------|--------|
| Design Images | 21 files | ✅ |
| Product Catalog | 38.57 KB | ✅ |

## Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |

## Recommendations

⚠️ Consider code splitting to reduce bundle size

✅ 21 design images are optimized with Next.js Image

✅ Product catalog size is optimal

## Next Steps

1. Run Lighthouse audit in Chrome DevTools on /shop page
2. Test on real mobile devices (iOS Safari, Android Chrome)
3. Monitor production metrics with Vercel Analytics
4. Set up Core Web Vitals monitoring

---

*For detailed performance metrics, run Lighthouse in Chrome DevTools or use:*
```bash
npm run build && npm run start
# Then run Lighthouse on http://localhost:3000/shop
```
