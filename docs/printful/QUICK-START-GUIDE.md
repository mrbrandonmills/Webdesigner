# Printful Buying Agent - Quick Start Guide
## Get Started in 30 Minutes

**Goal:** Replace manual product generator with intelligent buying agent

---

## Prerequisites

- ✅ Printful account with API key
- ✅ PostgreSQL database (Vercel Postgres or similar)
- ✅ OpenAI API key (for design generation)
- ✅ Vercel Pro account (for cron jobs)

---

## 30-Minute Quick Start

### Step 1: Environment Setup (5 minutes)

Add to `.env.local`:

```bash
# Printful
PRINTFUL_API_KEY=your_api_key
PRINTFUL_STORE_ID=your_store_id

# OpenAI
OPENAI_API_KEY=your_openai_key

# Database
DATABASE_URL=your_postgres_url

# Agent Config
CRON_SECRET=$(openssl rand -base64 32)
AGENT_AUTO_ADD=false
AGENT_AUTO_APPROVE=false
AGENT_MIN_SCORE=60
AGENT_PROFIT_TARGET=70
```

### Step 2: Database Migration (5 minutes)

```bash
# Install dependencies
npm install drizzle-orm pg

# Run migration
npx drizzle-kit push:pg
```

### Step 3: Install Agent Code (10 minutes)

Copy the following files from `AGENT-IMPLEMENTATION.md`:

```
lib/agent/
├── catalog-analyzer.ts
├── product-adder.ts
├── controller.ts
└── ...

app/api/agent/
├── status/route.ts
├── analyze-catalog/route.ts
└── add-products/route.ts
```

### Step 4: Run First Analysis (5 minutes)

```bash
# Start dev server
npm run dev

# Trigger catalog analysis
curl -X POST http://localhost:3000/api/agent/analyze-catalog
```

### Step 5: Review Results (5 minutes)

Visit: `http://localhost:3000/api/agent/status`

You should see:
```json
{
  "success": true,
  "catalog": {
    "totalAnalyzed": 150,
    "recommended": 45
  }
}
```

---

## What Happens Next?

### Automated Workflows

**Daily (2am UTC):**
- Check for new Printful products
- Update product performance metrics
- Adjust pricing for bestsellers

**Weekly (Sunday 3am UTC):**
- Full catalog re-analysis
- Add top 5 recommended products
- Deprecate slow movers

**Monthly (1st at 4am UTC):**
- Plan next seasonal collection
- Generate performance reports
- Optimize inventory mix

---

## Key Features

### 1. Intelligent Product Selection

The agent scores every Printful product 0-100 based on:

- **Quality (40 pts):** Premium brands like Bella+Canvas
- **Profit (30 pts):** High margin products (70%+)
- **Brand (20 pts):** Alignment with luxury positioning
- **Trends (10 pts):** Trending products and styles

**Only products scoring 60+ are recommended.**

### 2. Luxury Pricing

Automatic pricing optimization:

| Category | Cost | Agent Price | Margin |
|----------|------|-------------|---------|
| Fine Art | $11.95 | $89 | 86% |
| Apparel | $9.95 | $49 | 79% |
| Home | $14.95 | $59 | 74% |
| Accessories | $9.95 | $39 | 74% |

### 3. Lifecycle Management

Products move through stages:

```
New → Active → Bestseller
              ↓
           Slow → Deprecated
```

**Bestseller:** 10+ sales in 30 days
**Slow:** <3 sales in 60 days
**Deprecated:** 0 sales in 90 days

### 4. Seasonal Collections

Automatic quarterly collections:

- **Winter:** Cozy, introspection (hoodies, blankets)
- **Spring:** Renewal, movement (tees, totes)
- **Summer:** Freedom, expression (lightweight)
- **Fall:** Philosophy, reflection (hoodies, prints)

---

## Admin Dashboard

Replace `/admin/products/generate` with `/admin/buying-agent`

**Dashboard shows:**

- Active products count
- Revenue and profit
- Pending agent decisions
- Performance analytics

**Actions:**

- ✅ Approve agent recommendations
- ❌ Reject recommendations
- ⚙️ Configure agent settings
- 📊 View performance reports

---

## API Endpoints

```bash
# Get agent status
GET /api/agent/status

# Trigger catalog analysis
POST /api/agent/analyze-catalog

# Add products
POST /api/agent/add-products
{
  "productIds": [71, 231, 389],
  "autoApprove": false
}

# Get pending decisions
GET /api/agent/decisions/pending

# Approve decision
POST /api/agent/decisions/approve
{
  "decisionId": "uuid-here"
}
```

---

## Configuration Options

### Agent Behavior

```bash
# Auto-add products without approval
AGENT_AUTO_ADD=false  # Set to 'true' to auto-add

# Auto-approve added products
AGENT_AUTO_APPROVE=false  # Set to 'true' to skip review

# Minimum score to recommend
AGENT_MIN_SCORE=60  # 0-100

# Target profit margin
AGENT_PROFIT_TARGET=70  # Percentage
```

### Inventory Limits

```bash
# Maximum active products
AGENT_MAX_PRODUCTS=50

# Minimum active products
AGENT_MIN_PRODUCTS=20
```

---

## Monitoring

### Health Check

```bash
curl http://localhost:3000/api/agent/status
```

### Expected Response

```json
{
  "status": {
    "healthy": true,
    "lastRun": "2025-11-05T02:00:00Z"
  },
  "products": {
    "total": 42,
    "byStatus": {
      "active": 30,
      "bestseller": 8,
      "slow": 4
    }
  },
  "performance": {
    "totalSales": 156,
    "totalRevenue": 13890,
    "avgProfitMargin": 72.5
  }
}
```

---

## Troubleshooting

### Agent not running

Check cron jobs:
```bash
# Verify cron secret
echo $CRON_SECRET

# Test cron endpoint
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/buying-agent?workflow=daily
```

### No recommendations

Check scoring:
```bash
# Lower minimum score
AGENT_MIN_SCORE=50

# Re-run analysis
curl -X POST http://localhost:3000/api/agent/analyze-catalog
```

### Database errors

Verify connection:
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## Performance Benchmarks

**Expected Results (Year 1):**

| Metric | Manual | With Agent | Improvement |
|--------|--------|------------|-------------|
| Products/month | 10-15 | 30-50 | +200% |
| Time investment | 9 hrs/wk | 0 hrs/wk | -100% |
| Profit margin | 60-65% | 70-75% | +10-15% |
| Revenue (Year 1) | $134K | $392K | +193% |

---

## Next Steps

### Week 1: Setup
- [ ] Install agent services
- [ ] Run first analysis
- [ ] Review recommendations
- [ ] Add first products

### Week 2: Automation
- [ ] Set up cron jobs
- [ ] Configure workflows
- [ ] Test lifecycle management

### Week 3: Optimization
- [ ] Review performance
- [ ] Adjust scoring weights
- [ ] Optimize pricing

### Week 4: Scale
- [ ] Launch seasonal collection
- [ ] Enable auto-add (optional)
- [ ] Monitor and iterate

---

## Support

**Documentation:**
- Strategy: `docs/printful/BUYING-AGENT-STRATEGY.md`
- Implementation: `docs/printful/AGENT-IMPLEMENTATION.md`
- This guide: `docs/printful/QUICK-START-GUIDE.md`

**Common Issues:**
See `docs/printful/TROUBLESHOOTING.md`

---

## Success Metrics

Track these KPIs:

**Product Health:**
- Active products: 30-50
- Bestsellers: >20% of products
- Profit margin: >70% average
- Conversion rate: >3%

**Agent Performance:**
- Recommendation accuracy: >60%
- Time to market: <7 days
- Autonomy rate: >80%

**Business Impact:**
- Revenue growth: +50% vs manual
- Margin improvement: +10%
- Time saved: 9 hours/week

---

**Ready to launch your buying agent?**

Start with Step 1 above. 🚀

---

**Last Updated:** November 5, 2025
**Version:** 1.0
