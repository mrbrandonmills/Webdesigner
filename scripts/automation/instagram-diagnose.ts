#!/usr/bin/env tsx

/**
 * Instagram Connection Diagnostic
 * Checks all possible ways to find Instagram Business Account
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function diagnose() {
  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'EAASzPZAjjPUIBP6MuNN3xPNdzcz3yj5dDrw8ZAoNex17toQZBL7gZBkcAH8CRySZCEj4QhX5fUShwfmMYDK0gjNf3escQDcJEmH8qJW4MElpp1W8PcvuSdG75j1f4H9LdyZBIuzbbhY3J0xMkpfjrwQVY7Cji3OL2RWJDAluhubRdkKzuiuJxHyxo9gXmaPtZCpWYK0pkzdZBlAgqZBg4SIZCoOLYgG6ZABmJgIGJR5Y7fdkGUZD';
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '918484411342370';

  console.log('==========================================');
  console.log('INSTAGRAM CONNECTION DIAGNOSTIC');
  console.log('==========================================\n');

  // Test 1: Check page with all Instagram fields
  console.log('Test 1: Checking page with all Instagram fields...\n');

  const fields = [
    'id',
    'name',
    'instagram_business_account',
    'connected_instagram_account',
    'instagram_accounts',
  ].join(',');

  const response1 = await fetch(
    `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=${fields}&access_token=${TOKEN}`
  );
  const data1 = await response1.json();

  console.log('Response:', JSON.stringify(data1, null, 2));
  console.log('\n');

  // Test 2: Check token permissions
  console.log('Test 2: Checking token permissions...\n');

  const response2 = await fetch(
    `https://graph.facebook.com/v18.0/me/permissions?access_token=${TOKEN}`
  );
  const data2 = await response2.json();

  console.log('Permissions:');
  for (const perm of data2.data || []) {
    console.log(`- ${perm.permission}: ${perm.status}`);
  }
  console.log('\n');

  // Test 3: Debug token
  console.log('Test 3: Debug token info...\n');

  const response3 = await fetch(
    `https://graph.facebook.com/v18.0/debug_token?input_token=${TOKEN}&access_token=${TOKEN}`
  );
  const data3 = await response3.json();

  console.log('Token Info:', JSON.stringify(data3, null, 2));
  console.log('\n');

  // Test 4: Search for Instagram Business Accounts
  console.log('Test 4: Searching for Instagram accounts...\n');

  try {
    const response4 = await fetch(
      `https://graph.facebook.com/v18.0/${PAGE_ID}/instagram_accounts?access_token=${TOKEN}`
    );
    const data4 = await response4.json();
    console.log('Instagram Accounts:', JSON.stringify(data4, null, 2));
  } catch (error) {
    console.log('Could not fetch instagram_accounts');
  }
  console.log('\n');

  // Test 5: Check if we can directly access the known Instagram username
  console.log('Test 5: Searching for @dopamills directly...\n');

  try {
    const response5 = await fetch(
      `https://graph.facebook.com/v18.0/ig_hashtag_search?user_id=dopamills&q=dopamills&access_token=${TOKEN}`
    );
    const data5 = await response5.json();
    console.log('Search Result:', JSON.stringify(data5, null, 2));
  } catch (error) {
    console.log('Could not search for username');
  }
  console.log('\n');

  console.log('==========================================');
  console.log('DIAGNOSIS COMPLETE');
  console.log('==========================================\n');
}

diagnose().catch(console.error);
