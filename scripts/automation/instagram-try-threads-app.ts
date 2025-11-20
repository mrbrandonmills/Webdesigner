#!/usr/bin/env tsx

/**
 * Try with Threads App credentials
 */

async function tryThreadsApp() {
  console.log('==========================================');
  console.log('TRYING THREADS APP FOR INSTAGRAM');
  console.log('==========================================\n');

  const THREADS_APP_ID = '1147178904143253';
  const THREADS_APP_SECRET = '5abbd889938c1f9ab1961ebc61fdc1a9';
  const PAGE_ID = '918484411342370';

  console.log('Step 1: Generate OAuth URL for Threads App\n');

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

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${THREADS_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

  console.log('🔗 Authorization URL:\n');
  console.log(authUrl);
  console.log('\n');
  console.log('Opening browser...\n');

  const { exec } = await import('child_process');
  exec(`open "${authUrl}"`);

  console.log('==========================================');
  console.log('📋 INSTRUCTIONS:');
  console.log('==========================================\n');
  console.log('1. Browser will open - log in to Facebook');
  console.log('2. Click "Continue" to authorize');
  console.log('3. You will be redirected to: https://localhost/?code=...');
  console.log('4. Copy the ENTIRE URL from browser');
  console.log('5. Run this command:\n');
  console.log('   curl "https://graph.facebook.com/v18.0/oauth/access_token?\\');
  console.log(`     client_id=${THREADS_APP_ID}&\\`);
  console.log(`     redirect_uri=${redirectUri}&\\`);
  console.log(`     client_secret=${THREADS_APP_SECRET}&\\`);
  console.log('     code=PASTE_CODE_HERE"\n');
  console.log('==========================================\n');
}

tryThreadsApp().catch(console.error);
