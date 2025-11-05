#!/usr/bin/env node

/**
 * Affiliate Account Creator - Semi-Automated Signup Wizard
 *
 * This tool maximizes automation while respecting legal and platform limitations.
 * It handles form filling, password generation, and credential management.
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs').promises;

const {
  generatePassword,
  generateUsername,
  generateEmail,
  loadJSON,
  saveJSON,
  copyToClipboard,
  formatDate,
  encrypt,
  getPlatformStatusSummary
} = require('./affiliate-automation/utils');

const BrowserAutomation = require('./affiliate-automation/browser-automation');

// File paths
const PROJECT_ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data', 'affiliate');
const PLATFORMS_CONFIG = path.join(DATA_DIR, 'platforms-config.json');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');
const CREDENTIALS_TEMPLATE = path.join(DATA_DIR, 'credentials-template.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'signup-progress.json');

/**
 * Display welcome banner
 */
function displayBanner() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('║          AFFILIATE ACCOUNT CREATOR v1.0                    ║'));
  console.log(chalk.cyan.bold('║          Semi-Automated Signup Wizard                      ║'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));

  console.log(chalk.gray('This tool helps you:'));
  console.log(chalk.gray('  ✓ Generate strong passwords for each platform'));
  console.log(chalk.gray('  ✓ Auto-fill signup forms (where legal)'));
  console.log(chalk.gray('  ✓ Track application status'));
  console.log(chalk.gray('  ✓ Securely store credentials'));
  console.log(chalk.gray('  ✓ Guide you through manual verification steps\n'));
}

/**
 * Initialize credentials file
 */
async function initializeCredentials() {
  const spinner = ora('Initializing credentials...').start();

  try {
    let credentials = await loadJSON(CREDENTIALS_FILE);

    if (!credentials) {
      const template = await loadJSON(CREDENTIALS_TEMPLATE);
      credentials = template;
      credentials.lastUpdated = new Date().toISOString();
      await saveJSON(CREDENTIALS_FILE, credentials);
      spinner.succeed('Credentials initialized from template');
    } else {
      spinner.succeed('Credentials loaded');
    }

    return credentials;
  } catch (error) {
    spinner.fail('Failed to initialize credentials');
    throw error;
  }
}

/**
 * Load platform configurations
 */
async function loadPlatforms() {
  const spinner = ora('Loading platform configurations...').start();

  try {
    const config = await loadJSON(PLATFORMS_CONFIG);

    if (!config || !config.platforms) {
      throw new Error('Invalid platforms configuration');
    }

    spinner.succeed(`Loaded ${config.platforms.length} platform configurations`);
    return config.platforms;
  } catch (error) {
    spinner.fail('Failed to load platforms');
    throw error;
  }
}

/**
 * Display platform status overview
 */
function displayStatusOverview(credentials) {
  const summary = getPlatformStatusSummary(credentials);

  console.log(chalk.bold('\n📊 Account Status Overview:\n'));
  console.log(`  Total Platforms:    ${chalk.cyan(summary.total)}`);
  console.log(`  Pending:            ${chalk.yellow(summary.pending)}`);
  console.log(`  Approved:           ${chalk.green(summary.approved)}`);
  console.log(`  Rejected:           ${chalk.red(summary.rejected)}`);
  console.log(`  Active:             ${chalk.blue(summary.active)}\n`);
}

/**
 * Select platforms to sign up for
 */
async function selectPlatforms(platforms, credentials) {
  // Filter out already approved/active platforms
  const available = platforms.filter(p => {
    const account = credentials.accounts[p.id];
    return !account || ['pending', 'rejected'].includes(account.status);
  });

  if (available.length === 0) {
    console.log(chalk.yellow('\n✓ All platforms already processed!\n'));
    return [];
  }

  // Sort by priority
  const priorityOrder = { 'very-high': 0, 'high': 1, 'medium': 2, 'low': 3 };
  available.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const choices = available.map(p => ({
    name: `${p.name} ${chalk.gray(`(${p.priority} priority - ${p.approvalTime})`)}`,
    value: p.id,
    checked: p.priority === 'very-high' || p.priority === 'high'
  }));

  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select platforms to sign up for:',
      choices,
      pageSize: 15,
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Please select at least one platform';
        }
        return true;
      }
    }
  ]);

  return platforms.filter(p => selected.includes(p.id));
}

/**
 * Confirm business information
 */
async function confirmBusinessInfo(credentials) {
  console.log(chalk.bold('\n📋 Business Information:\n'));

  const info = credentials.businessInfo;

  console.log(`  Business Name:  ${chalk.cyan(info.businessName)}`);
  console.log(`  Website:        ${chalk.cyan(info.website)}`);
  console.log(`  Email:          ${chalk.cyan(info.email)}`);
  console.log(`  Business Type:  ${chalk.cyan(info.businessType.replace('_', ' '))}\n`);

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Is this information correct?',
      default: true
    }
  ]);

  if (!confirmed) {
    const updates = await inquirer.prompt([
      {
        type: 'input',
        name: 'businessName',
        message: 'Business Name:',
        default: info.businessName
      },
      {
        type: 'input',
        name: 'website',
        message: 'Website:',
        default: info.website
      },
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        default: info.email
      }
    ]);

    Object.assign(credentials.businessInfo, updates);
    await saveJSON(CREDENTIALS_FILE, credentials);
  }

  return credentials;
}

/**
 * Generate credentials for platform
 */
async function generateCredentials(platform, businessInfo, masterPassword) {
  const spinner = ora(`Generating credentials for ${platform.name}...`).start();

  await new Promise(resolve => setTimeout(resolve, 500));

  const username = generateUsername(businessInfo.businessName, platform.id);
  const email = generateEmail(businessInfo.email, platform.id);
  const password = generatePassword({ length: 20 });

  // Encrypt password
  const encryptedPassword = encrypt(password, masterPassword);

  spinner.succeed(`Credentials generated for ${platform.name}`);

  return {
    username,
    email,
    password: encryptedPassword,
    plainPassword: password // For display only, not stored
  };
}

/**
 * Process single platform signup
 */
async function processPlatformSignup(platform, credentials, masterPassword) {
  console.log(chalk.bold(`\n${'='.repeat(60)}`));
  console.log(chalk.bold.cyan(`  ${platform.name}`));
  console.log(chalk.bold(`${'='.repeat(60)}\n`));

  console.log(chalk.gray(`Priority: ${platform.priority}`));
  console.log(chalk.gray(`Approval Time: ${platform.approvalTime}`));
  console.log(chalk.gray(`Signup URL: ${platform.signupUrl}\n`));

  // Generate credentials
  const creds = await generateCredentials(platform, credentials.businessInfo, masterPassword);

  // Display credentials
  console.log(chalk.bold('📝 Generated Credentials:\n'));
  console.log(`  Username: ${chalk.cyan(creds.username)}`);
  console.log(`  Email:    ${chalk.cyan(creds.email)}`);
  console.log(`  Password: ${chalk.cyan(creds.plainPassword)}`);

  // Copy password to clipboard
  await copyToClipboard(creds.plainPassword);
  console.log(chalk.green('\n  ✓ Password copied to clipboard!\n'));

  // Ask how to proceed
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'How would you like to proceed?',
      choices: [
        { name: 'Open signup page and guide me through', value: 'guided' },
        { name: 'Open signup page (I\'ll do it manually)', value: 'manual' },
        { name: 'Skip this platform for now', value: 'skip' }
      ]
    }
  ]);

  if (action === 'skip') {
    console.log(chalk.yellow('⊘ Skipped\n'));
    return { status: 'skipped' };
  }

  // Open browser
  console.log(chalk.gray('\n🌐 Opening browser...'));
  const { exec } = require('child_process');
  exec(`open "${platform.signupUrl}"`);

  await new Promise(resolve => setTimeout(resolve, 2000));

  if (action === 'guided') {
    // Provide guided instructions
    console.log(chalk.bold.blue('\n📖 Step-by-Step Instructions:\n'));

    if (platform.fields.businessName) {
      console.log(`  1. Enter business name: ${chalk.cyan(credentials.businessInfo.businessName)}`);
    }
    if (platform.fields.website) {
      console.log(`  2. Enter website: ${chalk.cyan(platform.fields.website)}`);
    }
    console.log(`  3. Enter email: ${chalk.cyan(creds.email)}`);
    console.log(`  4. Enter username: ${chalk.cyan(creds.username)}`);
    console.log(`  5. Enter password: ${chalk.cyan('(already in clipboard)')}`);

    if (platform.requirements.phoneVerification) {
      console.log(chalk.yellow('\n  ⚠️  Phone verification required'));
    }
    if (platform.requirements.taxInfo) {
      console.log(chalk.yellow('  ⚠️  Tax information required (use your actual info)'));
    }

    console.log('');
  }

  // Wait for completion
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press Enter when you\'ve completed the signup (or type "failed" if it didn\'t work)...'
    }
  ]);

  // Update credentials
  const account = credentials.accounts[platform.id];
  account.username = creds.username;
  account.email = creds.email;
  account.password = creds.password;
  account.status = 'pending';
  account.dates.applied = new Date().toISOString();

  await saveJSON(CREDENTIALS_FILE, credentials);

  console.log(chalk.green(`\n✓ ${platform.name} signup recorded!\n`));

  return { status: 'completed' };
}

/**
 * Main wizard flow
 */
async function runWizard() {
  try {
    displayBanner();

    // Initialize
    const credentials = await initializeCredentials();
    const platforms = await loadPlatforms();

    // Display overview
    displayStatusOverview(credentials);

    // Get master password for encryption
    const { masterPassword } = await inquirer.prompt([
      {
        type: 'password',
        name: 'masterPassword',
        message: 'Enter master password for credential encryption:',
        mask: '*',
        validate: (input) => {
          if (input.length < 8) {
            return 'Password must be at least 8 characters';
          }
          return true;
        }
      }
    ]);

    // Confirm business information
    await confirmBusinessInfo(credentials);

    // Select platforms
    const selectedPlatforms = await selectPlatforms(platforms, credentials);

    if (selectedPlatforms.length === 0) {
      console.log(chalk.yellow('No platforms selected. Exiting.\n'));
      return;
    }

    console.log(chalk.bold(`\n🚀 Starting signup process for ${selectedPlatforms.length} platforms...\n`));

    // Process each platform
    let completed = 0;
    let skipped = 0;

    for (let i = 0; i < selectedPlatforms.length; i++) {
      const platform = selectedPlatforms[i];

      console.log(chalk.gray(`\nProgress: ${i + 1} of ${selectedPlatforms.length}\n`));

      const result = await processPlatformSignup(platform, credentials, masterPassword);

      if (result.status === 'completed') {
        completed++;
      } else if (result.status === 'skipped') {
        skipped++;
      }

      // Save progress after each platform
      credentials.lastUpdated = new Date().toISOString();
      await saveJSON(CREDENTIALS_FILE, credentials);

      // Brief pause between platforms
      if (i < selectedPlatforms.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Summary
    console.log(chalk.bold.green('\n' + '='.repeat(60)));
    console.log(chalk.bold.green('  🎉 SIGNUP PROCESS COMPLETE!'));
    console.log(chalk.bold.green('='.repeat(60) + '\n'));

    console.log(chalk.bold('Summary:\n'));
    console.log(`  Completed:  ${chalk.green(completed)}`);
    console.log(`  Skipped:    ${chalk.yellow(skipped)}`);
    console.log(`  Total:      ${selectedPlatforms.length}\n`);

    console.log(chalk.gray('Next steps:\n'));
    console.log(chalk.gray('  1. Check emails for verification links'));
    console.log(chalk.gray('  2. Complete any manual verification steps'));
    console.log(chalk.gray('  3. Run "node scripts/check-affiliate-status.js" to update status'));
    console.log(chalk.gray('  4. After approval, run "node scripts/configure-affiliate-accounts.js"\n'));

    console.log(chalk.cyan(`Credentials saved to: ${CREDENTIALS_FILE}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runWizard();
}

module.exports = { runWizard };
