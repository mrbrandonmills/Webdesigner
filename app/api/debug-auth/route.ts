import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const username = process.env.ADMIN_USERNAME
  const hash = process.env.ADMIN_PASSWORD_HASH

  // Test password
  const testPassword = '23458023'
  let match = false

  if (hash) {
    try {
      match = await bcrypt.compare(testPassword, hash)
    } catch (error) {
      console.error('Bcrypt error:', error)
    }
  }

  return NextResponse.json({
    username,
    usernameLength: username?.length,
    usernameChars: Array.from(username || '').map(c => c.charCodeAt(0)),
    hash Hash: hash?.substring(0, 20),
    hashLength: hash?.length,
    hashChars: hash ? Array.from(hash).slice(0, 20).map(c => c.charCodeAt(0)) : [],
    testPasswordMatches: match,
  })
}
