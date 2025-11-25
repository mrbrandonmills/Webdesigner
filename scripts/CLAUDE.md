# Scripts & Automation Guidelines

Context-specific guidelines for the `scripts/` directory - automation scripts, migrations, and development utilities.

## Overview

This directory contains Node.js scripts for automating affiliate account management, product synchronization, payment processing, database migrations, and testing. Scripts use Puppeteer for browser automation and integrate with third-party APIs.

## Directory Structure

```
scripts/
├── affiliate-automation/         # Browser automation utilities
│   ├── browser-automation.js   # Puppeteer helpers
│   └── utils.js                # Common utilities
├── printful/                    # Printful integration scripts
│   ├── sync-products.js        # Product sync
│   ├── create-mockups.js       # Generate product mockups
│   ├── update-pricing.js       # Pricing updates
│   ├── check-inventory.js      # Inventory monitoring
│   └── test-connection.js      # API connection test
├── shopify/                     # Shopify integration scripts
│   └── sync-products.js        # Shopify product sync
├── stripe/                      # Stripe payment scripts
│   ├── verify-webhook.js       # Webhook verification
│   ├── test-checkout.js        # Checkout flow testing
│   └── check-disputes.js       # Payment dispute monitoring
├── affiliate-account-creator.js  # Automated account creation
├── affiliate-signup-helper.js    # Affiliate signup automation
├── check-affiliate-status.js     # Account status checker
├── configure-affiliate-accounts.js # Account configuration
├── credential-manager.js         # Secure credential storage
├── generate-password-hash.js     # Password hashing utility
├── migrate-orders-to-db.ts      # Database migration
├── test-affiliate-system.js     # Affiliate system tests
├── test-printful-sync.js        # Printful sync tests
└── test-security.js             # Security testing
```

## NPM Scripts

**Available Commands:**
```json
{
  "affiliate:create": "node scripts/affiliate-account-creator.js",
  "affiliate:manage": "node scripts/credential-manager.js",
  "affiliate:configure": "node scripts/configure-affiliate-accounts.js",
  "affiliate:status": "node scripts/check-affiliate-status.js"
}
```

**Usage:**
```bash
# Create new affiliate accounts
npm run affiliate:create

# Manage credentials
npm run affiliate:manage

# Configure accounts
npm run affiliate:configure

# Check account status
npm run affiliate:status
```

## Affiliate Automation

### Account Creation

**Location:** `scripts/affiliate-account-creator.js`

**Purpose:** Automate affiliate account creation across multiple programs

**Usage:**
```bash
node scripts/affiliate-account-creator.js
```

**Features:**
- Interactive CLI with prompts
- Automated browser actions (Puppeteer)
- Multi-program support
- Error handling and retries
- Progress tracking

**Pattern:**
```javascript
import puppeteer from 'puppeteer'
import inquirer from 'inquirer'
import ora from 'ora'

async function createAffiliateAccount(program, credentials) {
  const spinner = ora(`Creating account for ${program}`).start()

  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // Navigate to signup page
    await page.goto(signupUrls[program])

    // Fill form
    await page.type('#email', credentials.email)
    await page.type('#password', credentials.password)

    // Submit
    await page.click('button[type="submit"]')
    await page.waitForNavigation()

    spinner.succeed(`Account created for ${program}`)

    await browser.close()
  } catch (error) {
    spinner.fail(`Failed to create account: ${error.message}`)
    throw error
  }
}
```

### Credential Management

**Location:** `scripts/credential-manager.js`

**Purpose:** Securely manage affiliate account credentials

**Features:**
- Encrypted credential storage
- Add/update/delete credentials
- View account list
- Export credentials

**Security:**
- Uses bcrypt for password hashing
- Environment variable encryption key
- Never logs sensitive data

### Status Checking

**Location:** `scripts/check-affiliate-status.js`

**Purpose:** Monitor affiliate account health and earnings

**Pattern:**
```javascript
async function checkAffiliateStatus(program) {
  const credentials = await getCredentials(program)

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Login
  await login(page, program, credentials)

  // Navigate to dashboard
  await page.goto(dashboardUrls[program])

  // Scrape status
  const status = await page.evaluate(() => {
    return {
      earnings: document.querySelector('.earnings')?.textContent,
      clicks: document.querySelector('.clicks')?.textContent,
      conversions: document.querySelector('.conversions')?.textContent
    }
  })

  await browser.close()

  return status
}
```

## Printful Integration

### Product Sync

**Location:** `scripts/printful/sync-products.js`

**Purpose:** Sync products from Printful to local database

**Usage:**
```bash
node scripts/printful/sync-products.js
```

**Pattern:**
```javascript
import { printful } from '../lib/printful-client.js'
import { db } from '../lib/db/client.js'

async function syncProducts() {
  console.log('Fetching products from Printful...')

  const printfulProducts = await printful.getProducts()

  for (const product of printfulProducts) {
    await db.query(`
      INSERT INTO products (
        printful_id, name, description, price, image_url
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (printful_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        updated_at = NOW()
    `, [
      product.id,
      product.name,
      product.description,
      product.price,
      product.image
    ])
  }

  console.log(`Synced ${printfulProducts.length} products`)
}

syncProducts().catch(console.error)
```

### Mockup Generation

**Location:** `scripts/printful/create-mockups.js`

**Purpose:** Generate product mockups via Printful API

**Features:**
- Batch mockup creation
- Template selection
- Image upload
- Preview generation

### Pricing Updates

**Location:** `scripts/printful/update-pricing.js`

**Purpose:** Update product pricing with markup calculations

## Stripe Integration

### Webhook Verification

**Location:** `scripts/stripe/verify-webhook.js`

**Purpose:** Test Stripe webhook endpoints

**Pattern:**
```javascript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function verifyWebhook(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )

    console.log('Webhook verified:', event.type)
    return true
  } catch (error) {
    console.error('Webhook verification failed:', error.message)
    return false
  }
}
```

### Checkout Testing

**Location:** `scripts/stripe/test-checkout.js`

**Purpose:** Test checkout flow with test cards

**Features:**
- Create test checkout session
- Simulate payment
- Verify order creation
- Test webhooks

## Database Migrations

### Migration Pattern

**Location:** `scripts/migrate-orders-to-db.ts`

**Purpose:** Migrate data between schemas or external sources

**Pattern:**
```typescript
import { sql } from '@vercel/postgres'

async function migrate() {
  console.log('Starting migration...')

  try {
    // Begin transaction
    await sql`BEGIN`

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE,
        user_email VARCHAR(255),
        total DECIMAL(10, 2),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Migrate data
    const legacyOrders = await fetchLegacyOrders()

    for (const order of legacyOrders) {
      await sql`
        INSERT INTO orders (order_number, user_email, total, status)
        VALUES (${order.number}, ${order.email}, ${order.total}, ${order.status})
        ON CONFLICT (order_number) DO NOTHING
      `
    }

    await sql`COMMIT`

    console.log(`Migrated ${legacyOrders.length} orders`)
  } catch (error) {
    await sql`ROLLBACK`
    console.error('Migration failed:', error)
    throw error
  }
}

migrate().catch(process.exit(1))
```

## Browser Automation

### Puppeteer Utilities

**Location:** `scripts/affiliate-automation/browser-automation.js`

**Reusable browser automation helpers:**
```javascript
export async function launchBrowser(headless = true) {
  return await puppeteer.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

export async function waitForSelector(page, selector, timeout = 30000) {
  try {
    await page.waitForSelector(selector, { timeout })
    return true
  } catch {
    return false
  }
}

export async function fillForm(page, formData) {
  for (const [selector, value] of Object.entries(formData)) {
    await page.type(selector, value)
  }
}

export async function screenshot(page, name) {
  const timestamp = new Date().toISOString()
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true
  })
}
```

## Testing Scripts

### Affiliate System Test

**Location:** `scripts/test-affiliate-system.js`

**Purpose:** End-to-end affiliate system testing

**Tests:**
- Account creation
- Login flow
- Link generation
- Tracking verification
- Commission calculation

### Security Testing

**Location:** `scripts/test-security.js`

**Purpose:** Security vulnerability testing

**Checks:**
- SQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting
- Authentication bypass attempts

## Best Practices

### DO
- Use environment variables for credentials
- Add progress indicators (ora spinners)
- Handle errors gracefully
- Log important events
- Use TypeScript for complex scripts
- Add CLI help text
- Test scripts in development first
- Use transactions for database operations
- Implement retry logic for network calls
- Clean up browser instances

### DON'T
- Hardcode credentials
- Run destructive scripts in production without confirmation
- Skip error handling
- Log sensitive data
- Leave browser instances running
- Use synchronous operations for I/O
- Skip input validation
- Commit credentials or API keys
- Run scripts without testing
- Ignore script failures silently

## Script Template

**Standard script structure:**
```javascript
#!/usr/bin/env node

import dotenv from 'dotenv'
import ora from 'ora'

// Load environment variables
dotenv.config()

// Validate required env vars
if (!process.env.REQUIRED_VAR) {
  console.error('Error: REQUIRED_VAR not set')
  process.exit(1)
}

async function main() {
  const spinner = ora('Starting task...').start()

  try {
    // Script logic here
    const result = await performTask()

    spinner.succeed('Task completed successfully')
    console.log('Result:', result)
  } catch (error) {
    spinner.fail('Task failed')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

// Execute
main()
```

## Environment Variables

**Required for scripts:**
```bash
# Affiliate Programs
AFFILIATE_PROGRAM_1_EMAIL=
AFFILIATE_PROGRAM_1_PASSWORD=

# Printful
PRINTFUL_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Encryption
CREDENTIAL_ENCRYPTION_KEY=
```

## Common Tasks

### Adding a New Script

1. Create file in appropriate directory
2. Add shebang: `#!/usr/bin/env node`
3. Import dependencies
4. Add main function
5. Handle errors
6. Test locally
7. Add to package.json scripts if needed

### Debugging a Script

```bash
# Enable verbose logging
DEBUG=* node scripts/my-script.js

# Run with Node inspector
node --inspect scripts/my-script.js

# Non-headless browser for Puppeteer
# Edit script: { headless: false }
```

### Scheduling Scripts

**Using cron:**
```bash
# Run affiliate status check daily at 9 AM
0 9 * * * cd /path/to/project && npm run affiliate:status

# Sync Printful products every 6 hours
0 */6 * * * cd /path/to/project && node scripts/printful/sync-products.js
```

**Using Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/sync-products",
    "schedule": "0 */6 * * *"
  }]
}
```

## Error Handling

**Standard error handling pattern:**
```javascript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      console.log(`Retry ${i + 1}/${maxRetries}...`)
      await sleep(1000 * (i + 1))
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [Library Guidelines](../lib/CLAUDE.md) - Utilities and integrations
- [Puppeteer Docs](https://pptr.dev)
- [Node.js Docs](https://nodejs.org/docs)

---

**Last Updated:** November 2025
