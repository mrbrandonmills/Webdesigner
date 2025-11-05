#!/usr/bin/env node

/**
 * Utility script to generate bcrypt password hash for admin authentication
 *
 * Usage:
 *   node scripts/generate-password-hash.js yourpassword
 *
 * This will output the bcrypt hash to add to your .env.local file
 */

const bcrypt = require('bcryptjs')

async function generateHash(password) {
  if (!password) {
    console.error('Error: Password is required')
    console.log('Usage: node scripts/generate-password-hash.js <password>')
    process.exit(1)
  }

  try {
    const hash = await bcrypt.hash(password, 12)
    console.log('\n=== Password Hash Generated ===')
    console.log('\nAdd this to your .env.local file:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    console.log('\nIMPORTANT SECURITY NOTES:')
    console.log('1. Never commit the .env.local file to version control')
    console.log('2. Use a strong, unique password')
    console.log('3. Store the original password securely (password manager)')
    console.log('4. Rotate passwords regularly')
    console.log('================================\n')
  } catch (error) {
    console.error('Error generating hash:', error.message)
    process.exit(1)
  }
}

// Get password from command line argument
const password = process.argv[2]
generateHash(password)