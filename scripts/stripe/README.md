# Stripe Automation Scripts

**Collection of utility scripts for managing Stripe payments, transactions, and operations.**

---

## Available Scripts

### 1. test-checkout.js

**Purpose:** Test the complete Stripe checkout flow end-to-end.

**Usage:**
```bash
# Basic test
node scripts/stripe/test-checkout.js

# Custom amount
node scripts/stripe/test-checkout.js --amount 99.99

# Debug mode (verbose output)
node scripts/stripe/test-checkout.js --debug
```

**What it does:**
- Verifies API key
- Creates test customer
- Generates checkout session
- Provides test card instructions
- Verifies payment completion
- Checks webhook events
- Optional cleanup

**Example output:**
```
============================================================
Stripe Checkout Flow Test
============================================================

[1] Verifying Stripe API key...
✓ API key is valid
✓ Running in TEST mode

[2] Creating test customer...
✓ Customer created: cus_ABC123

[3] Creating checkout session...
✓ Session created: cs_test_abc123

Checkout URL: https://checkout.stripe.com/c/pay/cs_test_...
```

---

### 2. verify-webhook.js

**Purpose:** Verify webhook endpoint configuration and connectivity.

**Usage:**
```bash
# Verify default endpoint
node scripts/stripe/verify-webhook.js

# Verify custom endpoint
node scripts/stripe/verify-webhook.js --url https://brandonmills.com/api/stripe/webhook

# Verbose mode
node scripts/stripe/verify-webhook.js --verbose
```

**What it checks:**
- API key validity
- Endpoint accessibility
- Configured webhooks in Stripe
- Webhook secret configuration
- Signature verification
- Recent webhook failures

**Example output:**
```
============================================================
Stripe Webhook Verification
============================================================

Testing endpoint: https://brandonmills.com/api/stripe/webhook

[1] Verifying Stripe API key...
✓ API key is valid

[2] Testing endpoint accessibility...
✓ Endpoint is accessible

[3] Checking configured webhook endpoints...
✓ Found 1 webhook endpoint(s)
✓ Found matching endpoint configuration

Enabled events:
  - checkout.session.completed
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - charge.refunded
```

---

### 3. refund-order.js

**Purpose:** Process full or partial refunds for orders.

**Usage:**
```bash
# Interactive mode
node scripts/stripe/refund-order.js

# Refund specific charge
node scripts/stripe/refund-order.js --charge ch_1ABC2DEF3GHI4JKL

# Refund from session ID
node scripts/stripe/refund-order.js --session cs_test_abc123

# Partial refund with reason
node scripts/stripe/refund-order.js --charge ch_ABC123 --amount 50.00 --reason requested_by_customer
```

**Refund reasons:**
- `requested_by_customer` - Customer requested refund
- `duplicate` - Duplicate charge
- `fraudulent` - Fraudulent transaction

**Example output:**
```
============================================================
Stripe Refund Processor
============================================================

Charge Details:
  ID: ch_1ABC2DEF3GHI4JKL
  Amount: $99.99 USD
  Status: succeeded
  Created: 2025-11-05T10:30:00Z

Maximum refundable amount: $99.99

============================================================
Refund Summary
============================================================
  Charge ID: ch_1ABC2DEF3GHI4JKL
  Original Amount: $99.99
  Refund Amount: $99.99
  Reason: requested_by_customer
  Type: FULL
============================================================

Proceed with refund? (yes/no): yes

Processing refund...
✓ Refund processed successfully!
```

---

### 4. export-transactions.js

**Purpose:** Export transaction data for financial reporting and analysis.

**Usage:**
```bash
# Export last 30 days (default)
node scripts/stripe/export-transactions.js

# Export specific date range
node scripts/stripe/export-transactions.js --start 2025-10-01 --end 2025-10-31

# Export last 90 days
node scripts/stripe/export-transactions.js --days 90

# Export to JSON
node scripts/stripe/export-transactions.js --format json --output transactions.json

# Export to CSV
node scripts/stripe/export-transactions.js --format csv --output transactions.csv
```

**Output formats:**
- **CSV:** Spreadsheet-compatible format for Excel/Sheets
- **JSON:** Structured data for analysis/reporting

**CSV columns:**
- `id` - Transaction ID
- `date` - Transaction date
- `type` - charge or refund
- `status` - Transaction status
- `amount` - Transaction amount
- `fee` - Stripe processing fee
- `net` - Net amount after fees
- `currency` - Currency code
- `customer` - Customer ID
- `description` - Transaction description
- `refunded` - Whether refunded
- `refund_amount` - Amount refunded
- `dispute` - Dispute status
- `payment_method` - Payment method type
- `card_brand` - Card brand (Visa, etc.)
- `card_last4` - Last 4 digits
- `receipt_url` - Receipt URL

**Example output:**
```
============================================================
Stripe Transaction Exporter
============================================================

Exporting transactions from 2025-10-01 to 2025-10-31

Fetching charges...
✓ Fetched 156 charges

Fetching refunds...
✓ Fetched 8 refunds

✓ Exported to CSV: stripe-transactions-1730812800000.csv

============================================================
Transaction Summary
============================================================
  Period: 2025-10-01 to 2025-10-31
  Total Charges: 156
  Total Refunds: 8
  Gross Revenue: $15,450.00
  Total Refunded: -$780.00
  Total Fees: -$478.05
  Net Revenue: $14,191.95
============================================================
```

---

### 5. check-disputes.js

**Purpose:** Monitor and manage chargebacks/disputes.

**Usage:**
```bash
# Check all disputes
node scripts/stripe/check-disputes.js

# Check disputes by status
node scripts/stripe/check-disputes.js --status warning_needs_response

# Show only urgent disputes (due within 3 days)
node scripts/stripe/check-disputes.js --urgent

# Export dispute data
node scripts/stripe/check-disputes.js --export disputes.json
```

**Dispute statuses:**
- `warning_needs_response` - Evidence needed
- `warning_under_review` - Being reviewed
- `warning_closed` - Closed (won/lost)
- `needs_response` - Response required
- `under_review` - Under review
- `won` - Dispute won
- `lost` - Dispute lost
- `charge_refunded` - Refund issued

**Example output:**
```
============================================================
Stripe Dispute Monitor
============================================================

Fetching disputes...
✓ Fetched 3 total disputes

============================================================
Dispute List
============================================================

🚨 URGENT DISPUTES (Action Required):
────────────────────────────────────────────────────────────

🚨 Dispute #1
   ID: dp_1ABC2DEF3GHI4JKL
   Status: warning_needs_response
   Reason: fraudulent
   Amount: $99.99 USD
   Charge: ch_1ABC2DEF3GHI4JKL
   Created: 2025-11-03T14:20:00Z
   Evidence Due: 2025-11-08T23:59:59Z
   Days Remaining: 3
   Evidence Submitted: No

============================================================
Dispute Summary
============================================================
  Total Disputes: 3
  🚨 Urgent: 1 (due within 3 days)
  ⚠️  Needs Response: 1
  ⏳ Under Review: 1
  ✅ Won: 0
  ❌ Lost: 0
  💰 Total Amount: $299.97
============================================================

📋 IMMEDIATE ACTIONS REQUIRED:
  1. Submit evidence for dp_1ABC2DEF3GHI4JKL (3 days remaining)
```

---

## Prerequisites

### Install Dependencies

```bash
npm install stripe dotenv readline
```

### Environment Variables

Create `.env.local` with:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000 # or https://brandonmills.com
```

---

## Common Workflows

### Testing Payment Flow

```bash
# 1. Start local server
npm run dev

# 2. Start Stripe CLI webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Run checkout test
node scripts/stripe/test-checkout.js

# 4. Complete payment in browser
# Use test card: 4242 4242 4242 4242

# 5. Verify webhooks
node scripts/stripe/verify-webhook.js
```

### Processing a Refund

```bash
# 1. Find the charge ID (from Stripe Dashboard or export)
node scripts/stripe/export-transactions.js --days 7

# 2. Process refund
node scripts/stripe/refund-order.js --charge ch_1ABC2DEF3GHI4JKL

# 3. Follow prompts to complete refund
```

### Monthly Financial Report

```bash
# Export previous month's transactions
node scripts/stripe/export-transactions.js \
  --start 2025-10-01 \
  --end 2025-10-31 \
  --format csv \
  --output october-2025-transactions.csv

# Open in Excel/Google Sheets for analysis
open october-2025-transactions.csv
```

### Dispute Management

```bash
# Check for urgent disputes daily
node scripts/stripe/check-disputes.js --urgent

# Export all disputes for record keeping
node scripts/stripe/check-disputes.js --export disputes-$(date +%Y-%m-%d).json

# Monitor specific status
node scripts/stripe/check-disputes.js --status warning_needs_response
```

---

## Troubleshooting

### "API key is invalid"

**Solution:**
- Check `STRIPE_SECRET_KEY` in `.env.local`
- Ensure key starts with `sk_test_` or `sk_live_`
- Verify key in Stripe Dashboard > Developers > API keys

### "Webhook endpoint not found"

**Solution:**
- For local testing: Use Stripe CLI
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
- For production: Configure webhook in Dashboard
  - Go to Developers > Webhooks
  - Add endpoint: `https://brandonmills.com/api/stripe/webhook`

### "Permission denied" when running scripts

**Solution:**
```bash
chmod +x scripts/stripe/*.js
```

### Scripts not finding modules

**Solution:**
```bash
# Install dependencies
npm install stripe dotenv

# Or run with npx
npx node scripts/stripe/test-checkout.js
```

---

## Best Practices

### Security

- Never commit `.env.local` to version control
- Use test mode keys for development
- Rotate API keys quarterly
- Use restricted keys when possible

### Testing

- Always test in test mode first
- Use Stripe test cards
- Verify webhooks are working
- Test refund flows

### Production

- Monitor disputes daily
- Export transactions monthly
- Keep refund documentation
- Respond to disputes within 7 days

---

## Support

For issues with these scripts:
1. Check the main [TROUBLESHOOTING.md](../../docs/stripe/TROUBLESHOOTING.md) guide
2. Review [Stripe API docs](https://stripe.com/docs/api)
3. Check [Stripe status](https://status.stripe.com)

---

## Test Cards Reference

```
# Success
4242 4242 4242 4242 - Visa (success)
5555 5555 5555 4444 - Mastercard (success)

# 3D Secure
4000 0025 0000 3155 - Requires authentication

# Declines
4000 0000 0000 9995 - Declined
4000 0000 0000 9987 - Lost card
4000 0000 0000 0069 - Expired card
4000 0000 0000 0127 - Incorrect CVC

# Special
4000 0000 0000 3220 - Dispute (fraudulent)
4000 0000 0000 0002 - Generic decline
```

---

**Last Updated:** 2025-11-05
**Maintainer:** Stripe Payment Specialist