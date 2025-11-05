#!/usr/bin/env node

/**
 * Configure Affiliate Accounts - Post-approval setup
 *
 * This tool helps you configure approved affiliate accounts:
 * - Set up tracking
 * - Generate affiliate links
 * - Test link functionality
 * - Create first affiliate products
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');

const {
  loadJSON,
  saveJSON,
  decrypt,
  formatDate,
  copyToClipboard
} = require('./affiliate-automation/utils');

// File paths
const PROJECT_ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data', 'affiliate');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');
const LINKS_FILE = path.join(DATA_DIR, 'affiliate-links.json');

/**
 * Display banner
 */
function displayBanner() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('║          AFFILIATE ACCOUNT CONFIGURATION                   ║'));
  console.log(chalk.cyan.bold('║          Post-Approval Setup Tool                          ║'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));
}

/**
 * Get approved accounts
 */
function getApprovedAccounts(credentials) {
  return Object.entries(credentials.accounts)
    .filter(([id, account]) => ['approved', 'active'].includes(account.status))
    .map(([id, account]) => ({ id, ...account }));
}

/**
 * Configure Amazon Associates
 */
async function configureAmazonAssociates(account) {
  console.log(chalk.bold.cyan('\n🔧 Configuring Amazon Associates\n'));

  console.log(chalk.gray('Setup steps:\n'));
  console.log(chalk.gray('  1. Log in to: https://affiliate-program.amazon.com'));
  console.log(chalk.gray('  2. Go to Tools → Product Linking → Link to Any Page'));
  console.log(chalk.gray('  3. Copy your Associate Tag (e.g., brandonmills-20)\n'));

  const { associateTag } = await inquirer.prompt([
    {
      type: 'input',
      name: 'associateTag',
      message: 'Enter your Associate Tag:',
      validate: (input) => {
        if (!input || input.length < 3) {
          return 'Please enter a valid Associate Tag';
        }
        return true;
      }
    }
  ]);

  // Update account
  if (!account.apiCredentials) {
    account.apiCredentials = {};
  }
  account.apiCredentials.associateTag = associateTag;
  account.status = 'active';
  account.dates.lastLogin = new Date().toISOString();

  console.log(chalk.green('\n✓ Amazon Associates configured!\n'));

  // Generate sample links
  const sampleProducts = [
    { name: 'Canon EOS R5', asin: 'B08D15RNG8' },
    { name: 'Sony A7 IV', asin: 'B09JZT6YK5' },
    { name: 'Manfrotto Tripod', asin: 'B002VD8380' }
  ];

  console.log(chalk.bold('📎 Sample Affiliate Links:\n'));

  sampleProducts.forEach(product => {
    const link = `https://www.amazon.com/dp/${product.asin}/?tag=${associateTag}`;
    console.log(`  ${chalk.cyan(product.name)}:`);
    console.log(`  ${chalk.gray(link)}\n`);
  });

  return {
    platform: 'amazon-associates',
    associateTag,
    sampleLinks: sampleProducts.map(p => ({
      ...p,
      url: `https://www.amazon.com/dp/${p.asin}/?tag=${associateTag}`
    }))
  };
}

/**
 * Configure ShareASale
 */
async function configureShareASale(account) {
  console.log(chalk.bold.cyan('\n🔧 Configuring ShareASale\n'));

  console.log(chalk.gray('Setup steps:\n'));
  console.log(chalk.gray('  1. Log in to: https://account.shareasale.com'));
  console.log(chalk.gray('  2. Go to Account Settings → API Settings'));
  console.log(chalk.gray('  3. Copy your Affiliate ID\n'));

  const { affiliateId, apiToken, apiSecret } = await inquirer.prompt([
    {
      type: 'input',
      name: 'affiliateId',
      message: 'Enter your Affiliate ID:'
    },
    {
      type: 'input',
      name: 'apiToken',
      message: 'Enter API Token (optional):',
      default: ''
    },
    {
      type: 'input',
      name: 'apiSecret',
      message: 'Enter API Secret (optional):',
      default: ''
    }
  ]);

  // Update account
  account.affiliateId = affiliateId;
  if (!account.apiCredentials) {
    account.apiCredentials = {};
  }
  if (apiToken) account.apiCredentials.apiToken = apiToken;
  if (apiSecret) account.apiCredentials.apiSecret = apiSecret;
  account.status = 'active';
  account.dates.lastLogin = new Date().toISOString();

  console.log(chalk.green('\n✓ ShareASale configured!\n'));

  console.log(chalk.gray('Next steps:\n'));
  console.log(chalk.gray('  1. Browse merchants and apply to programs'));
  console.log(chalk.gray('  2. Get approved by individual merchants'));
  console.log(chalk.gray('  3. Generate links from Links → Get Links\n'));

  return {
    platform: 'shareasale',
    affiliateId
  };
}

/**
 * Configure B&H Photo
 */
async function configureBHPhoto(account) {
  console.log(chalk.bold.cyan('\n🔧 Configuring B&H Photo Video\n'));

  console.log(chalk.gray('Setup steps:\n'));
  console.log(chalk.gray('  1. Log in to your B&H affiliate dashboard'));
  console.log(chalk.gray('  2. Copy your affiliate ID\n'));

  const { affiliateId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'affiliateId',
      message: 'Enter your Affiliate ID:'
    }
  ]);

  // Update account
  account.affiliateId = affiliateId;
  account.status = 'active';
  account.dates.lastLogin = new Date().toISOString();

  console.log(chalk.green('\n✓ B&H Photo configured!\n'));

  // Generate sample links
  const sampleProducts = [
    { name: 'Canon EOS R5', url: 'https://www.bhphotovideo.com/c/product/1595021-REG' },
    { name: 'Sony A7 IV', url: 'https://www.bhphotovideo.com/c/product/1665800-REG' },
    { name: 'Manfrotto Tripod', url: 'https://www.bhphotovideo.com/c/product/554610-REG' }
  ];

  console.log(chalk.bold('📎 Sample Affiliate Links:\n'));

  sampleProducts.forEach(product => {
    const link = `${product.url}/BI/${affiliateId}/KBID/1234`;
    console.log(`  ${chalk.cyan(product.name)}:`);
    console.log(`  ${chalk.gray(link)}\n`);
  });

  return {
    platform: 'bhphoto',
    affiliateId,
    sampleLinks: sampleProducts.map(p => ({
      ...p,
      url: `${p.url}/BI/${affiliateId}/KBID/1234`
    }))
  };
}

/**
 * Configure Printful
 */
async function configurePrintful(account) {
  console.log(chalk.bold.cyan('\n🔧 Configuring Printful Affiliate\n'));

  console.log(chalk.gray('Setup steps:\n'));
  console.log(chalk.gray('  1. Log in to: https://www.printful.com/dashboard/affiliate'));
  console.log(chalk.gray('  2. Copy your affiliate link\n'));

  const { affiliateLink } = await inquirer.prompt([
    {
      type: 'input',
      name: 'affiliateLink',
      message: 'Enter your Printful affiliate link:'
    }
  ]);

  // Update account
  account.status = 'active';
  account.dates.lastLogin = new Date().toISOString();

  console.log(chalk.green('\n✓ Printful configured!\n'));

  console.log(chalk.bold('📎 Your Affiliate Link:\n'));
  console.log(`  ${chalk.cyan(affiliateLink)}\n`);

  await copyToClipboard(affiliateLink);
  console.log(chalk.green('  ✓ Link copied to clipboard!\n'));

  return {
    platform: 'printful',
    affiliateLink
  };
}

/**
 * Generic platform configuration
 */
async function configureGenericPlatform(account) {
  console.log(chalk.bold.cyan(`\n🔧 Configuring ${account.platformName}\n`));

  const { accountId, affiliateId, apiKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'accountId',
      message: 'Enter Account ID:',
      default: account.accountId || ''
    },
    {
      type: 'input',
      name: 'affiliateId',
      message: 'Enter Affiliate/Publisher ID (if different):',
      default: account.affiliateId || ''
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter API Key (optional):',
      default: ''
    }
  ]);

  // Update account
  if (accountId) account.accountId = accountId;
  if (affiliateId) account.affiliateId = affiliateId;
  if (apiKey) {
    if (!account.apiCredentials) {
      account.apiCredentials = {};
    }
    account.apiCredentials.apiKey = apiKey;
  }
  account.status = 'active';
  account.dates.lastLogin = new Date().toISOString();

  console.log(chalk.green(`\n✓ ${account.platformName} configured!\n`));

  return {
    platform: account.id,
    accountId,
    affiliateId
  };
}

/**
 * Save affiliate links
 */
async function saveAffiliateLinks(links) {
  let existingLinks = await loadJSON(LINKS_FILE) || { links: [] };

  existingLinks.links = existingLinks.links || [];
  existingLinks.links.push({
    ...links,
    createdAt: new Date().toISOString()
  });

  existingLinks.lastUpdated = new Date().toISOString();

  await saveJSON(LINKS_FILE, existingLinks);
}

/**
 * Generate environment variables
 */
async function generateEnvVariables(credentials) {
  console.log(chalk.bold.cyan('\n📝 Generating Environment Variables\n'));

  const lines = [
    '# Affiliate Account Configuration',
    '# Add these to your .env.local file',
    ''
  ];

  Object.entries(credentials.accounts).forEach(([id, account]) => {
    if (['approved', 'active'].includes(account.status)) {
      const prefix = id.toUpperCase().replace(/-/g, '_');

      lines.push(`# ${account.platformName}`);
      if (account.accountId) {
        lines.push(`${prefix}_ACCOUNT_ID="${account.accountId}"`);
      }
      if (account.affiliateId) {
        lines.push(`${prefix}_AFFILIATE_ID="${account.affiliateId}"`);
      }
      if (account.apiCredentials) {
        Object.entries(account.apiCredentials).forEach(([key, value]) => {
          if (value) {
            const envKey = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            lines.push(`${prefix}_${envKey}="${value}"`);
          }
        });
      }
      lines.push('');
    }
  });

  const envContent = lines.join('\n');

  console.log(chalk.gray(envContent));

  const envFilePath = path.join(PROJECT_ROOT, '.env.affiliate');
  const fs = require('fs').promises;
  await fs.writeFile(envFilePath, envContent, 'utf8');

  console.log(chalk.green(`\n✓ Saved to: ${envFilePath}\n`));
}

/**
 * Main configuration flow
 */
async function runConfiguration() {
  try {
    displayBanner();

    // Load credentials
    const credentials = await loadJSON(CREDENTIALS_FILE);

    if (!credentials) {
      console.log(chalk.red('❌ No credentials file found.'));
      console.log(chalk.gray('Run "node scripts/affiliate-account-creator.js" first.\n'));
      return;
    }

    // Get approved accounts
    const approvedAccounts = getApprovedAccounts(credentials);

    if (approvedAccounts.length === 0) {
      console.log(chalk.yellow('\n⚠️  No approved accounts found.\n'));
      console.log(chalk.gray('Wait for platform approvals, then run this script again.\n'));
      return;
    }

    console.log(chalk.bold(`\n✓ Found ${approvedAccounts.length} approved account(s):\n`));

    approvedAccounts.forEach((account, index) => {
      console.log(`  ${index + 1}. ${chalk.cyan(account.platformName)} (${account.status})`);
    });

    console.log('');

    // Select accounts to configure
    const { selectedIds } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedIds',
        message: 'Select accounts to configure:',
        choices: approvedAccounts.map(account => ({
          name: account.platformName,
          value: account.id,
          checked: account.status === 'approved'
        }))
      }
    ]);

    if (selectedIds.length === 0) {
      console.log(chalk.yellow('\nNo accounts selected. Exiting.\n'));
      return;
    }

    // Configure each account
    const allLinks = [];

    for (const id of selectedIds) {
      const account = credentials.accounts[id];
      let links;

      switch (id) {
        case 'amazon-associates':
          links = await configureAmazonAssociates(account);
          break;

        case 'shareasale':
          links = await configureShareASale(account);
          break;

        case 'bhphoto':
          links = await configureBHPhoto(account);
          break;

        case 'printful':
          links = await configurePrintful(account);
          break;

        default:
          links = await configureGenericPlatform(account);
          break;
      }

      if (links) {
        allLinks.push(links);
        await saveAffiliateLinks(links);
      }

      // Save progress after each account
      credentials.lastUpdated = new Date().toISOString();
      await saveJSON(CREDENTIALS_FILE, credentials);

      console.log('');
    }

    // Generate environment variables
    await generateEnvVariables(credentials);

    // Summary
    console.log(chalk.bold.green('='.repeat(60)));
    console.log(chalk.bold.green('  🎉 CONFIGURATION COMPLETE!'));
    console.log(chalk.bold.green('='.repeat(60) + '\n'));

    console.log(chalk.bold('Summary:\n'));
    console.log(`  Configured Accounts: ${chalk.green(selectedIds.length)}`);
    console.log(`  Affiliate Links:     ${chalk.cyan(LINKS_FILE)}`);
    console.log(`  Environment Vars:    ${chalk.cyan('.env.affiliate')}\n`);

    console.log(chalk.gray('Next steps:\n'));
    console.log(chalk.gray('  1. Copy variables from .env.affiliate to .env.local'));
    console.log(chalk.gray('  2. Test affiliate links to verify tracking'));
    console.log(chalk.gray('  3. Start creating affiliate content'));
    console.log(chalk.gray('  4. Monitor commissions in platform dashboards\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runConfiguration();
}

module.exports = { runConfiguration };
