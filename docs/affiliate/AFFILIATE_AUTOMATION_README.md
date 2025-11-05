# Affiliate Account Automation System

## Overview

A comprehensive semi-automated system for creating and managing affiliate accounts across multiple platforms, designed to maximize efficiency while respecting legal and platform limitations.

## Features

### ✅ Automated
- **Password Generation**: Strong, unique passwords per platform (20+ characters)
- **Username Generation**: Platform-specific usernames from business name
- **Email Aliases**: Automatic email alias generation (`base+platform@domain.com`)
- **Form Pre-filling**: Auto-population of business information
- **Credential Storage**: Encrypted AES-256-GCM storage
- **Progress Tracking**: Save and resume signup sessions
- **Link Generation**: Automatic affiliate link creation
- **Environment Variables**: Auto-generation of .env configurations

### 🔧 Tools Included

1. **affiliate-account-creator.js** - Interactive signup wizard
2. **credential-manager.js** - View and manage credentials
3. **configure-affiliate-accounts.js** - Post-approval setup
4. **browser-automation.js** - Puppeteer-based form filling
5. **utils.js** - Encryption, generation, export utilities

## Installation

```bash
cd /Users/brandon/Webdesigner
npm install
```

Dependencies installed:
- `puppeteer` - Browser automation
- `inquirer` - Interactive CLI prompts
- `chalk` - Terminal styling
- `ora` - Loading spinners
- `generate-password` - Secure password generation
- `dotenv-vault` - Environment encryption

## Usage

### 1. Create Accounts

```bash
node scripts/affiliate-account-creator.js
```

**What it does:**
- Asks for master password (encrypts credentials)
- Confirms business information
- Lets you select platforms
- Generates unique credentials per platform
- Opens signup pages in browser
- Guides you through each step
- Handles email verification prompts
- Saves progress continuously

**Workflow:**
```
Start → Business Info → Select Platforms → For Each Platform:
  ├─ Generate Credentials
  ├─ Open Signup Page
  ├─ Guide Through Steps
  ├─ Wait for Email Verification
  └─ Save Status
```

### 2. Manage Credentials

```bash
node scripts/credential-manager.js
```

**Features:**
- View account overview
- List all accounts
- View account details
- Decrypt and view passwords
- Update account status
- Export to password managers (1Password, LastPass)
- Export to .env format
- Track approval status

**Export Formats:**
- 1Password CSV
- LastPass CSV
- JSON (encrypted)
- Environment Variables

### 3. Configure Active Accounts

```bash
node scripts/configure-affiliate-accounts.js
```

**Run after approval. It will:**
- Detect approved accounts
- Walk through platform-specific setup
- Collect affiliate IDs and API keys
- Generate sample affiliate links
- Create .env.affiliate file
- Test link functionality
- Save configuration

## File Structure

```
/Users/brandon/Webdesigner/
├── scripts/
│   ├── affiliate-account-creator.js      # Main signup wizard
│   ├── credential-manager.js             # Credential management
│   ├── configure-affiliate-accounts.js   # Post-approval setup
│   └── affiliate-automation/
│       ├── browser-automation.js         # Puppeteer helpers
│       └── utils.js                      # Utility functions
│
├── data/affiliate/
│   ├── platforms-config.json             # Platform configurations
│   ├── credentials-template.json         # Credential structure
│   ├── credentials.json                  # ENCRYPTED credentials (gitignored)
│   ├── affiliate-links.json              # Generated links
│   └── signup-progress.json              # Session progress
│
├── docs/affiliate/
│   ├── AFFILIATE_SIGNUP_GUIDE.md         # Complete guide
│   └── AFFILIATE_AUTOMATION_README.md    # This file
│
└── exports/                               # Password manager exports (gitignored)
```

## Supported Platforms

### Very High Priority (Photography Focus)

1. **B&H Photo Video** - Camera equipment (2-8% commission)
2. **Adorama** - Photography gear (2-5% commission)
3. **Printful** - Your print business (10% commission, instant approval)
4. **Amazon Associates** - Everything (1-10% commission)

### High Priority

5. **ShareASale** - Photography services and products (varies)
6. **CJ Affiliate** - Premium brands like Adobe (varies)

### Medium Priority

7. **Rakuten Advertising** - Large brands (varies)
8. **Impact Radius** - Modern platform (varies)
9. **Awin** - International merchants (varies)
10. **Mpix** - Photo printing (10-15% commission)

## Platform Configuration

### platforms-config.json

Each platform has:

```json
{
  "id": "platform-slug",
  "name": "Platform Name",
  "signupUrl": "https://...",
  "priority": "very-high|high|medium|low",
  "approvalTime": "1-2 days",
  "requirements": {
    "website": true,
    "taxInfo": true,
    "trafficProof": false,
    "phoneVerification": false
  },
  "fields": {
    "businessName": "Brandon Mills Photography",
    "website": "brandonmills.com",
    "contentCategory": ["Photography", "Art"]
  },
  "postApproval": {
    "apiAccess": true,
    "linkGenerator": true
  }
}
```

### credentials.json Structure

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-05T...",
  "businessInfo": {
    "businessName": "Brandon Mills Photography",
    "website": "brandonmills.com",
    "email": "affiliates@brandonmills.com",
    "...": "..."
  },
  "accounts": {
    "platform-id": {
      "platformName": "Platform Name",
      "status": "pending|approved|active|rejected",
      "email": "affiliates+platform@domain.com",
      "username": "generated_username",
      "password": {
        "encrypted": "...",
        "iv": "...",
        "authTag": "..."
      },
      "accountId": null,
      "affiliateId": null,
      "apiCredentials": {},
      "dates": {
        "applied": "2025-11-05T...",
        "approved": null,
        "lastLogin": null
      },
      "commissionRate": "X%"
    }
  }
}
```

## Security

### Encryption

All passwords are encrypted using:
- **Algorithm**: AES-256-GCM
- **Key Derivation**: Scrypt
- **Key Length**: 256 bits
- **IV Length**: 128 bits (random per encryption)
- **Authentication**: GCM auth tags

### Master Password

Your master password:
- Never stored on disk
- Required to decrypt credentials
- Should be 20+ characters
- Store in password manager
- Required for credential-manager.js

### Gitignore

Already configured to ignore:
```
data/affiliate/credentials.json
data/affiliate/signup-progress.json
.env.affiliate
.env.local
exports/
```

### Best Practices

1. **Use Strong Master Password**: 20+ characters with mixed case, numbers, symbols
2. **Back Up Credentials**: Export to 1Password/LastPass
3. **Never Commit Secrets**: Check .gitignore before commits
4. **Rotate Passwords**: Change every 90 days
5. **Monitor Access**: Check login activity in platform dashboards

## Workflow Examples

### First-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create accounts
node scripts/affiliate-account-creator.js
# Enter master password
# Confirm business info
# Select all "very-high" priority platforms
# Follow prompts for each platform

# 3. Check email
# Click verification links
# Complete tax forms
# Wait for approvals (1-7 days)

# 4. After approvals, configure accounts
node scripts/configure-affiliate-accounts.js
# Enter platform IDs
# Copy API keys
# Generate links

# 5. Start promoting!
```

### View Credentials

```bash
node scripts/credential-manager.js
# Enter master password
# Select "List all accounts"
# Review status
```

### Export to 1Password

```bash
node scripts/credential-manager.js
# Enter master password
# Select "Export credentials"
# Choose "1Password CSV"
# Import CSV into 1Password
```

### Update Account Status

```bash
node scripts/credential-manager.js
# Enter master password
# Select "Update account status"
# Choose platform
# Change status to "approved"
# Add account ID
```

## API Integration

### Using Credentials in Code

```javascript
// Load credentials
const credentials = require('./data/affiliate/credentials.json');

// Get Amazon Associate tag
const amazonTag = credentials.accounts['amazon-associates']
  .apiCredentials.associateTag;

// Generate Amazon link
function createAmazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}/?tag=${amazonTag}`;
}

// Example
const cameraLink = createAmazonLink('B08D15RNG8');
console.log(cameraLink);
// https://www.amazon.com/dp/B08D15RNG8/?tag=brandonmills-20
```

### Environment Variables

After running `configure-affiliate-accounts.js`:

```bash
# .env.affiliate generated with:
AMAZON_ASSOCIATES_ACCOUNT_ID="..."
AMAZON_ASSOCIATES_ASSOCIATE_TAG="brandonmills-20"
BHPHOTO_AFFILIATE_ID="..."
PRINTFUL_AFFILIATE_LINK="..."
```

Load in your app:

```javascript
// next.config.js or .env.local
module.exports = {
  env: {
    AMAZON_TAG: process.env.AMAZON_ASSOCIATES_ASSOCIATE_TAG,
    BHPHOTO_ID: process.env.BHPHOTO_AFFILIATE_ID
  }
}
```

## Troubleshooting

### "Cannot find module 'inquirer'"

```bash
npm install
```

### "Credentials file not found"

Run the account creator first:
```bash
node scripts/affiliate-account-creator.js
```

### "Failed to decrypt password"

Master password incorrect. Try again or reset:
```bash
# Back up first!
cp data/affiliate/credentials.json data/affiliate/credentials.backup.json

# Then regenerate with new master password
node scripts/affiliate-account-creator.js
```

### "Browser fails to launch"

Puppeteer issue. Reinstall:
```bash
npm uninstall puppeteer
npm install puppeteer
```

### "Platform rejected application"

**Common reasons:**
- Website not accessible
- Low/no traffic
- Low content quality
- Incomplete application
- Incorrect information

**Solutions:**
- Improve website content (10+ quality posts)
- Build traffic (100+ visitors/month)
- Complete all fields accurately
- Wait 30 days and reapply

## Advanced Usage

### Custom Platform Configuration

Add new platform to `data/affiliate/platforms-config.json`:

```json
{
  "platforms": [
    {
      "id": "new-platform",
      "name": "New Platform",
      "signupUrl": "https://...",
      "priority": "medium",
      "approvalTime": "3-5 days",
      "requirements": {
        "website": true,
        "taxInfo": true,
        "trafficProof": false,
        "phoneVerification": true
      },
      "fields": {
        "businessName": "Brandon Mills Photography",
        "website": "brandonmills.com",
        "contentCategory": ["Photography"]
      },
      "postApproval": {
        "apiAccess": false,
        "linkGenerator": true,
        "reports": true
      },
      "notes": "Platform-specific notes"
    }
  ]
}
```

### Batch Processing

Process multiple platforms without interaction:

```javascript
// scripts/batch-signup.js
const { runWizard } = require('./affiliate-account-creator');

async function batchSignup(platformIds) {
  for (const id of platformIds) {
    await runWizard({ platform: id, autoConfirm: true });
  }
}

batchSignup(['amazon-associates', 'bhphoto', 'printful']);
```

### Custom Link Generator

```javascript
// lib/affiliate-links.js
const credentials = require('../data/affiliate/credentials.json');

class AffiliateLinkGenerator {
  constructor() {
    this.accounts = credentials.accounts;
  }

  amazon(asin) {
    const tag = this.accounts['amazon-associates'].apiCredentials.associateTag;
    return `https://www.amazon.com/dp/${asin}/?tag=${tag}`;
  }

  bhphoto(productUrl) {
    const id = this.accounts['bhphoto'].affiliateId;
    return `${productUrl}/BI/${id}/KBID/1234`;
  }

  printful() {
    return this.accounts['printful'].affiliateLink;
  }

  // Add more platforms...
}

module.exports = new AffiliateLinkGenerator();
```

## Performance Tips

1. **Signup Order**: Start with "very-high" priority platforms (instant approval)
2. **Email Verification**: Keep email open in another window for quick verification
3. **Master Password**: Use password manager autofill for speed
4. **Batch Days**: Do all signups in one session (2-3 hours)
5. **Follow-up**: Check status every 2-3 days, update in credential manager

## Legal Compliance

### Required

- ✅ Accurate business information
- ✅ Real email verification
- ✅ Actual tax information
- ✅ Valid phone number
- ✅ Legitimate website
- ✅ FTC disclosure on all affiliate content

### Prohibited

- ❌ False information
- ❌ Fake verification bypass
- ❌ Bot traffic generation
- ❌ Unauthorized API access
- ❌ Cookie stuffing
- ❌ Link cloaking to hide affiliation

## Support

### Script Issues
GitHub Issues: [Your repo URL]

### Platform Support
- Amazon: associates-support@amazon.com
- ShareASale: support@shareasale.com
- B&H Photo: affiliates@bhphoto.com

### General Questions
See: `docs/affiliate/AFFILIATE_SIGNUP_GUIDE.md`

## Roadmap

- [ ] Browser extension for one-click link generation
- [ ] Automatic approval status checking
- [ ] Commission tracking dashboard
- [ ] Link performance analytics
- [ ] A/B testing for affiliate content
- [ ] Automated reporting
- [ ] Multi-site support
- [ ] Team credential sharing (encrypted)

## Contributing

Improvements welcome! Please:
1. Test thoroughly
2. Follow existing code style
3. Update documentation
4. Respect security best practices

## License

MIT License - See LICENSE file

---

**Created:** 2025-11-05
**Version:** 1.0.0
**Author:** Infrastructure Development Team
