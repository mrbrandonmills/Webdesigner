/**
 * Test script for Pinterest automation
 *
 * Usage:
 *   npx tsx scripts/test-pinterest-post.ts
 *
 * This will open a browser window and attempt to create a test Pin.
 * You'll need to login manually the first time, then the session will be saved.
 */

import { PinterestAutomation } from '../lib/pinterest-automation'

async function testPinterestPost() {
  const automation = new PinterestAutomation()

  try {
    console.log('🚀 Starting Pinterest automation test...\n')

    // Initialize browser (headless=false to see what's happening)
    await automation.initialize(false)

    // Check if logged in
    const isLoggedIn = await automation.isLoggedIn()

    if (!isLoggedIn) {
      console.log('❌ Not logged in to Pinterest')
      console.log('Please login manually in the browser window...')
      console.log('After logging in, press Ctrl+C and run the script again.\n')

      // You can also uncomment this to login programmatically:
      // await automation.login({
      //   email: 'your-pinterest-email@example.com',
      //   password: 'your-pinterest-password'
      // })

      // Keep browser open for manual login
      await new Promise((resolve) => setTimeout(resolve, 120000)) // Wait 2 minutes
    } else {
      console.log('✅ Already logged in to Pinterest\n')

      // Create a test Pin
      const result = await automation.createPin({
        title: 'Test Pin from Brandon Mills Website',
        description: 'Testing automated Pinterest posting from my luxury photography portfolio. This Pin was created using browser automation.',
        imageUrl: 'https://brandonmills.com/og-image.jpg', // Replace with actual image
        link: 'https://brandonmills.com',
        boardName: undefined, // Will use default board
        altText: 'Brandon Mills luxury photography brand',
      })

      if (result.success) {
        console.log('\n✅ SUCCESS!')
        console.log(`Pin URL: ${result.pinUrl}`)
      } else {
        console.log('\n❌ FAILED')
        console.log(`Error: ${result.error}`)
      }

      // Take a screenshot for debugging
      await automation.screenshot('pinterest-test.png')
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error)
  } finally {
    console.log('\nClosing browser...')
    await automation.close()
    console.log('Done!')
  }
}

// Run the test
testPinterestPost()
