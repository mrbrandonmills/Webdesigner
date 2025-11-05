import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import logger from './logger'

// SECURITY: Use environment variables and never hardcode credentials
// In production, store hashed passwords in a secure database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH // Store the bcrypt hash, not plaintext

const AUTH_COOKIE_NAME = 'brandon-admin-auth'
const AUTH_COOKIE_VALUE = 'authenticated-bmilly23'
const SESSION_DURATION_HOURS = 4 // Reduced from 7 days to 4 hours for security

// Helper function to hash passwords (use this to generate the hash for .env)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12) // 12 rounds is a good balance of security and performance
}

// Helper function to verify passwords
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function login(username: string, password: string): Promise<boolean> {
  // Validate environment configuration
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    logger.error('Admin authentication not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in environment variables.')
    return false
  }

  // Check username
  if (username !== ADMIN_USERNAME) {
    return false
  }

  // Verify password against hash
  const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH)

  if (isValidPassword) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
      maxAge: 60 * 60 * SESSION_DURATION_HOURS, // 4 hours
      path: '/',
    })
    return true
  }

  return false
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === AUTH_COOKIE_VALUE
}

export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }
}

// Utility function to generate a password hash for initial setup
// Run this once to generate the hash for your password, then store in .env
// Example usage: node -e "require('./lib/auth').generatePasswordHash('yourpassword')"
export async function generatePasswordHash(password: string) {
  const hash = await hashPassword(password)
  console.log('Add this to your .env.local file:')
  console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  return hash
}