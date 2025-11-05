# Database Installation Instructions

Quick reference guide for installing the database migration.

## Prerequisites

- Node.js 22.3.0 or higher
- Vercel account with project access
- Existing Stripe integration

## Installation Steps

### 1. Install Dependencies

The `@vercel/postgres` package has already been installed:

```bash
npm install @vercel/postgres
```

### 2. Create Vercel Postgres Database

**Via Vercel Dashboard**:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose region (same as deployment)
7. Click **Create**

**Via Vercel CLI** (alternative):
```bash
vercel env pull .env.local  # This will include new database vars
```

### 3. Copy Database Credentials

**Option A - Vercel Dashboard**:
1. Go to Storage > Your Database
2. Click **Settings** tab
3. Copy all environment variables
4. Add to `.env.local`

**Option B - Vercel CLI**:
```bash
vercel env pull .env.local
```

Your `.env.local` should now have:
```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="...-postgres.vercel-storage.com"
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# Set to false initially for testing
USE_DATABASE=false
```

### 4. Run Database Schema Migration

```bash
npx tsx lib/db/migrations/run-migration.ts
```

**Expected Output**:
```
🗄️  Database Migration Runner
================================

🔌 Testing database connection...
✅ Database connection successful

🚀 Running migration: 001_initial_schema.sql
📝 Executing 25 SQL statements...
✅ Statement 1/25 executed
✅ Statement 2/25 executed
...
✅ Migration completed: 001_initial_schema.sql

🎉 All migrations completed successfully!

📊 You can now run the data migration script to import existing orders.
   Run: npx tsx scripts/migrate-orders-to-db.ts
```

### 5. Import Existing Orders (if any)

**Dry Run First**:
```bash
npx tsx scripts/migrate-orders-to-db.ts --dry-run
```

**Actual Migration**:
```bash
npx tsx scripts/migrate-orders-to-db.ts
```

**Expected Output**:
```
🚀 Order Migration Script
========================

🔌 Testing database connection...
✅ Connected to database

📂 Looking for orders in: /path/to/data/orders
📦 Found 5 order files

[1/5] Processing order: order_123...
   ✅ Migrated successfully
      - Customer: customer@example.com
      - Total: USD 50.00
      - Items: 2
...

==================================================
📊 Migration Summary
==================================================
✅ Migrated: 5
⏭️  Skipped:  0
❌ Failed:   0
==================================================

✅ Migration completed successfully!

📝 Next steps:
   1. Update USE_DATABASE=true in .env.local
   2. Test the admin orders page
   3. Test a new order via Stripe webhook
   4. Keep filesystem backups until fully verified
```

### 6. Enable Database Storage

Update `.env.local`:
```env
USE_DATABASE=true
```

### 7. Test the Integration

**Start Development Server**:
```bash
npm run dev
```

**Test Admin Panel**:
1. Visit http://localhost:3000/admin/orders
2. Login with admin credentials
3. Verify orders are displayed
4. Check browser console - should see "dataSource": "database"

**Test Webhook** (optional):
```bash
# Install Stripe CLI if not already
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### 8. Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: add Vercel Postgres database migration"
git push

# Set production environment variable in Vercel Dashboard
# Go to: Settings > Environment Variables
# Add: USE_DATABASE=true (Production environment)
# Redeploy your application
```

## File Structure

After installation, you'll have these new files:

```
/Users/brandon/Webdesigner/
├── lib/
│   └── db/
│       ├── types.ts                    # TypeScript interfaces
│       ├── client.ts                   # Database client & queries
│       └── migrations/
│           ├── 001_initial_schema.sql  # SQL schema
│           └── run-migration.ts        # Migration runner
├── scripts/
│   └── migrate-orders-to-db.ts         # Data import script
├── app/
│   └── api/
│       ├── stripe/
│       │   └── webhook/
│       │       └── route-with-db.ts    # Updated webhook handler
│       └── admin/
│           └── orders/
│               └── route-with-db.ts    # Updated admin API
├── docs/
│   ├── DATABASE_SETUP.md               # Complete setup guide
│   └── DATABASE_INSTALLATION.md        # This file
└── .env.example                        # Updated with DB vars
```

## Activation Instructions

### Replace Original Files

Once you've tested the new database implementation, replace the original files:

```bash
# Backup originals
cp app/api/stripe/webhook/route.ts app/api/stripe/webhook/route.backup.ts
cp app/api/admin/orders/route.ts app/api/admin/orders/route.backup.ts

# Replace with database versions
mv app/api/stripe/webhook/route-with-db.ts app/api/stripe/webhook/route.ts
mv app/api/admin/orders/route-with-db.ts app/api/admin/orders/route.ts
```

**OR** manually update the imports in your existing route files:

```typescript
// In app/api/stripe/webhook/route.ts
import {
  createOrder,
  USE_DATABASE,
  isDatabaseAvailable,
} from '@/lib/db/client'
import type { CreateOrderInput } from '@/lib/db/types'

// Then update the createOrder function as shown in route-with-db.ts
```

## Verification Checklist

- [ ] `@vercel/postgres` installed
- [ ] Vercel Postgres database created
- [ ] Environment variables in `.env.local`
- [ ] Schema migration completed
- [ ] Existing orders imported (if any)
- [ ] `USE_DATABASE=true` set
- [ ] Dev server running
- [ ] Admin panel shows orders
- [ ] API response shows `"dataSource": "database"`
- [ ] Webhook test successful (optional)
- [ ] Production deployment completed

## Troubleshooting

### Can't Connect to Database

```bash
# Test connection manually
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT NOW()\`.then(r => console.log(r.rows[0]))"
```

If this fails:
- Check `POSTGRES_URL` in `.env.local`
- Verify database is created in Vercel Dashboard
- Check your network connection
- Restart development server

### Migration Script Fails

```bash
# Verify database is accessible
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT 1\`.then(() => console.log('✅ Connected'))"

# Check if table exists
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT COUNT(*) FROM orders\`.then(r => console.log('Rows:', r.rows[0].count))"
```

If table doesn't exist:
```bash
# Re-run schema migration
npx tsx lib/db/migrations/run-migration.ts
```

### Orders Not Showing

1. Check `USE_DATABASE` value:
   ```bash
   cat .env.local | grep USE_DATABASE
   ```

2. Check API response:
   ```bash
   curl http://localhost:3000/api/admin/orders
   # Look for "dataSource": "database" or "filesystem"
   ```

3. Verify orders in database:
   ```bash
   npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT COUNT(*) FROM orders\`.then(r => console.log('Orders:', r.rows[0].count))"
   ```

## Rollback

If something goes wrong:

```bash
# Disable database
echo "USE_DATABASE=false" >> .env.local

# Restart server
npm run dev
```

Your filesystem orders are still intact in `/data/orders/`.

## Support

For detailed documentation, see:
- [`/docs/DATABASE_SETUP.md`](./DATABASE_SETUP.md) - Complete setup guide
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)

## Quick Commands Reference

```bash
# Install dependencies
npm install @vercel/postgres

# Pull environment variables
vercel env pull .env.local

# Run schema migration
npx tsx lib/db/migrations/run-migration.ts

# Import orders (dry run)
npx tsx scripts/migrate-orders-to-db.ts --dry-run

# Import orders (actual)
npx tsx scripts/migrate-orders-to-db.ts

# Test database connection
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT NOW()\`.then(r => console.log(r.rows[0]))"

# Count orders in database
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT COUNT(*) FROM orders\`.then(r => console.log('Orders:', r.rows[0].count))"

# Start development
npm run dev
```
