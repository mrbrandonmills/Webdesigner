#!/usr/bin/env tsx

/**
 * Instagram Automation Setup Wizard
 *
 * Interactive CLI tool to configure Instagram automation credentials
 * Guides through Meta Developer setup and generates required tokens
 */

import * as readline from 'readline'
import * as fs from 'fs/promises'
import * as path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║   Instagram Automation Setup Wizard                       ║')
  console.log('║   Brandon Mills - Natural Instagram Posting               ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  // Check if already configured
  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = await fs.readFile(envPath, 'utf-8')

  if (envContent.includes('INSTAGRAM_ACCESS_TOKEN=') && !envContent.includes('# INSTAGRAM_ACCESS_TOKEN=')) {
    console.log('⚠️  Instagram automation appears to be already configured.')
    const reconfigure = await question('Do you want to reconfigure? (y/N): ')
    if (reconfigure.toLowerCase() !== 'y') {
      console.log('\n✅ Setup cancelled. Your existing configuration is unchanged.\n')
      rl.close()
      return
    }
  }

  console.log('\n📋 STEP 1: Instagram Business Account Setup')
  console.log('════════════════════════════════════════════════════════════\n')
  console.log('You need an Instagram Business Account connected to a Facebook Page.')
  console.log('')
  console.log('Setup steps:')
  console.log('1. Open Instagram app → Settings → Account')
  console.log('2. Switch to Professional Account → Choose Business')
  console.log('3. Connect to a Facebook Page (create one if needed)')
  console.log('')

  const hasBusinessAccount = await question('Do you have an Instagram Business Account? (y/N): ')

  if (hasBusinessAccount.toLowerCase() !== 'y') {
    console.log('\n❌ You need an Instagram Business Account to continue.')
    console.log('Please complete the setup steps above and run this wizard again.\n')
    rl.close()
    return
  }

  console.log('\n📋 STEP 2: Meta Developer App Setup')
  console.log('════════════════════════════════════════════════════════════\n')
  console.log('Opening Meta Developer Console...')
  console.log('')
  console.log('Instructions:')
  console.log('1. Go to: https://developers.facebook.com/apps')
  console.log('2. Click "Create App"')
  console.log('3. Choose app type: Business')
  console.log('4. Display name: "Brandon Mills Instagram Automation"')
  console.log('5. Click "Create App"')
  console.log('6. Add Product: Instagram Graph API')
  console.log('')

  await question('Press ENTER when you have created your Meta app...')

  console.log('\n📋 STEP 3: Get App Credentials')
  console.log('════════════════════════════════════════════════════════════\n')
  console.log('In the Meta Developer Console:')
  console.log('1. Go to Settings → Basic')
  console.log('2. Copy your App ID and App Secret')
  console.log('')

  const metaAppId = await question('Enter your Meta App ID: ')
  const metaAppSecret = await question('Enter your Meta App Secret: ')

  if (!metaAppId || !metaAppSecret) {
    console.log('\n❌ App ID and Secret are required. Please run the wizard again.\n')
    rl.close()
    return
  }

  console.log('\n📋 STEP 4: Generate Access Token')
  console.log('════════════════════════════════════════════════════════════\n')
  console.log('Opening Graph API Explorer...')
  console.log('')
  console.log('Instructions:')
  console.log('1. Go to: https://developers.facebook.com/tools/explorer/')
  console.log('2. Select your app from dropdown')
  console.log('3. Click "Generate Access Token"')
  console.log('4. Grant these permissions:')
  console.log('   - instagram_basic')
  console.log('   - instagram_content_publish')
  console.log('   - pages_read_engagement')
  console.log('   - pages_manage_posts')
  console.log('   - business_management')
  console.log('5. Copy the short-lived token')
  console.log('')

  const shortLivedToken = await question('Enter your short-lived access token: ')

  if (!shortLivedToken) {
    console.log('\n❌ Access token is required. Please run the wizard again.\n')
    rl.close()
    return
  }

  console.log('\n🔄 Exchanging for long-lived token...')

  // Exchange for long-lived token
  const exchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${metaAppId}&client_secret=${metaAppSecret}&fb_exchange_token=${shortLivedToken}`

  try {
    const response = await fetch(exchangeUrl)
    const data = await response.json()

    if (!data.access_token) {
      console.log('\n❌ Failed to exchange token:', data.error?.message || 'Unknown error')
      console.log('\nPlease verify:')
      console.log('- App ID and Secret are correct')
      console.log('- Token has the required permissions')
      console.log('- Token has not expired\n')
      rl.close()
      return
    }

    const longLivedToken = data.access_token
    console.log('✅ Long-lived token obtained! (Valid for 60 days)\n')

    console.log('\n📋 STEP 5: Get Instagram Business Account ID')
    console.log('════════════════════════════════════════════════════════════\n')
    console.log('🔍 Fetching your Facebook Pages...')

    // Get Facebook Pages
    const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedToken}`
    const pagesResponse = await fetch(pagesUrl)
    const pagesData = await pagesResponse.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      console.log('\n❌ No Facebook Pages found.')
      console.log('Please create a Facebook Page and connect it to your Instagram Business Account.\n')
      rl.close()
      return
    }

    console.log('\nAvailable Facebook Pages:')
    pagesData.data.forEach((page: any, index: number) => {
      console.log(`${index + 1}. ${page.name} (ID: ${page.id})`)
    })

    const pageSelection = await question('\nSelect the page connected to your Instagram (enter number): ')
    const pageIndex = parseInt(pageSelection) - 1

    if (pageIndex < 0 || pageIndex >= pagesData.data.length) {
      console.log('\n❌ Invalid selection. Please run the wizard again.\n')
      rl.close()
      return
    }

    const selectedPage = pagesData.data[pageIndex]
    const facebookPageId = selectedPage.id

    console.log(`\n✅ Selected: ${selectedPage.name}`)
    console.log('🔍 Fetching Instagram Business Account...')

    // Get Instagram Business Account
    const igUrl = `https://graph.facebook.com/v21.0/${facebookPageId}?fields=instagram_business_account&access_token=${longLivedToken}`
    const igResponse = await fetch(igUrl)
    const igData = await igResponse.json()

    if (!igData.instagram_business_account) {
      console.log('\n❌ No Instagram Business Account connected to this page.')
      console.log('Please connect your Instagram Business Account to the Facebook Page.\n')
      rl.close()
      return
    }

    const instagramBusinessAccountId = igData.instagram_business_account.id
    console.log(`✅ Instagram Business Account ID: ${instagramBusinessAccountId}\n`)

    console.log('\n📋 STEP 6: OpenAI API Key (for Caption Generation)')
    console.log('════════════════════════════════════════════════════════════\n')
    console.log('Instagram automation uses GPT-4 to generate natural captions.')
    console.log('')
    console.log('Get your API key:')
    console.log('1. Go to: https://platform.openai.com/api-keys')
    console.log('2. Create a new secret key')
    console.log('3. Copy the key (starts with sk-...)')
    console.log('')

    const openaiKey = await question('Enter your OpenAI API key (or press ENTER to skip): ')

    console.log('\n📋 STEP 7: Saving Configuration')
    console.log('════════════════════════════════════════════════════════════\n')

    // Update .env.local
    let updatedEnv = envContent

    // Replace Instagram section
    updatedEnv = updatedEnv.replace(
      /# ============================================\n# INSTAGRAM AUTOMATION - PENDING CONFIGURATION\n# ============================================\n# Get from: https:\/\/developers\.facebook\.com\/apps\n# META_APP_ID=\n# META_APP_SECRET=\n# INSTAGRAM_BUSINESS_ACCOUNT_ID=\n# FACEBOOK_PAGE_ID=\n# INSTAGRAM_ACCESS_TOKEN=\n# INSTAGRAM_WEBHOOK_VERIFY_TOKEN=brandonmills_instagram_webhook_2024/,
      `# ============================================
# INSTAGRAM AUTOMATION - ✅ CONFIGURED
# ============================================
META_APP_ID=${metaAppId}
META_APP_SECRET=${metaAppSecret}
INSTAGRAM_BUSINESS_ACCOUNT_ID=${instagramBusinessAccountId}
FACEBOOK_PAGE_ID=${facebookPageId}
INSTAGRAM_ACCESS_TOKEN=${longLivedToken}
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=brandonmills_instagram_webhook_2024`
    )

    // Update OpenAI key if provided
    if (openaiKey) {
      updatedEnv = updatedEnv.replace(
        /# ============================================\n# OPENAI API - REQUIRED FOR INSTAGRAM CAPTIONS\n# ============================================\n# Get from: https:\/\/platform\.openai\.com\/api-keys\n# OPENAI_API_KEY=sk-\.\.\./,
        `# ============================================
# OPENAI API - ✅ CONFIGURED
# ============================================
OPENAI_API_KEY=${openaiKey}`
      )
    }

    await fs.writeFile(envPath, updatedEnv, 'utf-8')

    console.log('✅ Configuration saved to .env.local\n')

    console.log('\n╔════════════════════════════════════════════════════════════╗')
    console.log('║   ✅ Instagram Automation Setup Complete!                 ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

    console.log('📝 Next Steps:\n')
    console.log('1. Test the setup:')
    console.log('   npm run automate:instagram:dry\n')
    console.log('2. Sync products from Printful:')
    console.log('   npm run automate:instagram:sync\n')
    console.log('3. Start automated posting:')
    console.log('   npm run automate:instagram\n')
    console.log('4. View analytics:')
    console.log('   npm run automate:instagram:report\n')

    console.log('📚 Documentation:')
    console.log('   - Setup Guide: INSTAGRAM_AUTOMATION_SETUP.md')
    console.log('   - Quick Reference: INSTAGRAM_QUICK_REFERENCE.md')
    console.log('   - Architecture: INSTAGRAM_SYSTEM_ARCHITECTURE.md\n')

    console.log('⚠️  Important Notes:')
    console.log('   - Access token expires in 60 days')
    console.log('   - Set a calendar reminder to refresh')
    console.log('   - Run this wizard again to regenerate\n')

    console.log('🎉 Happy automating!\n')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    console.log('\nPlease check your network connection and try again.\n')
  }

  rl.close()
}

main().catch(console.error)
