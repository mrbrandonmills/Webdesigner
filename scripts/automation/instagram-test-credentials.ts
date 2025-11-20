#!/usr/bin/env tsx

/**
 * Test Instagram credentials and find account
 */

async function testCredentials() {
  console.log('==========================================');
  console.log('INSTAGRAM CREDENTIAL TESTER');
  console.log('==========================================\n');

  // Try both apps
  const apps = [
    {
      name: 'Dopamills Automation',
      id: '1322977046248770',
      secret: '04567d41bbaee516f732e48493c208e6',
    },
    {
      name: 'Threads App',
      id: '1147178904143253',
      secret: '5abbd889938c1f9ab1961ebc61fdc1a9',
    },
  ];

  for (const app of apps) {
    console.log(`\nTesting: ${app.name} (${app.id})`);
    console.log('='.repeat(50));

    // Get app access token
    const appTokenUrl = `https://graph.facebook.com/oauth/access_token?client_id=${app.id}&client_secret=${app.secret}&grant_type=client_credentials`;

    try {
      const response = await fetch(appTokenUrl);
      const data = await response.json();

      if (data.error) {
        console.log('❌ App credentials invalid:', data.error.message);
        continue;
      }

      const appToken = data.access_token;
      console.log('✅ App token obtained');

      // Try to get pages using app token
      console.log('\nSearching for Dopamills page...');

      // This won't work with app token, but let's try
      const searchUrl = `https://graph.facebook.com/v18.0/search?q=Dopamills&type=page&access_token=${appToken}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        console.log('Found pages:');
        for (const page of searchData.data) {
          console.log(`- ${page.name} (ID: ${page.id})`);
        }
      } else {
        console.log('❌ Cannot search pages with app token');
        console.log('   Need user access token');
      }

    } catch (error) {
      console.log('❌ Error:', error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📋 WHAT YOU NEED TO DO:\n');
  console.log('The Instagram API requires a USER or PAGE access token,');
  console.log('not just an app token.');
  console.log('\n');
  console.log('EASIEST METHOD:');
  console.log('1. Go to your Instagram Business account settings on your phone');
  console.log('2. Go to Settings → Account → Linked accounts');
  console.log('3. Link to Facebook Business Page "Dopamills"');
  console.log('4. Then go to: https://developers.facebook.com/tools/explorer/');
  console.log('5. Select "Dopamills Automation" app');
  console.log('6. Click "Get Token" → "Get Page Access Token"');
  console.log('7. Select "Dopamills" page');
  console.log('8. Copy the token that starts with "EAA..."');
  console.log('\nPaste that token here and I will configure everything!');
  console.log('\n' + '='.repeat(50) + '\n');
}

testCredentials();
