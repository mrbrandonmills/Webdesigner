#!/usr/bin/env tsx

/**
 * Final Instagram Setup with Token
 */

async function finalSetup() {
  const TOKEN = 'EAASzPZAjjPUIBP6MuNN3xPNdzcz3yj5dDrw8ZAoNex17toQZBL7gZBkcAH8CRySZCEj4QhX5fUShwfmMYDK0gjNf3escQDcJEmH8qJW4MElpp1W8PcvuSdG75j1f4H9LdyZBIuzbbhY3J0xMkpfjrwQVY7Cji3OL2RWJDAluhubRdkKzuiuJxHyxo9gXmaPtZCpWYK0pkzdZBlAgqZBg4SIZCoOLYgG6ZABmJgIGJR5Y7fdkGUZD';
  const PAGE_ID = '918484411342370';
  const APP_ID = '1322977046248770';
  const APP_SECRET = '04567d41bbaee516f732e48493c208e6';

  console.log('==========================================');
  console.log('INSTAGRAM FINAL SETUP');
  console.log('==========================================\n');

  // Step 1: Test token and get page info
  console.log('Step 1: Testing token...\n');

  const pageResponse = await fetch(`https://graph.facebook.com/v18.0/${PAGE_ID}?fields=id,name&access_token=${TOKEN}`);
  const pageData = await pageResponse.json();

  if (pageData.error) {
    console.error('❌ Token error:', pageData.error.message);
    process.exit(1);
  }

  const pageId = PAGE_ID;
  const pageName = pageData.name;

  console.log('✅ Token valid!');
  console.log(`   Page: ${pageName}`);
  console.log(`   Page ID: ${pageId}\n`);

  // Step 2: Get Instagram Business Account
  console.log('Step 2: Getting Instagram account...\n');

  const igResponse = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${TOKEN}`
  );
  const igData = await igResponse.json();

  if (igData.error) {
    console.error('❌ Error:', igData.error.message);
    process.exit(1);
  }

  if (!igData.instagram_business_account) {
    console.error('❌ No Instagram Business Account connected to this page');
    console.log('   Go to your Dopamills Facebook Page → Settings → Instagram');
    console.log('   and connect your @dopamills Instagram account');
    process.exit(1);
  }

  const igAccountId = igData.instagram_business_account.id;
  console.log('✅ Instagram Business Account found!');
  console.log(`   ID: ${igAccountId}\n`);

  // Step 3: Test Instagram connection
  console.log('Step 3: Testing Instagram connection...\n');

  const igTestResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username,profile_picture_url&access_token=${TOKEN}`
  );
  const igTestData = await igTestResponse.json();

  if (igTestData.error) {
    console.error('❌ Error:', igTestData.error.message);
    process.exit(1);
  }

  console.log('✅ Connected to Instagram!');
  console.log(`   Username: @${igTestData.username}`);
  console.log(`   Account ID: ${igTestData.id}\n`);

  // Step 4: Exchange for long-lived token
  console.log('Step 4: Exchanging for long-lived token (60 days)...\n');

  const longTokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${TOKEN}`
  );
  const longTokenData = await longTokenResponse.json();

  let finalToken = TOKEN;
  if (longTokenData.access_token) {
    finalToken = longTokenData.access_token;
    console.log('✅ Long-lived token obtained (60 days)!\n');
  } else {
    console.log('⚠️  Using short-lived token (will need refresh soon)\n');
  }

  // Step 5: Update .env.local
  console.log('Step 5: Updating .env.local...\n');

  const fs = await import('fs/promises');
  const envPath = '/Volumes/Super Mastery/Webdesigner/.env.local';

  let envContent = await fs.readFile(envPath, 'utf-8');

  // Update Instagram section
  const updates: Record<string, string> = {
    META_APP_ID: APP_ID,
    META_APP_SECRET: APP_SECRET,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: igAccountId,
    FACEBOOK_PAGE_ID: pageId,
    INSTAGRAM_ACCESS_TOKEN: finalToken,
  };

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    }
  }

  await fs.writeFile(envPath, envContent);

  console.log('✅ Credentials saved to .env.local!\n');

  // Final summary
  console.log('==========================================');
  console.log('✅ SETUP COMPLETE!');
  console.log('==========================================\n');
  console.log(`Instagram Account: @${igTestData.username}`);
  console.log(`Instagram Business ID: ${igAccountId}`);
  console.log(`Facebook Page: ${pageName} (${pageId})`);
  console.log(`Access Token: Saved (${longTokenData.access_token ? '60 days' : 'short-lived'})\n`);
  console.log('🚀 READY TO POST!\n');
  console.log('Test with dry run:');
  console.log('  npm run automate:instagram:dry\n');
  console.log('Start 4x/day posting:');
  console.log('  npm run automate:instagram\n');
  console.log('==========================================\n');
}

finalSetup().catch(console.error);
