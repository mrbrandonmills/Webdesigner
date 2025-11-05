#!/usr/bin/env node

/**
 * Check Affiliate Status - Quick status overview of all accounts
 */

const chalk = require('chalk');
const path = require('path');
const { loadJSON, formatDate, getPlatformStatusSummary, calculateApprovalRate } = require('./affiliate-automation/utils');

const DATA_DIR = path.join(__dirname, '..', 'data', 'affiliate');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');
const PLATFORMS_CONFIG = path.join(DATA_DIR, 'platforms-config.json');

async function checkStatus() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║          AFFILIATE ACCOUNT STATUS CHECKER                 ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));

  try {
    // Load credentials
    const credentials = await loadJSON(CREDENTIALS_FILE);

    if (!credentials) {
      console.log(chalk.red('❌ No credentials file found.'));
      console.log(chalk.gray('Run: node scripts/affiliate-account-creator.js\n'));
      return;
    }

    // Load platform config for additional info
    const platformsConfig = await loadJSON(PLATFORMS_CONFIG);
    const platformsMap = {};

    if (platformsConfig && platformsConfig.platforms) {
      platformsConfig.platforms.forEach(p => {
        platformsMap[p.id] = p;
      });
    }

    // Summary
    const summary = getPlatformStatusSummary(credentials);
    const approvalRate = calculateApprovalRate(credentials);

    console.log(chalk.bold('📊 SUMMARY\n'));
    console.log(`  Total Platforms:     ${chalk.cyan(summary.total)}`);
    console.log(`  ${chalk.yellow('Pending')}:             ${summary.pending}`);
    console.log(`  ${chalk.green('Approved')}:            ${summary.approved}`);
    console.log(`  ${chalk.blue('Active')}:              ${summary.active}`);
    console.log(`  ${chalk.red('Rejected')}:            ${summary.rejected}`);
    console.log(`  Approval Rate:       ${chalk.cyan(approvalRate + '%')}`);
    console.log(`  Last Updated:        ${chalk.gray(formatDate(credentials.lastUpdated))}\n`);

    // Account details
    console.log(chalk.bold('📋 ACCOUNT DETAILS\n'));

    const statusEmoji = {
      pending: '⏳',
      approved: '✅',
      active: '🟢',
      rejected: '❌'
    };

    const statusColor = {
      pending: chalk.yellow,
      approved: chalk.green,
      active: chalk.blue,
      rejected: chalk.red
    };

    Object.entries(credentials.accounts).forEach(([id, account]) => {
      const platform = platformsMap[id];
      const emoji = statusEmoji[account.status] || '❓';
      const colorFn = statusColor[account.status] || chalk.gray;

      console.log(`${emoji} ${chalk.bold(account.platformName)}`);
      console.log(`   Status:       ${colorFn(account.status.toUpperCase())}`);
      console.log(`   Email:        ${chalk.gray(account.email || 'N/A')}`);

      if (platform) {
        console.log(`   Priority:     ${chalk.gray(platform.priority)}`);
        console.log(`   Approval:     ${chalk.gray(platform.approvalTime)}`);
      }

      console.log(`   Applied:      ${chalk.gray(formatDate(account.dates.applied))}`);

      if (account.dates.approved) {
        console.log(`   Approved:     ${chalk.green(formatDate(account.dates.approved))}`);
      }

      if (account.accountId) {
        console.log(`   Account ID:   ${chalk.cyan(account.accountId)}`);
      }

      if (account.commissionRate) {
        console.log(`   Commission:   ${chalk.cyan(account.commissionRate)}`);
      }

      console.log('');
    });

    // Action items
    const pendingCount = summary.pending;
    const approvedCount = summary.approved;

    if (pendingCount > 0 || approvedCount > 0) {
      console.log(chalk.bold('📌 ACTION ITEMS\n'));

      if (pendingCount > 0) {
        console.log(chalk.yellow('⏳ Pending Applications:'));
        console.log(chalk.gray('   • Check your email for verification links'));
        console.log(chalk.gray('   • Complete any manual verification steps'));
        console.log(chalk.gray('   • Wait for platform approval (1-7 days typically)'));
        console.log(chalk.gray('   • Run this script daily to update status\n'));
      }

      if (approvedCount > 0) {
        console.log(chalk.green('✅ Approved Accounts:'));
        console.log(chalk.gray('   • Run: node scripts/configure-affiliate-accounts.js'));
        console.log(chalk.gray('   • Complete post-approval setup'));
        console.log(chalk.gray('   • Generate affiliate links'));
        console.log(chalk.gray('   • Start creating content!\n'));
      }
    }

    // Next steps
    console.log(chalk.bold('🚀 NEXT STEPS\n'));

    if (summary.total === 0) {
      console.log(chalk.gray('1. Run: node scripts/affiliate-account-creator.js'));
      console.log(chalk.gray('2. Select platforms to sign up for'));
      console.log(chalk.gray('3. Follow the interactive wizard\n'));
    } else if (summary.active > 0) {
      console.log(chalk.gray('1. Start creating affiliate content'));
      console.log(chalk.gray('2. Generate affiliate links for products'));
      console.log(chalk.gray('3. Add FTC disclosures to all content'));
      console.log(chalk.gray('4. Track performance in platform dashboards'));
      console.log(chalk.gray('5. Monitor commissions and optimize\n'));
    } else if (approvedCount > 0) {
      console.log(chalk.gray('1. Run: node scripts/configure-affiliate-accounts.js'));
      console.log(chalk.gray('2. Set up tracking and API access'));
      console.log(chalk.gray('3. Generate your first affiliate links'));
      console.log(chalk.gray('4. Test links to verify tracking\n'));
    } else {
      console.log(chalk.gray('1. Check emails for verification'));
      console.log(chalk.gray('2. Wait for platform approvals'));
      console.log(chalk.gray('3. Run this script daily for updates'));
      console.log(chalk.gray('4. Apply to more platforms if needed\n'));
    }

    // Quick commands
    console.log(chalk.bold('⚡ QUICK COMMANDS\n'));
    console.log(chalk.gray('View details:      ') + chalk.cyan('node scripts/credential-manager.js'));
    console.log(chalk.gray('Configure approved:') + chalk.cyan('node scripts/configure-affiliate-accounts.js'));
    console.log(chalk.gray('Add more accounts: ') + chalk.cyan('node scripts/affiliate-account-creator.js'));
    console.log('');

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkStatus();
}

module.exports = { checkStatus };
