#!/usr/bin/env node

/**
 * Credential Manager - View, export, and manage affiliate credentials
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;

const {
  loadJSON,
  saveJSON,
  decrypt,
  formatDate,
  exportTo1Password,
  exportToLastPass,
  getPlatformStatusSummary,
  calculateApprovalRate
} = require('./affiliate-automation/utils');

// File paths
const PROJECT_ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data', 'affiliate');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');

/**
 * Display banner
 */
function displayBanner() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('║          AFFILIATE CREDENTIAL MANAGER                      ║'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));
}

/**
 * Display credentials overview
 */
function displayOverview(credentials) {
  const summary = getPlatformStatusSummary(credentials);
  const approvalRate = calculateApprovalRate(credentials);

  console.log(chalk.bold('📊 Overview:\n'));
  console.log(`  Total Platforms:    ${chalk.cyan(summary.total)}`);
  console.log(`  Pending:            ${chalk.yellow(summary.pending)}`);
  console.log(`  Approved:           ${chalk.green(summary.approved)}`);
  console.log(`  Active:             ${chalk.blue(summary.active)}`);
  console.log(`  Rejected:           ${chalk.red(summary.rejected)}`);
  console.log(`  Approval Rate:      ${chalk.cyan(approvalRate + '%')}`);
  console.log(`  Last Updated:       ${chalk.gray(formatDate(credentials.lastUpdated))}\n`);
}

/**
 * List all accounts
 */
function listAccounts(credentials) {
  console.log(chalk.bold('📋 Account List:\n'));

  const accounts = Object.entries(credentials.accounts);

  accounts.forEach(([id, account], index) => {
    const statusColor = {
      'pending': chalk.yellow,
      'approved': chalk.green,
      'active': chalk.blue,
      'rejected': chalk.red
    }[account.status] || chalk.gray;

    console.log(`  ${index + 1}. ${chalk.bold(account.platformName)}`);
    console.log(`     Status:       ${statusColor(account.status)}`);
    console.log(`     Email:        ${chalk.gray(account.email)}`);
    console.log(`     Username:     ${chalk.gray(account.username || 'N/A')}`);
    console.log(`     Applied:      ${chalk.gray(formatDate(account.dates.applied))}`);
    console.log(`     Approved:     ${chalk.gray(formatDate(account.dates.approved))}`);
    console.log('');
  });
}

/**
 * View single account details
 */
async function viewAccountDetails(credentials, masterPassword) {
  const accountChoices = Object.entries(credentials.accounts).map(([id, account]) => ({
    name: `${account.platformName} (${account.status})`,
    value: id
  }));

  const { accountId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accountId',
      message: 'Select account to view:',
      choices: accountChoices
    }
  ]);

  const account = credentials.accounts[accountId];

  console.log(chalk.bold(`\n${'='.repeat(60)}`));
  console.log(chalk.bold.cyan(`  ${account.platformName}`));
  console.log(chalk.bold(`${'='.repeat(60)}\n`));

  console.log(chalk.bold('Account Information:\n'));
  console.log(`  Status:           ${chalk.cyan(account.status)}`);
  console.log(`  Email:            ${chalk.cyan(account.email)}`);
  console.log(`  Username:         ${chalk.cyan(account.username || 'N/A')}`);
  console.log(`  Account ID:       ${chalk.cyan(account.accountId || 'N/A')}`);
  console.log(`  Commission Rate:  ${chalk.cyan(account.commissionRate)}`);

  if (account.apiCredentials) {
    console.log(chalk.bold('\nAPI Credentials:\n'));
    Object.entries(account.apiCredentials).forEach(([key, value]) => {
      console.log(`  ${key}:  ${chalk.gray(value || 'N/A')}`);
    });
  }

  console.log(chalk.bold('\nDates:\n'));
  console.log(`  Applied:   ${chalk.gray(formatDate(account.dates.applied))}`);
  console.log(`  Approved:  ${chalk.gray(formatDate(account.dates.approved))}`);
  console.log(`  Last Login: ${chalk.gray(formatDate(account.dates.lastLogin))}`);

  if (account.notes) {
    console.log(chalk.bold('\nNotes:\n'));
    console.log(`  ${chalk.gray(account.notes)}`);
  }

  // Option to view password
  const { viewPassword } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'viewPassword',
      message: 'View decrypted password?',
      default: false
    }
  ]);

  if (viewPassword) {
    try {
      const password = decrypt(account.password, masterPassword);
      console.log(chalk.bold('\n🔐 Password:\n'));
      console.log(`  ${chalk.cyan(password)}\n`);
    } catch (error) {
      console.log(chalk.red('\n❌ Failed to decrypt password. Incorrect master password?\n'));
    }
  }
}

/**
 * Update account status
 */
async function updateAccountStatus(credentials) {
  const accountChoices = Object.entries(credentials.accounts).map(([id, account]) => ({
    name: `${account.platformName} (${account.status})`,
    value: id
  }));

  const { accountId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accountId',
      message: 'Select account to update:',
      choices: accountChoices
    }
  ]);

  const account = credentials.accounts[accountId];

  const updates = await inquirer.prompt([
    {
      type: 'list',
      name: 'status',
      message: 'New status:',
      choices: ['pending', 'approved', 'active', 'rejected'],
      default: account.status
    },
    {
      type: 'input',
      name: 'accountId',
      message: 'Account ID (if approved):',
      default: account.accountId,
      when: (answers) => ['approved', 'active'].includes(answers.status)
    },
    {
      type: 'input',
      name: 'notes',
      message: 'Additional notes:',
      default: account.notes
    }
  ]);

  // Update account
  account.status = updates.status;
  if (updates.accountId) {
    account.accountId = updates.accountId;
  }
  if (updates.notes) {
    account.notes = updates.notes;
  }

  if (updates.status === 'approved' && !account.dates.approved) {
    account.dates.approved = new Date().toISOString();
  }

  credentials.lastUpdated = new Date().toISOString();
  await saveJSON(CREDENTIALS_FILE, credentials);

  console.log(chalk.green(`\n✓ ${account.platformName} updated!\n`));
}

/**
 * Export credentials
 */
async function exportCredentials(credentials) {
  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Export format:',
      choices: [
        { name: '1Password CSV', value: '1password' },
        { name: 'LastPass CSV', value: 'lastpass' },
        { name: 'JSON (encrypted)', value: 'json' },
        { name: 'Environment Variables', value: 'env' }
      ]
    }
  ]);

  const exportDir = path.join(PROJECT_ROOT, 'exports');
  await fs.mkdir(exportDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  let fileName;
  let content;

  switch (format) {
    case '1password':
      fileName = `affiliate-credentials-1password-${timestamp}.csv`;
      content = exportTo1Password(credentials);
      break;

    case 'lastpass':
      fileName = `affiliate-credentials-lastpass-${timestamp}.csv`;
      content = exportToLastPass(credentials);
      break;

    case 'json':
      fileName = `affiliate-credentials-${timestamp}.json`;
      content = JSON.stringify(credentials, null, 2);
      break;

    case 'env':
      fileName = `affiliate-credentials-${timestamp}.env`;
      content = generateEnvFile(credentials);
      break;
  }

  const filePath = path.join(exportDir, fileName);
  await fs.writeFile(filePath, content, 'utf8');

  console.log(chalk.green(`\n✓ Exported to: ${filePath}\n`));
}

/**
 * Generate .env file content
 */
function generateEnvFile(credentials) {
  const lines = [
    '# Affiliate Account Credentials',
    '# Generated: ' + new Date().toISOString(),
    '',
    '# Business Information',
    `AFFILIATE_BUSINESS_NAME="${credentials.businessInfo.businessName}"`,
    `AFFILIATE_WEBSITE="${credentials.businessInfo.website}"`,
    `AFFILIATE_EMAIL="${credentials.businessInfo.email}"`,
    ''
  ];

  Object.entries(credentials.accounts).forEach(([id, account]) => {
    const prefix = id.toUpperCase().replace(/-/g, '_');

    lines.push(`# ${account.platformName}`);
    lines.push(`${prefix}_ACCOUNT_ID="${account.accountId || ''}"`);
    lines.push(`${prefix}_USERNAME="${account.username || ''}"`);
    lines.push(`${prefix}_EMAIL="${account.email || ''}"`);
    lines.push(`${prefix}_STATUS="${account.status}"`);

    if (account.apiCredentials) {
      Object.entries(account.apiCredentials).forEach(([key, value]) => {
        const envKey = key.replace(/([A-Z])/g, '_$1').toUpperCase();
        lines.push(`${prefix}_${envKey}="${value || ''}"`);
      });
    }

    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Main menu
 */
async function mainMenu() {
  displayBanner();

  // Load credentials
  const credentials = await loadJSON(CREDENTIALS_FILE);

  if (!credentials) {
    console.log(chalk.red('❌ No credentials file found.'));
    console.log(chalk.gray('Run "node scripts/affiliate-account-creator.js" first.\n'));
    return;
  }

  // Get master password
  const { masterPassword } = await inquirer.prompt([
    {
      type: 'password',
      name: 'masterPassword',
      message: 'Enter master password:',
      mask: '*'
    }
  ]);

  let exit = false;

  while (!exit) {
    displayOverview(credentials);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'List all accounts', value: 'list' },
          { name: 'View account details', value: 'view' },
          { name: 'Update account status', value: 'update' },
          { name: 'Export credentials', value: 'export' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    console.log('');

    switch (action) {
      case 'list':
        listAccounts(credentials);
        await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
        break;

      case 'view':
        await viewAccountDetails(credentials, masterPassword);
        await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
        break;

      case 'update':
        await updateAccountStatus(credentials);
        // Reload credentials after update
        const updated = await loadJSON(CREDENTIALS_FILE);
        Object.assign(credentials, updated);
        break;

      case 'export':
        await exportCredentials(credentials);
        await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
        break;

      case 'exit':
        exit = true;
        break;
    }

    if (!exit) {
      console.clear();
      displayBanner();
    }
  }

  console.log(chalk.cyan('\n👋 Goodbye!\n'));
}

// Run if called directly
if (require.main === module) {
  mainMenu().catch(error => {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  });
}

module.exports = { mainMenu };
