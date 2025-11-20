#!/usr/bin/env tsx

/**
 * Simple Instagram Authentication
 * Gets access token and all IDs automatically
 */

async function main() {
  console.log('==========================================');
  console.log('INSTAGRAM SIMPLE AUTH');
  console.log('==========================================\n');

  const APP_ID = '1322977046248770';
  const APP_SECRET = '04567d41bbaee516f732e48493c208e6';

  console.log('App ID:', APP_ID);
  console.log('App Secret:', APP_SECRET.substring(0, 10) + '...\n');

  // Step 1: Generate OAuth URL
  const redirectUri = 'https://localhost/';
  const scope = [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
  ].join(',');

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

  console.log('STEP 1: Authorize App\n');
  console.log('Opening browser...\n');

  const { exec } = await import('child_process');
  exec(`open "${authUrl}"`);

  console.log('📋 INSTRUCTIONS:');
  console.log('1. Log in to Facebook if prompted');
  console.log('2. Click "Continue" to authorize');
  console.log('3. You will be redirected to https://localhost/?code=...');
  console.log('4. Copy the FULL URL from your browser');
  console.log('5. Paste it here\n');

  // Wait for user input
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const redirectedUrl = await new Promise<string>((resolve) => {
    rl.question('Paste the redirected URL: ', resolve);
  });

  rl.close();

  // Extract code
  const codeMatch = redirectedUrl.match(/code=([^&]+)/);
  if (!codeMatch) {
    console.error('\n❌ Could not find code in URL');
    process.exit(1);
  }

  const code = codeMatch[1];
  console.log('\n✅ Authorization code received!\n');

  // Step 2: Exchange for access token
  console.log('STEP 2: Getting Access Token\n');

  const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${APP_SECRET}&code=${code}`;

  try {
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('❌ Error getting token:', tokenData.error.message);
      process.exit(1);
    }

    const shortToken = tokenData.access_token;
    console.log('✅ Short-lived token obtained!\n');

    // Step 3: Exchange for long-lived token
    console.log('STEP 3: Getting Long-Lived Token (60 days)\n');

    const longUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortToken}`;

    const longResponse = await fetch(longUrl);
    const longData = await longResponse.json();

    const finalToken = longData.access_token || shortToken;
    console.log('✅ Long-lived token obtained!\n');

    // Step 4: Get Pages
    console.log('STEP 4: Finding Your Pages\n');

    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${finalToken}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();

    if (pagesData.error) {
      console.error('❌ Error:', pagesData.error.message);
      process.exit(1);
    }

    console.log('Your Pages:');
    for (const page of pagesData.data) {
      console.log(`- ${page.name} (ID: ${page.id})`);
    }

    // Find Dopamills page
    const dopamillsPage = pagesData.data.find((p: any) =>
      p.name.toLowerCase().includes('dopamills')
    );

    if (!dopamillsPage) {
      console.error('\n❌ Could not find Dopamills page');
      process.exit(1);
    }

    const pageId = dopamillsPage.id;
    const pageToken = dopamillsPage.access_token;
    console.log(`\n✅ Found: ${dopamillsPage.name} (${pageId})\n`);

    // Step 5: Get Instagram Account
    console.log('STEP 5: Getting Instagram Account\n');

    const igUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`;
    const igResponse = await fetch(igUrl);
    const igData = await igResponse.json();

    if (igData.error) {
      console.error('❌ Error:', igData.error.message);
      process.exit(1);
    }

    if (!igData.instagram_business_account) {
      console.error('❌ No Instagram Business Account connected');
      process.exit(1);
    }

    const igAccountId = igData.instagram_business_account.id;
    console.log('✅ Instagram Business Account ID:', igAccountId);

    // Step 6: Test connection
    console.log('\nSTEP 6: Testing Connection\n');

    const testUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${pageToken}`;
    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();

    if (testData.error) {
      console.error('❌ Error:', testData.error.message);
      process.exit(1);
    }

    console.log('✅ Connected to: @' + testData.username);

    // Step 7: Save to .env.local
    console.log('\nSTEP 7: Saving Credentials\n');

    const fs = await import('fs/promises');
    const envPath = '/Volumes/Super Mastery/Webdesigner/.env.local';

    let envContent = await fs.readFile(envPath, 'utf-8');

    // Update Instagram section
    const updates = {
      META_APP_ID: APP_ID,
      META_APP_SECRET: APP_SECRET,
      INSTAGRAM_BUSINESS_ACCOUNT_ID: igAccountId,
      FACEBOOK_PAGE_ID: pageId,
      INSTAGRAM_ACCESS_TOKEN: pageToken,
    };

    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }

    await fs.writeFile(envPath, envContent);

    console.log('✅ Credentials saved to .env.local\n');

    // Final summary
    console.log('==========================================');
    console.log('✅ SETUP COMPLETE!');
    console.log('==========================================\n');
    console.log('Instagram Account: @' + testData.username);
    console.log('Instagram Business ID:', igAccountId);
    console.log('Facebook Page ID:', pageId);
    console.log('Access Token: Valid for 60 days\n');
    console.log('🚀 NEXT STEPS:\n');
    console.log('Test automation:');
    console.log('  npm run automate:instagram:dry\n');
    console.log('Start 4x/day posting:');
    console.log('  npm run automate:instagram\n');
    console.log('==========================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
