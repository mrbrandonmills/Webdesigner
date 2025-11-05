#!/usr/bin/env node

/**
 * Test Affiliate System - Verify installation and functionality
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;

const {
  generatePassword,
  generateUsername,
  generateEmail,
  encrypt,
  decrypt,
  validatePlatformConfig,
  loadJSON
} = require('./affiliate-automation/utils');

async function runTests() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║          AFFILIATE SYSTEM TEST SUITE                      ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));

  let passed = 0;
  let failed = 0;

  // Test 1: Password Generation
  console.log(chalk.bold('Test 1: Password Generation'));
  try {
    const password = generatePassword({ length: 20 });
    if (password.length === 20) {
      console.log(chalk.green('  ✓ Password generated: ') + chalk.gray(password));
      passed++;
    } else {
      throw new Error('Incorrect length');
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 2: Username Generation
  console.log(chalk.bold('\nTest 2: Username Generation'));
  try {
    const username = generateUsername('Brandon Mills Photography', 'amazon-associates');
    console.log(chalk.green('  ✓ Username generated: ') + chalk.cyan(username));
    passed++;
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 3: Email Generation
  console.log(chalk.bold('\nTest 3: Email Alias Generation'));
  try {
    const email = generateEmail('affiliates@brandonmills.com', 'amazon-associates');
    console.log(chalk.green('  ✓ Email generated: ') + chalk.cyan(email));
    if (!email.includes('+amazon-associates')) {
      throw new Error('Alias not added');
    }
    passed++;
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 4: Encryption/Decryption
  console.log(chalk.bold('\nTest 4: Encryption/Decryption'));
  try {
    const testPassword = 'SuperSecret123!';
    const masterPassword = 'TestMasterPassword123!';

    const encrypted = encrypt(testPassword, masterPassword);
    console.log(chalk.green('  ✓ Encrypted: ') + chalk.gray(encrypted.encrypted.substring(0, 20) + '...'));

    const decrypted = decrypt(encrypted, masterPassword);
    if (decrypted === testPassword) {
      console.log(chalk.green('  ✓ Decrypted successfully'));
      passed++;
    } else {
      throw new Error('Decryption mismatch');
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 5: Platform Configuration
  console.log(chalk.bold('\nTest 5: Platform Configuration Loading'));
  try {
    const platformsPath = path.join(__dirname, '..', 'data', 'affiliate', 'platforms-config.json');
    const config = await loadJSON(platformsPath);

    if (!config || !config.platforms) {
      throw new Error('Invalid configuration');
    }

    console.log(chalk.green(`  ✓ Loaded ${config.platforms.length} platform configurations`));

    // Validate first platform
    const firstPlatform = config.platforms[0];
    validatePlatformConfig(firstPlatform);
    console.log(chalk.green(`  ✓ Validated: ${firstPlatform.name}`));

    passed++;
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 6: File Structure
  console.log(chalk.bold('\nTest 6: File Structure'));
  try {
    const requiredFiles = [
      'scripts/affiliate-account-creator.js',
      'scripts/credential-manager.js',
      'scripts/configure-affiliate-accounts.js',
      'scripts/check-affiliate-status.js',
      'scripts/affiliate-automation/utils.js',
      'scripts/affiliate-automation/browser-automation.js',
      'data/affiliate/platforms-config.json',
      'data/affiliate/credentials-template.json',
      'docs/affiliate/AFFILIATE_SIGNUP_GUIDE.md',
      'docs/affiliate/AFFILIATE_AUTOMATION_README.md',
      'docs/affiliate/QUICK_START.md'
    ];

    const root = path.join(__dirname, '..');
    let allExist = true;

    for (const file of requiredFiles) {
      const filePath = path.join(root, file);
      try {
        await fs.access(filePath);
        console.log(chalk.green('  ✓ ') + chalk.gray(file));
      } catch {
        console.log(chalk.red('  ✗ ') + chalk.gray(file) + chalk.red(' (missing)'));
        allExist = false;
      }
    }

    if (allExist) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 7: Dependencies
  console.log(chalk.bold('\nTest 7: Node Module Dependencies'));
  try {
    const dependencies = [
      'inquirer',
      'chalk',
      'ora',
      'generate-password',
      'puppeteer',
      'dotenv-vault'
    ];

    let allInstalled = true;

    for (const dep of dependencies) {
      try {
        require.resolve(dep);
        console.log(chalk.green('  ✓ ') + chalk.gray(dep));
      } catch {
        console.log(chalk.red('  ✗ ') + chalk.gray(dep) + chalk.red(' (not installed)'));
        allInstalled = false;
      }
    }

    if (allInstalled) {
      passed++;
    } else {
      failed++;
      console.log(chalk.yellow('\n  → Run: npm install'));
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 8: Gitignore Protection
  console.log(chalk.bold('\nTest 8: Security - Gitignore Protection'));
  try {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');

    const requiredIgnores = [
      'data/affiliate/credentials.json',
      'data/affiliate/signup-progress.json',
      '.env.affiliate',
      'exports/'
    ];

    let allProtected = true;

    for (const pattern of requiredIgnores) {
      if (gitignoreContent.includes(pattern)) {
        console.log(chalk.green('  ✓ ') + chalk.gray(pattern) + chalk.green(' (protected)'));
      } else {
        console.log(chalk.red('  ✗ ') + chalk.gray(pattern) + chalk.red(' (NOT protected)'));
        allProtected = false;
      }
    }

    if (allProtected) {
      passed++;
    } else {
      failed++;
      console.log(chalk.yellow('\n  ⚠️  Some sensitive files not in .gitignore!'));
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 9: Package.json Scripts
  console.log(chalk.bold('\nTest 9: NPM Scripts Configuration'));
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

    const requiredScripts = [
      'affiliate:create',
      'affiliate:manage',
      'affiliate:configure',
      'affiliate:status'
    ];

    let allConfigured = true;

    for (const script of requiredScripts) {
      if (packageJson.scripts[script]) {
        console.log(chalk.green('  ✓ ') + chalk.gray(`npm run ${script}`));
      } else {
        console.log(chalk.red('  ✗ ') + chalk.gray(`npm run ${script}`) + chalk.red(' (missing)'));
        allConfigured = false;
      }
    }

    if (allConfigured) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Test 10: Documentation Completeness
  console.log(chalk.bold('\nTest 10: Documentation Completeness'));
  try {
    const docsPath = path.join(__dirname, '..', 'docs', 'affiliate');
    const files = await fs.readdir(docsPath);

    const expectedDocs = [
      'AFFILIATE_SIGNUP_GUIDE.md',
      'AFFILIATE_AUTOMATION_README.md',
      'QUICK_START.md'
    ];

    let allPresent = true;

    for (const doc of expectedDocs) {
      if (files.includes(doc)) {
        const docPath = path.join(docsPath, doc);
        const stats = await fs.stat(docPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(chalk.green('  ✓ ') + chalk.gray(doc) + chalk.gray(` (${sizeKB} KB)`));
      } else {
        console.log(chalk.red('  ✗ ') + chalk.gray(doc) + chalk.red(' (missing)'));
        allPresent = false;
      }
    }

    if (allPresent) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Failed: ') + error.message);
    failed++;
  }

  // Summary
  console.log(chalk.bold('\n' + '='.repeat(60)));
  console.log(chalk.bold('TEST RESULTS'));
  console.log('='.repeat(60) + '\n');

  const total = passed + failed;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log(`  Total Tests:   ${chalk.cyan(total)}`);
  console.log(`  Passed:        ${chalk.green(passed)}`);
  console.log(`  Failed:        ${chalk.red(failed)}`);
  console.log(`  Success Rate:  ${chalk.cyan(percentage + '%')}\n`);

  if (failed === 0) {
    console.log(chalk.green.bold('  ✓ ALL TESTS PASSED!\n'));
    console.log(chalk.gray('System is ready to use. Start with:\n'));
    console.log(chalk.cyan('  npm run affiliate:create\n'));
  } else {
    console.log(chalk.yellow.bold('  ⚠️  SOME TESTS FAILED\n'));
    console.log(chalk.gray('Please fix the issues above before using the system.\n'));
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().catch(error => {
    console.error(chalk.red('\n❌ Test suite error:'), error.message);
    process.exit(1);
  });
}

module.exports = { runTests };
