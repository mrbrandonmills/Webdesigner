# Affiliate Account Automation System

## Overview

A comprehensive semi-automated system for creating and managing affiliate accounts across 10+ platforms, designed specifically for Brandon Mills Photography. This system maximizes automation while respecting all legal and platform limitations.

## Quick Start

### 1. Test the System

```bash
node scripts/test-affiliate-system.js
```

This verifies:
- All dependencies installed
- File structure correct
- Encryption working
- Platform configs valid
- Security measures in place

### 2. Create Affiliate Accounts

```bash
npm run affiliate:create
```

Interactive wizard that:
- Generates strong unique passwords
- Auto-fills signup forms
- Guides through verification
- Stores encrypted credentials
- Tracks progress

### 3. Check Status

```bash
npm run affiliate:status
```

Quick overview of all accounts:
- Pending applications
- Approved accounts
- Rejection reasons
- Next steps

### 4. Configure Active Accounts

```bash
npm run affiliate:configure
```

After approval, this:
- Sets up tracking IDs
- Generates affiliate links
- Creates .env variables
- Tests functionality

## Features

### Automated
✅ Password generation (20+ char, unique per platform)
✅ Username generation from business name
✅ Email aliases (`base+platform@domain.com`)
✅ Form pre-filling with business info
✅ Credential encryption (AES-256-GCM)
✅ Progress tracking & resume capability
✅ Link generation for approved accounts
✅ Environment variable generation

### Manual Steps Required
⚠️ Email verification (legal requirement)
⚠️ Phone verification (some platforms)
⚠️ Tax information entry (use real data)
⚠️ Bank account setup
⚠️ Waiting for manual platform approval

## Supported Platforms

### Very High Priority (Photography Focus)
1. **B&H Photo Video** - Camera equipment (2-8%)
2. **Adorama** - Photography gear (2-5%)
3. **Printful** - Print business (10%, instant)
4. **Amazon Associates** - Everything (1-10%)

### High Priority
5. **ShareASale** - Photo services (varies)
6. **CJ Affiliate** - Adobe, premium brands (varies)

### Medium Priority
7. **Rakuten** - Large brands (varies)
8. **Impact** - Modern platform (varies)
9. **Awin** - International (varies)
10. **Mpix** - Photo printing (10-15%)

## Commands

```bash
# Create new accounts
npm run affiliate:create

# View/manage credentials
npm run affiliate:manage

# Configure approved accounts
npm run affiliate:configure

# Check status
npm run affiliate:status

# Test system
node scripts/test-affiliate-system.js
```

## File Structure

```
/Users/brandon/Webdesigner/
│
├── scripts/
│   ├── affiliate-account-creator.js      # Main signup wizard
│   ├── credential-manager.js             # Credential management
│   ├── configure-affiliate-accounts.js   # Post-approval setup
│   ├── check-affiliate-status.js         # Status checker
│   ├── test-affiliate-system.js          # Test suite
│   └── affiliate-automation/
│       ├── browser-automation.js         # Puppeteer helpers
│       └── utils.js                      # Core utilities
│
├── data/affiliate/
│   ├── platforms-config.json             # Platform definitions
│   ├── credentials-template.json         # Credential structure
│   ├── credentials.json                  # ENCRYPTED (gitignored)
│   ├── affiliate-links.json              # Generated links
│   └── signup-progress.json              # Session state
│
├── docs/affiliate/
│   ├── QUICK_START.md                    # 5-minute guide
│   ├── AFFILIATE_SIGNUP_GUIDE.md         # Complete guide
│   └── AFFILIATE_AUTOMATION_README.md    # Technical docs
│
└── exports/                               # Password manager exports
```

## Security

### Encryption
- **Algorithm**: AES-256-GCM
- **Key Derivation**: Scrypt
- **Auth Tags**: Per-password verification
- **Random IVs**: Unique per encryption

### Protected Files (gitignored)
- `data/affiliate/credentials.json`
- `data/affiliate/signup-progress.json`
- `.env.affiliate`
- `exports/`

### Best Practices
1. Use 20+ character master password
2. Store master password in password manager
3. Export credentials to 1Password/LastPass
4. Never commit sensitive files
5. Rotate passwords every 90 days

## Workflow

### Day 1: Sign Up (2-3 hours)
```bash
npm run affiliate:create
# Select 4-6 platforms
# Complete guided signups
# Verify emails
```

### Day 2-7: Wait for Approvals
```bash
npm run affiliate:status
# Check daily for updates
# Complete any additional verifications
```

### Day 7+: Configure & Launch
```bash
npm run affiliate:configure
# Add affiliate IDs
# Generate links
# Start creating content
```

## Example Usage

### Generate Amazon Link
```javascript
// After configuration
const tag = 'brandonmills-20';
const asin = 'B08D15RNG8';
const link = `https://www.amazon.com/dp/${asin}/?tag=${tag}`;

// Result:
// https://www.amazon.com/dp/B08D15RNG8/?tag=brandonmills-20
```

### Use in Blog Post
```html
<article>
  <h2>My Favorite Camera: Canon EOS R5</h2>

  <p>I've been shooting with the Canon EOS R5 for 6 months...</p>

  <a href="https://www.amazon.com/dp/B08D15RNG8/?tag=brandonmills-20">
    Buy Canon EOS R5 on Amazon
  </a>

  <p class="affiliate-disclosure">
    This post contains affiliate links. I earn a commission
    if you purchase, at no additional cost to you.
  </p>
</article>
```

## Environment Variables

After configuration, `.env.affiliate` contains:

```bash
# Amazon Associates
AMAZON_ASSOCIATES_ACCOUNT_ID="..."
AMAZON_ASSOCIATES_ASSOCIATE_TAG="brandonmills-20"

# B&H Photo
BHPHOTO_AFFILIATE_ID="12345"

# Printful
PRINTFUL_AFFILIATE_LINK="https://..."
```

Use in Next.js:

```javascript
// next.config.js
module.exports = {
  env: {
    AMAZON_TAG: process.env.AMAZON_ASSOCIATES_ASSOCIATE_TAG,
    BHPHOTO_ID: process.env.BHPHOTO_AFFILIATE_ID
  }
}

// In component
const amazonLink = (asin) =>
  `https://www.amazon.com/dp/${asin}/?tag=${process.env.AMAZON_TAG}`;
```

## Troubleshooting

### Installation Issues

**"Cannot find module"**
```bash
npm install
```

**"Puppeteer fails to launch"**
```bash
npm uninstall puppeteer
npm install puppeteer
```

### Application Issues

**"Website not accessible"**
- Verify domain is live
- Check DNS settings
- Test in incognito mode
- Wait 24 hours, try again

**"Application rejected"**
- Add more content (10+ posts)
- Build traffic (100+ visitors/month)
- Complete all fields
- Wait 30 days, reapply

**"Email already registered"**
- Use email aliases: `base+platform@domain.com`
- All go to same inbox

### Credential Issues

**"Failed to decrypt password"**
- Master password incorrect
- Back up credentials first
- May need to regenerate

**"Credentials not found"**
```bash
# Check file exists
ls data/affiliate/credentials.json

# If missing, create accounts
npm run affiliate:create
```

## Platform-Specific Tips

### Amazon Associates
- Need 3 sales within 180 days to keep account
- SiteStripe bookmarklet for easy linking
- Product Advertising API available
- Best for: General products, books, electronics

### B&H Photo
- Fast approval for photography sites
- Excellent for camera gear reviews
- Professional affiliate dashboard
- Best for: Camera equipment, lenses, accessories

### Printful
- Instant approval for existing customers
- 10% commission + bonuses
- Easy integration with your store
- Best for: Promoting your own print business

### ShareASale
- Apply to individual merchants after approval
- Many photography-related merchants
- KEH, Moment, Peak Design available
- Best for: Photography accessories, services

## Legal Compliance

### Required Disclosures

Always include on pages with affiliate links:

```html
<div class="affiliate-disclosure">
  <strong>Disclosure:</strong> This post contains affiliate links.
  If you make a purchase through these links, I earn a commission
  at no additional cost to you. I only recommend products I personally
  use and believe will add value to your photography.
</div>
```

### FTC Guidelines
- Clear and conspicuous disclosure
- Near affiliate links, above fold
- Use plain language
- Can't hide in footer only
- Must disclose on social media too

### Platform TOS
- Read each platform's terms
- Follow link requirements
- Don't violate prohibited uses
- Monitor for TOS changes

## Performance Tracking

### Platform Dashboards
- Amazon: affiliate-program.amazon.com
- ShareASale: account.shareasale.com
- B&H Photo: [Check your approval email]
- CJ: members.cj.com

### Metrics to Track
- Click-through rate (CTR)
- Conversion rate
- Average order value (AOV)
- Earnings per click (EPC)
- Commission earned

### Optimization
- Test different products
- Try various placements
- Write product comparisons
- Create buying guides
- Use seasonal content

## Scaling Strategy

### Month 1-3: Foundation
- Get 5-10 platforms approved
- Create 20+ affiliate content pieces
- Build email list
- Establish posting schedule

### Month 4-6: Growth
- Apply to additional platforms
- Test product categories
- Optimize top performers
- Build backlinks

### Month 6-12: Scale
- Diversify income sources
- Create affiliate courses
- Build comparison tools
- Negotiate higher rates

## Support & Resources

### Documentation
- **Quick Start**: `docs/affiliate/QUICK_START.md`
- **Complete Guide**: `docs/affiliate/AFFILIATE_SIGNUP_GUIDE.md`
- **Technical Docs**: `docs/affiliate/AFFILIATE_AUTOMATION_README.md`

### Platform Support
- Amazon: associates-support@amazon.com
- ShareASale: support@shareasale.com
- B&H Photo: affiliates@bhphoto.com
- CJ: support.cj.com

### Learning Resources
- [Pat Flynn's Affiliate Guide](https://www.smartpassiveincome.com/guide/)
- [FTC Disclosure Guidelines](https://www.ftc.gov/business-guidance/)
- [Affiliate Marketing Course](https://www.affilorama.com/)

## Roadmap

### Planned Features
- [ ] Browser extension for one-click links
- [ ] Automatic approval checking
- [ ] Commission tracking dashboard
- [ ] Link performance analytics
- [ ] A/B testing framework
- [ ] Automated reporting
- [ ] Multi-site support

### Wishlist
- [ ] AI content suggestions
- [ ] Seasonal product recommendations
- [ ] Competitor analysis
- [ ] Email automation integration
- [ ] WordPress plugin
- [ ] Mobile app

## Success Metrics

### First 30 Days
- ✅ 5+ platforms approved
- ✅ 10+ affiliate links created
- ✅ 5+ content pieces published
- ✅ FTC disclosures added
- ✅ First clicks tracked

### First 90 Days
- ✅ 100+ clicks generated
- ✅ First commissions earned
- ✅ 20+ content pieces published
- ✅ Email list started
- ✅ Social promotion active

### First Year
- ✅ $500+ monthly commissions
- ✅ 10+ active platforms
- ✅ 50+ content pieces
- ✅ 1000+ email subscribers
- ✅ Consistent traffic growth

## Contributing

Improvements welcome! Areas needing help:
- Platform-specific automation
- Additional platforms
- Better error handling
- UI improvements
- Documentation
- Testing

## License

MIT License - Commercial use allowed

---

## Getting Started Right Now

```bash
# 1. Test everything works
node scripts/test-affiliate-system.js

# 2. Start creating accounts
npm run affiliate:create

# 3. Check status
npm run affiliate:status

# 4. Configure when approved
npm run affiliate:configure

# 5. Start earning!
```

**Questions?** See `docs/affiliate/QUICK_START.md` for a 5-minute guide.

---

**Created:** 2025-11-05
**Version:** 1.0.0
**Last Updated:** 2025-11-05
**Status:** Production Ready ✅
