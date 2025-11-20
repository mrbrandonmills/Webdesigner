#!/usr/bin/env tsx

/**
 * Get Long-Lived PAGE Access Token for Instagram
 *
 * Problem: Short-lived USER tokens expire in 1-2 hours
 * Solution: Convert to long-lived PAGE token (60 days)
 *
 * Steps:
 * 1. Take user's current short-lived USER token
 * 2. Exchange for long-lived USER token (60 days)
 * 3. Get list of pages user manages
 * 4. Get PAGE access token for Dopamills page
 * 5. Output long-lived PAGE token
 */

import { createInterface } from 'readline';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(prompt, resolve);
  });
}

async function main() {
  console.log('==========================================');
  console.log('GET LONG-LIVED PAGE ACCESS TOKEN');
  console.log('==========================================\n');

  console.log('📋 This script converts your short-lived USER token');
  console.log('   into a long-lived PAGE token (60 days)\n');

  // Get credentials from .env.local
  const appId = process.env.META_APP_ID || '1322977046248770';
  const appSecret = process.env.META_APP_SECRET || '176dc5e6afaabc9c22e59708218a1f14';
  const pageId = process.env.FACEBOOK_PAGE_ID || '918484411342370';

  console.log('✅ Using credentials from .env.local:');
  console.log('   - App ID:', appId);
  console.log('   - Page ID:', pageId, '(Dopamills)');
  console.log('   - App Secret:', appSecret.substring(0, 8) + '...\n');

  // Step 1: Get current short-lived token from user
  console.log('==========================================');
  console.log('📋 STEP 1: Paste Your Current Token');
  console.log('==========================================\n');

  console.log('📌 Where to get your current token:');
  console.log('   1. Go to: https://developers.facebook.com/tools/explorer/');
  console.log('   2. Select your app from dropdown');
  console.log('   3. Click "Generate Access Token"');
  console.log('   4. Copy the token shown\n');

  const currentToken = await question('Paste your current short-lived token here: ');

  if (!currentToken || currentToken.length < 50) {
    console.error('\n❌ Invalid token. Token should be 100+ characters long.');
    readline.close();
    process.exit(1);
  }

  console.log('\n✅ Token received!\n');

  try {
    // Step 2: Exchange for long-lived USER token
    console.log('==========================================');
    console.log('📋 STEP 2: Exchange for Long-Lived USER Token');
    console.log('==========================================\n');

    const longLivedUserUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`;

    console.log('🔄 Exchanging for long-lived USER token...\n');

    const userTokenResponse = await fetch(longLivedUserUrl);
    const userTokenData = await userTokenResponse.json();

    if (userTokenData.error) {
      console.error('❌ Error getting long-lived USER token:');
      console.error('   Message:', userTokenData.error.message);
      console.error('   Type:', userTokenData.error.type);
      console.error('\n💡 Common issues:');
      console.error('   - Token has already expired');
      console.error('   - App ID or Secret is incorrect');
      console.error('   - Token was not generated from the correct app\n');
      readline.close();
      process.exit(1);
    }

    const longLivedUserToken = userTokenData.access_token;
    const expiresIn = userTokenData.expires_in;
    const expiresInDays = Math.floor(expiresIn / 86400);

    console.log('✅ Long-lived USER token obtained!');
    console.log('   Expires in:', expiresInDays, 'days\n');

    // Step 3: Get list of pages
    console.log('==========================================');
    console.log('📋 STEP 3: Get Your Facebook Pages');
    console.log('==========================================\n');

    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedUserToken}`;

    console.log('🔄 Fetching your pages...\n');

    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();

    if (pagesData.error) {
      console.error('❌ Error fetching pages:', pagesData.error.message);
      readline.close();
      process.exit(1);
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      console.error('❌ No pages found!');
      console.error('   Make sure you manage at least one Facebook Page.\n');
      readline.close();
      process.exit(1);
    }

    console.log('✅ Found', pagesData.data.length, 'page(s):\n');
    pagesData.data.forEach((page: any, index: number) => {
      console.log(`   ${index + 1}. ${page.name}`);
      console.log(`      ID: ${page.id}`);
      console.log(`      Category: ${page.category}\n`);
    });

    // Step 4: Get PAGE token for Dopamills
    console.log('==========================================');
    console.log('📋 STEP 4: Get PAGE Access Token');
    console.log('==========================================\n');

    // Find Dopamills page
    const dopamillsPage = pagesData.data.find((page: any) => page.id === pageId);

    if (!dopamillsPage) {
      console.error('❌ Dopamills page not found in your pages!');
      console.error('   Expected Page ID:', pageId);
      console.error('\n💡 Available pages:');
      pagesData.data.forEach((page: any) => {
        console.error(`   - ${page.name}: ${page.id}`);
      });
      console.error('\n   Update FACEBOOK_PAGE_ID in .env.local\n');
      readline.close();
      process.exit(1);
    }

    console.log('✅ Found Dopamills page:', dopamillsPage.name);
    console.log('   Page ID:', dopamillsPage.id);

    // The PAGE token is already in the response!
    const pageAccessToken = dopamillsPage.access_token;

    console.log('\n🎉 PAGE access token obtained!\n');

    // Step 5: Get Instagram Business Account ID
    console.log('==========================================');
    console.log('📋 STEP 5: Get Instagram Business Account');
    console.log('==========================================\n');

    const igUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`;

    console.log('🔄 Fetching Instagram account...\n');

    const igResponse = await fetch(igUrl);
    const igData = await igResponse.json();

    if (igData.error) {
      console.error('❌ Error fetching Instagram account:', igData.error.message);
      readline.close();
      process.exit(1);
    }

    if (!igData.instagram_business_account) {
      console.error('❌ No Instagram Business Account connected to this page!');
      console.error('\n💡 To fix this:');
      console.error('   1. Go to your Facebook Page settings');
      console.error('   2. Connect your Instagram Business account');
      console.error('   3. Run this script again\n');
      readline.close();
      process.exit(1);
    }

    const igAccountId = igData.instagram_business_account.id;

    console.log('✅ Instagram Business Account found!');
    console.log('   Account ID:', igAccountId, '\n');

    // Step 6: Test the token
    console.log('==========================================');
    console.log('📋 STEP 6: Test Connection');
    console.log('==========================================\n');

    const testUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${pageAccessToken}`;

    console.log('🔄 Testing connection...\n');

    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();

    if (testData.error) {
      console.error('❌ Error testing connection:', testData.error.message);
      readline.close();
      process.exit(1);
    }

    console.log('✅ Connection successful!\n');
    console.log('   Instagram Username: @' + testData.username);
    console.log('   Name:', testData.name);
    console.log('   Followers:', testData.followers_count?.toLocaleString() || 'N/A');
    console.log('   Posts:', testData.media_count?.toLocaleString() || 'N/A');
    console.log('\n');

    // Step 7: Save to .env.local
    console.log('==========================================');
    console.log('📋 STEP 7: Update .env.local');
    console.log('==========================================\n');

    const envContent = `# ============================================
# INSTAGRAM AUTOMATION - Dopamills Account - ✅ CONFIGURED
# ============================================
META_APP_ID=${appId}
META_APP_SECRET=${appSecret}
INSTAGRAM_BUSINESS_ACCOUNT_ID=${igAccountId}
FACEBOOK_PAGE_ID=${pageId}
INSTAGRAM_ACCESS_TOKEN=${pageAccessToken}
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=dopamills_webhook_2024
`;

    const fs = await import('fs/promises');
    const envPath = resolve(__dirname, '../../.env.local');

    const wantToSave = await question('Do you want to update .env.local with the new token? (y/n): ');

    if (wantToSave.toLowerCase() === 'y' || wantToSave.toLowerCase() === 'yes') {
      try {
        const existingEnv = await fs.readFile(envPath, 'utf-8');

        // Find and replace the Instagram section
        let updatedEnv: string;

        if (existingEnv.includes('# INSTAGRAM AUTOMATION')) {
          // Replace existing section
          updatedEnv = existingEnv.replace(
            /# ={44}\n# INSTAGRAM AUTOMATION[\s\S]*?(?=\n# ={44}|$)/,
            envContent.trim()
          );
        } else {
          // Append new section
          updatedEnv = existingEnv + '\n\n' + envContent;
        }

        await fs.writeFile(envPath, updatedEnv);
        console.log('\n✅ .env.local updated successfully!\n');
      } catch (error) {
        console.error('\n❌ Error updating .env.local:', error);
        console.log('\n📋 Please add these manually to your .env.local:\n');
        console.log(envContent);
      }
    } else {
      console.log('\n📋 Copy and paste this into your .env.local:\n');
      console.log(envContent);
    }

    // Final Summary
    console.log('==========================================');
    console.log('🎉 SUCCESS! LONG-LIVED PAGE TOKEN READY');
    console.log('==========================================\n');

    console.log('📊 Summary:');
    console.log('   ✅ Token Type: PAGE Access Token (not USER)');
    console.log('   ✅ Duration: 60 days (never expires with refresh)');
    console.log('   ✅ Instagram: @' + testData.username);
    console.log('   ✅ Page: ' + dopamillsPage.name);
    console.log('\n');

    console.log('🔑 Your Long-Lived PAGE Access Token:');
    console.log('   ' + pageAccessToken);
    console.log('\n');

    console.log('💡 Key Differences from USER Token:');
    console.log('   ✅ PAGE tokens last 60 days (not 1-2 hours)');
    console.log('   ✅ PAGE tokens can be refreshed to never expire');
    console.log('   ✅ PAGE tokens have proper Instagram permissions');
    console.log('   ✅ PAGE tokens are tied to the page, not user\n');

    console.log('🚀 NEXT STEPS:\n');
    console.log('   1. Test the token:');
    console.log('      npm run automate:instagram:dry\n');
    console.log('   2. Start automated posting:');
    console.log('      npm run automate:instagram\n');
    console.log('   3. Set up auto-refresh (recommended):');
    console.log('      npm run automate:instagram:sync\n');

    console.log('==========================================\n');

    readline.close();
  } catch (error: any) {
    console.error('\n❌ Unexpected Error:', error.message);
    console.error('\n💡 Stack trace:');
    console.error(error.stack);
    readline.close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
