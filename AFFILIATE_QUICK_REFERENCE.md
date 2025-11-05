# Affiliate System - Quick Reference Card

## Commands

```bash
# Test system (run first)
node scripts/test-affiliate-system.js

# Create accounts
npm run affiliate:create

# Check status
npm run affiliate:status

# Manage credentials
npm run affiliate:manage

# Configure approved
npm run affiliate:configure
```

## Files

```
scripts/
  affiliate-account-creator.js      # Signup wizard
  credential-manager.js             # View/export credentials
  configure-affiliate-accounts.js   # Post-approval setup
  check-affiliate-status.js         # Status checker
  test-affiliate-system.js          # Test suite

data/affiliate/
  platforms-config.json             # Platform definitions
  credentials-template.json         # Structure
  credentials.json                  # ENCRYPTED (gitignored)
  affiliate-links.json              # Generated links

docs/affiliate/
  QUICK_START.md                    # 30-min guide
  AFFILIATE_SIGNUP_GUIDE.md         # Complete guide
  AFFILIATE_AUTOMATION_README.md    # Technical docs
```

## Priority Platforms

**Very High (Start Here):**
1. Printful (instant approval, 10%)
2. B&H Photo (1-3 days, 2-8%)
3. Amazon Associates (1-2 days, 1-10%)
4. Adorama (1-3 days, 2-5%)

**High:**
5. ShareASale (2-5 days, varies)
6. CJ Affiliate (3-7 days, varies)

## Workflow

1. **Test:** `node scripts/test-affiliate-system.js`
2. **Create:** `npm run affiliate:create` (2-3 hours)
3. **Wait:** Check emails, verify (1-7 days)
4. **Status:** `npm run affiliate:status` (daily)
5. **Configure:** `npm run affiliate:configure` (1 hour)
6. **Launch:** Create content with affiliate links

## Quick Troubleshooting

**"Email already registered"**
→ Use aliases: `base+platform@domain.com`

**"Website not accessible"**
→ Verify domain live, wait 24hrs, retry

**"Application rejected"**
→ Add content (10+ posts), build traffic, wait 30 days

**"Can't decrypt"**
→ Wrong master password, check password manager

**"Dependencies missing"**
→ `npm install`

## Sample Links

**Amazon:**
```
https://www.amazon.com/dp/ASIN/?tag=YOUR_TAG
```

**B&H Photo:**
```
https://www.bhphotovideo.com/c/product/ID/BI/YOUR_ID/KBID/1234
```

**Printful:**
```
https://www.printful.com/a/YOUR_ID
```

## FTC Disclosure Template

```html
<div class="affiliate-disclosure">
  This post contains affiliate links. I earn a commission
  if you purchase, at no additional cost to you.
</div>
```

## Security

- Master password: 20+ chars, store in password manager
- Never commit: credentials.json, .env.affiliate
- Export backups: 1Password/LastPass CSV
- Rotate passwords: Every 90 days

## Status Meanings

- **Pending:** Applied, waiting for approval
- **Approved:** Accepted, needs configuration
- **Active:** Configured, generating links
- **Rejected:** Denied, wait 30 days to reapply

## Time Estimates

- Signup per platform: 10-15 min
- Email verification: 2-5 min
- Approval wait: 1-7 days
- Configuration: 5-10 min
- First content: 30-60 min

## Success Checklist

- [ ] System tested (all green)
- [ ] 4+ platforms applied
- [ ] Emails verified
- [ ] Status checked daily
- [ ] Accounts configured
- [ ] Links generated
- [ ] FTC disclosure added
- [ ] First content published
- [ ] Performance tracked

## Support

**Docs:** `docs/affiliate/`
**Amazon:** associates-support@amazon.com
**ShareASale:** support@shareasale.com
**B&H:** Check approval email

## Pro Tips

1. Start with Printful (instant)
2. Apply to B&H + Adorama (photography)
3. Amazon requires 3 sales in 180 days
4. Use email aliases for organization
5. Export credentials to password manager
6. Check status daily during approvals
7. Configure immediately after approval
8. Test links before publishing
9. Always include FTC disclosure
10. Track performance weekly

---

**Quick Start:** `npm run affiliate:create`
**Need Help?** `docs/affiliate/QUICK_START.md`
