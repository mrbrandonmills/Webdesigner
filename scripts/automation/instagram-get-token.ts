#!/usr/bin/env tsx

/**
 * Instagram Access Token Generator
 * Gets long-lived access token for Instagram Business Account
 */

import { createInterface } from 'readline';

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
  console.log('INSTAGRAM ACCESS TOKEN GENERATOR');
  console.log('==========================================\n');

  // Step 1: Get App Credentials
  console.log('📋 STEP 1: App Credentials\n');
  const appId = await question('Enter your App ID (1322977046248770 or 1147178904143253): ');
  const appSecret = await question('Enter your App Secret: ');

  console.log('\n✅ App credentials saved!\n');

  // Step 2: Generate OAuth URL
  console.log('==========================================');
  console.log('📋 STEP 2: Get Authorization Code');
  console.log('==========================================\n');

  const redirectUri = 'https://localhost/';
  const scope = 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement';

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

  console.log('Opening browser to authorize app...\n');
  console.log('📌 Authorization URL:');
  console.log(authUrl);
  console.log('\n');

  // Open browser
  const { exec } = await import('child_process');
  exec(`open "${authUrl}"`);

  console.log('📋 INSTRUCTIONS:');
  console.log('1. Browser will open to Facebook login');
  console.log('2. Log in and authorize the app');
  console.log('3. You will be redirected to a URL starting with "https://localhost/?code=..."');
  console.log('4. Copy the FULL URL from your browser address bar');
  console.log('5. Paste it below\n');

  const redirectedUrl = await question('Paste the full redirected URL here: ');

  // Extract code from URL
  const codeMatch = redirectedUrl.match(/code=([^&]+)/);
  if (!codeMatch) {
    console.error('❌ Could not find authorization code in URL');
    process.exit(1);
  }

  const authCode = codeMatch[1];
  console.log('\n✅ Authorization code extracted!\n');

  // Step 3: Exchange for Access Token
  console.log('==========================================');
  console.log('📋 STEP 3: Exchange for Access Token');
  console.log('==========================================\n');

  const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${authCode}`;

  console.log('Exchanging authorization code for access token...\n');

  try {
    const response = await fetch(tokenUrl);
    const data = await response.json();

    if (data.error) {
      console.error('❌ Error getting access token:', data.error.message);
      process.exit(1);
    }

    const shortLivedToken = data.access_token;
    console.log('✅ Short-lived token obtained!\n');

    // Step 4: Exchange for Long-Lived Token
    console.log('==========================================');
    console.log('📋 STEP 4: Exchange for Long-Lived Token');
    console.log('==========================================\n');

    const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

    const longLivedResponse = await fetch(longLivedUrl);
    const longLivedData = await longLivedResponse.json();

    if (longLivedData.error) {
      console.error('❌ Error getting long-lived token:', longLivedData.error.message);
      console.log('Using short-lived token instead (expires in 1 hour)\n');
      console.log('Access Token:', shortLivedToken);
    } else {
      console.log('✅ Long-lived token obtained (60 days)!\n');
      console.log('Access Token:', longLivedData.access_token);
    }

    const finalToken = longLivedData.access_token || shortLivedToken;

    // Step 5: Get Instagram Business Account ID
    console.log('\n==========================================');
    console.log('📋 STEP 5: Get Instagram Business Account ID');
    console.log('==========================================\n');

    console.log('Fetching your pages and Instagram accounts...\n');

    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${finalToken}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();

    if (pagesData.error) {
      console.error('❌ Error fetching pages:', pagesData.error.message);
      process.exit(1);
    }

    console.log('📄 Your Facebook Pages:\n');
    for (const page of pagesData.data) {
      console.log(`- ${page.name} (ID: ${page.id})`);
    }

    console.log('\n');
    const selectedPageId = await question('Enter the Page ID for Dopamills: ');

    // Get Instagram account for this page
    const igUrl = `https://graph.facebook.com/v18.0/${selectedPageId}?fields=instagram_business_account&access_token=${finalToken}`;
    const igResponse = await fetch(igUrl);
    const igData = await igResponse.json();

    if (igData.error) {
      console.error('❌ Error fetching Instagram account:', igData.error.message);
      process.exit(1);
    }

    if (!igData.instagram_business_account) {
      console.error('❌ No Instagram Business Account connected to this page');
      console.log('Make sure your Instagram account is connected to this Facebook Page');
      process.exit(1);
    }

    const igAccountId = igData.instagram_business_account.id;

    console.log('\n✅ Instagram Business Account found!');
    console.log('Instagram Business Account ID:', igAccountId);

    // Step 6: Test Connection
    console.log('\n==========================================');
    console.log('📋 STEP 6: Test Connection');
    console.log('==========================================\n');

    const testUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username,profile_picture_url&access_token=${finalToken}`;
    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();

    if (testData.error) {
      console.error('❌ Error testing connection:', testData.error.message);
      process.exit(1);
    }

    console.log('✅ Connection successful!\n');
    console.log('Instagram Account:', testData.username);
    console.log('Account ID:', testData.id);

    // Step 7: Save to .env.local
    console.log('\n==========================================');
    console.log('📋 STEP 7: Save Credentials');
    console.log('==========================================\n');

    const envContent = `
# ============================================
# INSTAGRAM AUTOMATION - Dopamills Account
# ============================================
META_APP_ID=${appId}
META_APP_SECRET=${appSecret}
INSTAGRAM_BUSINESS_ACCOUNT_ID=${igAccountId}
FACEBOOK_PAGE_ID=${selectedPageId}
INSTAGRAM_ACCESS_TOKEN=${finalToken}
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=dopamills_webhook_2024
`;

    const fs = await import('fs/promises');
    const envPath = '/Volumes/Super Mastery/Webdesigner/.env.local';

    try {
      const existingEnv = await fs.readFile(envPath, 'utf-8');

      if (existingEnv.includes('# INSTAGRAM AUTOMATION')) {
        // Update existing section
        const updatedEnv = existingEnv.replace(
          /# INSTAGRAM AUTOMATION[\s\S]*?(?=\n# |$)/,
          envContent.trim()
        );
        await fs.writeFile(envPath, updatedEnv);
      } else {
        // Append new section
        await fs.appendFile(envPath, envContent);
      }

      console.log('✅ Credentials saved to .env.local\n');
    } catch (error) {
      console.error('❌ Error saving to .env.local:', error);
      console.log('\n📋 Please add these manually to your .env.local:');
      console.log(envContent);
    }

    // Final Summary
    console.log('==========================================');
    console.log('✅ SETUP COMPLETE!');
    console.log('==========================================\n');
    console.log('Your credentials:');
    console.log('- App ID:', appId);
    console.log('- Instagram Account: @' + testData.username);
    console.log('- Instagram Business ID:', igAccountId);
    console.log('- Facebook Page ID:', selectedPageId);
    console.log('- Access Token: Saved (60 days)\n');
    console.log('🚀 NEXT STEPS:\n');
    console.log('1. Test automation:');
    console.log('   npm run automate:instagram:dry\n');
    console.log('2. Start posting 4x/day:');
    console.log('   npm run automate:instagram\n');
    console.log('==========================================\n');

    readline.close();
  } catch (error) {
    console.error('❌ Error:', error);
    readline.close();
    process.exit(1);
  }
}

main();
