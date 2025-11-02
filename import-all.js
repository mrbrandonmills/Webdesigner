const fs = require('fs');

async function importPost(postIndex) {
  console.log(`\n🚀 Importing Post ${postIndex + 1}/4...`);

  try {
    const response = await fetch('http://localhost:3000/api/autonomous-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postIndex }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ SUCCESS: ${data.post.enhanced.title}`);
      console.log(`   Category: ${data.post.enhanced.category}`);
      console.log(`   Webflow ID: ${data.post.webflowId}`);
      console.log(`   URL: ${data.post.webflowUrl}`);
      return { success: true, data };
    } else {
      console.log(`❌ FAILED: ${data.error || data.details}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 AUTONOMOUS IMPORT STARTING...\n');
  console.log('This will import all 4 quality posts with AI-enhanced descriptions\n');

  const results = [];

  for (let i = 0; i < 4; i++) {
    const result = await importPost(i);
    results.push(result);

    // Wait 3 seconds between imports
    if (i < 3) {
      console.log('\n⏳ Waiting 3 seconds before next import...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n\n📊 IMPORT SUMMARY:');
  console.log('=' .repeat(50));
  const successful = results.filter(r => r.success).length;
  console.log(`✅ Successful: ${successful}/4`);
  console.log(`❌ Failed: ${4 - successful}/4`);

  if (successful === 4) {
    console.log('\n🎉 ALL POSTS IMPORTED SUCCESSFULLY!');
    console.log('Your autonomous portfolio site is now live on Webflow!');
  }

  // Save detailed results
  fs.writeFileSync('/tmp/import-results.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed results saved to: /tmp/import-results.json');
}

main().catch(console.error);
