# Activate Database Implementation

## Important Note

The database implementation has been created in **parallel files** to preserve your existing working system. To activate the database:

## Option 1: Replace Original Files (Recommended)

```bash
cd /Users/brandon/Webdesigner

# Backup originals
cp app/api/stripe/webhook/route.ts app/api/stripe/webhook/route.backup.ts
cp app/api/admin/orders/route.ts app/api/admin/orders/route.backup.ts

# Activate database versions
mv app/api/stripe/webhook/route-with-db.ts app/api/stripe/webhook/route.ts
mv app/api/admin/orders/route-with-db.ts app/api/admin/orders/route.ts
```

## Option 2: Manual Integration

If you prefer to manually integrate the database code:

### 1. Update Webhook Handler

In `/app/api/stripe/webhook/route.ts`, add these imports at the top:

```typescript
import {
  createOrder as createOrderInDb,
  USE_DATABASE,
  isDatabaseAvailable,
} from '@/lib/db/client'
import type { CreateOrderInput } from '@/lib/db/types'
```

Then replace the `createOrder` function with the one from `route-with-db.ts`.

### 2. Update Admin Orders API

In `/app/api/admin/orders/route.ts`, add these imports:

```typescript
import {
  getOrderSummaries,
  getOrderStats,
  USE_DATABASE,
  isDatabaseAvailable,
} from '@/lib/db/client'
import type { OrderFilters, PaginationParams } from '@/lib/db/types'
```

Then replace the `GET` function with the one from `route-with-db.ts`.

## After Activation

1. **Test locally** with `USE_DATABASE=false` first (filesystem mode)
2. **Run migrations** (see DATABASE_INSTALLATION.md)
3. **Enable database** with `USE_DATABASE=true`
4. **Test thoroughly** before deploying to production

## Rollback

If you need to rollback:

```bash
# Restore from backup
cp app/api/stripe/webhook/route.backup.ts app/api/stripe/webhook/route.ts
cp app/api/admin/orders/route.backup.ts app/api/admin/orders/route.ts

# Or simply set
USE_DATABASE=false
```

## Files Ready for Activation

✅ `/lib/db/types.ts` - Type definitions
✅ `/lib/db/client.ts` - Database client
✅ `/lib/db/migrations/001_initial_schema.sql` - SQL schema
✅ `/lib/db/migrations/run-migration.ts` - Migration runner
✅ `/scripts/migrate-orders-to-db.ts` - Data import
✅ `/app/api/stripe/webhook/route-with-db.ts` - Updated webhook
✅ `/app/api/admin/orders/route-with-db.ts` - Updated admin API

## Next Steps

Follow the complete guide in: [`DATABASE_INSTALLATION.md`](./DATABASE_INSTALLATION.md)
