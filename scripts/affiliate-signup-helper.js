#!/usr/bin/env node

/**
 * Affiliate Signup Helper Script
 * Assists with creating affiliate accounts by generating required information
 * and providing step-by-step guidance for manual signup
 */

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

// Configuration
const BUSINESS_INFO = {
  businessName: 'Brandon Mills Photography LLC',
  website: 'https://brandonmills.com',
  email: 'affiliates@brandonmills.com',
  backupEmail: 'bmills.partnerships@gmail.com',
  categories: ['Photography', 'Art', 'Luxury Lifestyle', 'Home Decor'],
  monthlyVisitors: '5000-10000',
  socialMedia: {
    instagram: '@brandonmills',
    pinterest: '@brandonmillsphoto',
  },
  contentTypes: [
    'Product Reviews',
    'Tutorial Content',
    'Gear Recommendations',
    'Gift Guides',
    'Behind the Scenes',
  ],
  promotionalMethods: [
    'Website Content',
    'Email Newsletter',
    'Social Media',
    'YouTube',
  ],
}

// Generate strong password
function generatePassword(length = 16) {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghjkmnpqrstuvwxyz'
  const numbers = '23456789'
  const symbols = '!@#$%&*'

  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Generate username variations
function generateUsernames(baseName) {
  const variations = [
    baseName,
    `${baseName}Lux`,
    `${baseName}Photo`,
    `${baseName}Creative`,
    `${baseName}Studio`,
    `${baseName}${new Date().getFullYear()}`,
  ]
  return variations
}

// Create signup checklist
function createSignupChecklist(program) {
  const checklist = {
    amazon: {
      name: 'Amazon Associates',
      url: 'https://affiliate-program.amazon.com/',
      steps: [
        'Navigate to signup URL',
        'Click "Sign up"',
        'Enter account information',
        'Add website and mobile apps',
        'Describe website content',
        'Enter traffic and monetization info',
        'Enter payment and tax information',
        'Review and accept agreement',
        'Verify email',
        'Wait for approval (usually instant)',
      ],
      requiredInfo: [
        'Legal name or business name',
        'Address',
        'Phone number',
        'Tax ID (SSN or EIN)',
        'Website URL',
        'Description of content',
        'How you drive traffic',
      ],
      tips: [
        'Have at least 10 published blog posts',
        'Include affiliate disclosure page',
        'Don\'t apply from work/public WiFi',
        'Be honest about traffic numbers',
      ],
    },
    shareasale: {
      name: 'ShareASale',
      url: 'https://www.shareasale.com/merchantsignup.cfm',
      steps: [
        'Go to affiliate signup page',
        'Fill out application form',
        'Enter website details',
        'Describe promotional methods',
        'Enter payment information',
        'Verify email',
        'Wait for approval (1-3 days)',
        'Apply to individual merchants',
      ],
      requiredInfo: [
        'Website URL',
        'Website description',
        'Monthly unique visitors',
        'Primary promotional methods',
        'Tax information',
        'Payment preferences',
      ],
      tips: [
        'Apply Monday-Wednesday for faster approval',
        'Highlight luxury/premium focus',
        'Mention specific merchants you want to promote',
        'Have Google Analytics installed',
      ],
    },
    cj: {
      name: 'CJ Affiliate',
      url: 'https://www.cj.com/publisher-sign-up',
      steps: [
        'Click "Join Now"',
        'Create publisher account',
        'Complete publisher profile',
        'Add website properties',
        'Enter tax information',
        'Set up payment method',
        'Wait for approval (2-5 days)',
        'Apply to advertisers',
      ],
      requiredInfo: [
        'Company information',
        'Website details',
        'Content categories',
        'Promotional methods',
        'Expected performance',
        'Banking details',
      ],
      tips: [
        'Emphasize quality over quantity',
        'Highlight luxury brand alignment',
        'Show examples of content',
        'Professional website is crucial',
      ],
    },
    printful: {
      name: 'Printful Affiliate',
      url: 'https://www.printful.com/affiliate-program',
      steps: [
        'Log into existing Printful account',
        'Navigate to Dashboard',
        'Click on "Affiliate Program"',
        'Accept affiliate terms',
        'Get referral link',
        'Set up payment method',
      ],
      requiredInfo: [
        'Existing Printful account',
        'PayPal or Printful wallet for payments',
      ],
      tips: [
        'Already a customer? Instant approval!',
        'Share your experience with Printful',
        'Create content about print-on-demand',
      ],
    },
    bh: {
      name: 'B&H Photo Affiliate',
      url: 'https://www.bhphotovideo.com/find/affiliate.jsp',
      steps: [
        'Complete application form',
        'Describe your audience',
        'Enter website details',
        'Submit for review',
        'Wait for approval (3-5 days)',
        'Get affiliate links',
      ],
      requiredInfo: [
        'Website URL',
        'Content description',
        'Audience demographics',
        'Promotional strategies',
      ],
      tips: [
        'Focus on photography expertise',
        'Mention specific equipment you use',
        'Highlight educational content',
      ],
    },
  }

  return checklist[program] || null
}

// Save credentials securely (template only, never real passwords)
function saveCredentials(program, data) {
  const credentialsDir = path.join(__dirname, '../data/affiliate-accounts')

  // Create directory if it doesn't exist
  if (!fs.existsSync(credentialsDir)) {
    fs.mkdirSync(credentialsDir, { recursive: true })
  }

  const filename = path.join(credentialsDir, `${program}-account.json`)
  const template = {
    program: program,
    created: new Date().toISOString(),
    status: 'PENDING_SIGNUP',
    credentials: {
      email: data.email,
      username: data.username,
      password: '[STORED_IN_PASSWORD_MANAGER]',
      affiliateId: '[TO_BE_PROVIDED]',
      apiKey: '[TO_BE_PROVIDED]',
    },
    notes: data.notes || '',
    lastUpdated: new Date().toISOString(),
  }

  fs.writeFileSync(filename, JSON.stringify(template, null, 2))
  console.log(`\n✅ Credential template saved to: ${filename}`)
  console.log('⚠️  Remember to store actual password in your password manager!')
}

// Interactive signup flow
async function interactiveSignup() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt) => new Promise((resolve) => {
    readline.question(prompt, resolve)
  })

  console.log('\n🚀 AFFILIATE SIGNUP HELPER')
  console.log('=' .repeat(50))

  console.log('\nAvailable Programs:')
  console.log('1. Amazon Associates')
  console.log('2. ShareASale')
  console.log('3. CJ Affiliate')
  console.log('4. Printful')
  console.log('5. B&H Photo')
  console.log('6. All Programs (Generate all)')

  const choice = await question('\nSelect program (1-6): ')

  const programs = {
    '1': 'amazon',
    '2': 'shareasale',
    '3': 'cj',
    '4': 'printful',
    '5': 'bh',
    '6': 'all',
  }

  const selected = programs[choice]

  if (!selected) {
    console.log('❌ Invalid selection')
    readline.close()
    return
  }

  if (selected === 'all') {
    // Generate for all programs
    for (const prog of Object.values(programs)) {
      if (prog !== 'all') {
        generateSignupInfo(prog)
      }
    }
  } else {
    generateSignupInfo(selected)
  }

  readline.close()
}

// Generate signup information
function generateSignupInfo(program) {
  console.log('\n' + '='.repeat(50))
  console.log(`📋 SIGNUP INFORMATION: ${program.toUpperCase()}`)
  console.log('='.repeat(50))

  const checklist = createSignupChecklist(program)
  if (!checklist) {
    console.log('❌ Program not found')
    return
  }

  console.log(`\n📍 Signup URL: ${checklist.url}`)

  const password = generatePassword()
  const usernames = generateUsernames('brandonmills')

  console.log('\n🔐 GENERATED CREDENTIALS:')
  console.log(`Email: ${BUSINESS_INFO.email}`)
  console.log(`Username Options:`)
  usernames.forEach(u => console.log(`  - ${u}`))
  console.log(`Password: ${password}`)
  console.log(`(Copy this password to your password manager NOW!)\n`)

  console.log('📝 INFORMATION TO PROVIDE:')
  console.log(`Business Name: ${BUSINESS_INFO.businessName}`)
  console.log(`Website: ${BUSINESS_INFO.website}`)
  console.log(`Categories: ${BUSINESS_INFO.categories.join(', ')}`)
  console.log(`Monthly Visitors: ${BUSINESS_INFO.monthlyVisitors}`)
  console.log(`Content Types: ${BUSINESS_INFO.contentTypes.join(', ')}`)

  console.log('\n✅ SIGNUP STEPS:')
  checklist.steps.forEach((step, i) => {
    console.log(`${i + 1}. ${step}`)
  })

  console.log('\n💡 PRO TIPS:')
  checklist.tips.forEach(tip => {
    console.log(`• ${tip}`)
  })

  console.log('\n📋 REQUIRED INFORMATION:')
  checklist.requiredInfo.forEach(info => {
    console.log(`• ${info}`)
  })

  // Save credentials template
  saveCredentials(program, {
    email: BUSINESS_INFO.email,
    username: usernames[0],
    notes: `Generated on ${new Date().toLocaleDateString()}`,
  })
}

// Generate content templates
function generateContentTemplates() {
  const templates = {
    disclosure: `
AFFILIATE DISCLOSURE

As an Amazon Associate and member of other affiliate programs, I earn from qualifying purchases. This means if you click on an affiliate link and purchase the item, I may receive an affiliate commission at no extra cost to you.

I only recommend products I personally use and believe will add value to my readers. All opinions remain my own.

Thank you for supporting Brandon Mills Photography!

Last updated: ${new Date().toLocaleDateString()}
`,

    privacyUpdate: `
PRIVACY POLICY UPDATE - AFFILIATE PROGRAMS

We participate in various affiliate marketing programs, which means we may get paid commissions on purchases made through our links to retailer sites. Our retail partners include:

• Amazon Associates
• ShareASale Network
• CJ Affiliate (Commission Junction)
• Printful Affiliate Program
• B&H Photo Affiliate Program

When you click on affiliate links on our website, cookies may be stored on your device to track sales and credit commissions.
`,

    aboutAffiliates: `
HOW WE MAKE MONEY

Brandon Mills Photography is supported by our readers. When you buy through links on our site, we may earn an affiliate commission at no additional cost to you.

We partner with companies whose products align with our values and that we genuinely recommend. Our affiliate partners include photography equipment retailers, software companies, and luxury lifestyle brands.

Every product recommendation is based on personal experience or extensive research. We never promote products solely for commission.
`,
  }

  const outputDir = path.join(__dirname, '../data/affiliate-content')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  Object.entries(templates).forEach(([name, content]) => {
    const filename = path.join(outputDir, `${name}.txt`)
    fs.writeFileSync(filename, content.trim())
    console.log(`✅ Created: ${filename}`)
  })
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--generate-content')) {
    console.log('\n📝 Generating content templates...')
    generateContentTemplates()
  } else if (args.includes('--quick')) {
    // Quick mode: generate all at once
    ['amazon', 'shareasale', 'cj', 'printful', 'bh'].forEach(prog => {
      generateSignupInfo(prog)
    })
  } else {
    // Interactive mode
    await interactiveSignup()
  }

  console.log('\n✨ Done! Remember to:')
  console.log('1. Store passwords in your password manager')
  console.log('2. Set up 2FA on all accounts')
  console.log('3. Add affiliate disclosure to your website')
  console.log('4. Update privacy policy')
  console.log('5. Create quality content before applying')
}

// Run the script
main().catch(console.error)