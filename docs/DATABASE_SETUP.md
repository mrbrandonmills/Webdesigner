# Database Setup Guide

Complete guide for migrating from filesystem-based order storage to Vercel Postgres.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Detailed Setup](#detailed-setup)
5. [Migration Process](#migration-process)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Plan](#rollback-plan)

---

## Overview

This guide covers the migration from JSON file-based order storage to a production-ready PostgreSQL database using Vercel Postgres.

### Benefits of Database Migration

✅ **Data Persistence**: Orders persist across deployments
✅ **ACID Guarantees**: Transactions ensure data integrity
✅ **Scalability**: Handle high volumes efficiently
✅ **Query Performance**: Fast filtering and pagination
✅ **Concurrent Access**: No race conditions
✅ **Analytics**: Complex queries for business insights

### Architecture

- **Database**: Vercel Postgres (PostgreSQL-compatible, serverless)
- **ORM**: Direct SQL queries via `@vercel/postgres`
- **Feature Flag**: `USE_DATABASE` for gradual rollout
- **Backwards Compatibility**: Filesystem fallback during transition

---

## Prerequisites

Before starting, ensure you have:

- [ ] Vercel account with access to project
- [ ] Local development environment set up
- [ ] Existing `.env.local` file with Stripe credentials
- [ ] Node.js 22.3.0 or higher
- [ ] Database migration dependencies installed

---

## Quick Start

### 1. Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose region (same as your deployment region)
6. Click **Create**

### 2. Connect Database to Project

1. Select your database
2. Click **Connect Project**
3. Choose your project from dropdown
4. Click **Connect**
5. Vercel automatically adds environment variables

### 3. Copy Environment Variables Locally

```bash
# In Vercel Dashboard, go to Settings > Environment Variables
# Copy all POSTGRES_* variables to your .env.local file

# Or use Vercel CLI
vercel env pull .env.local
```

### 4. Run Database Migration

```bash
# Run schema migration
npx tsx lib/db/migrations/run-migration.ts

# Verify tables were created
# You should see: ✅ Migration completed: 001_initial_schema.sql
```

### 5. Import Existing Orders

```bash
# Preview migration (dry run)
npx tsx scripts/migrate-orders-to-db.ts --dry-run

# Run actual migration
npx tsx scripts/migrate-orders-to-db.ts

# You should see: ✅ Migration completed successfully!
```

### 6. Enable Database Storage

```bash
# Update .env.local
USE_DATABASE=true
```

### 7. Test the Integration

```bash
# Start development server
npm run dev

# Test admin orders page
# Visit: http://localhost:3000/admin/orders

# Test webhook (use Stripe CLI)
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## Detailed Setup

### Environment Variables

Add these to your `.env.local` file (auto-populated by Vercel):

```env
# Vercel Postgres Connection Strings
POSTGRES_URL="postgres://default:xxx@xxx-postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx-postgres.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="xxx-postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxx"
POSTGRES_DATABASE="verceldb"

# Feature Flag (set to true to enable database)
USE_DATABASE=true
```

### Database Schema

The migration creates the following schema:

```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'usd',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  printful_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  printful_order_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes** for performance:
- `idx_orders_customer_email` - Fast lookup by email
- `idx_orders_status` - Filter by status
- `idx_orders_created_at` - Sort by date
- `idx_orders_stripe_session` - Prevent duplicate orders
- `idx_orders_status_created` - Combined filtering

---

## Migration Process

### Phase 1: Prepare Database

```bash
# Install dependencies (already done)
npm install @vercel/postgres

# Verify database connection
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT NOW()\`.then(r => console.log(r.rows[0]))"
```

### Phase 2: Run Schema Migration

```bash
# Run migration script
npx tsx lib/db/migrations/run-migration.ts

# Expected output:
# 🚀 Running migration: 001_initial_schema.sql
# 📝 Executing 25 SQL statements...
# ✅ Migration completed: 001_initial_schema.sql
```

### Phase 3: Import Existing Orders

```bash
# Dry run first to preview
npx tsx scripts/migrate-orders-to-db.ts --dry-run

# Review output:
# 📦 Found X order files
# 🔍 Would migrate order: order_xxx
#    - Customer: customer@example.com
#    - Total: USD 50.00

# Run actual migration
npx tsx scripts/migrate-orders-to-db.ts

# Expected output:
# ✅ Migrated: X
# ⏭️  Skipped: 0
# ❌ Failed: 0
```

### Phase 4: Test Database Integration

```bash
# Keep USE_DATABASE=false initially
# Test admin panel still works with filesystem

# Enable database
USE_DATABASE=true

# Restart dev server
npm run dev

# Visit http://localhost:3000/admin/orders
# You should see "dataSource": "database" in the API response
```

### Phase 5: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: migrate orders to Vercel Postgres"

# Push to trigger deployment
git push

# In Vercel Dashboard:
# 1. Go to Settings > Environment Variables
# 2. Add USE_DATABASE=true to Production environment
# 3. Redeploy
```

---

## API Changes

### Updated Webhook Handler

**File**: `/app/api/stripe/webhook/route.ts`

The webhook now:
- Checks if database is available
- Writes to database when `USE_DATABASE=true`
- Falls back to filesystem if database fails
- Maintains filesystem backup during transition

### Updated Admin Orders API

**File**: `/app/api/admin/orders/route.ts`

The API now:
- Reads from database when `USE_DATABASE=true`
- Supports pagination via query parameters
- Supports filtering by status, email, date range
- Returns enhanced statistics

**New Query Parameters**:

```typescript
GET /api/admin/orders?limit=50&offset=0
GET /api/admin/orders?status=paid
GET /api/admin/orders?email=customer@example.com
GET /api/admin/orders?startDate=2025-01-01&endDate=2025-12-31
```

**Enhanced Response**:

```json
{
  "success": true,
  "orders": [...],
  "stats": {
    "totalOrders": 100,
    "totalRevenue": 5000.00,
    "pendingOrders": 5,
    "paidOrders": 85,
    "fulfilledOrders": 70,
    "shippedOrders": 60,
    "averageOrderValue": 50.00
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "dataSource": "database"
}
```

---

## Troubleshooting

### Database Connection Fails

**Error**: `Error: POSTGRES_URL environment variable not set`

**Solution**:
1. Verify `.env.local` has `POSTGRES_URL`
2. Restart development server
3. Check Vercel Dashboard > Storage > Database is created

---

### Migration Script Fails

**Error**: `orders table does not exist`

**Solution**:
```bash
# Run schema migration first
npx tsx lib/db/migrations/run-migration.ts

# Then run data migration
npx tsx scripts/migrate-orders-to-db.ts
```

---

### Duplicate Order Errors

**Error**: `duplicate key value violates unique constraint`

**Solution**:
- This is expected - orders with same Stripe session ID are skipped
- Check migration output for "Skipped (already exists)" messages
- This prevents duplicate orders during re-runs

---

### Filesystem Orders Not Migrating

**Error**: `No order files found to migrate`

**Solution**:
1. Check `/data/orders/` directory exists
2. Verify order files follow pattern: `order_*.json`
3. Check file permissions

---

### Admin Panel Shows Old Data

**Solution**:
1. Verify `USE_DATABASE=true` in `.env.local`
2. Clear browser cache
3. Check API response includes `"dataSource": "database"`
4. Restart development server

---

## Rollback Plan

If you need to revert to filesystem storage:

### 1. Disable Database

```bash
# In .env.local
USE_DATABASE=false
```

### 2. Restart Application

```bash
# Local
npm run dev

# Production
# Update environment variable in Vercel Dashboard
# Trigger redeploy
```

### 3. Verify Filesystem Backup

All orders are backed up to filesystem during transition:

```bash
ls data/orders/
# You should see order_*.json files
```

### 4. Keep Database for Later

Don't delete the database - you can re-enable it anytime:

```bash
USE_DATABASE=true
```

---

## Advanced Usage

### Manual Database Queries

```typescript
import { sql } from '@vercel/postgres'

// Get orders by status
const result = await sql`
  SELECT * FROM orders
  WHERE status = 'paid'
  ORDER BY created_at DESC
  LIMIT 10
`

// Get revenue by month
const revenue = await sql`
  SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as orders,
    SUM(total_amount) as revenue
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '1 year'
  GROUP BY month
  ORDER BY month DESC
`
```

### Database Backup

```bash
# In Vercel Dashboard
# Go to Storage > Your Database > Backups
# Click "Create Backup"

# Or use pg_dump locally (requires connection string)
pg_dump $POSTGRES_URL > backup.sql
```

### Performance Monitoring

```typescript
import { sql } from '@vercel/postgres'

// Check slow queries
const slowQueries = await sql`
  SELECT query, calls, mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10
`

// Check table size
const tableSize = await sql`
  SELECT
    pg_size_pretty(pg_total_relation_size('orders')) as size
`
```

---

## Support

### Documentation

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [@vercel/postgres SDK](https://github.com/vercel/storage/tree/main/packages/postgres)

### Common Commands

```bash
# Run schema migration
npx tsx lib/db/migrations/run-migration.ts

# Import orders
npx tsx scripts/migrate-orders-to-db.ts

# Dry run import
npx tsx scripts/migrate-orders-to-db.ts --dry-run

# Force import (skip confirmation)
npx tsx scripts/migrate-orders-to-db.ts --force

# Check database connection
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT COUNT(*) FROM orders\`.then(r => console.log('Orders:', r.rows[0].count))"
```

---

## Security Best Practices

1. **Never commit credentials**
   - `.env.local` is in `.gitignore`
   - Use Vercel's environment variables

2. **Use connection pooling**
   - `POSTGRES_PRISMA_URL` includes PgBouncer
   - Handles serverless connection limits

3. **Input validation**
   - All user input is sanitized
   - Parameterized queries prevent SQL injection

4. **Backup regularly**
   - Enable automated backups in Vercel
   - Keep filesystem backup during transition

5. **Monitor access**
   - Review database logs in Vercel Dashboard
   - Set up alerts for unusual activity

---

## Success Checklist

Before considering migration complete:

- [ ] Database created in Vercel
- [ ] Environment variables configured
- [ ] Schema migration successful
- [ ] Existing orders imported
- [ ] `USE_DATABASE=true` enabled
- [ ] Admin panel shows database orders
- [ ] New webhook orders save to database
- [ ] Pagination working
- [ ] Filtering working
- [ ] Statistics accurate
- [ ] Production deployment successful
- [ ] Monitoring set up
- [ ] Backup verified
- [ ] Team notified

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check database size in Vercel Dashboard
- Review slow query logs
- Verify backups are running

**Monthly**:
- Analyze query performance
- Review and optimize indexes
- Archive old orders if needed

**Quarterly**:
- Review and update schema if needed
- Optimize table statistics
- Test backup restoration

---

## Questions?

If you encounter issues not covered here:

1. Check Vercel Dashboard logs
2. Review application logs
3. Check database connection status
4. Verify environment variables
5. Try rollback plan if critical

**Remember**: The filesystem backup is maintained during transition, so you can always rollback safely!
