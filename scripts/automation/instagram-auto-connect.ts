#!/usr/bin/env tsx

/**
 * Automated Instagram Connection using Playwright
 * This will open Facebook and help you connect Instagram to the Page
 */

import { chromium } from 'playwright';

async function autoConnect() {
  console.log('==========================================');
  console.log('AUTOMATED INSTAGRAM CONNECTION');
  console.log('==========================================\n');

  console.log('Starting browser automation...\n');

  const browser = await chromium.launch({
    headless: false, // Show browser so you can see what's happening
    slowMo: 1000, // Slow down so you can follow along
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Go to Facebook Page Settings
    console.log('Step 1: Opening Dopamills Page Settings...\n');
    await page.goto('https://www.facebook.com/dopamills/settings');

    // Wait for login if needed
    console.log('⏳ Waiting for you to log in if needed...\n');
    await page.waitForTimeout(5000);

    // Step 2: Look for Instagram settings
    console.log('Step 2: Looking for Instagram settings...\n');

    // Try different possible selectors
    const instagramSelectors = [
      'text=Instagram',
      'text=Linked accounts',
      'text=Connected accounts',
      '[href*="instagram"]',
    ];

    let instagramLink = null;
    for (const selector of instagramSelectors) {
      try {
        instagramLink = await page.waitForSelector(selector, { timeout: 3000 });
        if (instagramLink) {
          console.log('✅ Found Instagram settings!\n');
          await instagramLink.click();
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!instagramLink) {
      console.log('⚠️  Could not automatically find Instagram settings');
      console.log('   Please manually click on "Instagram" or "Linked accounts" in the left sidebar\n');
      await page.waitForTimeout(10000);
    }

    // Step 3: Look for Connect button
    console.log('Step 3: Looking for Connect button...\n');

    const connectSelectors = [
      'text=Connect',
      'text=Connect Account',
      'text=Link Account',
      'button:has-text("Connect")',
    ];

    let connectButton = null;
    for (const selector of connectSelectors) {
      try {
        connectButton = await page.waitForSelector(selector, { timeout: 3000 });
        if (connectButton) {
          console.log('✅ Found Connect button!\n');
          console.log('   Clicking Connect...\n');
          await connectButton.click();
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!connectButton) {
      console.log('⚠️  Could not find Connect button');
      console.log('   Please manually click the Connect button\n');
    }

    // Step 4: Wait for Instagram login
    console.log('Step 4: Waiting for Instagram login popup...\n');
    await page.waitForTimeout(3000);

    // Check if Instagram login window opened
    const pages = context.pages();
    if (pages.length > 1) {
      const instagramPage = pages[pages.length - 1];
      console.log('✅ Instagram login window detected!\n');
      console.log('   Please log in to @dopamills\n');

      // Wait for login to complete
      await instagramPage.waitForTimeout(20000);
    }

    console.log('==========================================');
    console.log('✅ PROCESS COMPLETE!');
    console.log('==========================================\n');
    console.log('If you successfully connected Instagram:');
    console.log('1. Close this browser window');
    console.log('2. Run: npx tsx scripts/automation/instagram-final-setup.ts\n');

    // Keep browser open so user can complete manually if needed
    console.log('Browser will stay open for 2 minutes for you to complete manually if needed...\n');
    await page.waitForTimeout(120000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

autoConnect().catch(console.error);
